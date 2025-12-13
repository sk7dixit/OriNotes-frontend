import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, Loader, Shield, Smartphone } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FloatingLabelInput from '../components/ui/FloatingLabelInput'; // Reusing new component
import Logo from '../components/ui/Logo';
import { Github } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';



const COUNTRY_CODES = [
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'AU' },
  { code: '+81', country: 'JP' },
  { code: '+86', country: 'CN' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+971', country: 'UAE' },
];

const Register = () => {
  // Form States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  // UI States
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passcodes do not match.');
      return;
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(mobileNumber)) {
      setError('Please enter a valid mobile number (digits only, 7-15 chars).');
      return;
    }

    setLoading(true);
    const fullMobileNumber = mobileNumber.startsWith('+') ? mobileNumber : (countryCode + mobileNumber);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    try {
      await api.post('/users/register', { name: cleanName, email: cleanEmail, password, mobileNumber: fullMobileNumber, username: cleanUsername });
      setShowOtpInput(true);
      setMessage('Account created. Please verify your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanOtp = otp.trim();

    try {
      const res = await api.post('/users/verify-email-otp', { email: cleanEmail, otp: cleanOtp });
      const { token, user } = res.data;
      login(token, user);
      setMessage('Email verified! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed.');
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
      } else {
        navigate('/dashboard');
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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-[#0f172a] to-slate-900">

        {/* Logo (Top Left) */}
        <div className="absolute top-10 left-10 z-20">
          <Logo size="2xl" />
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px]"></div>

        <div className="relative z-10 m-auto max-w-lg p-12">
          {/* Main Headline (Logo removed) */}
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Start your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              journey today.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Join thousands of students and professionals who are already transforming how they learn and share.
          </p>

          {/* Feature List */}
          <div className="mt-12 space-y-4">
            {['Global Note Access', 'University Content', 'Secure & Private', 'Real-time Collaboration'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="p-1 rounded-full bg-teal-500/10 text-teal-400">
                  <CheckCircle size={14} />
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* RIGHT SECTION: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative overflow-y-auto">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-[420px] animate-fade-in-up py-10">

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{showOtpInput ? 'Verify Email' : 'Create Account'}</h2>
            <p className="text-slate-500">
              {showOtpInput ? 'Enter the code sent to your email.' : 'Sign up to get started with OriNotes.'}
            </p>
          </div>

          {!showOtpInput ? (
            <form onSubmit={handleRegister} className="space-y-2">
              <FloatingLabelInput
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

              <FloatingLabelInput
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={User} // Could use Hash icon
                required
              />

              <FloatingLabelInput
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <div className="flex gap-3">
                <div className="w-[110px]">
                  {/* Country Code Select */}
                  <div className="relative mb-5 group h-[58px]">
                    <div className="relative flex items-center w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl h-full hover:border-white/20 hover:bg-white/[0.05] transition-all">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-white text-[15px] font-medium h-full px-4 appearance-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 pointer-events-none text-slate-500">
                        <ArrowRight size={12} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <FloatingLabelInput
                    label="Mobile Number"
                    name="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    icon={Smartphone}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <FloatingLabelInput
                  label="Confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Lock}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-500 hover:text-white transition-colors">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification} className="space-y-4 animate-fade-in-right">
              <div className="text-center mb-6">
                <p className="text-slate-400 text-sm">We sent a verification code to <span className="text-white font-medium">{email}</span></p>
                <p className="text-xs text-amber-400/80 bg-amber-400/10 py-2 px-3 rounded-lg inline-block mt-2">
                  ⚠️ Check Spam folder if not received
                </p>
              </div>

              <FloatingLabelInput
                label="6-Digit OTP"
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
              {message && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle size={16} /> {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <>Verify Email <CheckCircle size={20} /></>}
              </button>
            </form>
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

          {/* Footer Links */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="absolute top-[-5px] left-0 right-0 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;