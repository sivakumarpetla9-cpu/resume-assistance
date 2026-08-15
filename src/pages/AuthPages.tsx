import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Cpu, ArrowRight, Lock, Mail, User, CheckCircle } from 'lucide-react';

export const AuthPages: React.FC<{ mode: 'login' | 'signup' | 'forgot' }> = ({ mode: initialMode }) => {
  const { setActiveScreen } = useCareer();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('alex.vance@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Vance');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      setActiveScreen('onboarding');
    } else if (mode === 'login') {
      setActiveScreen('command-center');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F3F5F7] flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-md bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-6">
        
        {/* Brand header */}
        <div className="flex items-center gap-3 justify-center pb-2 border-b border-[#1C2633]/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#35C6FF] to-[#4F7CFF] p-0.5">
            <div className="w-full h-full bg-[#070A0F] rounded-[6px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#35C6FF]" />
            </div>
          </div>
          <span className="font-mono text-base font-bold tracking-wider text-[#F3F5F7]">STITCH</span>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-[#F3F5F7]">
            {mode === 'login' && 'Sign In to Your Workspace'}
            {mode === 'signup' && 'Create Your Career Intelligence Profile'}
            {mode === 'forgot' && 'Reset Security Credentials'}
          </h2>
          <p className="text-xs text-[#A7B0BC]">
            {mode === 'login' && 'Enter credentials to access your Career Intelligence System.'}
            {mode === 'signup' && 'Get instant access to ATS diagnostics, resume tailoring & AI interviews.'}
            {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-[#111822] border border-[#35D399] text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-[#35D399] mx-auto" />
            <div className="font-mono text-sm font-bold text-[#F3F5F7]">Reset Link Sent</div>
            <p className="text-xs text-[#A7B0BC]">Check your email inbox to complete password reset.</p>
            <button
              onClick={() => setMode('login')}
              className="text-xs font-mono text-[#35C6FF] hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-sans"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-mono"
                  placeholder="candidate@example.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono text-[#A7B0BC]">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-mono text-[#35C6FF] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(53,198,255,0.3)]"
            >
              <span>{mode === 'login' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT & ONBOARD' : 'SEND RESET LINK'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Mode Switch */}
        <div className="text-center pt-2 text-xs font-mono text-[#66717F]">
          {mode === 'login' ? (
            <span>
              Don't have a profile yet?{' '}
              <button onClick={() => setMode('signup')} className="text-[#35C6FF] hover:underline">
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-[#35C6FF] hover:underline">
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
