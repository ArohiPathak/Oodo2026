'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  User, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Loader2,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { EmployeeSearch } from '@/components/employees/EmployeeSearch';

// 1. Formatting helpers
const formatLeaveType = (type: string) => {
  if (!type) return '—';
  const config: Record<string, string> = {
    paid: 'Paid Time Off',
    sick: 'Sick Leave',
    unpaid: 'Unpaid Leave',
  };
  return config[type.toLowerCase()] || type;
};

const formatRange = (start: string, end: string) => {
  try {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${s.toLocaleDateString('en-US', options)} – ${e.toLocaleDateString('en-US', options)}`;
  } catch (err) {
    return `${start} – ${end}`;
  }
};

const calculateDuration = (start: string, end: string) => {
  try {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  } catch (err) {
    return '—';
  }
};

const formatRequestedDate = (isoString: string) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return '—';
  }
};

// 2. Custom status badge matching Dayflow style
const RequestStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; dot: string; label: string }> = {
    pending: { bg: 'bg-amber-50 border-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
    approved: { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
    rejected: { bg: 'bg-rose-50 border-rose-100 text-rose-700', dot: 'bg-rose-500', label: 'Rejected' },
  };
  
  const val = config[status.toLowerCase()] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${val.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${val.dot}`} />
      {val.label}
    </span>
  );
};

