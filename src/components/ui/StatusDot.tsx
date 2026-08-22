import React from 'react';
import { Plane } from 'lucide-react';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half_day';

interface StatusDotProps {
  status: AttendanceStatus;
  showLabel?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  showLabel = false,
  className = '',
}) => {
  const statusConfig = {
    present: {
      dotClass: 'bg-[#10B981]',
      textClass: 'text-emerald-600',
      bgClass: 'bg-[#E6F4EA]',
      label: 'Present',
    },
    leave: {
      dotClass: 'bg-[#3B82F6]',
      textClass: 'text-blue-600',
      bgClass: 'bg-[#E8F0FE]',
      label: 'On Leave',
    },
    absent: {
      dotClass: 'bg-[#F59E0B]', // Yellow
      textClass: 'text-amber-600',
      bgClass: 'bg-[#FEF3C7]',
      label: 'Absent',
    },
    half_day: {
      dotClass: 'bg-[#8B5CF6]', // Purple
      textClass: 'text-purple-600',
      bgClass: 'bg-[#F5F3FF]',
      label: 'Half Day',
    },
  };

  const config = statusConfig[status] || statusConfig.absent;

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass} ${className}`}
      >
        {status === 'leave' ? (
          <Plane size={12} className={config.textClass} />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        )}
        {config.label}
      </span>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {status === 'leave' ? (
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full border border-blue-200 bg-[#E8F0FE] text-blue-500 shadow-sm cursor-help"
          aria-label={`Status: ${config.label}`}
        >
          <Plane size={10} />
        </span>
      ) : (
        <span
          className={`block w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm cursor-help ${config.dotClass}`}
          aria-label={`Status: ${config.label}`}
        />
      )}
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium pointer-events-none">
        {config.label}
      </span>
    </div>
  );
};
