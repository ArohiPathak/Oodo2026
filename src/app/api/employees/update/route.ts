import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate caller and verify role is admin
    const supabase = await createServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { data: adminProfile, error: profileErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileErr || !adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 2. Parse request payload
    const {
      profileId,
      phone,
      designation,
      departmentId,
      managerId,
      location,
      joiningDate,
      dateOfBirth,
      residentialAddress,
      nationality,
      personalEmail,
      gender,
      maritalStatus,
      bankAccountNumber,
      bankName,
      ifscCode,
      panNo,
      uanNo,
      basicSalary,
      hra,
      allowances,
      deductions,
      skills,
      experience,
      qualification,
      university,
      previousCompany
    } = await req.json();

    if (!profileId) {
      return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    // 3. Initialize Supabase Admin client with service role key
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

    // Fetch existing about details to preserve about_text
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('about')
      .eq('id', profileId)
      .maybeSingle();

    let aboutJSON: any = {};
    try {
      if (existingProfile?.about && existingProfile.about.trim().startsWith('{')) {
        aboutJSON = JSON.parse(existingProfile.about);
      } else {
        aboutJSON.about_text = existingProfile?.about || '';
      }
    } catch {
      aboutJSON.about_text = existingProfile?.about || '';
    }

    // Merge resume details
    if (experience !== undefined) aboutJSON.experience = experience;
    if (qualification !== undefined) aboutJSON.qualification = qualification;
    if (university !== undefined) aboutJSON.university = university;
    if (previousCompany !== undefined) aboutJSON.previous_company = previousCompany;

    const aboutString = JSON.stringify(aboutJSON);

    // 4. Update profiles table
    const { error: updateProfileErr } = await supabaseAdmin
      .from('profiles')
      .update({
        phone: phone || null,
        designation: designation || null,
        department_id: departmentId || null,
        manager_id: managerId || null,
        location: location || null,
        joining_date: joiningDate || null,
        about: aboutString
      })
      .eq('id', profileId);

    if (updateProfileErr) {
      console.error('Error updating profile details:', updateProfileErr);
      return NextResponse.json({ error: updateProfileErr.message }, { status: 500 });
    }

    // 5. Update or Insert employee_private_info
    const { data: existingPriv } = await supabaseAdmin
      .from('employee_private_info')
      .select('profile_id')
      .eq('profile_id', profileId)
      .maybeSingle();

    const infoPayload = {
      date_of_birth: dateOfBirth || null,
      residential_address: residentialAddress || null,
      nationality: nationality || null,
      personal_email: personalEmail || null,
      gender: gender || null,
      marital_status: maritalStatus || null,
      bank_account_number: bankAccountNumber || null,
      bank_name: bankName || null,
      ifsc_code: ifscCode || null,
      pan_no: panNo || null,
      uan_no: uanNo || null
    };

    if (existingPriv) {
      const { error: privErr } = await supabaseAdmin
        .from('employee_private_info')
        .update(infoPayload)
        .eq('profile_id', profileId);
      if (privErr) console.error('Error updating private info:', privErr);
    } else {
      const { error: privErr } = await supabaseAdmin
        .from('employee_private_info')
        .insert({
          profile_id: profileId,
          ...infoPayload
        });
      if (privErr) console.error('Error inserting private info:', privErr);
    }

    // 6. Update or Insert payroll / salary structures
    const basicNum = Number(basicSalary) || 0;
    const allowancesNum = Number(allowances) || 0;
    const deductionsNum = Number(deductions) || 0;
    const netNum = basicNum + allowancesNum - deductionsNum;
    const hraNum = Number(hra) || 0;

    const { data: existingPayroll } = await supabaseAdmin
      .from('payroll')
      .select('employee_id')
      .eq('employee_id', profileId)
      .maybeSingle();

    if (existingPayroll) {
      await supabaseAdmin
        .from('payroll')
        .update({
          basic_salary: basicNum,
          allowances: allowancesNum,
          deductions: deductionsNum,
          net_salary: netNum
        })
        .eq('employee_id', profileId);
    } else {
      await supabaseAdmin
        .from('payroll')
        .insert({
          employee_id: profileId,
          basic_salary: basicNum,
          allowances: allowancesNum,
          deductions: deductionsNum,
          net_salary: netNum
        });
    }

    const { data: existingStruct } = await supabaseAdmin
      .from('salary_structures')
      .select('employee_id')
      .eq('employee_id', profileId)
      .maybeSingle();

    if (existingStruct) {
      await supabaseAdmin
        .from('salary_structures')
        .update({
          basic_salary: basicNum,
          hra: hraNum,
          monthly_wage: netNum
        })
        .eq('employee_id', profileId);
    } else {
      await supabaseAdmin
        .from('salary_structures')
        .insert({
          employee_id: profileId,
          basic_salary: basicNum,
          hra: hraNum,
          monthly_wage: netNum
        });
    }

    // 7. Update employee_skills
    if (Array.isArray(skills)) {
      await supabaseAdmin
        .from('employee_skills')
        .delete()
        .eq('employee_id', profileId);

      if (skills.length > 0) {
        const skillInserts = skills.map((skillName: string) => ({
          employee_id: profileId,
          skill_name: skillName,
          proficiency: 'Intermediate'
        }));
        await supabaseAdmin
          .from('employee_skills')
          .insert(skillInserts);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating employee API:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
