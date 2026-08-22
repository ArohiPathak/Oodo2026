import { createClient } from '@/lib/supabase/client';
import { Employee } from '@/data/mockEmployees';

const supabase = createClient();

export const employeeService = {
  fetchEmployees: async (): Promise<Employee[]> => {
    const { data: dbProfiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        department:departments(name),
        company:companies(name),
        manager:profiles!manager_id(full_name)
      `);

    if (error) {
      console.error('Error fetching employees:', error.message);
      return [];
    }

    if (dbProfiles) {
      return dbProfiles.map((p: any) => ({
        id: p.employee_id || '',
        name: p.full_name || '',
        designation: p.designation || '',
        department: p.department?.name || '',
        email: p.email || '',
        phone: p.phone || '',
        joiningDate: p.joining_date || '',
        status: 'present',
        company: p.company?.name || '',
        manager: p.manager?.full_name || '',
        location: p.location || '',
        dob: '',
        address: '',
        nationality: '',
        personalEmail: '',
        gender: '',
        maritalStatus: '',
        avatarUrl: p.profile_picture || '',
        about: p.about || '',
      }));
    }
    return [];
  },

  fetchEmployeeById: async (id: string): Promise<any> => {
    // 1. Fetch profile details
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        department:departments(name),
        company:companies(name),
        manager:profiles!manager_id(full_name)
      `)
      .or(`employee_id.eq.${id},id.eq.${id}`)
      .maybeSingle();

    if (error || !profile) {
      console.error('Error fetching employee by ID:', error?.message);
      return null;
    }

    // 2. Fetch parallel sub-records
    const [privateRes, payrollRes, structureRes, skillsRes] = await Promise.all([
      supabase.from('employee_private_info').select('*').eq('profile_id', profile.id).maybeSingle(),
      supabase.from('payroll').select('*').eq('employee_id', profile.id).maybeSingle(),
      supabase.from('salary_structures').select('*').eq('employee_id', profile.id).maybeSingle(),
      supabase.from('employee_skills').select('*').eq('employee_id', profile.id)
    ]);

    const privateInfo = privateRes.data || null;
    const payroll = payrollRes.data || null;
    const salaryStructure = structureRes.data || null;
    const skills = skillsRes.data || [];

    return {
      id: profile.employee_id || `EMP-${profile.id.substring(0, 8).toUpperCase()}`,
      db_id: profile.id,
      name: profile.full_name || 'New Employee',
      designation: profile.designation || 'Software Engineer',
      department: profile.department?.name || 'Engineering',
      departmentId: profile.department_id,
      company: profile.company?.name || 'Dayflow Technologies',
      companyId: profile.company_id,
      manager: profile.manager?.full_name || 'Ananya Rao',
      managerId: profile.manager_id,
      location: profile.location || 'Mumbai, India',
      email: profile.email || '',
      phone: profile.phone || '',
      joiningDate: profile.joining_date || new Date().toISOString().split('T')[0],
      status: 'present',

      dob: privateInfo?.date_of_birth || '',
      address: privateInfo?.residential_address || '',
      nationality: privateInfo?.nationality || '',
      personalEmail: privateInfo?.personal_email || '',
      gender: privateInfo?.gender || '',
      maritalStatus: privateInfo?.marital_status || '',

      bankAccountNumber: privateInfo?.bank_account_number || '',
      bankName: privateInfo?.bank_name || '',
      ifscCode: privateInfo?.ifsc_code || '',
      panNo: privateInfo?.pan_no || '',
      uanNo: privateInfo?.uan_no || '',

      basicSalary: salaryStructure?.basic_salary || payroll?.basic_salary || 0,
      hra: salaryStructure?.hra || 0,
      allowances: payroll?.allowances || salaryStructure?.fixed_allowance || 0,
      deductions: payroll?.deductions || salaryStructure?.professional_tax || 0,
      netSalary: payroll?.net_salary || salaryStructure?.monthly_wage || 0,

      skills: skills.map((s: any) => s.skill_name),
      about: profile.about || '',
      avatarUrl: profile.profile_picture || '',
    };
  },

  createEmployee: async (newEmp: Omit<Employee, 'status' | 'joiningDate'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmp.email,
          name: newEmp.name,
          department: newEmp.department,
          designation: newEmp.designation,
          employeeId: newEmp.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add employee');
      }

      return true;
    } catch (err: any) {
      console.error('Error creating employee:', err);
      throw err;
    }
  }
};
