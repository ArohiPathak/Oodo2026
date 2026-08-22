import React from 'react';
import { Mail, Phone, Briefcase, MapPin, Building, UserCheck, Camera } from 'lucide-react';
import { Employee } from '@/data/mockEmployees';
import { Avatar } from '../ui/Avatar';

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee }) => {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
      {/* Background Banner */}
      <div className="h-32 bg-gradient-to-r from-primary-light/20 to-primary/10 relative" />

      {/* Profile Detail Content */}
      <div className="px-6 md:px-8 pb-8 relative">
        
        {/* Avatar positioned half-up */}
        <div className="absolute -top-12 left-6 md:left-8 group">
          <div className="relative inline-block">
            <Avatar
              name={employee.name}
              src={employee.avatarUrl}
              size="xl"
              className="border-4 border-white shadow-md ring-4 ring-primary-light/5"
            />
            {/* Edit Icon Overlay */}
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-primary-dark transition-colors">
              <Camera size={14} />
            </div>
          </div>
        </div>

        {/* Name and Designation Row */}
        <div className="pt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{employee.name}</h1>
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-lg text-xs font-bold font-mono">
                {employee.id}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">{employee.designation}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-50" />

        {/* Contact & Company Details Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
              <p className="text-xs font-bold text-gray-800 truncate">{employee.email}</p>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Phone</p>
              <p className="text-xs font-bold text-gray-800">{employee.phone}</p>
            </div>
          </div>

          {/* Company */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <Building size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Company</p>
              <p className="text-xs font-bold text-gray-800">{employee.company || 'Dayflow Technologies'}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <Briefcase size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Department</p>
              <p className="text-xs font-bold text-gray-800">{employee.department}</p>
            </div>
          </div>

          {/* Manager */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <UserCheck size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Manager</p>
              <p className="text-xs font-bold text-gray-800">{employee.manager || 'Ananya Rao (HR Specialist)'}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 p-3 bg-lavender/30 rounded-2xl border border-primary/5">
            <div className="w-9 h-9 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location</p>
              <p className="text-xs font-bold text-gray-800">{employee.location || 'Mumbai, India'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
