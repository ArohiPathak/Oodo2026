'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Clock, Calendar, Menu, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '../ui/Avatar';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { isCheckedIn, checkInTime, handleCheckIn, handleCheckOut } = useApp();

  const isAdmin = currentUser.id === 'EMP004';
  const navItems = [
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Attendance', href: isAdmin ? '/attendance' : '/employee/attendance', icon: Clock },
    { name: 'Time Off', href: isAdmin ? '/time-off' : '/employee/time-off', icon: Calendar },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/employees' && pathname.startsWith('/employees')) {
      return true;
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EFF1FF] border-b border-primary/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo & Desktop Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl select-none transition-all duration-200 ${
                pathname === '/' ? 'bg-primary/15 text-primary' : 'hover:bg-white/50'
              }`}
            >
              <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                D
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900 font-sans">
                Dayflow<span className="text-primary font-black">.</span>
              </span>
            </Link>
 
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-gray-600 hover:text-primary hover:bg-white/50'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
 
          {/* Right Side: Check-in Systray, Avatar & UserDropdown */}
          <div className="flex items-center gap-4">
            
            {/* Attendance Systray Toggler */}
            <div className="bg-white/60 border border-primary/5 rounded-2xl px-3 py-1.5 min-h-[44px] flex items-center justify-center select-none">
              {isCheckedIn ? (
                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] font-extrabold tracking-tight">
                      since {checkInTime.replace(':', '.').toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckOut}
                    className="text-[9px] font-extrabold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded transition-all mt-0.5 border border-red-200/50"
                  >
                    Check Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-extrabold tracking-tight hidden sm:inline">Offline</span>
                  </div>
                  <button
                    onClick={handleCheckIn}
                    className="text-xs bg-primary hover:bg-primary-dark text-white px-2.5 py-1 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    Check In
                  </button>
                </div>
              )}
            </div>
 
            {/* Profile Avatar trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none"
              >
                <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="sm" />
              </button>
 
              <UserMenu
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={currentUser}
                onLogout={onLogout}
              />
            </div>
 
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-500 hover:text-primary p-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Navigation Panel */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-gray-100 bg-[#EFF1FF] space-y-1 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-white/50'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
