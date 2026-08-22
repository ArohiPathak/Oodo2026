'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { EmployeeDetails } from '@/components/employees/EmployeeDetails';
import { employeeService } from '@/services/employeeService';
import { Employee } from '@/data/mockEmployees';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { role } = useApp();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin access redirect check
  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/employee/dashboard');
    }
  }, [role, router]);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const emp = await employeeService.fetchEmployeeById(id);
        setEmployee(emp);
      } catch (err) {
        console.error('Failed to load employee details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'admin') {
      loadDetails();
    }
  }, [id, role]);

  if (role && role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

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
