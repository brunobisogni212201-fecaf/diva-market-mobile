'use client';

import { useState } from 'react';
import { User, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { registerUser } from '@/app/auth/actions';
import ConsentSection from '@/components/auth/ConsentSection';
import { ROLES } from '@/lib/auth/rbac';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!agreedToTerms) {
      setError('Você deve aceitar os Termos de Uso e Política de Privacidade para continuar.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('agreedToTerms', 'true');
    formData.append('role', ROLES.USUARIA);

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // If success, it redirects automatically
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Background Decorative Shape */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#880E4F] to-pink-300 opacity-20 rounded-b-[3rem]"></div>

      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Header */}
        <header className="text-center mb-10 mt-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#880E4F] to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#880E4F] font-bold text-xs">DM</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Crie sua conta ✨
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Informe seu celular para receber o acesso via WhatsApp.
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
          {/* Name Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <User size={20} />
            </div>
            <input
              name="fullName"
              type="text"
              placeholder="Seu nome completo"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#880E4F] focus:ring-2 focus:ring-pink-100 transition-all duration-200 text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Phone size={20} />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="WhatsApp (ex: +5511999999999)"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#880E4F] focus:ring-2 focus:ring-pink-100 transition-all duration-200 text-sm"
              required
              disabled={isLoading}
              pattern="\+?[0-9]*"
              inputMode="tel"
            />
          </div>

          {/* Consent Section */}
          <ConsentSection
            role={ROLES.USUARIA}
            checked={agreedToTerms}
            onChange={setAgreedToTerms}
            className="py-2"
          />

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-green-200"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Receber Link no WhatsApp</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-auto text-center pb-8">
          <p className="text-slate-600 text-sm">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-[#880E4F] hover:text-pink-700 font-bold transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div >
    </div >
  );
}