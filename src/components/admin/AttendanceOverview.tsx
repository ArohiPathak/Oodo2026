import React from 'react';

interface AttendanceOverviewProps {
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  leaveCount: number;
  totalCount: number;
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  presentCount,
  absentCount,
  halfDayCount,
  leaveCount,
  totalCount,
}) => {
  const total = totalCount || 1;
  const presentPct = (presentCount / total) * 100;
  const halfDayPct = (halfDayCount / total) * 100;
  const leavePct = (leaveCount / total) * 100;
  const absentPct = (absentCount / total) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 hover:shadow-soft-lg transition-all duration-200">
      <h3 className="text-base font-bold text-gray-900 tracking-tight">Today&apos;s Attendance</h3>
      <p className="text-xs font-semibold text-gray-400 mt-0.5">Overview of active workforce attendance</p>

      {/* Progress Bar Distribution */}
      <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden mt-6 shadow-inner">
        {presentPct > 0 && (
          <div style={{ width: `${presentPct}%` }} className="bg-[#10B981] h-full transition-all duration-500" title={`Present: ${presentCount}`} />
        )}
        {halfDayPct > 0 && (
          <div style={{ width: `${halfDayPct}%` }} className="bg-[#8B5CF6] h-full transition-all duration-500" title={`Half-day: ${halfDayCount}`} />
        )}
        {leavePct > 0 && (
          <div style={{ width: `${leavePct}%` }} className="bg-[#3B82F6] h-full transition-all duration-500" title={`On Leave: ${leaveCount}`} />
        )}
        {absentPct > 0 && (
          <div style={{ width: `${absentPct}%` }} className="bg-[#EF4444] h-full transition-all duration-500" title={`Absent: ${absentCount}`} />
        )}
      </div>

      {/* Legend Breakdown */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Present */}
        <div className="flex items-center justify-between p-3 bg-emerald-50/30 border border-emerald-100/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="text-xs font-bold text-gray-700">Present</span>
          </div>
          <span className="text-sm font-black text-gray-900">{presentCount}</span>
        </div>

        {/* Half-day */}
        <div className="flex items-center justify-between p-3 bg-purple-50/30 border border-purple-100/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            <span className="text-xs font-bold text-gray-700">Half-day</span>
          </div>
          <span className="text-sm font-black text-gray-900">{halfDayCount}</span>
        </div>

        {/* On Leave */}
        <div className="flex items-center justify-between p-3 bg-blue-50/30 border border-blue-100/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span className="text-xs font-bold text-gray-700">Leave</span>
          </div>
          <span className="text-sm font-black text-gray-900">{leaveCount}</span>
        </div>

        {/* Absent */}
        <div className="flex items-center justify-between p-3 bg-red-50/30 border border-red-100/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-xs font-bold text-gray-700">Absent</span>
          </div>
          <span className="text-sm font-black text-gray-900">{absentCount}</span>
        </div>
      </div>
    </div>
  );
};
