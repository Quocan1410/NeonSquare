'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { addToast } from '@/components/ui/toast';
import { ToastContainer } from '@/components/ui/toast';
import { Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        description: 'Passwords do not match',
      });
      return;
    }

    if (formData.password.length < 6) {
      addToast({
        type: 'error',
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success) {
        addToast({
          type: 'success',
          title: 'Registration Successful',
          description: 'Please sign in to continue',
        });
        // Redirect to login with email pre-filled
        router.push(`/login?email=${encodeURIComponent(formData.email)}`);
      } else {
        addToast({
          type: 'error',
          title: 'Registration Failed',
          description: response.message || 'Registration failed',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles with Custom Animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" style={{
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200/30 rounded-full blur-lg" style={{
          animation: 'drift 8s ease-in-out infinite',
          animationDelay: '1s'
        }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200/15 rounded-full blur-2xl" style={{
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-200/25 rounded-full blur-xl" style={{
          animation: 'drift 7s ease-in-out infinite',
          animationDelay: '0.5s'
        }}></div>
        
        {/* Subtle Grid Pattern with Shimmer */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)`,
          backgroundSize: '20px 20px',
          animation: 'shimmer 3s linear infinite'
        }}></div>
        
        {/* Floating Particles with Varied Animations */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-40" style={{
          animation: 'float 4s ease-in-out infinite'
        }}></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-30" style={{
          animation: 'drift 5s ease-in-out infinite',
          animationDelay: '1s'
        }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400 rounded-full opacity-35" style={{
          animation: 'float 3s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20" style={{
          animation: 'drift 6s ease-in-out infinite',
          animationDelay: '1.5s'
        }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-25" style={{
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '0.8s'
        }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Forum</h1>
            <p className="text-gray-600">Create an account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className="peer h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pt-4 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="firstName" 
                  className={`absolute left-4 transition-all duration-200 bg-white px-1 ${
                    formData.firstName || focusedField === 'firstName'
                      ? '-top-2 translate-y-0 text-xs text-blue-600'
                      : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                  }`}
                >
                  First Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className="peer h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pt-4 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="lastName" 
                  className={`absolute left-4 transition-all duration-200 bg-white px-1 ${
                    formData.lastName || focusedField === 'lastName'
                      ? '-top-2 translate-y-0 text-xs text-blue-600'
                      : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                  }`}
                >
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="peer h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pt-4 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                placeholder=" "
                required
              />
              <label 
                htmlFor="email" 
                className={`absolute left-4 transition-all duration-200 bg-white px-1 ${
                  formData.email || focusedField === 'email'
                    ? '-top-2 translate-y-0 text-xs text-blue-600'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                }`}
              >
                Email
              </label>
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200" />
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="peer h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pt-4 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                placeholder=" "
                required
              />
              <label 
                htmlFor="password" 
                className={`absolute left-4 transition-all duration-200 bg-white px-1 ${
                  formData.password || focusedField === 'password'
                    ? '-top-2 translate-y-0 text-xs text-blue-600'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className="peer h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pt-4 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                placeholder=" "
                required
              />
              <label 
                htmlFor="confirmPassword" 
                className={`absolute left-4 transition-all duration-200 bg-white px-1 ${
                  formData.confirmPassword || focusedField === 'confirmPassword'
                    ? '-top-2 translate-y-0 text-xs text-blue-600'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                }`}
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
