'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function EmployeeTimeOffPage() {
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const [requests, setRequests] = useState([
    { id: 1, type: 'Paid Leave', dateRange: 'Aug 25 - Aug 27, 2026', duration: '3 days', status: 'pending', desc: 'Family trip' },
    { id: 2, type: 'Sick Leave', dateRange: 'Jul 14, 2026', duration: '1 day', status: 'approved', desc: 'Medical appointment' },
    { id: 3, type: 'Unpaid Leave', dateRange: 'May 02, 2026', duration: '1 day', status: 'rejected', desc: 'Personal work' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    
    // Dynamic request creation
    const newRequest = {
      id: Date.now(),
      type: `${leaveType} Leave`,
      dateRange: `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      duration: 'Calculated',
      status: 'pending',
      desc: remarks || 'No remarks provided',
    };

    setRequests(prev => [newRequest, ...prev]);
    setStartDate('');
    setEndDate('');
    setRemarks('');
    alert('Leave request submitted successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
            <AlertCircle size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
            <Clock size={12} className="animate-pulse" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Time Off Requests</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Submit and review your leave requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leave Request Form */}
        <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 lg:col-span-1 h-fit">
          <h3 className="text-base font-bold text-gray-900 mb-4">Request Leave</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Remarks / Notes</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Brief reason for your request"
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer">
              <Plus size={16} />
              Submit Request
            </Button>
          </form>
        </div>

        {/* Leave Requests History Table */}
        <div className="bg-white rounded-3xl border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">Request History</h3>
              <span className="text-[10px] font-extrabold text-primary bg-primary/5 px-2.5 py-1 rounded-full">Self-Service</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-lavender/20 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                    <th className="py-3.5 px-6">Leave Type</th>
                    <th className="py-3.5 px-6">Requested Dates</th>
                    <th className="py-3.5 px-6">Notes</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-lavender/5 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-bold">{req.type}</td>
                      <td className="py-4 px-6 text-gray-500">{req.dateRange}</td>
                      <td className="py-4 px-6 text-gray-400 font-normal truncate max-w-[150px]">{req.desc}</td>
                      <td className="py-4 px-6">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
