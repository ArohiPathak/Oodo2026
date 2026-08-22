import React from 'react';
import { Search, X } from 'lucide-react';

interface EmployeeSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search employees by name, ID, title..."
        className="w-full pl-11 pr-10 py-3 bg-white border border-primary/5 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-soft"
      />
      
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
