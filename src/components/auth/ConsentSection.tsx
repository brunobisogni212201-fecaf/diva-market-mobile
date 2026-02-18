'use client';

import Link from 'next/link';
import { z } from 'zod';
import { UserRole, ROLES } from '@/lib/auth/rbac';
import clsx from 'clsx';

// --- Zod Schema for Validation ---
export const consentSchema = z.object({
    agreedToTerms: z.literal(true, {
        message: 'Você deve aceitar os Termos de Uso.',
    }),
});

interface ConsentSectionProps {
    role: UserRole;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    className?: string;
}

export default function ConsentSection({
    role,
    checked,
    onChange,
    error,
    className
}: ConsentSectionProps) {

    // Specific text based on role
    const getRoleSpecificText = () => {
        switch (role) {
            case ROLES.VENDEDORA:
                return 'Inclui consentimento para processamento de dados financeiros e vendas.';
            case ROLES.ENTREGADORA:
                return 'Inclui consentimento para rastreamento de localização durante entregas.';
            case ROLES.USUARIA:
            default:
                return 'Inclui consentimento para comunicações de marketing e gestão de pedidos.';
        }
    };

    return (
        <div className={clsx("space-y-2", className)}>
            <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                </div>
                <div className="text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                        Li e aceito os{' '}
                        <Link
                            href="/legal?tab=termos"
                            target="_blank"
                            className="text-pink-600 hover:text-pink-500 underline"
                        >
                            Termos de Uso
                        </Link>
                        {' '}e{' '}
                        <Link
                            href="/legal?tab=privacidade"
                            target="_blank"
                            className="text-pink-600 hover:text-pink-500 underline"
                        >
                            Política de Privacidade
                        </Link>
                        .
                    </label>
                    <p className="text-gray-500 mt-1">
                        {getRoleSpecificText()}
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-600 pl-7">
                    {error}
                </p>
            )}
        </div>
    );
}
