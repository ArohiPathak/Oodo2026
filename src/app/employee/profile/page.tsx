'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useApp } from '@/context/AppContext';
import { EmployeeProfileHeader } from '@/components/employee/EmployeeProfileHeader';
import {
  EmployeeProfileTabs,
  EmployeeProfileTabType,
} from '@/components/employee/EmployeeProfileTabs';
import { EmployeePrivateInfo } from '@/components/employee/EmployeePrivateInfo';
import { EmployeeResume } from '@/components/employee/EmployeeResume';
import { EmployeeSalaryInfo } from '@/components/employee/EmployeeSalaryInfo';
import { EmployeeSecurity } from '@/components/employee/EmployeeSecurity';

export default function EmployeeProfilePage() {
  const router = useRouter();
  const { role, isLoadingAuth } = useApp();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<EmployeeProfileTabType>('private_info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for DB details
  const [profile, setProfile] = useState<any>(null);
  const [privateInfo, setPrivateInfo] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);

  // Enforce Employee-only access
  useEffect(() => {
    if (!isLoadingAuth && role && role !== 'employee') {
      router.replace('/profile');
    }
  }, [role, isLoadingAuth, router]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch user from Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // 2. Query profile details with joins
        const { data: dbProfile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            department:departments(name),
            company:companies(name),
            manager:profiles!manager_id(full_name)
          `)
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!dbProfile) {
          setError('Profile record not found.');
          setLoading(false);
          return;
        }

        setProfile(dbProfile);

        // 3. Query other sections in parallel
        const [privateRes, skillsRes] = await Promise.all([
          supabase.from('employee_private_info').select('*').eq('profile_id', user.id).maybeSingle(),
          supabase.from('employee_skills').select('*').eq('employee_id', user.id)
        ]);

        if (privateRes.error) console.error('Private Info Error:', privateRes.error);
        if (skillsRes.error) console.error('Skills Error:', skillsRes.error);

        setPrivateInfo(privateRes.data || null);
        setSkills(skillsRes.data || []);
      } catch (err: any) {
        console.error('Unable to load profile. Supabase error details:', err);
        setError('Unable to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  if (role && role !== 'employee') {
    return null; // Redirecting
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm font-semibold text-gray-500 mt-4">Fetching profile information...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center border border-red-100 shadow-soft space-y-4 my-10 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl font-bold select-none">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-gray-900">Error Loading Profile</h2>
        <p className="text-sm text-gray-500">{error || 'Something went wrong.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Map database profile to format expected by EmployeeProfileHeader
  const mappedEmployee = {
    id: profile.employee_id || `EMP-${profile.id.substring(0, 8).toUpperCase()}`,
    name: profile.full_name || 'New Employee',
    designation: profile.designation || 'Software Engineer',
    email: profile.email || '',
    phone: profile.phone || 'Not provided',
    department: profile.department?.name || 'Not provided',
    company: profile.company?.name || 'Not provided',
    manager: profile.manager?.full_name || 'Not provided',
    location: profile.location || 'Not provided',
    avatarUrl: profile.profile_picture || '',
  };



  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          My Profile
        </h1>
        <p className="text-sm font-semibold text-gray-500 mt-1">
          View your personal and employment information
        </p>
      </div>

      {/* PROFILE HEADER */}
      <EmployeeProfileHeader employee={mappedEmployee as any} />

      {/* PROFILE TABS */}
      <EmployeeProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === 'private_info' && (
        <EmployeePrivateInfo employee={profile} privateInfo={privateInfo} />
      )}

      {activeTab === 'resume' && (
        <EmployeeResume employee={profile} skills={skills} />
      )}

      {activeTab === 'salary' && (
        <EmployeeSalaryInfo />
      )}

      {activeTab === 'security' && (
        <EmployeeSecurity email={profile.email} />
      )}
    </div>
  );
}