import React from 'react';
import { Employee } from '@/data/mockEmployees';

interface EmployeePrivateInfoProps {
  employee: Employee;
}

export const EmployeePrivateInfo: React.FC<EmployeePrivateInfoProps> = ({ employee }) => {
  const fields = [
    {
      label: 'Date of Birth',
      value: employee.dob ? new Date(employee.dob).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) : 'October 24, 1996',
    },
    {
      label: 'Nationality',
      value: employee.nationality || 'Indian',
    },
    {
      label: 'Gender',
      value: employee.gender || 'Male',
    },
    {
      label: 'Marital Status',
      value: employee.maritalStatus || 'Single',
    },
    {
      label: 'Personal Email',
      value: employee.personalEmail || 'aarav.sharma.personal@gmail.com',
    },
    {
      label: 'Date of Joining',
      value: employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) : 'January 15, 2024',
    },
    {
      label: 'Residential Address',
      value: employee.address || 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai - 400050',
      isFullWidth: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Private Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, idx) => (
          <div key={idx} className={field.isFullWidth ? 'md:col-span-2' : ''}>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {field.label}
            </p>
            <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
