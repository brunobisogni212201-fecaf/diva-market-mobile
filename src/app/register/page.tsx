'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, ShoppingBag, Store, Truck, ArrowRight, Heart } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ConsentSection from '@/components/auth/ConsentSection';
import { registerUser } from '@/app/auth/actions';

// Role Definitions for UI
const ROLES = [
  {
    id: 'usuaria',
    label: 'Quero Comprar',
    icon: ShoppingBag,
    description: 'Encontre produtos incríveis',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    selectedColor: 'ring-2 ring-pink-500 bg-pink-100',
  },
  {
    id: 'vendedora',
    label: 'Quero Vender',
    icon: Store,
    description: 'Crie sua loja e venda mais',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    selectedColor: 'ring-2 ring-purple-500 bg-purple-100',
  },
  {
    id: 'entregadora',
    label: 'Quero Entregar',
    icon: Truck,
    description: 'Faça entregas e ganhe renda',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    selectedColor: 'ring-2 ring-blue-500 bg-blue-100',
  },
];

export default function RegisterPage() {
  const [role, setRole] = useState('usuaria');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    if (!agreedToTerms) {
      setError('Você deve aceitar os Termos de Uso e Política de Privacidade.');
      setIsLoading(false);
      return;
    }

    // Append role to formData since RadioGroup isn't natively a form input in this shadcn setup sometimes, 
    // or to ensure explicit value.
    if (!formData.get('role')) {
      formData.append('role', role);
    }

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Success handled by server action redirect or here
      // If action redirects, we might not reach here, but good to have fallback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-[#880E4F] p-8 text-center text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-8 translate-y-8"></div>

          <h1 className="text-3xl font-bold mb-2 relative z-10 flex items-center justify-center gap-2">
            Diva Market <Heart className="fill-current text-pink-300" size={24} />
          </h1>
          <p className="text-pink-100 text-sm relative z-10">Crie sua conta e faça parte da comunidade</p>
        </div>

        <div className="p-8">
          <form action={handleSubmit} className="space-y-6">

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Como você quer usar o app?</Label>
              <RadioGroup
                defaultValue="usuaria"
                onValueChange={setRole}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                name="role"
              >
                {ROLES.map((r) => (
                  <div key={r.id}>
                    <RadioGroupItem value={r.id} id={r.id} className="peer sr-only" />
                    <Label
                      htmlFor={r.id}
                      className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-gray-50 hover:text-gray-900 peer-data-[state=checked]:border-[#880E4F] peer-data-[state=checked]:text-[#880E4F] cursor-pointer transition-all h-full ${role === r.id ? 'border-[#880E4F] bg-pink-50' : 'border-gray-200 bg-white text-gray-500'
                        }`}
                    >
                      <r.icon className="mb-2 h-6 w-6" />
                      <span className="text-xs font-semibold text-center">{r.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="fullName" name="fullName" placeholder="Seu nome" className="pl-10 h-12 rounded-xl" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" className="pl-10 h-12 rounded-xl" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="password" name="password" type="password" placeholder="******" className="pl-10 h-12 rounded-xl" required minLength={6} />
                </div>
              </div>
            </div>

            {/* Terms */}
            <ConsentSection
              role={role}
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex flex-col gap-1">
                <span className="font-medium">Atenção:</span>
                {error}
                {error.includes('já está cadastrado') && (
                  <Link href="/login" className="text-[#880E4F] font-bold hover:underline flex items-center gap-1 mt-1">
                    Ir para Login <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#880E4F] hover:bg-pink-900 text-white h-12 rounded-xl font-bold text-lg shadow-lg shadow-pink-200 transition-transform active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? 'Criando Conta...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Já tem cadastro?{' '}
            <Link href="/login" className="text-[#880E4F] font-semibold hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}