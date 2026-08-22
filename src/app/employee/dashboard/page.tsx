'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { EmployeeQuickAccess } from '@/components/employee/EmployeeQuickAccess';
import { EmployeeAttendanceSummary } from '@/components/employee/EmployeeAttendanceSummary';
import { EmployeeLeaveSummary } from '@/components/employee/EmployeeLeaveSummary';
import { EmployeeRecentActivity, ActivityItem } from '@/components/employee/EmployeeRecentActivity';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    isCheckedIn,
    checkInTime,
    handleCheckIn,
    handleCheckOut,
    logout,
    role,
  } = useApp();

  useEffect(() => {
    if (role && role !== 'employee') {
      router.push('/employees');
    }
  }, [role, router]);

  if (role && role !== 'employee') {
    return null;
  }

  // Mock leave requests counters (Pending: 1, Approved: 3, Rejected: 1)
  const leaveSummary = {
    pendingCount: 1,
    approvedCount: 3,
    rejectedCount: 1,
    latestRequest: {
      type: 'Paid Leave',
      dateRange: 'Aug 25 - Aug 27',
      status: 'pending' as const,
    },
  };

  // Mock activity items (reusable structure)
  const activities: ActivityItem[] = [
    {
      id: 'act_1',
      type: 'attendance',
      title: 'Attendance',
      description: isCheckedIn 
        ? `Checked in at ${checkInTime}` 
        : 'Offline / Shift not active',
      timestamp: 'Today',
      statusBadge: isCheckedIn ? 'Present' : 'Offline',
      statusType: isCheckedIn ? 'success' : 'error',
    },
    {
      id: 'act_2',
      type: 'leave',
      title: 'Leave Request',
      description: 'Paid Leave · Aug 25 - Aug 27',
      timestamp: 'Yesterday',
      statusBadge: 'Pending',
      statusType: 'warning',
    },
  ];

  // Extract first name for the greeting (e.g. "Aarav")
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Aarav';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">
          Here&apos;s your Dayflow overview
        </p>
      </div>

      {/* Quick Access Actions Grid */}
      <EmployeeQuickAccess
        isCheckedIn={isCheckedIn}
        pendingLeavesCount={leaveSummary.pendingCount}
        onLogout={logout}
      />

      {/* Grid: Attendance & Leaves Side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmployeeAttendanceSummary
          isCheckedIn={isCheckedIn}
          globalCheckInTime={checkInTime}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
        <EmployeeLeaveSummary
          pendingCount={leaveSummary.pendingCount}
          approvedCount={leaveSummary.approvedCount}
          rejectedCount={leaveSummary.rejectedCount}
          latestRequest={leaveSummary.latestRequest}
        />
      </div>

      {/* Recent Activity Feed */}
      <EmployeeRecentActivity activities={activities} />
    </div>
  );
}
