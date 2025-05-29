
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import Logo from '../components/Logo';
import QRCodeUpload from '../components/QRCodeUpload';
import Footer from '../components/Footer';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: signup form, 2: QR upload
  const [qrFile, setQrFile] = useState<File | null>(null);
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Get referral/source from URL
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('referralCode') || urlParams.get('utm_source');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !masterPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Check master password (in production, this would be environment variable)
    const MASTER_PASSWORD = 'MSR2025'; // This should be from environment
    if (masterPassword !== MASTER_PASSWORD) {
      toast.error('Invalid master password');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      
      // Store referral data if present
      if (referralCode) {
        localStorage.setItem('referralCode', referralCode);
      }

      toast.success('Welcome to Remindly 🎉 Let\'s help you get paid faster.');
      setStep(2); // Move to QR upload step
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleQRUpload = (file: File) => {
    setQrFile(file);
    toast.success('QR code uploaded successfully!');
  };

  const handleFinishSetup = () => {
    // In production, upload QR to Supabase Storage here
    if (qrFile) {
      console.log('Uploading QR file:', qrFile);
    }
    
    navigate('/dashboard');
  };

  const handleSkipQR = () => {
    navigate('/dashboard');
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <Logo size="md" linkTo="/dashboard" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>
          </div>

          {/* QR Upload Step */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Upload Your UPI QR Code
                </h2>
                <p className="text-gray-400">
                  Add your QR code to make it easier for clients to pay you
                </p>
              </div>

              <div className="space-y-6">
                <QRCodeUpload onUpload={handleQRUpload} />
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleSkipQR}
                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleFinishSetup}
                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-colors"
                  >
                    Finish Setup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="flex-1 flex">
        {/* Left side - Branding */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
            <div className="h-full flex flex-col justify-center items-center text-white p-12">
              <div className="max-w-md text-center">
                <Logo size="lg" linkTo={null} className="mb-8 justify-center" />
                <h2 className="text-4xl font-display font-bold mb-6">
                  Join Thousands of Business Owners
                </h2>
                <p className="text-xl text-primary-100 mb-8">
                  Start managing your client payments more efficiently with automated reminders and payment tracking.
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          {/* Header for mobile */}
          <div className="lg:hidden flex justify-between items-center mb-8">
            <Logo size="md" linkTo={null} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>
          </div>

          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center mb-8 lg:block hidden">
              <Logo size="md" linkTo={null} className="justify-center mb-4" />
              <p className="text-gray-400">Create your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="masterPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    id="masterPassword"
                    name="masterPassword"
                    type={showMasterPassword ? 'text' : 'password'}
                    required
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Enter master password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showMasterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Required for signup</p>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password || !confirmPassword || !masterPassword}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Register;
