import React from 'react';
import { Users } from 'lucide-react';
import { Employee } from '../../data/mockEmployees';
import { EmployeeCard } from './EmployeeCard';

interface EmployeeGridProps {
  employees: Employee[];
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees }) => {
  if (employees.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-primary/5 shadow-soft text-center animate-in fade-in duration-350">
        <div className="w-12 h-12 rounded-2xl bg-primary-light/10 text-primary flex items-center justify-center mb-4">
          <Users size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-900">No employees found</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          We couldn&apos;t find any employees matching your search parameters. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};
