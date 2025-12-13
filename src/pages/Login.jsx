import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff, Loader, Smartphone, Shield, Key } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';
import Logo from '../components/ui/Logo';
import { Github } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';

const Login = () => {
  // Tab State: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // Form States
  const [identifier, setIdentifier] = useState(''); // email/username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP States
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Capture redirect path if present
  const from = location.state?.from?.pathname;

  // --- Actions ---

  const handleSuccessRedirect = (user) => {
    if (from) {
      navigate(from);
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/users/login', { identifier, password });
      const { token, user } = res.data;

      login(token, user); // saves to context & localStorage
      handleSuccessRedirect(user);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError('Please enter your email or username.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/request-login-otp', { identifier: cleanIdentifier });
      setOtpSent(true);
      setMessage(`Code sent to ${identifier}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to send OTP. User may not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanIdentifier = identifier.trim();
    const cleanOtp = otp.trim();

    if (!cleanIdentifier || !cleanOtp) {
      setError('Please enter both your identifier and the code.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/users/verify-login-otp', { identifier: cleanIdentifier, otp: cleanOtp });
      const { token, user } = res.data;
      login(token, user);
      handleSuccessRedirect(user);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid Code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    setError('');
    setLoading(true);
    try {
      const provider = providerName === 'google' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send to backend
      const res = await api.post('/users/social-login', {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        provider: providerName,
        socialId: user.uid,
        photoUrl: user.photoURL
      });

      const { token, user: dbUser, isNewUser } = res.data;
      login(token, dbUser);

      if (isNewUser) {
        navigate('/settings');
        // Optional: you could pass state to show a specific message in settings
      } else {
        handleSuccessRedirect(dbUser);
      }

    } catch (err) {
      console.error("Social Login Failed", err);
      setError('Social login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex selection:bg-indigo-500/30 font-sans text-slate-200">

      {/* LEFT SECTION: Visuals */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-tr from-slate-900 via-[#0f172a] to-indigo-950/20">
        <div className="absolute top-10 left-10 z-20">
          <Logo size="2xl" />
        </div>
        <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[130px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px]"></div>

        <div className="relative z-10 m-auto max-w-lg p-12">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Capture ideas, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              Share knowledge.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            The modern platform for students and professionals to organize notes, collaborate on research, and share insights instantly.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                  User
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-slate-400">
              <span className="text-white">10k+</span> students joined
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* RIGHT SECTION: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative">
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-[420px] animate-fade-in-up">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <div className="bg-slate-900/50 p-1 rounded-2xl flex items-center mb-8 border border-white/5 shadow-inner">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'password' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Key size={16} /> Password
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'otp' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Shield size={16} /> One-Time Code
            </button>
          </div>

          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-2">
              <FloatingLabelInput
                label="Email or Username"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                icon={Mail}
                required
              />

              <div className="relative">
                <FloatingLabelInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
                <div className="absolute right-0 -bottom-6">
                  <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
                </div>
              </div>

              <div className="h-4"></div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
              </button>
            </form>
          )}

          {loginMethod === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                  <FloatingLabelInput
                    label="Email Address"
                    name="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    icon={Mail}
                    required
                  />

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="animate-spin" size={20} /> : <>Send Code <Smartphone size={20} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in-right">
                  <div className="text-center mb-6">
                    <p className="text-slate-400 text-sm">We sent a 6-digit code to <span className="text-white font-medium">{identifier}</span></p>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-indigo-400 hover:text-indigo-300 mt-2">Change email</button>
                  </div>

                  <FloatingLabelInput
                    label="6-Digit Code"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    icon={Shield}
                    required
                  />

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="animate-spin" size={20} /> : <>Verify & Login <CheckCircle size={20} /></>}
                  </button>
                </form>
              )}
            </div>
          )}



          {/* Social Login Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f172a] text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="h-12 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
              className="h-12 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#24292F]/90 transition-colors flex items-center justify-center gap-2"
            >
              <Github size={20} />
              GitHub
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline">
                Create account
              </Link>
            </p>
          </div>
          <div className="absolute top-[-40px] left-0 right-0 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Login;
