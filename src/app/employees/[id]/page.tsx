'use client';

import React, { use } from 'react';
import { useApp } from '@/context/AppContext';
import { EmployeeDetails } from '@/components/employees/EmployeeDetails';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: PageProps) {
  // Resolve params asynchronously in line with Next.js App Router rules
  const { id } = use(params);
  const { employees } = useApp();

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Employee Not Found</h2>
        <p className="text-sm text-gray-500">The employee with ID &quot;{id}&quot; does not exist in our directory.</p>
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Link>
      </div>
    );
  }

  return <EmployeeDetails employee={employee} />;
}
