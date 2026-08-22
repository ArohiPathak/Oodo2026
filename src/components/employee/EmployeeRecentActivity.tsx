import React from 'react';
import { Check, Calendar, AlertCircle } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'attendance' | 'leave' | 'system';
  title: string;
  description: string;
  timestamp: string;
  statusBadge?: string;
  statusType?: 'success' | 'warning' | 'info' | 'error';
}

interface EmployeeRecentActivityProps {
  activities: ActivityItem[];
}

export const EmployeeRecentActivity: React.FC<EmployeeRecentActivityProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return <Check size={14} className="text-emerald-600" />;
      case 'leave':
        return <Calendar size={14} className="text-amber-600" />;
      default:
        return <AlertCircle size={14} className="text-primary" />;
    }
  };

  const getIconBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return 'bg-emerald-50 border-emerald-100';
      case 'leave':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-primary/5 border-primary/10';
    }
  };

  const getStatusBadgeClass = (statusType?: ActivityItem['statusType']) => {
    switch (statusType) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'error':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
      <h3 className="text-base font-bold text-gray-900 mb-6">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400 font-semibold">
          No recent activities found
        </div>
      ) : (
        <div className="relative border-l-2 border-lavender pl-6 ml-3 space-y-6">
          {activities.map((item) => (
            <div key={item.id} className="relative">
              {/* Connector Dot Icon */}
              <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center ${getIconBg(item.type)} shadow-sm bg-white`}>
                {getIcon(item.type)}
              </div>

              {/* Activity Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {item.statusBadge && (
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadgeClass(item.statusType)}`}>
                      {item.statusBadge}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-gray-400">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
