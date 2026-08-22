export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}
