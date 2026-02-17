'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { login } from './actions';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError('E-mail ou senha incorretos.'); // Generic message for security, or use result.error
      setIsLoading(false);
    }
    // If success, the action redirects, so no need to set loading false
  };

  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth
    console.log('Google login - To be implemented');
  };

  const handleFacebookLogin = async () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook login - To be implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Background Decorative Shape */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#880E4F] to-pink-300 opacity-20 rounded-b-[3rem]"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Header */}
        <header className="text-center mb-12 mt-8">
          {/* Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#880E4F] to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#880E4F] font-bold text-xs">DM</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Bem-vinda de volta, Diva! ✨
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Entre para gerenciar sua vitrine ou suas compras.
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Mail size={20} />
            </div>
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#880E4F] focus:ring-2 focus:ring-pink-100 transition-all duration-200 text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Lock size={20} />
            </div>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="w-full pl-12 pr-14 py-4 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#880E4F] focus:ring-2 focus:ring-pink-100 transition-all duration-200 text-sm"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link 
              href="/forgot-password"
              className="text-[#880E4F] hover:text-pink-700 text-sm font-medium transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#880E4F] hover:bg-pink-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-pink-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-b from-pink-50 to-white text-slate-500">
              Ou entre com
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-slate-700 font-medium text-sm">Google</span>
          </button>

          {/* Facebook Login */}
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-2xl transition-all duration-200 shadow-sm"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="font-medium text-sm">Facebook</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto text-center pb-8">
          <p className="text-slate-600 text-sm">
            Ainda não tem conta?{' '}
            <Link 
              href="/register"
              className="text-[#880E4F] hover:text-pink-700 font-bold transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
