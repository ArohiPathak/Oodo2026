'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

// Formatting helpers
const formatLeaveType = (type: string) => {
  if (!type) return '—';
  const config: Record<string, string> = {
    paid: 'Paid Leave',
    sick: 'Sick Leave',
    unpaid: 'Unpaid Leave',
  };
  return config[type.toLowerCase()] || type;
};

const formatRange = (start: string, end: string) => {
  try {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    if (s.getTime() === e.getTime()) {
      return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    const startStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  } catch (err) {
    return `${start} – ${end}`;
  }
};

export default function EmployeeTimeOffPage() {
  const supabase = createClient();
  const router = useRouter();

  // Authentication states
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requests state
  const [requests, setRequests] = useState<any[]>([]);

  // 1. Fetch requests function
  const fetchRequests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching employee leaves:', err);
    }
  };

  // Auth check on mount
  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }

        setCurrentUser(user);
        await fetchRequests(user.id);
      } catch (err) {
        console.error('Error initializing page:', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    initPage();
  }, [router, supabase]);

  // 2. Submit form handle (real insert)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('You must be logged in to submit a request.');
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          employee_id: user.id,
          leave_type: leaveType.toLowerCase(),
          start_date: startDate,
          end_date: endDate,
          reason: remarks,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      // Reset form fields
      setStartDate('');
      setEndDate('');
      setRemarks('');

      // Refresh request history from Supabase
      await fetchRequests(user.id);

      alert('Leave request submitted successfully!');
    } catch (err: any) {
      console.error('Submission error:', err.message);
      alert('Unable to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-gray-500 tracking-wide animate-pulse">Checking credentials...</p>
      </div>
    );
  }

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
                disabled={isSubmitting}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
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
                disabled={isSubmitting}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                disabled={isSubmitting}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Remarks / Notes</label>
              <textarea
                value={remarks}
                disabled={isSubmitting}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Brief reason for your request"
                className="w-full px-3 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] disabled:opacity-50"
              />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Submit Request
                </>
              )}
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
                      <td className="py-4 px-6 text-gray-900 font-bold">{formatLeaveType(req.leave_type)}</td>
                      <td className="py-4 px-6 text-gray-500">{formatRange(req.start_date, req.end_date)}</td>
                      <td className="py-4 px-6 text-gray-400 font-normal truncate max-w-[150px]">{req.reason || '—'}</td>
                      <td className="py-4 px-6">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs font-semibold text-gray-400 italic">
                        No leave request logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
