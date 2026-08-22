'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export default function EmployeeAttendancePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Attendance</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Track your daily and weekly shift logging</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 text-center py-16">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock size={28} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Attendance Module Coming Soon</h3>
        <p className="text-sm text-gray-400 font-semibold max-w-md mx-auto">
          We are currently integrating this page with the live shifts tracking system. Soon you will be able to review your daily and weekly attendance records here.
        </p>
      </div>
    </div>
  );
}
