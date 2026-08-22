import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface EmployeeSecurityProps {
  email: string;
}

export const EmployeeSecurity: React.FC<EmployeeSecurityProps> = ({ email }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        throw error;
      }

      setSuccessMsg('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      console.error('Password update error:', err);
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Security</h3>

      <div className="space-y-4">
        {/* Email Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-lavender/20 rounded-2xl border border-primary/5 gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">Account Email</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">This is the email address linked to your account.</p>
          </div>
          <span className="text-sm font-bold text-gray-800 bg-white px-4 py-2 rounded-xl border border-primary/5 shadow-sm">
            {email}
          </span>
        </div>

        {/* Account Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-lavender/20 rounded-2xl border border-primary/5 gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">Account Status</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">Your employee account is active</p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
            Active
          </span>
        </div>

        {/* Password Reset Section */}
        <div className="p-5 bg-lavender/20 rounded-2xl border border-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">Password</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Keep your account secure by updating your password regularly.</p>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-sm transition-colors cursor-pointer"
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordChange} className="mt-5 space-y-4 max-w-md animate-in slide-in-from-top-2 duration-200">
              <hr className="border-primary/5 mb-4" />
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 bg-white border border-primary/10 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 bg-white border border-primary/10 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {errorMsg && (
                <div className="text-red-600 text-xs font-semibold">{errorMsg}</div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={loading} className="text-xs py-2 px-4">
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)} className="text-xs py-2 px-4">
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {successMsg && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 text-xs font-semibold animate-in fade-in duration-200">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
