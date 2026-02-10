import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function AuthPage() {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let err: string | null;
    if (mode === 'signup') {
      err = await signup(email.trim(), password, name.trim());
    } else {
      err = await login(email.trim(), password);
    }

    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8ebf1] via-[#f0f4f8] to-[#e0e8f5]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] shadow-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2c3e50]">Welcome to Opto</h1>
          <p className="text-[#6b7e9e] mt-2">Your social financial wellness platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tab toggle */}
          <div className="flex bg-[#f5f7fa] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white shadow-sm text-[#2c3e50]'
                  : 'text-[#6b7e9e] hover:text-[#2c3e50]'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white shadow-sm text-[#2c3e50]'
                  : 'text-[#6b7e9e] hover:text-[#2c3e50]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-[#2c3e50] block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6b7e9e]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f7fa] border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6] focus:ring-2 focus:ring-[#5c87d6]/20 transition-all"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[#2c3e50] block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6b7e9e]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f7fa] border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6] focus:ring-2 focus:ring-[#5c87d6]/20 transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#2c3e50] block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6b7e9e]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#f5f7fa] border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6] focus:ring-2 focus:ring-[#5c87d6]/20 transition-all"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7e9e] hover:text-[#2c3e50]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] text-white font-medium hover:from-[#4a6bb8] hover:to-[#3d5a9e] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md text-sm"
            >
              {loading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Log In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#6b7e9e] mt-5">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(null); }} className="text-[#5c87d6] font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(null); }} className="text-[#5c87d6] font-medium hover:underline">
                  Log in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-[#6b7e9e] mt-6">
          Passwords are hashed with bcrypt. Your data stays on localhost.
        </p>
      </div>
    </div>
  );
}
