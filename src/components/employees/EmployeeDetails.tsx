import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Hash } from 'lucide-react';
import { Employee } from '../../data/mockEmployees';
import { Avatar } from '../ui/Avatar';
import { StatusDot } from '../ui/StatusDot';

interface EmployeeDetailsProps {
  employee: Employee;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/employees"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors py-1 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Employees
      </Link>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">
        {/* Card Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary-light/20 to-primary/10" />

        {/* Profile Info Summary */}
        <div className="px-6 md:px-8 pb-8 relative">
          {/* Avatar repositioned half-up */}
          <div className="absolute -top-12 left-6 md:left-8">
            <Avatar
              name={employee.name}
              size="xl"
              className="border-4 border-white shadow-md ring-4 ring-primary-light/5"
            />
          </div>

          {/* Action Row alignment */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-sm font-semibold text-gray-500 mt-0.5">{employee.designation}</p>
            </div>
            
            <div className="self-start sm:self-auto">
              <StatusDot status={employee.status} showLabel={true} />
            </div>
          </div>

          <hr className="my-6 border-gray-50" />

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee ID */}
            <div className="flex items-center gap-3 p-4 bg-lavender/40 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                <Hash size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Employee ID</p>
                <p className="text-sm font-bold text-gray-800 font-mono">{employee.id}</p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center gap-3 p-4 bg-lavender/40 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Department</p>
                <p className="text-sm font-bold text-gray-800">{employee.department}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-lavender/40 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                <a
                  href={`mailto:${employee.email}`}
                  className="text-sm font-bold text-primary hover:underline block truncate max-w-[200px] sm:max-w-xs"
                >
                  {employee.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-4 bg-lavender/40 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                <a href={`tel:${employee.phone}`} className="text-sm font-bold text-gray-800 hover:underline">
                  {employee.phone}
                </a>
              </div>
            </div>

            {/* Joining Date */}
            <div className="flex items-center gap-3 p-4 bg-lavender/40 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Joining Date</p>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
