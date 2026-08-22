'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TimeOffPage() {
  const handleRequestTimeOff = () => {
    alert('Request Time Off dialog placeholder. This functionality will be added in a future release.');
  };

  const balances = [
    { type: 'Paid Time Off', remaining: 12, total: 18, color: 'text-primary bg-primary/5 border-primary/10' },
    { type: 'Sick Leave', remaining: 6, total: 8, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { type: 'Wellness Days', remaining: 2, total: 2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  const requests = [
    { type: 'Sick Leave', date: 'Jul 14, 2026', duration: '1 day', status: 'Approved', desc: 'Medical appointment' },
    { type: 'Paid Time Off', date: 'Jun 12 - Jun 14, 2026', duration: '3 days', status: 'Approved', desc: 'Family trip' },
    { type: 'Paid Time Off', date: 'Apr 05, 2026', duration: '0.5 day', status: 'Approved', desc: 'Personal work' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Time Off</h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your leave balance and check request status</p>
        </div>

        <Button
          variant="primary"
          onClick={handleRequestTimeOff}
          className="self-start sm:self-auto flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
        >
          <Plus size={16} />
          Request Time Off
        </Button>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {balances.map((bal, idx) => (
          <div key={idx} className={`bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between`}>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{bal.type}</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-black text-gray-900">{bal.remaining}</span>
                <span className="text-sm text-gray-400 font-semibold">/ {bal.total} days</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Used: {bal.total - bal.remaining} days</span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${bal.color}`}>
                Active Balance
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Recent Requests</h3>
          <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">2026 Calendar Year</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Dates Requested</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Reason / Note</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
              {requests.map((req, idx) => (
                <tr key={idx} className="hover:bg-lavender/10 transition-colors">
                  <td className="py-4 px-6 text-gray-900 font-bold">{req.type}</td>
                  <td className="py-4 px-6 text-gray-500">{req.date}</td>
                  <td className="py-4 px-6 text-gray-600">{req.duration}</td>
                  <td className="py-4 px-6 text-gray-400 font-normal truncate max-w-[150px]">{req.desc}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                      <CheckCircle size={12} />
                      Approved
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
