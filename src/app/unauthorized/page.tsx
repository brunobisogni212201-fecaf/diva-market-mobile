import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Acesso Negado</h1>
            <p className="text-gray-600 mb-8">Você não tem permissão para acessar esta área.</p>
            <Link href="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Voltar ao Início
            </Link>
        </div>
    );
}
