import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Employee } from '../../data/mockEmployees';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (newEmp: Omit<Employee, 'status' | 'joiningDate'>) => void;
  nextIdSuggestion: string;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  nextIdSuggestion,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState(nextIdSuggestion);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !id || !department || !designation) {
      alert('Please fill out all required fields.');
      return;
    }
    
    onAddEmployee({
      id,
      name,
      email,
      department,
      designation,
      phone: '+91 98765 00000', // Default phone number for prototype
    });

    // Reset state
    setName('');
    setEmail('');
    setId('');
    setDepartment('');
    setDesignation('');
    onClose();
  };

  // Re-sync ID recommendation when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setId(nextIdSuggestion);
    }
  }, [isOpen, nextIdSuggestion]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. aarav@dayflow.com"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        {/* Flex grid for ID and Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. EMP010"
              className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-800 font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Department
            </label>
            <select
              id="department"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-950 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-gray-400">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="People Ops">People Ops</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {/* Designation */}
        <div>
          <label htmlFor="designation" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Designation
          </label>
          <input
            id="designation"
            type="text"
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Software Engineer"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        {/* Actions Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};
