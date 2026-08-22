'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
} from 'lucide-react';

import { Avatar } from '../ui/Avatar';
import { StatusDot } from '../ui/StatusDot';
import { Button } from '../ui/Button';

import { createClient } from '@/lib/supabase/client';
import { EmployeeSalaryManager } from './EmployeeSalaryManager';

interface EmployeeDetailsProps {
  employee: any;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
}) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // -------------------------------------------------------
  // JOB INFO
  // -------------------------------------------------------

  const [designation, setDesignation] = useState(
    employee.designation || ''
  );

  const [phone, setPhone] = useState(
    employee.phone || ''
  );

  const [location, setLocation] = useState(
    employee.location || ''
  );

  const [joiningDate, setJoiningDate] = useState(
    employee.joiningDate || ''
  );

  const [selectedDeptId, setSelectedDeptId] = useState(
    employee.departmentId || ''
  );

  const [selectedManagerId, setSelectedManagerId] = useState(
    employee.managerId || ''
  );

  // -------------------------------------------------------
  // PRIVATE INFO
  // -------------------------------------------------------

  const [dob, setDob] = useState(
    employee.dob || ''
  );

  const [address, setAddress] = useState(
    employee.address || ''
  );

  const [nationality, setNationality] = useState(
    employee.nationality || ''
  );

  const [personalEmail, setPersonalEmail] = useState(
    employee.personalEmail || ''
  );

  const [gender, setGender] = useState(
    employee.gender || 'Male'
  );

  const [maritalStatus, setMaritalStatus] = useState(
    employee.maritalStatus || 'Single'
  );

  // -------------------------------------------------------
  // BANK DETAILS
  // -------------------------------------------------------

  const [bankAccountNumber, setBankAccountNumber] = useState(
    employee.bankAccountNumber || ''
  );

  const [bankName, setBankName] = useState(
    employee.bankName || ''
  );

  const [ifscCode, setIfscCode] = useState(
    employee.ifscCode || ''
  );

  const [panNo, setPanNo] = useState(
    employee.panNo || ''
  );

  const [uanNo, setUanNo] = useState(
    employee.uanNo || ''
  );

  // -------------------------------------------------------
  // SKILLS
  // -------------------------------------------------------

  const [skills, setSkills] = useState(
    employee.skills
      ? employee.skills.join(', ')
      : ''
  );

  // -------------------------------------------------------
  // DEPARTMENTS + MANAGERS
  // -------------------------------------------------------

  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const supabase = createClient();

      const [deptsRes, managersRes] = await Promise.all([
        supabase
          .from('departments')
          .select('id, name'),

        supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'admin'),
      ]);

      if (deptsRes.error) {
        console.error(
          'Error fetching departments:',
          deptsRes.error
        );
      }

      if (managersRes.error) {
        console.error(
          'Error fetching managers:',
          managersRes.error
        );
      }

      setDepartments(deptsRes.data || []);
      setManagers(managersRes.data || []);
    };

    if (isEditing) {
      fetchOptions();
    }
  }, [isEditing]);

  // -------------------------------------------------------
  // SAVE PROFILE
  // -------------------------------------------------------

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await fetch('/api/employees/update', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          profileId: employee.db_id,

          phone,
          designation,

          departmentId:
            selectedDeptId || null,

          managerId:
            selectedManagerId || null,

          location,

          joiningDate:
            joiningDate || null,

          dateOfBirth:
            dob || null,

          residentialAddress:
            address || null,

          nationality:
            nationality || null,

          personalEmail:
            personalEmail || null,

          gender:
            gender || null,

          maritalStatus:
            maritalStatus || null,

          bankAccountNumber:
            bankAccountNumber || null,

          bankName:
            bankName || null,

          ifscCode:
            ifscCode || null,

          panNo:
            panNo || null,

          uanNo:
            uanNo || null,

          skills: skills
            .split(',')
            .map((skill: string) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          'Failed to update employee details'
        );
      }

      alert(
        'Employee details updated successfully!'
      );

      setIsEditing(false);

      router.refresh();

      // Ensures refreshed data is shown immediately
      window.location.reload();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error';

      console.error(
        'Employee update failed:',
        err
      );

      alert(
        `Failed to save details: ${message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------
  // CANCEL EDIT
  // -------------------------------------------------------

  const handleCancel = () => {
    setDesignation(employee.designation || '');
    setPhone(employee.phone || '');
    setLocation(employee.location || '');
    setJoiningDate(employee.joiningDate || '');

    setSelectedDeptId(
      employee.departmentId || ''
    );

    setSelectedManagerId(
      employee.managerId || ''
    );

    setDob(employee.dob || '');
    setAddress(employee.address || '');
    setNationality(employee.nationality || '');

    setPersonalEmail(
      employee.personalEmail || ''
    );

    setGender(
      employee.gender || 'Male'
    );

    setMaritalStatus(
      employee.maritalStatus || 'Single'
    );

    setBankAccountNumber(
      employee.bankAccountNumber || ''
    );

    setBankName(employee.bankName || '');
    setIfscCode(employee.ifscCode || '');
    setPanNo(employee.panNo || '');
    setUanNo(employee.uanNo || '');

    setSkills(
      employee.skills
        ? employee.skills.join(', ')
        : ''
    );

    setIsEditing(false);
  };

  // -------------------------------------------------------
  // DATE FORMATTER
  // -------------------------------------------------------

  const formatDate = (date?: string) => {
    if (!date) {
      return 'Not provided';
    }

    try {
      return new Date(date).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <div className="flex justify-between items-center">

        <Link
          href="/employees"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors py-1 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />

          Back to Employees
        </Link>

        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() =>
              setIsEditing(true)
            }
            className="flex items-center gap-1.5 py-1.5 px-3 shadow-soft hover:shadow-soft-lg cursor-pointer"
          >
            <Pencil size={14} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">

            <Button
              variant="outline"
              disabled={isSaving}
              onClick={handleCancel}
              className="flex items-center gap-1 py-1.5 px-3 border-gray-200"
            >
              <X size={14} />
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1 py-1.5 px-3"
            >
              <Check size={14} />

              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </Button>

          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* PROFILE HEADER */}
      {/* ================================================= */}

      <div className="bg-white rounded-3xl shadow-soft border border-primary/5 overflow-hidden">

        <div className="h-32 bg-gradient-to-r from-primary-light/20 to-primary/10" />

        <div className="px-6 md:px-8 pb-8 relative">

          <div className="absolute -top-12 left-6 md:left-8">

            <Avatar
              name={employee.name}
              src={employee.avatarUrl}
              size="xl"
              className="border-4 border-white shadow-md ring-4 ring-primary-light/5"
            />

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-16">

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {employee.name ||
                  'Not provided'}
              </h1>

              <p className="text-sm font-semibold text-gray-500 mt-0.5">
                {employee.designation ||
                  'Not provided'}
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <StatusDot
                status={employee.status}
                showLabel={true}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* VIEW MODE */}
      {/* ================================================= */}

      {!isEditing ? (
        <div className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Employment Details */}

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

              <h3 className="text-base font-bold text-gray-900">
                Employment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InfoBlock
                  label="Employee Code"
                  value={employee.id}
                />

                <InfoBlock
                  label="Designation"
                  value={employee.designation}
                />

                <InfoBlock
                  label="Department"
                  value={employee.department}
                />

                <InfoBlock
                  label="Manager"
                  value={employee.manager}
                />

                <InfoBlock
                  label="Work Location"
                  value={employee.location}
                />

                <InfoBlock
                  label="Joining Date"
                  value={formatDate(
                    employee.joiningDate
                  )}
                />

                <InfoBlock
                  label="Office Phone"
                  value={employee.phone}
                />

                <InfoBlock
                  label="Work Email"
                  value={employee.email}
                />

              </div>
            </div>

            {/* Personal + Bank Details */}

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

              <h3 className="text-base font-bold text-gray-900">
                Personal & Bank Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InfoBlock
                  label="Date of Birth"
                  value={formatDate(
                    employee.dob
                  )}
                />

                <InfoBlock
                  label="Nationality"
                  value={employee.nationality}
                />

                <InfoBlock
                  label="Gender"
                  value={employee.gender}
                />

                <InfoBlock
                  label="Marital Status"
                  value={
                    employee.maritalStatus
                  }
                />

                <InfoBlock
                  label="Personal Email"
                  value={
                    employee.personalEmail
                  }
                />

                <InfoBlock
                  label="Residential Address"
                  value={employee.address}
                  isFullWidth
                />

                <hr className="md:col-span-2 border-gray-100/60 my-2" />

                <InfoBlock
                  label="Bank Name"
                  value={employee.bankName}
                />

                <InfoBlock
                  label="Account Number"
                  value={
                    employee.bankAccountNumber
                  }
                />

                <InfoBlock
                  label="IFSC Code"
                  value={employee.ifscCode}
                />

                <InfoBlock
                  label="PAN Number"
                  value={employee.panNo}
                />

                <InfoBlock
                  label="UAN Number"
                  value={employee.uanNo}
                />

              </div>
            </div>

            {/* Skills */}

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6 lg:col-span-2">

              <h3 className="text-base font-bold text-gray-900">
                Resume & Skills
              </h3>

              <div>

                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Skills Directory
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  {employee.skills &&
                    employee.skills.length >
                    0 ? (
                    employee.skills.map(
                      (skill: string) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-lavender text-primary rounded-xl text-xs font-bold border border-primary/5"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm font-semibold text-gray-500 italic">
                      Not provided
                    </span>
                  )}

                </div>
              </div>
            </div>

          </div>

          {/* ================================================= */}
          {/* SALARY MANAGER */}
          {/* ================================================= */}

          <EmployeeSalaryManager
            employee={employee}
          />

        </div>
      ) : (

        /* ================================================= */
        /* EDIT MODE */
        /* ================================================= */

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Employment Settings */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Employment Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                label="Designation"
                value={designation}
                onChange={setDesignation}
              />

              <InputField
                label="Office Phone"
                value={phone}
                onChange={setPhone}
              />

              {/* Department */}

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Department
                </label>

                <select
                  value={selectedDeptId}
                  onChange={(e) =>
                    setSelectedDeptId(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">
                    None / Not provided
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {department.name}
                      </option>
                    )
                  )}

                </select>
              </div>

              {/* Manager */}

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Manager
                </label>

                <select
                  value={selectedManagerId}
                  onChange={(e) =>
                    setSelectedManagerId(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">
                    None / Not provided
                  </option>

                  {managers.map((manager) => (
                    <option
                      key={manager.id}
                      value={manager.id}
                    >
                      {manager.full_name}
                    </option>
                  ))}

                </select>
              </div>

              <InputField
                label="Work Location"
                value={location}
                onChange={setLocation}
                placeholder="e.g. Bengaluru, India"
              />

              {/* Joining Date */}

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Joining Date
                </label>

                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) =>
                    setJoiningDate(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />

              </div>
            </div>
          </div>

          {/* Personal Info */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Personal & Private Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dob}
                  onChange={(e) =>
                    setDob(e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />

              </div>

              <InputField
                label="Nationality"
                value={nationality}
                onChange={setNationality}
              />

              <InputField
                label="Personal Email"
                value={personalEmail}
                onChange={setPersonalEmail}
                type="email"
              />

              {/* Gender */}

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* Marital Status */}

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Marital Status
                </label>

                <select
                  value={maritalStatus}
                  onChange={(e) =>
                    setMaritalStatus(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="Single">
                    Single
                  </option>

                  <option value="Married">
                    Married
                  </option>

                  <option value="Divorced">
                    Divorced
                  </option>

                  <option value="Widowed">
                    Widowed
                  </option>
                </select>

              </div>

              {/* Address */}

              <div className="md:col-span-2">

                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Residential Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                />

              </div>
            </div>
          </div>

          {/* Bank Details */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Bank Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                label="Bank Name"
                value={bankName}
                onChange={setBankName}
              />

              <InputField
                label="Account Number"
                value={bankAccountNumber}
                onChange={
                  setBankAccountNumber
                }
              />

              <InputField
                label="IFSC Code"
                value={ifscCode}
                onChange={setIfscCode}
              />

              <InputField
                label="PAN Number"
                value={panNo}
                onChange={setPanNo}
              />

              <InputField
                label="UAN Number"
                value={uanNo}
                onChange={setUanNo}
              />

            </div>
          </div>

          {/* Skills */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft space-y-6">

            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Skills Directory Settings
            </h3>

            <InputField
              label="Skills (Comma-separated)"
              value={skills}
              onChange={setSkills}
              placeholder="React, Next.js, TypeScript, SQL"
            />

          </div>

          {/* Salary remains managed separately */}
          <div className="lg:col-span-2">

            <EmployeeSalaryManager
              employee={employee}
            />

          </div>

        </div>
      )}
    </div>
  );
};

// =========================================================
// INFO DISPLAY COMPONENT
// =========================================================

const InfoBlock: React.FC<{
  label: string;
  value?: string | number | null;
  isFullWidth?: boolean;
}> = ({
  label,
  value,
  isFullWidth,
}) => {
    return (
      <div
        className={
          isFullWidth
            ? 'md:col-span-2'
            : ''
        }
      >
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          {label}
        </p>

        <div className="mt-1 text-sm font-bold text-gray-800 break-words select-all">
          {value !== null &&
            value !== undefined &&
            value !== ''
            ? String(value)
            : 'Not provided'}
        </div>
      </div>
    );
  };

// =========================================================
// EDIT INPUT COMPONENT
// =========================================================

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          {label}
        </label>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
        />
      </div>
    );
  };