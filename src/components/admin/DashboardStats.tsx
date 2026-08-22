import React from 'react';

interface DashboardStatsProps {
  totalEmployees: number;
  presentCount: number;
  presentPercentage: number;
  onLeaveCount: number;
  pendingTimeOffCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalEmployees,
  presentCount,
  presentPercentage,
  onLeaveCount,
  pendingTimeOffCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Employees */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Employees</p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-black text-gray-900">{totalEmployees}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-3">Active employees</p>
      </div>

      {/* Present Today */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Present Today</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-gray-900">{presentCount}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-[#E6F4EA] px-2 py-0.5 rounded-full">
              {presentPercentage}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-3">{presentPercentage}% attendance today</p>
      </div>

      {/* On Leave */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On Leave</p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-black text-gray-900">{onLeaveCount}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-3">Currently on leave</p>
      </div>

      {/* Pending Time Off */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Time Off</p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-black text-gray-900">{pendingTimeOffCount}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-3">Requests awaiting approval</p>
      </div>
    </div>
  );
};
