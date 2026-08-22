'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary visual placeholder feedback as per specs
    alert('Sign In clicked! Authentication integration will be implemented in a future update.');
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
        
        {/* Login ID / Email */}
        <div>
          <label htmlFor="emailOrId" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            Login ID / Email
          </label>
          <input
            id="emailOrId"
            type="text"
            required
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            placeholder="Enter Login ID or Email"
            className="w-full px-4 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full pl-4 pr-10 py-2.5 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors animate-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 shadow-soft hover:shadow-soft-lg mt-2 text-sm font-semibold tracking-wider"
        >
          SIGN IN
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
