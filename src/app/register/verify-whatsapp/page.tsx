import { Phone } from 'lucide-react';
import Link from 'next/link';

export default function VerifyWhatsAppPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <Phone className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verifique seu WhatsApp!</h2>
                <p className="text-gray-600">
                    Enviamos um link de acesso para o seu número. Clique nele para entrar na sua conta.
                </p>
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                    <p>Não recebeu? Verifique se o número está correto ou tente se cadastrar novamente.</p>
                </div>
                <Link href="/login" className="block text-[#880E4F] font-semibold hover:underline mt-4">
                    Voltar para Login
                </Link>
            </div>
        </div>
    );
}
