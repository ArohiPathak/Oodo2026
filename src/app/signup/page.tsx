'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [companyName, setCompanyName] = useState('');
  const [logoName, setLogoName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();

      // 1. Call Supabase Auth signUp
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
            phone: phone,
            role: 'admin',
          }
        }
      });

      if (error) {
        console.error('Supabase Auth error during signup:', error);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMsg('Unable to complete signup. Please try again.');
        setIsLoading(false);
        return;
      }

      // 2. Create Company
      const { data: company, error: companyErr } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          email: email,
          phone: phone,
        })
        .select()
        .single();

      if (companyErr) {
        console.error('Supabase DB error creating company:', companyErr);
        setErrorMsg(companyErr.message);
        setIsLoading(false);
        return;
      }

      // 3. Create Admin Profile
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          employee_id: `EMP-${data.user.id.substring(0, 8).toUpperCase()}`,
          full_name: name,
          email: email,
          phone: phone,
          role: 'admin',
          company_id: company?.id || null,
          joining_date: new Date().toISOString().split('T')[0],
        });

      if (profileErr) {
        console.error('Supabase DB error creating profile:', profileErr);
        setErrorMsg(profileErr.message);
        setIsLoading(false);
        return;
      }

      // 4. Success handling
      if (data.session) {
        // Redirect to admin area directly if session exists (email confirmation disabled)
        router.push('/employees');
      } else {
        // Session is null -> Email confirmation enabled
        setSuccessMsg('Account created. Please check your email to verify your account.');
      }
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-3xl border border-primary/10 shadow-soft-lg p-8 sm:p-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 my-8">
      
      {/* Branding Logo */}
      <div className="flex items-center gap-2 select-none mb-6">
        <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
          D
        </span>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Dayflow<span className="text-primary font-black">.</span>
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        
        {/* Company Name & Logo Upload */}
        <div>
          <label htmlFor="companyName" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            required
            disabled={isLoading}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
          />
          
          {/* Logo upload trigger */}
          <div className="flex justify-end mt-1.5">
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={handleFileChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer transition-colors"
            >
              <Upload size={14} />
              {logoName ? `Logo: ${logoName}` : 'Upload Logo'}
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
          />
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            disabled={isLoading}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
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
              placeholder="Create a password"
              className="w-full pl-4 pr-10 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full pl-4 pr-10 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Alert Display */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMsg}
          </div>
        )}

        {/* Success Alert Display */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {successMsg}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full py-2.5 shadow-soft hover:shadow-soft-lg mt-4 text-sm font-semibold tracking-wider disabled:opacity-50"
        >
          {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
        </Button>
      </form>

      {/* Muted Sign In Link Footer */}
      <div className="mt-8 text-xs font-semibold text-gray-500 select-none">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline ml-0.5">
          Sign In
        </Link>
      </div>

    </div>
  );
}
