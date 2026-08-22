import React from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { Employee } from '../../data/mockEmployees';
import { Avatar } from '../ui/Avatar';
import { StatusDot } from '../ui/StatusDot';

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <Link
      href={`/employees/${employee.id}`}
      className="group block bg-white rounded-3xl p-6 relative border border-primary/5 hover:border-primary/15 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-250 ease-in-out cursor-pointer flex flex-col items-center text-center"
    >
      {/* Top Right Status Dot */}
      <div className="absolute top-5 right-5">
        <StatusDot status={employee.status} />
      </div>

      {/* Avatar */}
      <Avatar name={employee.name} size="lg" className="ring-4 ring-primary-light/5 group-hover:ring-primary-light/10 transition-all duration-250" />

      {/* Basic Profile Details */}
      <h3 className="text-base font-bold text-gray-900 mt-4 group-hover:text-primary transition-colors duration-200">
        {employee.name}
      </h3>
      <p className="text-xs font-medium text-gray-500 mt-1">
        {employee.designation}
      </p>

      {/* Department Badge */}
      <span className="inline-block text-xs font-semibold text-primary bg-primary/5 group-hover:bg-primary/10 px-3 py-1 rounded-full mt-4 transition-colors">
        {employee.department}
      </span>

      {/* Employee ID */}
      <span className="text-[10px] text-gray-400 font-mono mt-3 uppercase tracking-wider">
        {employee.id}
      </span>
    </Link>
  );
};
