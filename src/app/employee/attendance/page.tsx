'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronDown, Calendar, Clock, AlertCircle, Sparkles, Award, Play, Pause } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
  status: 'present' | 'absent' | 'leave' | 'half-day';
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function EmployeeAttendancePage() {
  const { currentUser, leaveRequests, isCheckedIn, checkInTime } = useApp();
  
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Centralized helper to get a record for any date
  const getRecordForDate = (dateObj: Date): AttendanceRecord => {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const d = dateObj.getDate();
    const dayOfWeek = dateObj.getDay();

    const formattedDate = `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`;
    const isoDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // Weekend check
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        date: formattedDate,
        checkIn: '—',
        checkOut: '—',
        workHours: '00:00',
        extraHours: '00:00',
        status: 'absent'
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateObj);
    checkDate.setHours(0, 0, 0, 0);

    // Future date check
    if (checkDate > today) {
      return {
        date: formattedDate,
        checkIn: '—',
        checkOut: '—',
        workHours: '—',
        extraHours: '—',
        status: 'absent'
      };
    }

    // Leave check
    const onLeave = leaveRequests.some(
      (req) =>
        req.employeeId === currentUser.id &&
        req.status === 'approved' &&
        isoDateStr >= req.startDate &&
        isoDateStr <= req.endDate
    );

    if (onLeave) {
      return {
        date: formattedDate,
        checkIn: '—',
        checkOut: '—',
        workHours: '00:00',
        extraHours: '00:00',
        status: 'leave'
      };
    }

    const isToday =
      y === today.getFullYear() &&
      m === today.getMonth() &&
      d === today.getDate();

    if (isToday) {
      if (isCheckedIn) {
        let checkIn = checkInTime;
        if (checkIn.endsWith('AM') || checkIn.endsWith('PM')) {
          const [time, modifier] = checkIn.split(' ');
          let [hours, minutes] = time.split(':');
          if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
          }
          if (modifier === 'AM' && hours === '12') {
            hours = '00';
          }
          checkIn = `${hours.padStart(2, '0')}:${minutes}`;
        }
        return {
          date: formattedDate,
          checkIn,
          checkOut: '—',
          workHours: '—',
          extraHours: '—',
          status: 'present'
        };
      } else {
        return {
          date: formattedDate,
          checkIn: '—',
          checkOut: '—',
          workHours: '00:00',
          extraHours: '00:00',
          status: 'absent'
        };
      }
    }

    // Deterministic past weekday record using month/day seed
    const seed = (d + m * 31) % 20;
    if (seed === 15) {
      // Absent day
      return {
        date: formattedDate,
        checkIn: '—',
        checkOut: '—',
        workHours: '00:00',
        extraHours: '00:00',
        status: 'absent'
      };
    } else if (seed === 10) {
      // Half-day
      return {
        date: formattedDate,
        checkIn: '10:00',
        checkOut: '14:00',
        workHours: '04:00',
        extraHours: '00:00',
        status: 'half-day'
      };
    } else {
      // Present day (Check In: 10:00, Check Out: 19:00 -> 9 hours of work, 1 hour extra)
      const checkInMin = 45 + (d % 30) - 15;
      const checkInHour = checkInMin >= 60 ? 10 : 9;
      const checkInMinute = checkInMin % 60;

      const checkOutMin = 45 + ((d + 5) % 30) - 15;
      const checkOutHour = checkOutMin >= 60 ? 19 : 18;
      const checkOutMinute = checkOutMin % 60;

      const checkInStr = `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`;
      const checkOutStr = `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}`;

      const workMinutesTotal = (checkOutHour * 60 + checkOutMinute) - (checkInHour * 60 + checkInMinute);
      const workHoursNum = Math.floor(workMinutesTotal / 60);
      const workMinutesNum = workMinutesTotal % 60;
      const workHoursStr = `${String(workHoursNum).padStart(2, '0')}:${String(workMinutesNum).padStart(2, '0')}`;

      const extraMinutes = Math.max(0, workMinutesTotal - 480);
      const extraHoursNum = Math.floor(extraMinutes / 60);
      const extraMinutesNum = extraMinutes % 60;
      const extraHoursStr = `${String(extraHoursNum).padStart(2, '0')}:${String(extraMinutesNum).padStart(2, '0')}`;

      return {
        date: formattedDate,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        workHours: workHoursStr,
        extraHours: extraHoursStr,
        status: 'present'
      };
    }
  };

  // Weekdays (working days) in the selected month
  const getWeekdaysInMonth = (y: number, m: number) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let weekdays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(y, m, d).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        weekdays++;
      }
    }
    return weekdays;
  };

  // Generate monthly logs list
  const getMonthlyRecords = (): AttendanceRecord[] => {
    const monthlyRecords: AttendanceRecord[] = [];
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    const todayDate = new Date();

    for (let d = 1; d <= daysInMonthCount; d++) {
      const dateObj = new Date(year, month, d);
      const dayOfWeek = dateObj.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Skip future dates
      if (
        year > todayDate.getFullYear() ||
        (year === todayDate.getFullYear() && month > todayDate.getMonth()) ||
        (year === todayDate.getFullYear() && month === todayDate.getMonth() && d > todayDate.getDate())
      ) {
        continue;
      }

      monthlyRecords.push(getRecordForDate(dateObj));
    }
    return monthlyRecords.reverse();
  };

  const monthlyRecordsList = getMonthlyRecords();
  const presentCount = monthlyRecordsList.filter((r) => r.status === 'present' || r.status === 'half-day').length;
  const leavesCount = monthlyRecordsList.filter((r) => r.status === 'leave').length;
  const totalWorkingDays = getWeekdaysInMonth(year, month);
  const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

  // Generate weekly logs list (Monday to Friday range)
  const getWeeklyRecords = (): AttendanceRecord[] => {
    const currentDay = selectedDate.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + distanceToMonday);

    const weeklyRecords: AttendanceRecord[] = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const dayObj = new Date(monday);
      dayObj.setDate(monday.getDate() + i);
      weeklyRecords.push(getRecordForDate(dayObj));
    }
    return weeklyRecords;
  };

  const weeklyRecordsList = getWeeklyRecords();

  // Week range label (e.g. "Aug 17, 2026 - Aug 21, 2026")
  const getWeekRangeLabel = (): string => {
    const currentDay = selectedDate.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + distanceToMonday);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${monday.toLocaleDateString('en-US', opt)}, ${monday.getFullYear()} - ${friday.toLocaleDateString('en-US', opt)}, ${friday.getFullYear()}`;
  };

  // Navigation handlers
  const handlePrev = () => {
    setSelectedDate((prev) => {
      const nextD = new Date(prev);
      if (viewMode === 'daily') {
        nextD.setDate(prev.getDate() - 1);
      } else if (viewMode === 'weekly') {
        nextD.setDate(prev.getDate() - 7);
      } else {
        nextD.setMonth(prev.getMonth() - 1);
      }
      return nextD;
    });
  };

  const handleNext = () => {
    setSelectedDate((prev) => {
      const nextD = new Date(prev);
      if (viewMode === 'daily') {
        nextD.setDate(prev.getDate() + 1);
      } else if (viewMode === 'weekly') {
        nextD.setDate(prev.getDate() + 7);
      } else {
        nextD.setMonth(prev.getMonth() + 1);
      }
      return nextD;
    });
  };

  const handleSelectMonth = (idx: number) => {
    setSelectedDate((prev) => {
      const nextD = new Date(prev);
      nextD.setMonth(idx);
      return nextD;
    });
    setIsDropdownOpen(false);
  };

  // Dynamic status styling mapping
  const statusConfig = {
    present: { label: 'Present', style: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    absent: { label: 'Absent', style: 'text-red-700 bg-red-50 border-red-100' },
    'half-day': { label: 'Half-day', style: 'text-primary bg-primary/10 border-primary/20' },
    leave: { label: 'Leave', style: 'text-amber-700 bg-amber-50 border-amber-100' }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Area & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">
            Review and track your check-in history and shift logs
          </p>
        </div>

        {/* Tab view switcher */}
        <div className="flex bg-lavender/50 p-1 rounded-2xl border border-primary/5 self-start md:self-auto select-none">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' }
          ].map((tab) => {
            const active = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                  active
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------- MONTHLY VIEW PANEL -------------------- */}
      {viewMode === 'monthly' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-4 bg-white rounded-3xl p-4 shadow-soft border border-primary/5">
            
            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
              >
                &gt;
              </button>
            </div>

            {/* Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 px-4 flex items-center gap-2 border border-primary/10 rounded-xl text-sm font-bold text-gray-700 hover:border-primary/30 hover:bg-lavender/30 transition-all focus:outline-none cursor-pointer select-none"
              >
                <Calendar size={16} className="text-primary" />
                {MONTHS[month]} {year}
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-primary/10 rounded-2xl shadow-soft-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="max-h-60 overflow-y-auto no-scrollbar">
                    {MONTHS.map((mName, idx) => (
                      <button
                        key={mName}
                        onClick={() => handleSelectMonth(idx)}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors ${
                          idx === month
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-primary-light/5'
                        }`}
                      >
                        {mName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary counters */}
            <div className="flex-1 flex flex-wrap gap-4 items-center sm:justify-end">
              <div className="flex items-center gap-3 px-4 py-2 bg-lavender/30 border border-primary/5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={15} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Days Present</p>
                  <p className="text-xs font-black text-gray-800">{presentCount} Days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-lavender/30 border border-primary/5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar size={15} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Leaves Count</p>
                  <p className="text-xs font-black text-gray-800">{leavesCount} Days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-lavender/30 border border-primary/5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles size={15} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Working Days</p>
                  <p className="text-xs font-black text-gray-800">{totalWorkingDays} Days</p>
                </div>
              </div>
            </div>

          </div>

          {/* Period Title */}
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              {isCurrentMonth ? `${new Date().getDate()}, ${MONTHS[month]} ${year}` : `1, ${MONTHS[month]} ${year}`}
            </h3>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
            {monthlyRecordsList.length === 0 ? (
              <div className="p-16 text-center select-none flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-sm font-extrabold text-gray-700">No attendance records for this month.</h4>
                <p className="text-xs text-gray-400 font-semibold mt-1">Check back later or select a different period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50 select-none">
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Check In</th>
                      <th className="py-3.5 px-6">Check Out</th>
                      <th className="py-3.5 px-6">Work Hours</th>
                      <th className="py-3.5 px-6">Extra Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                    {monthlyRecordsList.map((rec) => {
                      const config = statusConfig[rec.status];
                      const isLeave = rec.status === 'leave';
                      const isAbsent = rec.status === 'absent';
                      
                      return (
                        <tr key={rec.date} className="hover:bg-lavender/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-gray-900">{rec.date}</td>
                          <td className="py-4 px-6">
                            {isLeave || isAbsent ? (
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] tracking-tight border ${config.style}`}>
                                {config.label}
                              </span>
                            ) : (
                              <span className="font-mono text-gray-800">{rec.checkIn}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-mono text-gray-800">
                            {isLeave || isAbsent ? '—' : rec.checkOut}
                          </td>
                          <td className={`py-4 px-6 font-mono ${rec.status === 'half-day' ? 'text-amber-600' : 'text-gray-800'}`}>
                            {rec.workHours}
                          </td>
                          <td className={`py-4 px-6 font-mono ${parseInt(rec.extraHours, 10) > 0 ? 'text-primary' : 'text-gray-400'}`}>
                            {rec.extraHours}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* -------------------- WEEKLY VIEW PANEL -------------------- */}
      {viewMode === 'weekly' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls navigation row */}
          <div className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-soft border border-primary/5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
              >
                &gt;
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Calendar size={16} className="text-primary" />
              <span>{getWeekRangeLabel()}</span>
            </div>
          </div>

          {/* Table display */}
          <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50 select-none">
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Check In</th>
                    <th className="py-3.5 px-6">Check Out</th>
                    <th className="py-3.5 px-6">Work Hours</th>
                    <th className="py-3.5 px-6">Extra Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                  {weeklyRecordsList.map((rec) => {
                    const config = statusConfig[rec.status];
                    const isLeave = rec.status === 'leave';
                    const isAbsent = rec.status === 'absent';

                    return (
                      <tr key={rec.date} className="hover:bg-lavender/10 transition-colors">
                        <td className="py-4 px-6 font-mono text-gray-900">{rec.date}</td>
                        <td className="py-4 px-6">
                          {isLeave || isAbsent ? (
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] tracking-tight border ${config.style}`}>
                              {config.label}
                            </span>
                          ) : (
                            <span className="font-mono text-gray-800">{rec.checkIn}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-mono text-gray-800">
                          {isLeave || isAbsent ? '—' : rec.checkOut}
                        </td>
                        <td className={`py-4 px-6 font-mono ${rec.status === 'half-day' ? 'text-amber-600' : 'text-gray-800'}`}>
                          {rec.workHours}
                        </td>
                        <td className={`py-4 px-6 font-mono ${parseInt(rec.extraHours, 10) > 0 ? 'text-primary' : 'text-gray-400'}`}>
                          {rec.extraHours}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* -------------------- DAILY VIEW PANEL -------------------- */}
      {viewMode === 'daily' && (() => {
        const record = getRecordForDate(selectedDate);
        const config = statusConfig[record.status];
        const isLeave = record.status === 'leave';
        const isAbsent = record.status === 'absent';
        const isFuture = new Date(selectedDate) > new Date();

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Controls navigation row */}
            <div className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-soft border border-primary/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center border border-primary/10 rounded-xl text-gray-500 hover:text-primary hover:bg-lavender/50 transition-all font-extrabold focus:outline-none cursor-pointer"
                >
                  &gt;
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Calendar size={16} className="text-primary" />
                <span>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Daily Detail Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 max-w-xl">
              
              {/* Card Header Status */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Attendance Summary</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Date: {record.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-tight border ${config.style}`}>
                  {config.label}
                </span>
              </div>

              {/* Card Fields Grid */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                
                {/* Check In */}
                <div className="p-4 bg-lavender/30 border border-primary/5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Play size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Check In</p>
                    <p className="text-sm font-black text-gray-800 font-mono">
                      {isLeave ? 'Leave' : isAbsent ? '—' : record.checkIn}
                    </p>
                  </div>
                </div>

                {/* Check Out */}
                <div className="p-4 bg-lavender/30 border border-primary/5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Pause size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Check Out</p>
                    <p className="text-sm font-black text-gray-800 font-mono">
                      {isLeave || isAbsent ? '—' : record.checkOut}
                    </p>
                  </div>
                </div>

                {/* Work Hours */}
                <div className="p-4 bg-lavender/30 border border-primary/5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Work Hours</p>
                    <p className="text-sm font-black text-gray-800 font-mono">
                      {isFuture ? '—' : record.workHours}
                    </p>
                  </div>
                </div>

                {/* Extra Hours */}
                <div className="p-4 bg-lavender/30 border border-primary/5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Extra Hours</p>
                    <p className="text-sm font-black text-gray-800 font-mono">
                      {isFuture ? '—' : record.extraHours}
                    </p>
                  </div>
                </div>

              </div>

              {/* Status Explanation Box */}
              <div className="mt-6 p-4 rounded-2xl bg-lavender/20 border border-primary/5 text-xs text-gray-600 leading-relaxed font-semibold">
                {isFuture ? (
                  <p>This date is in the future. Shift logging is not active yet.</p>
                ) : isLeave ? (
                  <p>You were on approved leave on this day. Leave hours are excluded from payroll deduction calculations.</p>
                ) : isAbsent ? (
                  <p>No check-in record logged for this business day. If you were present, contact your HR Admin.</p>
                ) : record.status === 'half-day' ? (
                  <p>Half-day logged (4 working hours). Extra hours calculations are disabled for half-day shifts.</p>
                ) : (
                  <p>Attendance logged successfully. Shift durations exceeded standard 8 working hours, adding to active overtime logs.</p>
                )}
              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
