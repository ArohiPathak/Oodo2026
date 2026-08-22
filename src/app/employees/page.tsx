'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { EmployeeSearch } from '@/components/employees/EmployeeSearch';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { AddEmployeeModal } from '@/components/employees/AddEmployeeModal';
import { employeeService } from '@/services/employeeService';
import { Employee } from '@/data/mockEmployees';

export default function EmployeesPage() {
  const router = useRouter();
  const {
    isCheckedIn,
    checkInTime,
    currentUser,
    role,
    isLoadingAuth,
  } = useApp();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Server/RLS-backed checks & redirects as UX
  useEffect(() => {
    if (!isLoadingAuth && role && role !== 'admin') {
      router.replace('/employee/dashboard');
    }
  }, [role, isLoadingAuth, router]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      loadEmployees();
    }
  }, [role]);

  const handleAddEmployee = async (newEmp: Omit<Employee, 'status' | 'joiningDate'>) => {
    try {
      await employeeService.createEmployee(newEmp);
      await loadEmployees();
    } catch (err: any) {
      alert(`Failed to add employee: ${err.message}`);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (role && role !== 'admin') {
    return null;
  }

  // Dynamic next employee ID computation
  const numericIds = employees
    .map((e) => parseInt(e.id.replace('EMP', ''), 10))
    .filter((n) => !isNaN(n));
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 9;
  const nextIdSuggestion = `EMP${String(maxId + 1).padStart(3, '0')}`;

  // Filter logic across 4 fields
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );
  });

  if (role && role !== 'admin') {
    return null; // Let the redirect happen
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employees</h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage and view your team directory</p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
        >
          <Plus size={16} />
          New Employee
        </Button>
      </div>

      {/* Welcome & Greeting Card */}
      <div className="bg-[#FFF4EC] rounded-3xl p-6 shadow-soft border border-orange-100/50 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-soft-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE4D0] text-[#E07A5F] flex items-center justify-center text-xl font-bold select-none">
            👋
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              HI, {currentUser?.name || 'Admin'}!
            </h2>
            <p className="text-sm font-semibold text-[#B26B50] mt-0.5">
              Ready to start your day?
            </p>
          </div>
        </div>

        {/* Helper status text */}
        <div className="text-xs font-bold text-[#9A624A] bg-[#FFFBF7] px-4 py-2 rounded-2xl border border-orange-200/30 shadow-sm flex items-center gap-2">
          {isCheckedIn ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Checked in since {checkInTime}</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Offline •</span>
            </>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <EmployeeSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Helper counts tag */}
        <p className="text-xs text-gray-500 font-semibold self-end md:self-auto bg-white px-3 py-1.5 rounded-xl border border-primary/5 shadow-soft">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
      </div>

      {/* Responsive Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <EmployeeGrid employees={filteredEmployees} />
      )}

      {/* Reusable Form Dialog Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        nextIdSuggestion={nextIdSuggestion}
      />
    </div>
  );
}
