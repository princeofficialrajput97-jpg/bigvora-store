import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BigVoraLogo } from '../common/BigVoraLogo';
import { Smartphone, ShieldCheck, ArrowRight, X, RotateCcw, Lock, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, requestOtp, loginWithOtp, showToast } = useApp();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [serverOtpHint, setServerOtpHint] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMsg('Please enter a valid mobile number with country code.');
      return;
    }

    setIsLoading(true);
    const result = await requestOtp(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      setStep('OTP');
      setResendTimer(45);
      if (result.devOtp) {
        setServerOtpHint(result.devOtp);
        showToast(`Verification code generated: ${result.devOtp}`, 'info');
      }
    } else {
      setErrorMsg(result.error || 'Failed to send verification SMS.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    const result = await loginWithOtp(phoneNumber, otpCode, fullName);
    setIsLoading(false);

    if (result.success) {
      setStep('PHONE');
      setOtpCode('');
      setServerOtpHint(null);
    } else {
      setErrorMsg(result.error || 'Invalid OTP code.');
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithOtp('+91 98765 00000', '888888', fullName.trim() || 'Google Client');
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1322] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <BigVoraLogo size="lg" variant="stacked" />
          <h2 className="text-xl font-extrabold text-white mt-3">
            {step === 'PHONE' ? 'Welcome to BigVora' : 'Verify Phone Number'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {step === 'PHONE'
              ? 'Access ready-made Android apps, websites, and custom project tracking.'
              : `Enter the 6-digit verification code sent to ${phoneNumber}`}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {serverOtpHint && step === 'OTP' && (
          <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between">
            <span className="text-[11px] text-slate-300">OTP Code:</span>
            <button
              onClick={() => setOtpCode(serverOtpHint)}
              className="font-mono font-bold text-purple-300 bg-purple-900/60 px-2.5 py-1 rounded border border-purple-400/40 hover:bg-purple-800 transition-colors"
            >
              Fill: {serverOtpHint}
            </button>
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name (Optional for new users)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. John Doe / Rahul Sharma"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <Smartphone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Standard SMS rates apply. Secure OTP verification.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0D1322] px-3 text-slate-500 uppercase tracking-wider text-[10px]">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                6-Digit Security Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="888888"
                  autoFocus
                  required
                  className="w-full text-center tracking-[0.5em] text-lg font-mono py-3 bg-slate-900 border border-purple-500/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Access Account</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-slate-400 hover:text-white"
              >
                Change Number
              </button>

              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={handleSendOtp}
                className={`flex items-center gap-1 ${
                  resendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            By signing in, you accept BigVora Store's{' '}
            <span className="text-purple-400 cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-purple-400 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>

      </div>
    </div>
  );
};
