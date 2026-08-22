import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Mail, Lock, User, LogIn, UserPlus, Download, Zap } from 'lucide-react';

export default function AuthCard() {
  const { handleEmailSignUp, handleEmailLogin, handleGuestLogin } = useSubscriptions();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name) {
      setFormError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      if (isSignUp) {
        await handleEmailSignUp(email, password, name);
      } else {
        await handleEmailLogin(email, password);
      }
    } catch (err) {
      let msg = err.message || 'Authentication failed.';
      if (msg.includes('auth/operation-not-allowed')) {
        msg = 'Email/Password authentication is disabled in Firebase Console. Please enable "Email/Password" in Firebase Console -> Authentication -> Sign-in method.';
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists.';
      } else if (msg.includes('auth/invalid-email')) {
        msg = 'Please enter a valid email address.';
      }
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-6 rounded-[32px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-5 animate-in fade-in duration-300 my-4 shadow-sm">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1A1918] p-2 mx-auto shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center">
          <img src="/logo.png" alt="UnSub Logo" className="w-full h-full object-contain rounded-xl" />
        </div>
        <h2 className="text-xl font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
          {isSignUp ? 'Create UnSub Account' : 'Welcome to UnSub'}
        </h2>
        <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E] max-w-xs mx-auto">
          {isSignUp ? 'Sign up with email to start tracking your subscriptions.' : 'Sign in to manage your recurring bills & renewals.'}
        </p>
      </div>

      {/* Auth Toggle Tabs */}
      <div className="flex bg-[#EBE6DD] dark:bg-[#181715] p-1 rounded-2xl border border-black/5 dark:border-white/10">
        <button
          type="button"
          onClick={() => { setIsSignUp(false); setFormError(''); }}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            !isSignUp 
              ? 'bg-white dark:bg-[#2A2825] text-[#1C1917] dark:text-white shadow-sm' 
              : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(true); setFormError(''); }}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            isSignUp 
              ? 'bg-white dark:bg-[#2A2825] text-[#1C1917] dark:text-white shadow-sm' 
              : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Message Alert */}
      {formError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
          {formError}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Name Field (Sign Up Only) */}
        {isSignUp && (
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-extrabold text-[#78746D] dark:text-[#A8A29E] uppercase tracking-wider ml-1">
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 absolute left-3.5 text-[#78746D]" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F3] outline-none focus:ring-2 focus:ring-[#DF4F38]"
                required={isSignUp}
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1 text-left">
          <label className="text-[11px] font-extrabold text-[#78746D] dark:text-[#A8A29E] uppercase tracking-wider ml-1">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 absolute left-3.5 text-[#78746D]" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F3] outline-none focus:ring-2 focus:ring-[#DF4F38]"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1 text-left">
          <label className="text-[11px] font-extrabold text-[#78746D] dark:text-[#A8A29E] uppercase tracking-wider ml-1">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 absolute left-3.5 text-[#78746D]" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F3] outline-none focus:ring-2 focus:ring-[#DF4F38]"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 mt-2 rounded-[20px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs shadow-md transition-all touch-shrink flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
        >
          {submitting ? (
            <span className="animate-pulse">Processing...</span>
          ) : isSignUp ? (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Demo / Guest Instant Access */}
      <button
        type="button"
        onClick={handleGuestLogin}
        className="w-full py-3 rounded-[20px] bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-extrabold text-xs flex items-center justify-center gap-2 transition-all touch-shrink hover:bg-amber-500/20"
      >
        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span>Instant Demo Access (Skip Login)</span>
      </button>

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
        <span className="flex-shrink mx-3 text-[10px] uppercase font-extrabold text-[#78746D] dark:text-[#A8A29E]">ANDROID APP</span>
        <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
      </div>

      {/* Direct APK Download Button */}
      <a
        href="https://github.com/abdul0042/reminder/releases/latest/download/app-debug.apk"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 rounded-[20px] bg-[#DF4F38] text-white font-extrabold text-xs shadow-terracotta transition-all touch-shrink flex items-center justify-center gap-2 hover:opacity-95"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>Download Android App (.apk)</span>
      </a>
    </div>
  );
}
