'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '../data/mockEmployees';
import { LeaveRequest } from '@/types/leave';
import { initialLeaveRequests } from '../data/mockRequests';

interface AppContextType {
  isCheckedIn: boolean;
  checkInTime: string;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
  currentUser: (Employee & { role?: string }) | null;
  role: 'admin' | 'employee' | null;
  isLoadingAuth: boolean;
  leaveRequests: LeaveRequest[];
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  logout: () => void;
  updateEmployeeProfile: (id: string, updates: Partial<Employee>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('09:00 AM');
  const router = useRouter();
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<(Employee & { role?: string }) | null>(null);
  const [role, setRole] = useState<'admin' | 'employee' | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Sync current user's initial check-in state
  useEffect(() => {
    if (currentUser) {
      setIsCheckedIn(currentUser.status === 'present');
    }
  }, [currentUser]);

  // Synchronize currentUser state with Supabase authenticated user role
  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
              *,
              department:departments(name),
              company:companies(name),
              manager:profiles!manager_id(full_name)
            `)
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile && isMounted) {
            const mappedUser: Employee & { role?: string } = {
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
              role: profile.role,
            };
            setCurrentUser(mappedUser);
            setRole(profile.role as 'admin' | 'employee');
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error('Failed to sync auth session:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setCurrentUser(null);
          setRole(null);
          setIsLoadingAuth(false);
        }
      } else if (session) {
        syncUser();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, status: 'present' } : null);
    }
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, status: 'absent' } : null);
    }
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'approved' } : req))
    );
  };

  const rejectLeaveRequest = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'rejected' } : req))
    );
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    router.push('/login');
    router.refresh();
  };

  const updateEmployeeProfile = (id: string, updates: Partial<Employee>) => {
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isCheckedIn,
        checkInTime,
        handleCheckIn,
        handleCheckOut,
        currentUser,
        role,
        isLoadingAuth,
        leaveRequests,
        approveLeaveRequest,
        rejectLeaveRequest,
        logout,
        updateEmployeeProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

