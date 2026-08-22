'use client';

import React from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AttendancePage() {
  const { isCheckedIn, checkInTime } = useApp();

  // Mock attendance history logs
  const logs = [
    { date: 'Aug 21, 2026', checkIn: '09:02 AM', checkOut: '05:30 PM', status: 'present', hours: '8.5h' },
    { date: 'Aug 20, 2026', checkIn: '08:55 AM', checkOut: '06:12 PM', status: 'present', hours: '9.3h' },
    { date: 'Aug 19, 2026', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'present', hours: '8.5h' },
    { date: 'Aug 18, 2026', checkIn: '—', checkOut: '—', status: 'leave', hours: '0h' },
    { date: 'Aug 17, 2026', checkIn: '09:05 AM', checkOut: '05:30 PM', status: 'present', hours: '8.4h' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Track your daily clock-in logs and monthly metrics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendance Rate</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900">96.4%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+1.2%</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Target rate: 95% minimum</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Check-In</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900">09:04 AM</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">On-time rate: 92% this month</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overtime Logged</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900">12.5 hrs</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Approved overtime hours</p>
        </div>
      </div>

      {/* Today's status alert */}
      <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all duration-200 ${
        isCheckedIn
          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          : 'bg-amber-50/50 border-amber-100 text-amber-800'
      }`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          isCheckedIn ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        }`}>
          {isCheckedIn ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        <div>
          <p className="text-sm font-bold">
            {isCheckedIn 
              ? `You checked in at ${checkInTime} today.` 
              : 'You have not checked in for today yet.'
            }
          </p>
          <p className="text-xs opacity-80 mt-0.5">
            {isCheckedIn 
              ? 'Your hours are being tracked automatically.' 
              : 'Remember to click Check In on the Employees tab to start your day.'
            }
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Recent Logs</h3>
          <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">August 2026</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Hours</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
              {isCheckedIn && (
                <tr className="bg-emerald-50/10">
                  <td className="py-4 px-6 text-gray-900 font-bold">Today, Aug 22</td>
                  <td className="py-4 px-6 font-mono">{checkInTime}</td>
                  <td className="py-4 px-6 text-gray-400 font-normal">Active...</td>
                  <td className="py-4 px-6 text-gray-400 font-normal">—</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                      Active
                    </span>
                  </td>
                </tr>
              )}
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-lavender/10 transition-colors">
                  <td className="py-4 px-6">{log.date}</td>
                  <td className="py-4 px-6 font-mono text-gray-600">{log.checkIn}</td>
                  <td className="py-4 px-6 font-mono text-gray-600">{log.checkOut}</td>
                  <td className="py-4 px-6 text-gray-600">{log.hours}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      log.status === 'present' 
                        ? 'bg-[#E6F4EA] text-emerald-600' 
                        : 'bg-[#E8F0FE] text-blue-600'
                    }`}>
                      {log.status === 'present' ? 'Present' : 'On Leave'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
