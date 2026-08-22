'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, DollarSign, Wallet, ShieldAlert, BadgeInfo } from 'lucide-react';

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export const EmployeeSalaryInfo: React.FC = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [salaryStructure, setSalaryStructure] = useState<any>(null);
  const [payroll, setPayroll] = useState<any>(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setErrorMsg('Not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch salary_structures
        const { data: structData, error: structError } = await supabase
          .from('salary_structures')
          .select('*')
          .eq('employee_id', user.id)
          .maybeSingle();

        if (structError) throw structError;

        // Fetch payroll summary
        const { data: payrollData, error: payrollError } = await supabase
          .from('payroll')
          .select('*')
          .eq('employee_id', user.id)
          .maybeSingle();

        if (payrollError) throw payrollError;

        setSalaryStructure(structData);
        setPayroll(payrollData);
      } catch (err: any) {
        console.error('Error loading salary data:', err);
        setErrorMsg('Unable to retrieve salary details at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-gray-400 animate-pulse">Loading salary information...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center gap-4 text-red-600 max-w-xl mx-auto mt-6 shadow-soft select-none animate-in fade-in">
        <ShieldAlert className="shrink-0 w-6 h-6" />
        <div>
          <h4 className="font-bold text-sm">Error Loading Salary Details</h4>
          <p className="text-xs opacity-90 font-medium mt-0.5">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!salaryStructure) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6 select-none animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-lavender/40 text-primary flex items-center justify-center mx-auto border border-primary/5 shadow-sm mb-4">
          <BadgeInfo size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-900">No Salary Configuration Found</h3>
        <p className="text-xs font-semibold text-gray-500 mt-2 max-w-sm mx-auto">
          Your active salary structure has not been defined yet. Please contact Human Resources to configure your wage ledger.
        </p>
      </div>
    );
  }

  const monthlyWage = salaryStructure.monthly_wage || 0;
  const yearlyWage = salaryStructure.yearly_wage || (monthlyWage * 12);
  const basicSalary = salaryStructure.basic_salary || 0;
  const hra = salaryStructure.hra || 0;
  const performanceBonus = salaryStructure.performance_bonus || 0;
  const lta = salaryStructure.leave_travel_allowance || 0;
  const standardAllowance = salaryStructure.standard_allowance || 0;
  const fixedAllowance = salaryStructure.fixed_allowance || 0;

  const employeePf = salaryStructure.employee_pf || 0;
  const professionalTax = salaryStructure.professional_tax || 0;

  const totalAllowances = hra + performanceBonus + lta + standardAllowance + fixedAllowance;
  const totalDeductions = employeePf + professionalTax;

  // Use authoritative payroll net salary if available, otherwise calculate it
  const netSalary = payroll ? payroll.net_salary : (basicSalary + totalAllowances - totalDeductions);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 mt-6">
      
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Monthly Wage Card */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex items-center gap-4 hover:shadow-soft-lg transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-lavender text-primary flex items-center justify-center shadow-sm">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Monthly Wage</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(monthlyWage)}</p>
          </div>
        </div>

        {/* Yearly Wage Card */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary/5 flex items-center gap-4 hover:shadow-soft-lg transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-lavender text-primary flex items-center justify-center shadow-sm">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Yearly Wage</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(yearlyWage)}</p>
          </div>
        </div>

        {/* Net Take Home Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-6 shadow-soft flex items-center gap-4 hover:shadow-soft-lg transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-sm">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/70 tracking-wider">Net Monthly Take-Home</p>
            <p className="text-2xl font-black text-white mt-1">{formatCurrency(netSalary)}</p>
          </div>
        </div>

      </div>

      {/* 2. Detailed Structure Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Earnings Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Monthly Earnings & Allowances
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">Basic Salary</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(basicSalary)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">House Rent Allowance (HRA)</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(hra)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">Performance Bonus Contribution</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(performanceBonus)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">Leave Travel Allowance (LTA)</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(lta)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">Standard Allowance</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(standardAllowance)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs font-semibold text-gray-500">Fixed Allowance</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(fixedAllowance)}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-emerald-50/30 px-4 py-3 rounded-2xl border border-emerald-100/30">
              <span className="text-xs font-bold text-emerald-800">Total Monthly Gross</span>
              <span className="text-sm font-black text-emerald-800">{formatCurrency(basicSalary + totalAllowances)}</span>
            </div>
          </div>
        </div>

        {/* Deductions Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Monthly Deductions & Contributions
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-semibold text-gray-500">Provident Fund (Employee PF Contribution)</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(employeePf)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs font-semibold text-gray-500">Professional Tax (PT)</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(professionalTax)}</span>
            </div>

            <div className="mt-14 pt-4 border-t border-gray-100 flex justify-between items-center bg-rose-50/30 px-4 py-3 rounded-2xl border border-rose-100/30">
              <span className="text-xs font-bold text-rose-800">Total Deductions</span>
              <span className="text-sm font-black text-rose-800">{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
