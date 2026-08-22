import React, { useState, useEffect } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface EmployeePrivateInfoProps {
  employee: any;
  privateInfo: any;
  onRefresh?: () => void;
}

export const EmployeePrivateInfo: React.FC<EmployeePrivateInfoProps> = ({ employee, privateInfo, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [address, setAddress] = useState('');

  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [panNo, setPanNo] = useState('');
  const [uanNo, setUanNo] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

  useEffect(() => {
    setDob(privateInfo?.date_of_birth || '');
    setNationality(privateInfo?.nationality || '');
    setGender(privateInfo?.gender || '');
    setMaritalStatus(privateInfo?.marital_status || '');
    setPersonalEmail(privateInfo?.personal_email || '');
    setJoiningDate(privateInfo?.date_of_joining || employee?.joining_date || '');
    setAddress(privateInfo?.residential_address || '');
    setAccountNumber(privateInfo?.bank_account_number || '');
    setBankName(privateInfo?.bank_name || '');
    setIfscCode(privateInfo?.ifsc_code || '');
    setPanNo(privateInfo?.pan_no || '');
    setUanNo(privateInfo?.uan_no || '');
    setEmployeeCode(privateInfo?.employee_code || employee?.employee_id || '');
  }, [privateInfo, employee]);

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

  const handleSave = async () => {
    const supabase = createClient();
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to update details.');
        return;
      }

      const { error } = await supabase
        .from('employee_private_info')
        .upsert({
          profile_id: user.id,
          date_of_birth: dob || null,
          nationality: nationality || null,
          gender: gender || null,
          marital_status: maritalStatus || null,
          personal_email: personalEmail || null,
          date_of_joining: joiningDate || null,
          residential_address: address || null,
          bank_account_number: accountNumber || null,
          bank_name: bankName || null,
          ifsc_code: ifscCode || null,
          pan_no: panNo || null,
          uan_no: uanNo || null,
          employee_code: employeeCode || null,
        });

      if (error) throw error;

      setIsEditing(false);
      if (onRefresh) onRefresh();
      alert('Private information updated successfully!');
    } catch (err: any) {
      console.error('Error saving private info:', err);
      alert(`Unable to save details: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDob(privateInfo?.date_of_birth || '');
    setNationality(privateInfo?.nationality || '');
    setGender(privateInfo?.gender || '');
    setMaritalStatus(privateInfo?.marital_status || '');
    setPersonalEmail(privateInfo?.personal_email || '');
    setJoiningDate(privateInfo?.date_of_joining || employee?.joining_date || '');
    setAddress(privateInfo?.residential_address || '');
    setAccountNumber(privateInfo?.bank_account_number || '');
    setBankName(privateInfo?.bank_name || '');
    setIfscCode(privateInfo?.ifsc_code || '');
    setPanNo(privateInfo?.pan_no || '');
    setUanNo(privateInfo?.uan_no || '');
    setEmployeeCode(privateInfo?.employee_code || employee?.employee_id || '');
    setIsEditing(false);
  };

  const inputClass = "mt-2 w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-450 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all";

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex justify-end gap-3 mt-4">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 font-bold shadow-soft hover:shadow-soft-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 border-primary/10 text-primary hover:bg-primary/5 font-bold"
          >
            <Pencil size={14} />
            Edit Info
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Private Info */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-6">Private Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* DOB */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date of Birth</p>
              {isEditing ? (
                <input
                  type="date"
                  className={inputClass}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {formatDate(dob)}
                </div>
              )}
            </div>

            {/* Nationality */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Nationality</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={nationality}
                  placeholder="e.g. Indian"
                  onChange={(e) => setNationality(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {nationality || 'Not provided'}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gender</p>
              {isEditing ? (
                <select
                  className={inputClass}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 capitalize select-none">
                  {gender || 'Not provided'}
                </div>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Marital Status</p>
              {isEditing ? (
                <select
                  className={inputClass}
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 capitalize select-none">
                  {maritalStatus || 'Not provided'}
                </div>
              )}
            </div>

            {/* Personal Email */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Personal Email</p>
              {isEditing ? (
                <input
                  type="email"
                  className={inputClass}
                  value={personalEmail}
                  placeholder="e.g. personal@gmail.com"
                  onChange={(e) => setPersonalEmail(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {personalEmail || 'Not provided'}
                </div>
              )}
            </div>

            {/* Date of Joining */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date of Joining</p>
              {isEditing ? (
                <input
                  type="date"
                  className={inputClass}
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {formatDate(joiningDate)}
                </div>
              )}
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Residential Address</p>
              {isEditing ? (
                <textarea
                  className={inputClass}
                  value={address}
                  rows={2}
                  placeholder="Enter residential address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {address || 'Not provided'}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right side: Bank Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-6">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Account Number */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account Number</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={accountNumber}
                  placeholder="Enter Account Number"
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {accountNumber || 'Not provided'}
                </div>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Bank Name</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={bankName}
                  placeholder="Enter Bank Name"
                  onChange={(e) => setBankName(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {bankName || 'Not provided'}
                </div>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">IFSC Code</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={ifscCode}
                  placeholder="Enter IFSC Code"
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {ifscCode || 'Not provided'}
                </div>
              )}
            </div>

            {/* PAN No */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">PAN No</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={panNo}
                  placeholder="Enter PAN Number"
                  onChange={(e) => setPanNo(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {panNo || 'Not provided'}
                </div>
              )}
            </div>

            {/* UAN No */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">UAN No</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={uanNo}
                  placeholder="Enter UAN Number"
                  onChange={(e) => setUanNo(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {uanNo || 'Not provided'}
                </div>
              )}
            </div>

            {/* Employee Code */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Employee Code</p>
              {isEditing ? (
                <input
                  type="text"
                  className={inputClass}
                  value={employeeCode}
                  placeholder="Enter Employee Code"
                  onChange={(e) => setEmployeeCode(e.target.value)}
                />
              ) : (
                <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                  {employeeCode || 'Not provided'}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
