import React from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Click-away backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Floating Menu */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-primary/10 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
        {/* User Brief */}
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Dropdown Items */}
        <div className="p-1">
          <Link
            href={user.role === 'admin' ? '/profile' : '/employee/profile'}
            onClick={onClose}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary-light/5 rounded-xl transition-all duration-200"
          >
            <User size={16} />
            My Profile
          </Link>
          
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-left"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};
