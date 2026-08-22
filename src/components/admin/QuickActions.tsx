import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickActionsProps {
  onNewEmployeeClick: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNewEmployeeClick }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 hover:shadow-soft-lg transition-all duration-200">
      <h3 className="text-base font-bold text-gray-900 tracking-tight">Quick Actions</h3>
      <p className="text-xs font-semibold text-gray-400 mt-0.5">Frequently used operational controls</p>

      <div className="flex flex-col gap-3 mt-6">
        <Button
          variant="primary"
          onClick={onNewEmployeeClick}
          className="flex items-center justify-center gap-2 py-3 shadow-soft hover:shadow-soft-lg w-full text-xs font-bold"
        >
          <Plus size={16} />
          New Employee
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/time-off')}
          className="flex items-center justify-center gap-2 py-3 w-full text-xs font-bold"
        >
          <Calendar size={16} />
          Review Time Off
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/attendance')}
          className="flex items-center justify-center gap-2 py-3 w-full text-xs font-bold"
        >
          <Clock size={16} />
          View Attendance
        </Button>
      </div>
    </div>
  );
};
