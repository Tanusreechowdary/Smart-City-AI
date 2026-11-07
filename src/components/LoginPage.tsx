import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useCityData();

  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('tanusreechowdarysirigiri@gmail.com');
  const [password, setPassword] = useState<string>('••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showCreateAccount, setShowCreateAccount] = useState<boolean>(false);
  const [resetSentEmail, setResetSentEmail] = useState<string>('');
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen' as UserRole,
  });
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        email: usernameOrEmail,
        name: usernameOrEmail.includes('@')
          ? usernameOrEmail.split('@')[0].toUpperCase()
          : usernameOrEmail,
      });
      setIsLoading(false);
    }, 400);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        email: 'tanusreechowdarysirigiri@gmail.com',
        name: 'Tanusree Chowdary',
        role: 'citizen',
      });
      setIsLoading(false);
    }, 450);
  };

  const handleQuickDemo = (role: UserRole, email: string, name: string) => {
    setUsernameOrEmail(email);
    setPassword('Vijayawada2026!');
    setIsLoading(true);
    setTimeout(() => {
      login({ email, role, name });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-[#eef5fa] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#0a4d8c]/20 selection:text-[#0a4d8c]">
      {/* Central Login Card */}
      <div className="w-full max-w-[1040px] bg-white rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(10,50,90,0.14)] border border-slate-100 flex flex-col lg:flex-row transition-all">
        {/* Left Side: Smart City Banner Visual */}
        <div className="w-full lg:w-[58%] relative min-h-[320px] sm:min-h-[420px] lg:min-h-[660px] bg-[#0c3660] overflow-hidden select-none flex items-stretch">
          <img
            src="/assets/smart_city_login_banner.png"
            alt="Smart City - Smarter Today, Greener Tomorrow"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Side: Exact Login Form */}
        <div className="w-full lg:w-[42%] bg-white px-7 sm:px-10 lg:px-12 py-10 sm:py-12 flex flex-col justify-center relative">
          {/* Top Avatar Badge */}
          <div className="flex justify-center mb-4">
            <div className="w-[74px] h-[74px] rounded-full bg-[#0a4d8c] flex items-center justify-center shadow-md">
              <User className="w-9 h-9 text-white" strokeWidth={2.3} />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0a3866] text-center tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-sm text-slate-500 font-normal text-center mt-1 mb-7">
            Log in to your Smart City portal
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email field */}
            <div>
              <div className="flex items-center px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:border-[#0a4d8c] focus-within:ring-2 focus-within:ring-[#0a4d8c]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <User className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Username / Email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:border-[#0a4d8c] focus-within:ring-2 focus-within:ring-[#0a4d8c]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <Lock className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" strokeWidth={1.8} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors ml-2 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0a4d8c] focus:ring-[#0a4d8c] cursor-pointer"
                />
                <span className="text-slate-600 text-sm">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-[#0a66c2] hover:text-[#084e96] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button with Arrow */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0a4d8c] hover:bg-[#083e70] active:scale-[0.99] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <span>{isLoading ? 'Authenticating...' : 'Login'}</span>
              <span className="text-lg leading-none">→</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold bg-white">
              OR
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>Login with Google</span>
          </button>

          {/* New to Smart City? Create an account */}
          <p className="text-center text-sm text-slate-500 mt-6">
            New to Smart City?{' '}
            <button
              type="button"
              onClick={() => setShowCreateAccount(true)}
              className="text-[#0a66c2] hover:underline font-semibold cursor-pointer"
            >
              Create an account
            </button>
          </p>

          {/* Convenient Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Quick Demo Access
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'admin',
                    'admin@smartcity.gov',
                    'Dr. Ramesh Varma (Commissioner)'
                  )
                }
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                👑 Administrator
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'operator',
                    'operator@smartcity.gov',
                    'S. K. Rao (VMC Operations)'
                  )
                }
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                ⚙️ Field Operator
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'citizen',
                    'citizen@vijayawada.in',
                    'Priya Sharma (Citizen)'
                  )
                }
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                👤 Citizen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSentEmail('');
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {resetSentEmail ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Password Reset Link Sent</h3>
                <p className="text-sm text-slate-600 mt-2">
                  We've dispatched recovery instructions to{' '}
                  <span className="font-semibold text-slate-800">{resetSentEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSentEmail('');
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#0a4d8c] text-white text-sm font-semibold hover:bg-[#083e70]"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#0a3866]">Reset Password</h3>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                  Enter your registered username or municipal email to receive recovery instructions.
                </p>
                <div className="flex items-center px-4 py-3 rounded-xl border border-slate-200 mb-4 focus-within:border-[#0a4d8c] focus-within:ring-2 focus-within:ring-[#0a4d8c]/15">
                  <User className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    defaultValue={usernameOrEmail}
                    id="reset-email-input"
                    className="w-full text-sm text-slate-800 outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        'reset-email-input'
                      ) as HTMLInputElement;
                      setResetSentEmail(input?.value || usernameOrEmail);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0a4d8c] text-white text-sm font-semibold hover:bg-[#083e70]"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowCreateAccount(false);
                setSignupSuccess(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {signupSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Account Registered!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Welcome to Vijayawada Smart City Platform,{' '}
                  <span className="font-semibold text-slate-800">{signupForm.name}</span>. You can
                  now access your citizen dashboard.
                </p>
                <button
                  onClick={() => {
                    setShowCreateAccount(false);
                    setSignupSuccess(false);
                    login({
                      email: signupForm.email,
                      name: signupForm.name,
                      role: signupForm.role,
                    });
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#0a4d8c] text-white text-sm font-semibold hover:bg-[#083e70]"
                >
                  Continue to Smart City Dashboard →
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#0a3866]">Create Smart City Account</h3>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                  Sign up for Vijayawada citizen services, municipal tracking, and smart notifications.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSignupSuccess(true);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Naidu"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0a4d8c] focus:ring-2 focus:ring-[#0a4d8c]/15 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0a4d8c] focus:ring-2 focus:ring-[#0a4d8c]/15 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portal Role
                    </label>
                    <select
                      value={signupForm.role}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, role: e.target.value as UserRole }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0a4d8c] focus:ring-2 focus:ring-[#0a4d8c]/15 outline-none bg-white text-slate-800"
                    >
                      <option value="citizen">Citizen (Grievance submission & tracking)</option>
                      <option value="operator">Field Operator (IoT & sensor maintenance)</option>
                      <option value="admin">Administrator (Municipal Command Center)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0a4d8c] focus:ring-2 focus:ring-[#0a4d8c]/15 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateAccount(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0a4d8c] text-white text-sm font-semibold hover:bg-[#083e70]"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
