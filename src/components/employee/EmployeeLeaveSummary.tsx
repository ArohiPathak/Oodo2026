import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface LeaveRequest {
  type: string;
  dateRange: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface EmployeeLeaveSummaryProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  latestRequest?: LeaveRequest;
}

export const EmployeeLeaveSummary: React.FC<EmployeeLeaveSummaryProps> = ({
  pendingCount,
  approvedCount,
  rejectedCount,
  latestRequest,
}) => {
  const statusLabel = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Leave Requests</h3>
          <Calendar size={18} className="text-primary" />
        </div>

        {/* Count Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          <div className="p-2.5 bg-[#FFF9F3] rounded-2xl border border-amber-100/30">
            <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</span>
            <span className="block text-xl font-black text-amber-700 mt-1">{pendingCount}</span>
          </div>
          <div className="p-2.5 bg-[#F4FCF7] rounded-2xl border border-emerald-100/30">
            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved</span>
            <span className="block text-xl font-black text-emerald-700 mt-1">{approvedCount}</span>
          </div>
          <div className="p-2.5 bg-[#FFF5F5] rounded-2xl border border-red-100/30">
            <span className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">Rejected</span>
            <span className="block text-xl font-black text-red-600 mt-1">{rejectedCount}</span>
          </div>
        </div>

        {/* Latest Request Detail */}
        {latestRequest && (
          <div className="mt-4 p-3 bg-lavender/30 rounded-2xl border border-primary/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-gray-800">{latestRequest.type}</p>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{latestRequest.dateRange}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
              latestRequest.status === 'pending' ? 'bg-amber-50 text-amber-600' :
              latestRequest.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
              'bg-red-50 text-red-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                latestRequest.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                latestRequest.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
              }`} />
              {statusLabel[latestRequest.status]}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/employee/time-off" passHref legacyBehavior>
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer text-xs"
          >
            View Leave Requests
            <ChevronRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
};
