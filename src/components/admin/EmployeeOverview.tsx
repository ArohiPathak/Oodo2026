import React from 'react';
import Link from 'next/link';
import { Employee } from '@/data/mockEmployees';
import { EmployeeCard } from '../employees/EmployeeCard';

interface EmployeeOverviewProps {
  employees: Employee[];
}

export const EmployeeOverview: React.FC<EmployeeOverviewProps> = ({ employees }) => {
  const displayedEmployees = employees.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Employees</h3>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">Directory snippet of active workforce</p>
        </div>
        <Link
          href="/employees"
          className="text-xs font-bold text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all duration-200"
        >
          View all employees
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEmployees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};
