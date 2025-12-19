
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Building, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { FloralPattern, BottomFloral } from '../constants';
import { api } from '../lib/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [flatId, setFlatId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        // In a real app, this would call api.auth.register
        await new Promise(r => setTimeout(r, 1000));
        setRegistered(true);
        setTimeout(() => {
          setIsRegistering(false);
          setRegistered(false);
        }, 2000);
      } else {
        const { user } = await api.auth.login(email, password);
        onLogin(user);
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#F8F9F5] dark:bg-[#1A1F1A]">
      <FloralPattern />
      <BottomFloral />

      <div className="w-full max-w-sm flex flex-col items-center text-center z-10 glass-card p-8 sm:p-10 rounded-[40px] sm:rounded-[48px] shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300">
        <div className="mb-8">
          <h2 className="text-[#8C9A8C] tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-2 uppercase">Parasnath</h2>
          <h1 className="text-5xl sm:text-6xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] font-medium leading-none flex items-center gap-1 justify-center">
            N<span className="text-[#6B8E6B]">Ʌ</span>G<span className="text-[#6B8E6B]">Ʌ</span>RI
          </h1>
        </div>

        {error && (
          <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg w-full">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] mb-1">
            {isRegistering ? 'Create Account' : 'Welcome back'}
          </h3>
          <p className="text-[#8C9A8C] dark:text-[#A3B18A] text-xs sm:text-sm">
            {isRegistering ? 'Join Parasnath Nagari community' : 'Login to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-5">
          {isRegistering && (
            <>
              <div className="relative animate-in slide-in-from-left-4 duration-300">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-[#8C9A8C]" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[20px] sm:rounded-[24px] py-3.5 sm:py-4 pl-12 pr-4 text-[#3D4F3D] dark:text-[#E6E9E0] placeholder-[#8C9A8C]/60 focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-sm transition-all"
                  required={isRegistering}
                />
              </div>
              <div className="relative animate-in slide-in-from-right-4 duration-300">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Building size={18} className="text-[#8C9A8C]" />
                </div>
                <input
                  type="text"
                  placeholder="Flat ID (e.g. 501)"
                  value={flatId}
                  onChange={(e) => setFlatId(e.target.value)}
                  className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[20px] sm:rounded-[24px] py-3.5 sm:py-4 pl-12 pr-4 text-[#3D4F3D] dark:text-[#E6E9E0] placeholder-[#8C9A8C]/60 focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-sm transition-all"
                  required={isRegistering}
                />
              </div>
            </>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-[#8C9A8C]" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[20px] sm:rounded-[24px] py-3.5 sm:py-4 pl-12 pr-4 text-[#3D4F3D] dark:text-[#E6E9E0] placeholder-[#8C9A8C]/60 focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-[#8C9A8C]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[20px] sm:rounded-[24px] py-3.5 sm:py-4 pl-12 pr-12 text-[#3D4F3D] dark:text-[#E6E9E0] placeholder-[#8C9A8C]/60 focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-sm transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-[#8C9A8C] hover:text-[#6B8E6B] transition-colors p-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isRegistering && (
            <div className="text-right">
              <a href="#" className="text-[10px] sm:text-xs font-bold text-[#8C9A8C] dark:text-[#A3B18A] hover:text-[#6B8E6B] transition-colors">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B8E6B] text-white font-bold py-3.5 sm:py-4 rounded-[20px] sm:rounded-[24px] shadow-xl shadow-[#6B8E6B]/30 hover:bg-[#5a7a5a] hover:scale-[1.02] active:scale-[0.95] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-[#8C9A8C] dark:text-[#A3B18A] text-[11px] sm:text-sm mb-1">
            {isRegistering ? 'Already have an account?' : 'New to Parasnath Nagari Building No 5?'}
          </p>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[#6B8E6B] text-xs sm:text-sm font-bold hover:underline active:opacity-70 transition-all flex items-center gap-1 mx-auto"
          >
            {isRegistering && <ArrowLeft size={14} />}
            {isRegistering ? 'Back to Login' : 'Register Now'}
          </button>
        </div>
      </div>

      {registered && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-500">
          <CheckCircle2 size={20} className="text-[#6B8E6B]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Registration Successful!</span>
            <span className="text-[10px] opacity-70">Redirecting to login...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
