import React from 'react';
import Link from 'next/link';
import { User, Clock, Calendar, LogOut } from 'lucide-react';

interface EmployeeQuickAccessProps {
  isCheckedIn: boolean;
  pendingLeavesCount: number;
  onLogout: () => void;
}

export const EmployeeQuickAccess: React.FC<EmployeeQuickAccessProps> = ({
  isCheckedIn,
  pendingLeavesCount,
  onLogout,
}) => {
  const cards = [
    {
      title: 'Profile',
      description: 'View your profile',
      icon: User,
      href: '/employee/profile',
      bgColor: 'bg-[#EEF1FF] hover:bg-[#E2E6FF]',
      iconColor: 'text-[#7C7FF2] bg-white/60',
      textColor: 'text-gray-900',
      subTextColor: 'text-gray-500',
    },
    {
      title: 'Attendance',
      description: isCheckedIn ? 'Checked in today' : 'Not Checked In',
      icon: Clock,
      href: '/employee/attendance',
      bgColor: 'bg-[#E6F4EA] hover:bg-[#D5EFE0]',
      iconColor: 'text-[#137333] bg-white/60',
      textColor: 'text-gray-900',
      subTextColor: 'text-gray-600',
    },
    {
      title: 'Leave Requests',
      description: `${pendingLeavesCount} Pending request${pendingLeavesCount !== 1 ? 's' : ''}`,
      icon: Calendar,
      href: '/employee/time-off',
      bgColor: 'bg-[#FFF4EC] hover:bg-[#FFE5D4]',
      iconColor: 'text-[#B26B50] bg-white/60',
      textColor: 'text-gray-900',
      subTextColor: 'text-[#9A624A]',
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className={`${card.bgColor} rounded-3xl p-6 border border-primary/5 shadow-soft hover:scale-[1.02] hover:shadow-soft-lg transition-all duration-250 flex flex-col items-start gap-4 group`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform duration-250`}>
              <Icon size={22} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h4 className={`text-base font-bold ${card.textColor}`}>
                  {card.title}
                </h4>
                {card.badge !== undefined && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className={`text-xs font-semibold ${card.subTextColor} mt-1`}>{card.description}</p>
            </div>
          </Link>
        );
      })}

      {/* Logout Card */}
      <button
        onClick={onLogout}
        className="bg-[#FCE8E6] hover:bg-[#FADBD8] rounded-3xl p-6 border border-primary/5 shadow-soft hover:scale-[1.02] hover:shadow-soft-lg transition-all duration-250 flex flex-col items-start gap-4 text-left group w-full focus:outline-none cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#C5221F] bg-white/60 group-hover:scale-110 transition-transform duration-250">
          <LogOut size={22} />
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
            Logout
          </h4>
          <p className="text-xs font-semibold text-gray-655 mt-1">Sign out of your session</p>
        </div>
      </button>
    </div>
  );
};
