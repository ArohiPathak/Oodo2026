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
        id: p.employee_id || `EMP-${p.id.substring(0, 8).toUpperCase()}`,
        name: p.full_name || 'New Employee',
        designation: p.designation || 'Software Engineer',
        department: p.department?.name || 'Engineering',
        email: p.email || '',
        phone: p.phone || '+91 98765 00000',
        joiningDate: p.joining_date || new Date().toISOString().split('T')[0],
        status: 'present',
        company: p.company?.name || 'Dayflow Technologies',
        manager: p.manager?.full_name || 'Ananya Rao',
        location: p.location || 'Mumbai, India',
        dob: p.dob || '',
        address: p.address || '',
        nationality: p.nationality || '',
        personalEmail: p.personal_email || '',
        gender: p.gender || '',
        maritalStatus: p.marital_status || '',
        avatarUrl: p.profile_picture || '',
        about: p.about || '',
      }));
    }
    return [];
  },

  fetchEmployeeById: async (id: string): Promise<Employee | null> => {
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

    return {
      id: profile.employee_id || `EMP-${profile.id.substring(0, 8).toUpperCase()}`,
      name: profile.full_name || 'New Employee',
      designation: profile.designation || 'Software Engineer',
      department: profile.department?.name || 'Engineering',
      email: profile.email || '',
      phone: profile.phone || '+91 98765 00000',
      joiningDate: profile.joining_date || new Date().toISOString().split('T')[0],
      status: 'present',
      company: profile.company?.name || 'Dayflow Technologies',
      manager: profile.manager?.full_name || 'Ananya Rao',
      location: profile.location || 'Mumbai, India',
      dob: profile.dob || '',
      address: profile.address || '',
      nationality: profile.nationality || '',
      personalEmail: profile.personal_email || '',
      gender: profile.gender || '',
      maritalStatus: profile.marital_status || '',
      avatarUrl: profile.profile_picture || '',
      about: profile.about || '',
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
