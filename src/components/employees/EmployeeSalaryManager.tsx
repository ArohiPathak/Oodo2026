'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Employee } from '@/data/mockEmployees';
import { Loader2, ShieldCheck, ShieldAlert, BadgeInfo, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmployeeSalaryManagerProps {
  employee: Employee;
}

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export const EmployeeSalaryManager: React.FC<EmployeeSalaryManagerProps> = ({ employee }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Target employee UUID from profiles table
  const [employeeUuid, setEmployeeUuid] = useState<string | null>(null);

  // Form Fields State
  const [monthlyWage, setMonthlyWage] = useState(0);
  const [basicPercentage, setBasicPercentage] = useState(50);
  const [hraPercentage, setHraPercentage] = useState(50);
  const [performanceBonusPercentage, setPerformanceBonusPercentage] = useState(8.33);
  const [ltaPercentage, setLtaPercentage] = useState(8.33);
  const [standardAllowance, setStandardAllowance] = useState(4167);
  const [fixedAllowance, setFixedAllowance] = useState(0);
  const [employeePfPercentage, setEmployeePfPercentage] = useState(12);
  const [employerPfPercentage, setEmployerPfPercentage] = useState(12);
  const [professionalTax, setProfessionalTax] = useState(200);

  const fetchProfileAndSalary = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      let lookupEmail = employee.email;
      if (lookupEmail === 'aarav.sharma@dayflow.com') {
        lookupEmail = 'employee@gmail.com';
      } else if (lookupEmail === 'ananya.rao@dayflow.com') {
        lookupEmail = 'admin@gmail.com';
      }

      // Find UUID in profiles using email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', lookupEmail)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        setErrorMsg(`No database profile found for email ${employee.email}. Please ensure they are registered.`);
        setLoading(false);
        return;
      }

      setEmployeeUuid(profile.id);

      // Fetch existing salary structure
      const { data: struct, error: structError } = await supabase
        .from('salary_structures')
        .select('*')
        .eq('employee_id', profile.id)
        .maybeSingle();

      if (structError) throw structError;

      if (struct) {
        setMonthlyWage(struct.monthly_wage || 0);
        setBasicPercentage(struct.basic_percentage || 50);
        setHraPercentage(struct.hra_percentage || 50);
        setPerformanceBonusPercentage(struct.performance_bonus_percentage || 8.33);
        setLtaPercentage(struct.lta_percentage || 8.33);
        setStandardAllowance(struct.standard_allowance || 0);
        setFixedAllowance(struct.fixed_allowance || 0);
        setEmployeePfPercentage(struct.employee_pf_percentage || 12);
        setEmployerPfPercentage(struct.employer_pf_percentage || 12);
        setProfessionalTax(struct.professional_tax || 0);
      }
    } catch (err: any) {
      console.error('Error fetching admin salary structure:', err);
      setErrorMsg('Failed to load salary structure details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSalary();
  }, [employee, supabase]);

  // Live Calculations
  const yearlyWage = monthlyWage * 12;
  const basicSalary = Math.round(monthlyWage * (basicPercentage / 100));
  const hra = Math.round(basicSalary * (hraPercentage / 100));
  const performanceBonus = Math.round(monthlyWage * (performanceBonusPercentage / 100));
  const lta = Math.round(monthlyWage * (ltaPercentage / 100));
  const employeePf = Math.round(basicSalary * (employeePfPercentage / 100));
  const employerPf = Math.round(basicSalary * (employerPfPercentage / 100));

  const totalAllowances = hra + performanceBonus + lta + standardAllowance + fixedAllowance;
  const totalDeductions = employeePf + professionalTax;
  const netSalary = basicSalary + totalAllowances - totalDeductions;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeUuid || isSaving) return;

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Check existing salary_structure
      const { data: existingStruct, error: checkStructErr } = await supabase
        .from('salary_structures')
        .select('id')
        .eq('employee_id', employeeUuid)
        .maybeSingle();

      if (checkStructErr) throw checkStructErr;

      let structResult;
      const structPayload = {
        monthly_wage: monthlyWage,
        yearly_wage: yearlyWage,
        basic_percentage: basicPercentage,
        hra_percentage: hraPercentage,
        performance_bonus_percentage: performanceBonusPercentage,
        lta_percentage: ltaPercentage,
        standard_allowance: standardAllowance,
        fixed_allowance: fixedAllowance,
        professional_tax: professionalTax,
        employee_pf_percentage: employeePfPercentage,
        employer_pf_percentage: employerPfPercentage,
        basic_salary: basicSalary,
        hra: hra,
        performance_bonus: performanceBonus,
        leave_travel_allowance: lta,
        employee_pf: employeePf,
        employer_pf: employerPf
      };

      if (existingStruct) {
        structResult = await supabase
          .from('salary_structures')
          .update(structPayload)
          .eq('employee_id', employeeUuid)
          .select();
      } else {
        structResult = await supabase
          .from('salary_structures')
          .insert({
            employee_id: employeeUuid,
            ...structPayload
          })
          .select();
      }

      if (structResult.error) throw structResult.error;
      if (!structResult.data || structResult.data.length === 0) {
        throw new Error('Save to salary_structures succeeded but did not return updated rows.');
      }

      // 2. Check existing payroll
      const { data: existingPayroll, error: checkPayrollErr } = await supabase
        .from('payroll')
        .select('id')
        .eq('employee_id', employeeUuid)
        .maybeSingle();

      if (checkPayrollErr) throw checkPayrollErr;

      let payrollResult;
      const payrollPayload = {
        basic_salary: basicSalary,
        allowances: totalAllowances,
        deductions: totalDeductions,
        effective_from: new Date().toISOString().split('T')[0]
      };

      if (existingPayroll) {
        payrollResult = await supabase
          .from('payroll')
          .update(payrollPayload)
          .eq('employee_id', employeeUuid)
          .select();
      } else {
        payrollResult = await supabase
          .from('payroll')
          .insert({
            employee_id: employeeUuid,
            ...payrollPayload
          })
          .select();
      }

      if (payrollResult.error) throw payrollResult.error;

      setSuccessMsg('Salary structure and active payroll updated successfully!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      console.error('Error saving salary configuration:', err);
      setErrorMsg(err.message || 'Failed to save salary configuration. Please verify RLS permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-gray-400 animate-pulse">Loading salary configuration...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <div>
          <h3 className="text-base font-bold text-gray-900">Salary Management</h3>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Configure wage matrix and allowance weights</p>
        </div>
        <span className="text-[10px] font-extrabold text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Admin Console
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 select-all">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 select-none">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Wages Configuration */}
        <div className="bg-lavender/10 p-5 rounded-2xl border border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Monthly Gross Wage (INR)</label>
            <input
              type="number"
              min="0"
              required
              disabled={isSaving}
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yearly Gross Wage</label>
            <div className="px-4 py-2.5 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-bold text-gray-500 h-[44px] flex items-center">
              {formatCurrency(yearlyWage)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Net Monthly Take-Home</label>
            <div className="px-4 py-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-xl text-sm font-extrabold text-emerald-600 h-[44px] flex items-center">
              {formatCurrency(netSalary)}
            </div>
          </div>
        </div>

        {/* Calculations Split: Earnings vs Deductions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Split Config */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-2">Earnings Splits</h4>
            
            {/* Basic percentage */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Basic Salary Definition</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={basicPercentage}
                    onChange={(e) => setBasicPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Gross</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Basic Salary</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(basicSalary)}</p>
              </div>
            </div>

            {/* HRA percentage */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">House Rent Allowance (HRA)</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={hraPercentage}
                    onChange={(e) => setHraPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Basic</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">HRA Value</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(hra)}</p>
              </div>
            </div>

            {/* Performance Bonus */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Performance Bonus</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={performanceBonusPercentage}
                    onChange={(e) => setPerformanceBonusPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Gross</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bonus Value</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(performanceBonus)}</p>
              </div>
            </div>

            {/* LTA */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Leave Travel Allowance (LTA)</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={ltaPercentage}
                    onChange={(e) => setLtaPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Gross</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LTA Value</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(lta)}</p>
              </div>
            </div>

            {/* Standard Allowance */}
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-500">Standard Allowance (INR)</label>
              <input
                type="number"
                min="0"
                disabled={isSaving}
                value={standardAllowance}
                onChange={(e) => setStandardAllowance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-32 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-right focus:outline-none"
              />
            </div>

            {/* Fixed Allowance */}
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-500">Fixed Allowance (INR)</label>
              <input
                type="number"
                min="0"
                disabled={isSaving}
                value={fixedAllowance}
                onChange={(e) => setFixedAllowance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-32 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-right focus:outline-none"
              />
            </div>
          </div>

          {/* Deductions Split Config */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-2">Deductions Splits</h4>

            {/* Employee PF */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Employee PF Contribution</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={employeePfPercentage}
                    onChange={(e) => setEmployeePfPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Basic</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee PF Value</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(employeePf)}</p>
              </div>
            </div>

            {/* Employer PF */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Employer PF Contribution</label>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={isSaving}
                    value={employerPfPercentage}
                    onChange={(e) => setEmployerPfPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">% of Basic</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employer PF Value</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(employerPf)}</p>
              </div>
            </div>

            {/* Professional Tax */}
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-500">Professional Tax (INR)</label>
              <input
                type="number"
                min="0"
                disabled={isSaving}
                value={professionalTax}
                onChange={(e) => setProfessionalTax(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-32 px-3 py-1.5 bg-lavender/20 border border-primary/5 rounded-lg text-xs font-bold text-gray-800 text-right focus:outline-none"
              />
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-2 select-none text-xs font-semibold text-gray-400">
              <div className="flex justify-between">
                <span>Sum Earnings Monthly</span>
                <span className="font-bold text-gray-700">{formatCurrency(basicSalary + totalAllowances)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sum Deductions Monthly</span>
                <span className="font-bold text-gray-700">{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-50">
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving || !employeeUuid}
            className="flex items-center gap-2 px-6 py-2.5 font-bold shadow-soft hover:shadow-soft-lg cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving matrix...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Salary Structure
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
