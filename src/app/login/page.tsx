'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin'>('employee');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      let email = emailOrId.trim();

      // Check if user entered an email address or an Employee ID
      const isEmail = email.includes('@');

      if (!isEmail) {
        // Query profiles by employee_id to find the email
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('employee_id', email)
          .maybeSingle();

        if (profileError) {
          setErrorMsg('Unable to sign in right now. Please try again.');
          setIsLoading(false);
          return;
        }

        if (!profileData || !profileData.email) {
          setErrorMsg('Employee account not found. Please contact HR.');
          setIsLoading(false);
          return;
        }

        email = profileData.email;
      }

      // Authenticate via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setErrorMsg('Invalid email/Login ID or password.');
        setIsLoading(false);
        return;
      }

      const user = authData.user;
      if (!user) {
        setErrorMsg('Unable to sign in right now. Please try again.');
        setIsLoading(false);
        return;
      }

      // Fetch profile to verify role
      const { data: profile, error: profileQueryError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileQueryError) {
        await supabase.auth.signOut();
        setErrorMsg('Unable to sign in right now. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!profile) {
        // Auth user exists but profile is missing
        await supabase.auth.signOut();
        setErrorMsg('Employee account not found. Please contact HR.');
        setIsLoading(false);
        return;
      }

      const userRole = profile.role?.toLowerCase();
      if (userRole !== selectedRole) {
        await supabase.auth.signOut();
        setErrorMsg('Selected role does not match your account.');
        setIsLoading(false);
        return;
      }

      // Redirect based on verified role
      if (userRole === 'admin') {
        router.push('/');
      } else {
        router.push('/employee/dashboard');
      }

      router.refresh();

    } catch (err: any) {
      setErrorMsg('Unable to sign in right now. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-white rounded-3xl border border-primary/10 shadow-soft-lg p-8 sm:p-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      
      {/* Branding Logo */}
      <div className="flex items-center gap-2 select-none mb-8">
        <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
          D
        </span>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Dayflow<span className="text-primary font-black">.</span>
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        
        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Role
          </label>
          <select
            id="role"
            value={selectedRole}
            disabled={isLoading}
            onChange={(e) => setSelectedRole(e.target.value as 'employee' | 'admin')}
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="employee">Dashboard</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Login ID / Email */}
        <div>
          <label htmlFor="emailOrId" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Login ID / Email
          </label>
          <input
            id="emailOrId"
            type="text"
            required
            disabled={isLoading}
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            placeholder="Enter Login ID or Email"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full pl-4 pr-10 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Admin Test Credentials Info Box */}
        {selectedRole === 'admin' && (
          <div className="bg-[#FFF4EC] border border-orange-100/50 rounded-xl p-3.5 text-xs text-gray-700 space-y-1.5 select-all animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="font-extrabold text-[#B26B50] uppercase tracking-wider mb-1">
              Test Admin Credentials
            </p>
            <div>
              <span className="font-semibold text-gray-500">Email:</span>{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200/20 text-[#A05C45]">admin@gmail.com</code>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Password:</span>{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200/20 text-[#A05C45]">admin123</code>
            </div>
          </div>
        )}

        {/* Error Alert Display */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full py-2.5 shadow-soft hover:shadow-soft-lg mt-2 text-sm font-semibold tracking-wider"
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </Button>
      </form>

      {/* Muted Sign Up Link Footer */}
      <div className="mt-8 text-xs font-semibold text-gray-500 select-none">
        Don't have an Account?{' '}
        <Link href="/signup" className="text-primary hover:underline ml-0.5">
          Sign Up
        </Link>
      </div>

    </div>
  );
}
