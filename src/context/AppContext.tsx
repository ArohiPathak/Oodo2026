'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, initialEmployees } from '../data/mockEmployees';
import { LeaveRequest } from '@/types/leave';
import { initialLeaveRequests } from '../data/mockRequests';

interface AppContextType {
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'status' | 'joiningDate'>) => void;
  isCheckedIn: boolean;
  checkInTime: string;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
  currentUser: Employee;
  leaveRequests: LeaveRequest[];
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('09:00 AM');
  const router = useRouter();
  const supabase = createClient();

  // Find current user (Aarav Sharma)
  const currentUser = employees.find((emp) => emp.id === 'EMP001') || employees[0];

  // Sync current user's initial state if they are present/absent
  useEffect(() => {
    if (currentUser) {
      setIsCheckedIn(currentUser.status === 'present');
    }
  }, []);

  const addEmployee = (newEmp: Omit<Employee, 'status' | 'joiningDate'>) => {
    const fullEmp: Employee = {
      ...newEmp,
      status: 'present', // Defaults to present when added
      joiningDate: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [...prev, fullEmp]);
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));

    // Update logged-in employee status to 'present'
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentUser.id ? { ...emp, status: 'present' } : emp))
    );
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);

    // Update logged-in employee status to 'absent'
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentUser.id ? { ...emp, status: 'absent' } : emp))
    );
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
  return (
    <AppContext.Provider
      value={{
        employees,
        addEmployee,
        isCheckedIn,
        checkInTime,
        handleCheckIn,
        handleCheckOut,
        currentUser,
        leaveRequests,
        approveLeaveRequest,
        rejectLeaveRequest,
        logout,
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
