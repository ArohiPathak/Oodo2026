'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EmployeeProfileHeader } from '@/components/employee/EmployeeProfileHeader';
import { EmployeeProfileTabs, EmployeeProfileTabType } from '@/components/employee/EmployeeProfileTabs';
import { EmployeePrivateInfo } from '@/components/employee/EmployeePrivateInfo';

export default function EmployeeProfilePage() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<EmployeeProfileTabType>('private_info');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your personal HR record and account details</p>
      </div>
      
      {/* Profile Header Details block */}
      <EmployeeProfileHeader employee={currentUser} />

      {/* Tabs navigation list */}
      <EmployeeProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab panel contents switcher */}
      {activeTab === 'private_info' ? (
        <EmployeePrivateInfo employee={currentUser} />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6 select-none animate-in fade-in slide-in-from-top-3 duration-250">
          <h3 className="text-base font-bold text-gray-900 capitalize">
            {activeTab === 'resume' ? 'Resume' : activeTab === 'salary' ? 'Salary Info' : 'Security'}
          </h3>
          <p className="text-sm font-semibold text-gray-400 mt-2">Coming soon.</p>
        </div>
      )}
    </div>
  );
}
