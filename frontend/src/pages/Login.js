import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    setError('Google OAuth credentials not configured yet. Please use regular email/password or create an account for now.');
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // Hit the new dedicated Demo endpoint that bypasses DB validation
      const res = await fetch('http://localhost:5000/api/auth/demo', {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Since we are mocking login without AuthContext's axios, we inject token locally
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        // Force reload so auth context picks up the mocked localStorage values
        window.location.href = '/';
      } else {
        setError("Demo login failed arbitrarily.");
      }
    } catch (e) {
      console.error("Demo login error:", e);
      setError("Network error hitting Demo endpoint.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-lightBase dark:bg-darkBase transition-colors duration-500">
      
      {/* Premium Decorative Light/Dark Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10 px-4 sm:px-0">
        
        {/* Logo Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 mb-4 transform hover:scale-105 transition-transform">
            <ShieldCheck size={40} className="text-primary dark:text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Securely access your emergency locker
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-darkCard/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-lightBase dark:bg-darkBase/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-primary dark:text-primary dark:hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-lightBase dark:bg-darkBase/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social / Alternative Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-darkCard text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white dark:bg-darkBase border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-lightBase dark:hover:bg-slate-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-xl shadow-sm text-sm font-semibold text-indigo-700 dark:text-primary hover:bg-primary/20 dark:hover:bg-indigo-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ShieldCheck size={18} />
                Demo 
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Sign up link */}
        <p className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:text-primary dark:text-primary dark:hover:text-indigo-300 hover:underline transition-all">
            Sign up now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
