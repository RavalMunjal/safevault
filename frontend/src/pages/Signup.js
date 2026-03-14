import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 px-4 sm:px-0 mt-8">
        
        {/* Header Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 mb-4 transform hover:scale-105 transition-transform">
            <ShieldAlert size={40} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Setup your emergency security locker
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 dark:bg-darkCard/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-lightBase dark:bg-darkBase/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 dark:text-white transition-all shadow-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-lightBase dark:bg-darkBase/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 dark:text-white transition-all shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-lightBase dark:bg-darkBase/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 dark:text-white transition-all shadow-sm"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-all">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
