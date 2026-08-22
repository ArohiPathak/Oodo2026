import React from 'react';

export type EmployeeProfileTabType = 'resume' | 'private_info' | 'salary' | 'security';

interface EmployeeProfileTabsProps {
  activeTab: EmployeeProfileTabType;
  onTabChange: (tab: EmployeeProfileTabType) => void;
}

export const EmployeeProfileTabs: React.FC<EmployeeProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: EmployeeProfileTabType; label: string }[] = [
    { id: 'resume', label: 'Resume' },
    { id: 'private_info', label: 'Private Info' },
    { id: 'salary', label: 'Salary Info' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="border-b border-gray-100 mt-8 w-full">
      <nav className="flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
