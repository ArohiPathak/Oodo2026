import React, { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmployeeAttendanceSummaryProps {
  isCheckedIn: boolean;
  globalCheckInTime: string;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export const EmployeeAttendanceSummary: React.FC<EmployeeAttendanceSummaryProps> = ({
  isCheckedIn,
  globalCheckInTime,
  onCheckIn,
  onCheckOut,
}) => {
  const [state, setState] = useState<'idle' | 'checked-in' | 'checked-out'>('idle');
  const [checkInTime, setCheckInTime] = useState('--');
  const [checkOutTime, setCheckOutTime] = useState('--');

  useEffect(() => {
    if (isCheckedIn) {
      setState('checked-in');
      setCheckInTime(globalCheckInTime || '09:12 AM');
    } else if (state === 'checked-in') {
      setState('checked-out');
      setCheckOutTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }));
    }
  }, [isCheckedIn, globalCheckInTime]);

  const handleLocalCheckIn = () => {
    onCheckIn();
    setState('checked-in');
    setCheckInTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));
  };

  const handleLocalCheckOut = () => {
    onCheckOut();
    setState('checked-out');
    setCheckOutTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Today&apos;s Attendance</h3>
          {state === 'checked-in' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Present
            </span>
          )}
          {state === 'checked-out' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Present (Checked Out)
            </span>
          )}
          {state === 'idle' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              Not Checked In
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check In</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{checkInTime}</p>
          </div>
          <div className="p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check Out</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{checkOutTime}</p>
          </div>
        </div>

        {state === 'checked-out' && (
          <div className="mt-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-50 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Worked Today:</span>
            <span>8h 52m</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {state === 'idle' && (
          <Button
            variant="primary"
            onClick={handleLocalCheckIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer"
          >
            <LogIn size={16} />
            Check In
          </Button>
        )}
        {state === 'checked-in' && (
          <Button
            variant="danger"
            onClick={handleLocalCheckOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer"
          >
            <LogOut size={16} />
            Check Out
          </Button>
        )}
        {state === 'checked-out' && (
          <Button
            variant="outline"
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 animate-pulse"
          >
            Shift Completed 👍
          </Button>
        )}
      </div>
    </div>
  );
};
