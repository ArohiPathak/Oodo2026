import { LeaveRequest } from '@/types/leave';

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'REQ001',
    employeeId: 'EMP002',
    employeeName: 'Priya Patel',
    leaveType: 'Sick Leave',
    startDate: '2026-08-26',
    endDate: '2026-08-26',
    duration: '1 day',
    status: 'pending',
    reason: 'Dental checkup'
  },
  {
    id: 'REQ002',
    employeeId: 'EMP007',
    employeeName: 'Vivaan Verma',
    leaveType: 'Paid Time Off',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    duration: '3 days',
    status: 'pending',
    reason: 'Family trip'
  },
  {
    id: 'REQ003',
    employeeId: 'EMP005',
    employeeName: 'Kabir Malhotra',
    leaveType: 'Paid Time Off',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    duration: '5 days',
    status: 'pending',
    reason: 'Annual vacation'
  },
  {
    id: 'REQ004',
    employeeId: 'EMP002',
    employeeName: 'Priya Patel',
    leaveType: 'Sick Leave',
    startDate: '2026-07-14',
    endDate: '2026-07-14',
    duration: '1 day',
    status: 'approved',
    reason: 'Medical appointment'
  },
  {
    id: 'REQ005',
    employeeId: 'EMP003',
    employeeName: 'Rohan Deshmukh',
    leaveType: 'Paid Time Off',
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    duration: '3 days',
    status: 'approved',
    reason: 'Family trip'
  }
];
