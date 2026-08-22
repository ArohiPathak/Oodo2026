'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AttendanceOverview } from '@/components/admin/AttendanceOverview';
import { PendingTimeOff } from '@/components/admin/PendingTimeOff';
import { EmployeeOverview } from '@/components/admin/EmployeeOverview';
import { QuickActions } from '@/components/admin/QuickActions';
import { AddEmployeeModal } from '@/components/employees/AddEmployeeModal';

export default function AdminDashboard() {
  const {
    employees,
    addEmployee,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    currentUser,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Stats derivation
  const totalEmployees = employees.length;
  const presentEmployees = employees.filter((emp) => emp.status === 'present').length;
  const absentEmployees = employees.filter((emp) => emp.status === 'absent').length;
  const halfDayEmployees = employees.filter((emp) => emp.status === 'half-day').length;
  const leaveEmployees = employees.filter((emp) => emp.status === 'leave').length;

  const presentPercentage = totalEmployees
    ? Math.round((presentEmployees / totalEmployees) * 100)
    : 0;

  const pendingRequestsCount = leaveRequests.filter((r) => r.status === 'pending').length;

  // Dynamic next employee ID computation
  const numericIds = employees
    .map((e) => parseInt(e.id.replace('EMP', ''), 10))
    .filter((n) => !isNaN(n));
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 9;
  const nextIdSuggestion = `EMP${String(maxId + 1).padStart(3, '0')}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Good morning, {currentUser?.name || 'Admin'}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">
            Here&apos;s what&apos;s happening across your organization today.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardStats
        totalEmployees={totalEmployees}
        presentCount={presentEmployees}
        presentPercentage={presentPercentage}
        onLeaveCount={leaveEmployees}
        pendingTimeOffCount={pendingRequestsCount}
      />

      {/* Grid: Attendance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceOverview
            presentCount={presentEmployees}
            absentCount={absentEmployees}
            halfDayCount={halfDayEmployees}
            leaveCount={leaveEmployees}
            totalCount={totalEmployees}
          />
        </div>
        <div>
          <QuickActions onNewEmployeeClick={() => setIsAddModalOpen(true)} />
        </div>
      </div>

      {/* Pending Leave Requests */}
      <PendingTimeOff
        requests={leaveRequests}
        onApprove={approveLeaveRequest}
        onReject={rejectLeaveRequest}
      />

      {/* Employee Overview Directory */}
      <EmployeeOverview employees={employees} />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={addEmployee}
        nextIdSuggestion={nextIdSuggestion}
      />
    </div>
  );
}
