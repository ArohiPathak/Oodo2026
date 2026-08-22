'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { EmployeeDetails } from '@/components/employees/EmployeeDetails';

export default function ProfilePage() {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your personal HR record and account details</p>
      </div>
      
      <EmployeeDetails employee={currentUser} />
    </div>
  );
}
