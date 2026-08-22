'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Users,
  ShieldAlert,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatusDot, AttendanceStatus } from '@/components/ui/StatusDot';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { EmployeeSearch } from '@/components/employees/EmployeeSearch';

// Date ranges calculation helper (avoiding timezone offset shifts)
const getWeekRange = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayVal = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${dayVal}`);
  }
  
  return {
    start: days[0],
    end: days[6],
    days
  };
};

const formatReadableDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

const formatWeekRange = (dateStr: string) => {
  const { start, end } = getWeekRange(dateStr);
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${endYear}`;
  } else {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${endYear}`;
  }
};

const formatTime = (isoString: string | null) => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return '—';
  }
};

export default function AttendancePage() {
  const supabase = createClient();
  const router = useRouter();

  // Authentication and role authorization states
  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // View state settings
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const local = new Date();
    const year = local.getFullYear();
    const month = String(local.getMonth() + 1).padStart(2, '0');
    const day = String(local.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Database records
  const [profiles, setProfiles] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Authorization guard check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          router.push('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          router.push('/login');
          return;
        }

        if (profile.role?.toLowerCase() !== 'admin') {
          router.replace('/employee/attendance');
          return;
        }

        setAdminProfile(profile);
        setAuthorized(true);
        setAuthLoading(false);
      } catch (err) {
        console.error('Authorization routing error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, supabase]);

  // 2. Fetch live data from Supabase once authorized
  useEffect(() => {
    if (!authorized) return;

    const fetchAttendanceData = async () => {
      setDataLoading(true);
      setErrorMsg('');
      try {
        // Fetch all employee profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name', { ascending: true });

        if (profilesError) {
          throw new Error('Unable to load employee profiles.');
        }

        setProfiles(profilesData || []);

        // Fetch attendance records based on current date and viewMode
        if (viewMode === 'daily') {
          const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .eq('attendance_date', selectedDate);

          if (attendanceError) {
            throw new Error('Unable to load attendance records.');
          }

          setAttendanceRecords(attendanceData || []);
        } else {
          // Weekly view
          const { start, end } = getWeekRange(selectedDate);
          const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .gte('attendance_date', start)
            .lte('attendance_date', end);

          if (attendanceError) {
            throw new Error('Unable to load attendance records.');
          }

          setAttendanceRecords(attendanceData || []);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Unable to load attendance records.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchAttendanceData();
  }, [authorized, viewMode, selectedDate, supabase]);

  // 3. Handlers for navigation controls
  const handlePrevDate = () => {
    if (viewMode === 'daily') {
      const current = new Date(selectedDate + 'T00:00:00');
      current.setDate(current.getDate() - 1);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    } else {
      const current = new Date(selectedDate + 'T00:00:00');
      current.setDate(current.getDate() - 7);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    }
  };

  const handleNextDate = () => {
    if (viewMode === 'daily') {
      const current = new Date(selectedDate + 'T00:00:00');
      current.setDate(current.getDate() + 1);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    } else {
      const current = new Date(selectedDate + 'T00:00:00');
      current.setDate(current.getDate() + 7);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    }
  };

  // 4. Client search filters
  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (profile.full_name || '').toLowerCase().includes(query) ||
      (profile.employee_id || '').toLowerCase().includes(query) ||
      (profile.designation || '').toLowerCase().includes(query)
    );
  });

  // Calculate compact grid cells for Weekly view
  const { days: weekDays } = getWeekRange(selectedDate);

  // Helper to render letter indicators in Weekly view
  const renderWeeklyIndicator = (status: string | null) => {
    if (!status) return <span className="text-gray-300 font-normal">—</span>;

    const normalized = status.replace('-', '_');
    const config: Record<string, { bg: string; text: string; label: string }> = {
      present: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100/60', text: 'P', label: 'Present' },
      absent: { bg: 'bg-amber-50 text-amber-600 border-amber-100/60', text: 'A', label: 'Absent' },
      half_day: { bg: 'bg-purple-50 text-purple-600 border-purple-100/60', text: 'H', label: 'Half Day' },
      leave: { bg: 'bg-blue-50 text-blue-600 border-blue-100/60', text: 'L', label: 'On Leave' },
    };

    const val = config[normalized] || { bg: 'bg-amber-50 text-amber-600 border-amber-100/60', text: 'A', label: 'Absent' };

    return (
      <span 
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black border select-none transition-all hover:scale-105 cursor-help ${val.bg}`}
        title={val.label}
      >
        {val.text}
      </span>
    );
  };

  // 5. Auth validation state screen
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-gray-500 tracking-wide animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  // Unauthorized display (authenticated but role is not admin)
  if (!authorized) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-red-100 shadow-soft-lg p-8 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Access Denied</h2>
          <p className="text-sm font-semibold text-gray-500 leading-relaxed">
            Your current account credentials do not authorize access to all-employee attendance records.
          </p>
        </div>

        <hr className="border-gray-100" />

        <Button
          variant="primary"
          onClick={() => router.push('/employee/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-bold tracking-wider"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  // 6. Authorized Admin view UI
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Attendance Overview
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">
            Admin console for tracking daily and weekly employee check-in logs
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex bg-white/60 p-1 rounded-2xl border border-primary/5 shadow-soft shrink-0">
          <button
            onClick={() => {
              setViewMode('daily');
              setSearchQuery('');
            }}
            className={`px-4.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
              viewMode === 'daily'
                ? 'bg-primary text-white shadow-soft'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => {
              setViewMode('weekly');
              setSearchQuery('');
            }}
            className={`px-4.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
              viewMode === 'weekly'
                ? 'bg-primary text-white shadow-soft'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Navigation Date Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevDate}
            className="w-10 h-10 p-0 rounded-2xl"
          >
            <ChevronLeft size={18} />
          </Button>

          <span className="text-sm sm:text-base font-extrabold text-gray-900 min-w-[170px] text-center select-none">
            {viewMode === 'daily' ? formatReadableDate(selectedDate) : formatWeekRange(selectedDate)}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDate}
            className="w-10 h-10 p-0 rounded-2xl"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Simple search box filter */}
        <div className="w-full sm:w-auto shrink-0 flex justify-end">
          <EmployeeSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </div>

      {/* Main Content Area */}
      {errorMsg ? (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center gap-4 text-red-600 max-w-xl mx-auto shadow-soft animate-in zoom-in-95">
          <AlertCircle className="shrink-0 w-6 h-6" />
          <div>
            <h4 className="font-bold text-sm">Error</h4>
            <p className="text-xs opacity-90 font-medium mt-0.5">{errorMsg}</p>
          </div>
        </div>
      ) : dataLoading ? (
        /* Skeleton Table loading UI */
        <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden animate-pulse">
          <div className="h-14 bg-gray-50 border-b border-gray-50 flex items-center px-6">
            <div className="w-1/4 h-4 bg-gray-200 rounded" />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4"><div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" /><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div>
            <hr className="border-gray-50" />
            <div className="flex gap-4"><div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" /><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div>
          </div>
        </div>
      ) : attendanceRecords.length === 0 ? (
        /* Dynamic empty state depending on current dates */
        <div className="bg-white rounded-3xl border border-primary/5 shadow-soft p-12 text-center max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-lavender/40 text-primary flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
            <Calendar size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              No Attendance Logs Found
            </h3>
            <p className="text-xs font-semibold text-gray-500">
              {viewMode === 'daily' 
                ? 'No attendance records have been logged for this date.' 
                : 'No attendance records have been logged for this week.'
              }
            </p>
          </div>
        </div>
      ) : viewMode === 'daily' ? (
        /* DAILY VIEW TABLE */
        <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Check In</th>
                  <th className="py-4 px-6">Check Out</th>
                  <th className="py-4 px-6">Work Hours</th>
                  <th className="py-4 px-6">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {filteredProfiles.map((profile) => {
                  const record = attendanceRecords.find(r => r.employee_id === profile.id);
                  const statusVal: AttendanceStatus = (record ? record.status : 'absent').replace('-', '_') as AttendanceStatus;
                  
                  return (
                    <tr key={profile.id} className="hover:bg-lavender/10 transition-colors">
                      {/* Name & ID */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Avatar name={profile.full_name || 'Employee'} src={profile.profile_picture} size="sm" />
                        <div>
                          <div className="font-extrabold text-gray-900">{profile.full_name || 'New Employee'}</div>
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5">{profile.employee_id || 'N/A'}</div>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        <StatusDot status={statusVal} showLabel={true} />
                      </td>

                      {/* Timings & Hours */}
                      <td className="py-4 px-6 font-mono text-xs text-gray-600">
                        {record ? formatTime(record.check_in) : '—'}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-600">
                        {record ? formatTime(record.check_out) : '—'}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {record && record.work_hours ? `${record.work_hours} hrs` : '—'}
                      </td>

                      {/* Remarks */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium max-w-[200px] truncate" title={record?.remarks || ''}>
                        {record?.remarks || '—'}
                      </td>
                    </tr>
                  );
                })}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs font-semibold text-gray-400 italic">
                      No matching employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* WEEKLY VIEW GRID */
        <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                  <th className="py-4 px-6">Employee</th>
                  {weekDays.map((dayStr) => {
                    const d = new Date(dayStr + 'T00:00:00');
                    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateVal = d.getDate();
                    return (
                      <th key={dayStr} className="py-4 px-6 text-center">
                        <div>{dayLabel}</div>
                        <div className="text-[9px] text-gray-400 font-extrabold mt-0.5">{dateVal}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700 animate-in fade-in duration-200">
                {filteredProfiles.map((profile) => {
                  return (
                    <tr key={profile.id} className="hover:bg-lavender/10 transition-colors">
                      {/* Name & ID */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Avatar name={profile.full_name || 'Employee'} src={profile.profile_picture} size="sm" />
                        <div>
                          <div className="font-extrabold text-gray-900">{profile.full_name || 'New Employee'}</div>
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5">{profile.employee_id || 'N/A'}</div>
                        </div>
                      </td>

                      {/* Day cells grid */}
                      {weekDays.map((dayStr) => {
                        const record = attendanceRecords.find(
                          r => r.employee_id === profile.id && r.attendance_date === dayStr
                        );
                        return (
                          <td key={dayStr} className="py-4 px-6 text-center align-middle">
                            {renderWeeklyIndicator(record ? record.status : null)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs font-semibold text-gray-400 italic">
                      No matching employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
