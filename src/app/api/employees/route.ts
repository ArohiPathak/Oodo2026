import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the caller using the server client
    const supabase = await createServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    // 2. Fetch the caller's profile to verify they are an admin
    const { data: adminProfile, error: profileErr } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileErr || !adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Parse request payload
    const { email, name, department, designation, employeeId } = await req.json();

    if (!email || !name || !department || !designation || !employeeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 4. Initialize Supabase Admin client with service role key
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SECRET_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 5. Query the department ID based on department name
    const { data: deptData } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('name', department)
      .maybeSingle();

    const departmentId = deptData?.id || null;

    // 6. Create employee Auth User securely using the admin service key
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: 'Password123!', // Standard initial password
      email_confirm: true, // Auto-confirm email to bypass manual validation
      user_metadata: {
        full_name: name,
        role: 'employee'
      }
    });

    if (authError) {
      console.error('Supabase Auth provisioning error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newUserId = authUser.user.id;

    // 7. Insert profiles table row
    const { data: profile, error: insertProfileErr } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        employee_id: employeeId,
        full_name: name,
        email: email,
        role: 'employee',
        designation: designation,
        department_id: departmentId,
        company_id: adminProfile.company_id,
        joining_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (insertProfileErr) {
      console.error('Error inserting employee profile:', insertProfileErr);
      // Clean up Auth user to avoid orphaned logins
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: insertProfileErr.message }, { status: 500 });
    }

    // 8. Insert employee_private_info table row
    const { error: insertPrivateErr } = await supabaseAdmin
      .from('employee_private_info')
      .insert({
        profile_id: newUserId,
        personal_email: email,
        employee_code: employeeId,
        date_of_joining: new Date().toISOString().split('T')[0]
      });

    if (insertPrivateErr) {
      console.error('Error inserting employee private info:', insertPrivateErr);
    }

    // 9. Insert payroll table row
    const { error: insertPayrollErr } = await supabaseAdmin
      .from('payroll')
      .insert({
        employee_id: newUserId,
        basic_salary: 0,
        allowances: 0,
        deductions: 0,
        net_salary: 0
      });

    if (insertPayrollErr) {
      console.error('Error inserting employee payroll structure:', insertPayrollErr);
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('Internal Server Error in employee API:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
