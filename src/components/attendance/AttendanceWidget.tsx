import React from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface AttendanceWidgetProps {
  isCheckedIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  checkInTime?: string;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  isCheckedIn,
  onCheckIn,
  onCheckOut,
  checkInTime = '09:00 AM',
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-200 hover:shadow-soft-lg">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          isCheckedIn ? 'bg-emerald-50 text-[#10B981]' : 'bg-primary-light/10 text-primary'
        }`}>
          <Clock size={24} />
        </div>
        
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {isCheckedIn ? 'Checked in' : 'Ready to start your day?'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isCheckedIn 
              ? `Your shifts started today at ${checkInTime}` 
              : 'Log your attendance for today'
            }
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-end">
        {isCheckedIn ? (
          <Button
            variant="danger"
            onClick={onCheckOut}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Check Out
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onCheckIn}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            Check In
          </Button>
        )}
      </div>
    </div>
  );
};
