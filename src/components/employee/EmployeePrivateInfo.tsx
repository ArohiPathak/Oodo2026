import React from 'react';

interface EmployeePrivateInfoProps {
  employee: any;
  privateInfo: any;
}

export const EmployeePrivateInfo: React.FC<EmployeePrivateInfoProps> = ({ employee, privateInfo }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not provided';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const personalFields = [
    {
      label: 'Date of Birth',
      value: formatDate(privateInfo?.date_of_birth),
    },
    {
      label: 'Nationality',
      value: privateInfo?.nationality || 'Not provided',
    },
    {
      label: 'Gender',
      value: privateInfo?.gender || 'Not provided',
    },
    {
      label: 'Marital Status',
      value: privateInfo?.marital_status || 'Not provided',
    },
    {
      label: 'Personal Email',
      value: privateInfo?.personal_email || 'Not provided',
    },
    {
      label: 'Date of Joining',
      value: formatDate(privateInfo?.date_of_joining || employee?.joining_date),
    },
    {
      label: 'Residential Address',
      value: privateInfo?.residential_address || 'Not provided',
      isFullWidth: true,
    },
  ];

  const bankFields = [
    {
      label: 'Account Number',
      value: privateInfo?.bank_account_number || 'Not provided',
    },
    {
      label: 'Bank Name',
      value: privateInfo?.bank_name || 'Not provided',
    },
    {
      label: 'IFSC Code',
      value: privateInfo?.ifsc_code || 'Not provided',
    },
    {
      label: 'PAN No',
      value: privateInfo?.pan_no || 'Not provided',
    },
    {
      label: 'UAN No',
      value: privateInfo?.uan_no || 'Not provided',
    },
    {
      label: 'Employee Code',
      value: privateInfo?.employee_code || employee?.employee_id || 'Not provided',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left side: Private Info */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <h3 className="text-base font-bold text-gray-900 mb-6">Private Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalFields.map((field, idx) => (
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

      {/* Right side: Bank Details */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <h3 className="text-base font-bold text-gray-900 mb-6">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankFields.map((field, idx) => (
            <div key={idx}>
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
    </div>
  );
};
