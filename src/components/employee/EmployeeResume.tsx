import React from 'react';

interface EmployeeResumeProps {
  employee: any;
  skills: any[];
}

export const EmployeeResume: React.FC<EmployeeResumeProps> = ({ employee, skills }) => {
  const skillsList = skills.length > 0 
    ? skills.map(s => `${s.skill_name} (${s.proficiency || 'Intermediate'})`).join(', ') 
    : 'Not provided';

  const fields = [
    {
      label: 'Current Position',
      value: employee?.designation || 'Not provided',
    },
    {
      label: 'Experience',
      value: 'Not provided',
    },
    {
      label: 'Qualification',
      value: 'Not provided',
    },
    {
      label: 'University',
      value: 'Not provided',
    },
    {
      label: 'Skills',
      value: skillsList,
      isFullWidth: true,
    },
    {
      label: 'Previous Company',
      value: 'Not provided',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Resume</h3>

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
