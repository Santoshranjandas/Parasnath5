import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Lock, User as UserIcon, Building, ArrowRight, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { User } from '../types';
import { FloralPattern, BottomFloral } from '../constants';
import { api } from '../lib/api';

interface LoginProps {
  onLogin: (user: User, isNew?: boolean) => void;
}

// Reusable 4-digit input component
const DigitInput = ({ 
  value, 
  onChange, 
  onEnter, 
  disabled,
  compact = false
}: { 
  value: string, 
  onChange: (val: string) => void, 
  onEnter?: () => void,
  disabled?: boolean,
  compact?: boolean
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    if (!/^\d*$/.test(val)) return; // Only allow numbers

    const lastChar = val.slice(-1);
    const newValue = value.split('');
    newValue[index] = lastChar;
    const finalStr = newValue.join('');
    
    onChange(finalStr);

    if (lastChar && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    
    if (index === 3 && lastChar && onEnter) {
       onEnter();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`flex justify-center gap-3 sm:gap-4 ${compact ? 'my-2' : 'my-4'}`}>
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ''}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`bg-white/50 border-2 border-[#6B8E6B]/20 rounded-xl text-center font-bold text-[#3D4F3D] focus:border-[#6B8E6B] focus:outline-none focus:ring-4 focus:ring-[#6B8E6B]/10 transition-all disabled:opacity-50 ${compact ? 'w-10 h-10 text-lg' : 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl'}`}
        />
      ))}
    </div>
  );
};

