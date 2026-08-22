import React from 'react';

interface EmployeeSalaryInfoProps {
  payroll: any;
  salaryStructure: any;
}

export const EmployeeSalaryInfo: React.FC<EmployeeSalaryInfoProps> = ({ payroll, salaryStructure }) => {
  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) return 'Not available';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const basicSalary = salaryStructure?.basic_salary || payroll?.basic_salary;
  const hra = salaryStructure?.hra;
  const allowances = payroll?.allowances || salaryStructure?.fixed_allowance || salaryStructure?.standard_allowance;
  const deductions = payroll?.deductions || salaryStructure?.professional_tax;
  
  // Calculate net salary if not direct from DB
  const netSalary = payroll?.net_salary || salaryStructure?.monthly_wage || 
    ((basicSalary || 0) + (hra || 0) + (allowances || 0) - (deductions || 0));

  const hasSalaryInfo = basicSalary !== undefined || hra !== undefined || allowances !== undefined || deductions !== undefined || netSalary !== 0;

  if (!hasSalaryInfo) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
        <h3 className="text-base font-bold text-gray-900 mb-6">Salary Information</h3>
        <p className="text-sm font-semibold text-gray-500 italic">Not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Salary Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Basic Salary</p>
          <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
            {formatCurrency(basicSalary)}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">House Rent Allowance (HRA)</p>
          <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
            {formatCurrency(hra)}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Allowances</p>
          <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
            {formatCurrency(allowances)}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Deductions</p>
          <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
            {formatCurrency(deductions)}
          </div>
        </div>

        <div className="md:col-span-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
          <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
            Net Monthly Salary
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">
            {formatCurrency(netSalary)}
          </p>
        </div>
      </div>
    </div>
  );
};
