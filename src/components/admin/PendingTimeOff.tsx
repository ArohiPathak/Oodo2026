import React from 'react';
import Link from 'next/link';
import { Check, X, Calendar } from 'lucide-react';
import { LeaveRequest } from '@/types/leave';
import { Button } from '@/components/ui/Button';

interface PendingTimeOffProps {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const PendingTimeOff: React.FC<PendingTimeOffProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatRange = (start: string, end: string) => {
    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden hover:shadow-soft-lg transition-all duration-200">
      <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900">Pending Time Off</h3>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">Requests awaiting admin approval</p>
        </div>
        <Link
          href="/time-off"
          className="text-xs font-bold text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all duration-200"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        {pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center mb-3">
              <Calendar size={20} />
            </div>
            <h4 className="text-sm font-bold text-gray-900">All caught up!</h4>
            <p className="text-xs text-gray-500 mt-0.5">No pending time-off requests to review.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Dates</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
              {pendingRequests.map((req) => (
                <tr key={req.id} className="hover:bg-lavender/10 transition-colors">
                  <td className="py-4 px-6 text-gray-900 font-bold">{req.employeeName}</td>
                  <td className="py-4 px-6 text-gray-500">{req.leaveType}</td>
                  <td className="py-4 px-6 text-gray-600 font-normal">
                    {formatRange(req.startDate, req.endDate)}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-normal">{req.duration}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-55 bg-amber-50 text-amber-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onApprove(req.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs"
                      >
                        <Check size={12} />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onReject(req.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                      >
                        <X size={12} />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