type LoginStep = 'PHONE_ENTRY' | 'OTP_VERIFY' | 'MPIN_ENTRY' | 'REGISTRATION';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('PHONE_ENTRY');
  
  // Data State
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [flatId, setFlatId] = useState('');
  const [wing, setWing] = useState('A');
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [existingUserName, setExistingUserName] = useState<string | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing user phone to facilitate "Remember Me"
    const savedPhone = localStorage.getItem('saved_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      // Verify if user actually exists in the (mock) DB
      api.auth.checkUser(savedPhone)
        .then(res => {
          if (res.exists && res.full_name) {
            setExistingUserName(res.full_name);
            setStep('MPIN_ENTRY');
          } else {
            // Saved phone invalid or user deleted? Fallback to phone entry
            setStep('PHONE_ENTRY');
          }
        })
        .catch(() => {
          setStep('PHONE_ENTRY');
        })
        .finally(() => {
          // Add a small delay for smooth transition and logo display
          setTimeout(() => setCheckingSaved(false), 800);
        });
    } else {
      setCheckingSaved(false);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input to ensure consistency
    const val = e.target.value.replace(/\D/g, '');
    setPhone(val);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.auth.checkUser(phone);
      if (res.exists && res.full_name) {
        setExistingUserName(res.full_name);
        setStep('MPIN_ENTRY');
      } else {
        setExistingUserName(null);
        // Direct transition to OTP Verify for new users
        const fakeOtp = '1234'; 
        setGeneratedOtp(fakeOtp);
        setStep('OTP_VERIFY');
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') { // Mock check
      setStep('REGISTRATION');
      setError(null);
    } else {
      setError("Incorrect OTP. Try 1234.");
    }
  };

  const handleLoginMpin = async () => {
    if (mpin.length !== 4) return;
    setLoading(true);
    setError(null);
    try {
      const { user } = await api.auth.loginMpin(phone, mpin);
      // Existing user (false for isNew)
      onLogin(user, false);
    } catch (err) {
      setError("Incorrect MPIN.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mpin.length !== 4) {
      setError("Please set a 4-digit MPIN.");
      return;
    }
    if (mpin !== confirmMpin) {
      setError("MPINs do not match.");
      return;
    }
    if (!flatId) {
      setError("Please enter your flat number.");
      return;
    }

    setLoading(true);
    try {
      const fullFlatId = `${wing}-${flatId}`;
      const { user } = await api.auth.register(fullName, phone, fullFlatId, mpin);
      // New user (true for isNew)
      onLogin(user, true);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('PHONE_ENTRY');
    setPhone('');
    setOtp('');
    setMpin('');
    setConfirmMpin('');
    setFlatId('');
    setWing('A');
    setError(null);
    setGeneratedOtp(null);
    setExistingUserName(null);
    localStorage.removeItem('saved_phone'); // Clear remember me to allow switching
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#F8F9F5] dark:bg-[#1A1F1A]">
      <FloralPattern />
      <BottomFloral />

      <div className="w-full max-w-sm flex flex-col items-center text-center z-10 glass-card p-8 sm:p-10 rounded-[40px] shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300">
        
        {/* Logo Section */}
        <div className="mb-6">
          <h2 className="text-[#8C9A8C] tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-2 uppercase">Parasnath</h2>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] font-medium leading-none flex items-center gap-1 justify-center">
            N<span className="text-[#6B8E6B]">Ʌ</span>G<span className="text-[#6B8E6B]">Ʌ</span>RI
          </h1>
        </div>

        {error && (
          <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg w-full animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {checkingSaved ? (
           <div className="py-12 flex flex-col items-center gap-4 animate-in fade-in">
             <Loader2 className="animate-spin text-[#6B8E6B]" size={32} />
             <p className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest">Identifying User...</p>
           </div>
        ) : (
          <>
            {/* STEP 1: PHONE ENTRY (Guest) */}
            {step === 'PHONE_ENTRY' && (
              <div className="w-full animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] mb-1">Welcome Guest</h3>
                <p className="text-[#8C9A8C] text-xs mb-6">Enter your mobile number to continue</p>
                
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-white/50 border border-gray-100 rounded-[20px] py-3.5 pl-12 pr-4 text-[#3D4F3D] focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none text-lg tracking-wide font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6B8E6B] text-white font-bold py-3.5 rounded-[20px] shadow-lg shadow-[#6B8E6B]/30 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Get OTP'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: OTP VERIFY */}
            {step === 'OTP_VERIFY' && (
              <div className="w-full animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] mb-1">Enter OTP</h3>
                <p className="text-[#8C9A8C] text-xs mb-4">We sent a code to {phone}</p>

                {generatedOtp && (
                  <div className="bg-[#6B8E6B]/10 text-[#6B8E6B] font-mono text-lg font-bold py-2 px-4 rounded-lg mb-4 inline-block border border-[#6B8E6B]/20">
                    {generatedOtp}
                  </div>
                )}

                <DigitInput 
                  value={otp} 
                  onChange={setOtp} 
                  onEnter={handleVerifyOtp}
                />

                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#6B8E6B] text-white font-bold py-3.5 rounded-[20px] shadow-lg mt-4 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all"
                >
                  Verify & Proceed
                </button>
                <button onClick={resetFlow} className="mt-4 text-xs text-[#8C9A8C] font-bold hover:underline">Change Mobile Number</button>
              </div>
            )}

            {/* STEP 3: REGISTRATION */}
            {step === 'REGISTRATION' && (
              <div className="w-full animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] mb-1">Setup Profile</h3>
                <p className="text-[#8C9A8C] text-xs mb-6">Complete your registration</p>

                <form onSubmit={handleRegistration} className="space-y-3">
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/50 border border-gray-100 rounded-[20px] py-3 pl-12 pr-4 text-[#3D4F3D] focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1/3 relative">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8C9A8C] text-[10px] font-bold uppercase z-10 opacity-70">
                           Wing
                         </div>
                        <select 
                            value={wing}
                            onChange={(e) => setWing(e.target.value)}
                            className="w-full h-full bg-white/50 border border-gray-100 rounded-[20px] py-3 pl-12 pr-8 text-[#3D4F3D] font-bold focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none appearance-none"
                        >
                            {['A', 'B', 'C', 'D'].map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#8C9A8C]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <div className="w-2/3 relative">
                        <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                        <input
                        type="text"
                        placeholder="Flat No (e.g. 501)"
                        value={flatId}
                        onChange={(e) => setFlatId(e.target.value)}
                        className="w-full bg-white/50 border border-gray-100 rounded-[20px] py-3 pl-12 pr-4 text-[#3D4F3D] focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
                        required
                        />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-[#8C9A8C] text-[10px] font-bold uppercase tracking-wider mb-1">Set MPIN</p>
                    <DigitInput value={mpin} onChange={setMpin} compact />
                  </div>

                  <div className="pt-0">
                    <p className="text-[#8C9A8C] text-[10px] font-bold uppercase tracking-wider mb-1">Confirm MPIN</p>
                    <DigitInput value={confirmMpin} onChange={setConfirmMpin} compact />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6B8E6B] text-white font-bold py-3.5 rounded-[20px] shadow-lg hover:bg-[#5a7a5a] active:scale-[0.98] transition-all mt-4"
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: EXISTING USER (MPIN) */}
            {step === 'MPIN_ENTRY' && (
              <div className="w-full animate-in slide-in-from-right-8 duration-300">
                 <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white shadow-md">
                    <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" />
                 </div>
                <h3 className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] mb-1">Welcome back</h3>
                <h4 className="text-lg font-bold text-[#6B8E6B] mb-6">{existingUserName || 'Member'}</h4>
                
                <p className="text-[#8C9A8C] text-xs font-bold uppercase tracking-wider mb-2">Enter MPIN</p>
                <DigitInput 
                  value={mpin} 
                  onChange={setMpin} 
                  onEnter={handleLoginMpin}
                  disabled={loading}
                />

                <button
                  onClick={handleLoginMpin}
                  disabled={loading || mpin.length !== 4}
                  className="w-full bg-[#6B8E6B] text-white font-bold py-3.5 rounded-[20px] shadow-lg mt-6 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? 'Verifying...' : 'Login'}
                </button>
                
                <button onClick={resetFlow} className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#8C9A8C] hover:text-[#3D4F3D]">
                  <RefreshCw size={12} /> Switch Account
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;