export default function TimeOffPage() {
  const supabase = createClient();
  const router = useRouter();

  // Authentication and role authorization states
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Data states for Admin
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Detail Modal review states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Authorization guard check on mount
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

        if (profile.role?.toLowerCase() === 'admin') {
          setIsAdmin(true);
          setAdminProfile(profile);
          setAuthLoading(false);
        } else {
          setIsAdmin(false);
          router.push('/employee/time-off');
        }
      } catch (err) {
        console.error('Authorization routing error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, supabase]);

  // 2. Fetch live leave requests once authorized as admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchRequests = async () => {
      setDataLoading(true);
      setErrorMsg('');
      try {
        // Fetch all leave requests joining requester profile info
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*, profiles!employee_id(*)')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setLeaveRequests(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setErrorMsg('Unable to load leave requests.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchRequests();
  }, [isAdmin, supabase]);

  // 3. Approval and Rejection handles
  const handleApprove = async () => {
    if (!selectedRequest || isUpdating) return;

    setIsUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          admin_comment: adminComment.trim() || null,
          reviewed_by: session.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Update local state immediately
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: 'approved', 
              admin_comment: adminComment.trim() || null,
              reviewed_by: session.user.id,
              reviewed_at: new Date().toISOString()
            } 
          : req
      ));

      setIsModalOpen(false);
    } catch (err) {
      alert("Unable to update leave request. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || isUpdating) return;

    setIsUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          admin_comment: adminComment.trim() || null,
          reviewed_by: session.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Update local state immediately
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: 'rejected', 
              admin_comment: adminComment.trim() || null,
              reviewed_by: session.user.id,
              reviewed_at: new Date().toISOString()
            } 
          : req
      ));

      setIsModalOpen(false);
    } catch (err) {
      alert("Unable to update leave request. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenReviewModal = (req: any) => {
    setSelectedRequest(req);
    setAdminComment(req.admin_comment || '');
    setIsModalOpen(true);
  };

  // 4. Client-side search and filters
  const filteredRequests = leaveRequests.filter(req => {
    const profile = req.profiles;
    const name = profile?.full_name || '';
    const empId = profile?.employee_id || '';
    const designation = profile?.designation || '';

    const matchesQuery = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || req.leave_type?.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'all' || req.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesQuery && matchesType && matchesStatus;
  });

  // 5. Fallback Original Employee-side placeholders
  const handleRequestTimeOff = () => {
    alert('Request Time Off dialog placeholder. This functionality will be added in a future release.');
  };



  const balances = [
    { type: 'Paid Time Off', remaining: 12, total: 18, color: 'text-primary bg-primary/5 border-primary/10' },
    { type: 'Sick Leave', remaining: 6, total: 8, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { type: 'Wellness Days', remaining: 2, total: 2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  const requests = [
    { type: 'Sick Leave', date: 'Jul 14, 2026', duration: '1 day', status: 'Approved', desc: 'Medical appointment' },
    { type: 'Paid Time Off', date: 'Jun 12 - Jun 14, 2026', duration: '3 days', status: 'Approved', desc: 'Family trip' },
    { type: 'Paid Time Off', date: 'Apr 05, 2026', duration: '0.5 day', status: 'Approved', desc: 'Personal work' },
  ];

  // Render check auth screen
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-gray-500 tracking-wide animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  // A. RENDERING FOR EMPLOYEE
  if (!isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Time Off</h1>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your leave balance and check request status</p>
          </div>

          <Button
            variant="primary"
            onClick={handleRequestTimeOff}
            className="self-start sm:self-auto flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
          >
            <Plus size={16} />
            Request Time Off
          </Button>
        </div>

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {balances.map((bal, idx) => (
            <div key={idx} className={`bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex flex-col justify-between`}>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{bal.type}</p>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-black text-gray-900">{bal.remaining}</span>
                  <span className="text-sm text-gray-400 font-semibold">/ {bal.total} days</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Used: {bal.total - bal.remaining} days</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${bal.color}`}>
                  Active Balance
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900">Recent Requests</h3>
            <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">2026 Calendar Year</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Dates Requested</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Reason / Note</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {requests.map((req, idx) => (
                  <tr key={idx} className="hover:bg-lavender/10 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-bold">{req.type}</td>
                    <td className="py-4 px-6 text-gray-500">{req.date}</td>
                    <td className="py-4 px-6 text-gray-600">{req.duration}</td>
                    <td className="py-4 px-6 text-gray-400 font-normal truncate max-w-[150px]">{req.desc}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                        <CheckCircle size={12} />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // B. RENDERING FOR ADMIN
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Time Off Requests</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Admin leave console to review, approve, and reject team leave requests</p>
      </div>

      {/* Filter and search toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          <EmployeeSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Dropdowns */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Type</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3.5 py-2 bg-lavender/35 border border-primary/5 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="paid">Paid Time Off</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2 bg-lavender/35 border border-primary/5 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Content Results */}
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
      ) : leaveRequests.length === 0 ? (
        /* Correct Empty State */
        <div className="bg-white rounded-3xl border border-primary/5 shadow-soft p-12 text-center max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-lavender/40 text-primary flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
            <CalendarDays size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              No Leave Requests Found
            </h3>
            <p className="text-xs font-semibold text-gray-500">
              There are currently no leave requests in the database.
            </p>
          </div>
        </div>
      ) : (
        /* Requests Table List */
        <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lavender/30 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-50">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Leave Type</th>
                  <th className="py-4 px-6">Date Range</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Requested On</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {filteredRequests.map((req) => {
                  const profile = req.profiles;
                  return (
                    <tr key={req.id} className="hover:bg-lavender/10 transition-colors">
                      {/* Requester details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={profile?.full_name || 'Employee'} src={profile?.profile_picture} size="sm" />
                          <div>
                            <div className="font-extrabold text-gray-900">{profile?.full_name || 'New Employee'}</div>
                            <div className="text-[10px] font-bold text-gray-400 mt-0.5">{profile?.employee_id || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{formatLeaveType(req.leave_type)}</span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-6 text-gray-500">
                        {formatRange(req.start_date, req.end_date)}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-6 text-gray-600">
                        {calculateDuration(req.start_date, req.end_date)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <RequestStatusBadge status={req.status} />
                      </td>

                      {/* Creation Date */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                        {formatRequestedDate(req.created_at)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant={req.status?.toLowerCase() === 'pending' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleOpenReviewModal(req)}
                          className="font-bold tracking-wide rounded-xl"
                        >
                          {req.status?.toLowerCase() === 'pending' ? 'Review' : 'View Logs'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs font-semibold text-gray-400 italic">
                      No matching leave request records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Modal Review Detail Dialog Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRequest?.status?.toLowerCase() === 'pending' ? 'Review Leave Request' : 'Leave Request Log'}
      >
        {selectedRequest && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Requester Profile Badge */}
            <div className="flex items-center gap-3 bg-lavender/20 p-4.5 rounded-2xl border border-primary/5">
              <Avatar name={selectedRequest.profiles?.full_name || 'Employee'} src={selectedRequest.profiles?.profile_picture} size="md" />
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">{selectedRequest.profiles?.full_name || 'New Employee'}</h4>
                <p className="text-xs font-bold text-gray-400 mt-0.5">
                  {selectedRequest.profiles?.designation || 'Staff'} &bull; {selectedRequest.profiles?.employee_id || 'N/A'}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lavender/10 p-3.5 rounded-2xl border border-primary/5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leave Type</span>
                <p className="text-sm font-extrabold text-gray-900 mt-1">{formatLeaveType(selectedRequest.leave_type)}</p>
              </div>
              <div className="bg-lavender/10 p-3.5 rounded-2xl border border-primary/5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                <p className="text-sm font-extrabold text-gray-900 mt-1">{calculateDuration(selectedRequest.start_date, selectedRequest.end_date)}</p>
              </div>
            </div>

            {/* Range */}
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Date Range</span>
              <p className="text-sm font-extrabold text-gray-800">{formatRange(selectedRequest.start_date, selectedRequest.end_date)}</p>
            </div>

            {/* Employee Remarks */}
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Employee Remarks</span>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600 font-medium leading-relaxed italic">
                &ldquo;{selectedRequest.reason || '(No reason specified)'}&rdquo;
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Admin Action Comments */}
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Admin Comments / Notes</span>
              {selectedRequest.status?.toLowerCase() === 'pending' ? (
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Provide an optional remark for approval or reason for rejection..."
                  className="w-full px-4 py-3 bg-lavender/30 border border-primary/5 rounded-2xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none h-24"
                />
              ) : (
                <div className="bg-lavender/5 border border-primary/5 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-gray-700">
                  {selectedRequest.admin_comment || <span className="text-gray-400 italic">No admin comments left.</span>}
                </div>
              )}
            </div>

            {/* Reviews metadata */}
            {selectedRequest.status?.toLowerCase() !== 'pending' && (
              <div className="bg-[#FFF4EC] border border-orange-100/50 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-[#9A624A] font-bold">
                <AlertCircle size={16} className="text-orange-500 shrink-0" />
                <span>
                  Reviewed on {new Date(selectedRequest.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {/* Approve / Reject buttons */}
            {selectedRequest.status?.toLowerCase() === 'pending' && (
              <div className="flex gap-3 pt-2">
                <Button
                  variant="danger"
                  disabled={isUpdating}
                  onClick={handleReject}
                  className="flex-1 py-2.5 font-bold tracking-wider shadow-sm"
                >
                  Reject Request
                </Button>
                <Button
                  variant="primary"
                  disabled={isUpdating}
                  onClick={handleApprove}
                  className="flex-1 py-2.5 font-bold tracking-wider shadow-sm"
                >
                  Approve Request
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
