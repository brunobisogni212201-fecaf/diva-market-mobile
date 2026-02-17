'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole, ROLES } from '@/lib/auth/rbac';
import {
    BarChart3,
    Users,
    Settings,
    ShoppingBag,
    Truck,
    Package,
    Home,
    LogOut,
    UserCircle,
    LucideIcon
} from 'lucide-react';
import { logout } from '@/app/actions/auth-actions';

interface ToolItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const SIDEBAR_ITEMS: Record<UserRole, ToolItem[]> = {
    [ROLES.ADMIN]: [
        { name: 'Dashboard', href: '/admin', icon: BarChart3 },
        { name: 'Usuários', href: '/admin/users', icon: Users },
        { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ],
    [ROLES.VENDEDORA]: [
        { name: 'Minha Loja', href: '/vendedora', icon: Home },
        { name: 'Produtos', href: '/vendedora/products', icon: Package },
        { name: 'Vendas', href: '/vendedora/sales', icon: ShoppingBag },
    ],
    [ROLES.ENTREGADORA]: [
        { name: 'Entregas', href: '/entregadora', icon: Truck },
        { name: 'Histórico', href: '/entregadora/history', icon: BarChart3 },
    ],
    [ROLES.USUARIA]: [
        { name: 'Início', href: '/cliente', icon: Home },
        { name: 'Meus Pedidos', href: '/cliente/orders', icon: ShoppingBag },
        { name: 'Perfil', href: '/cliente/profile', icon: UserCircle },
    ],
};

export default function DashboardSidebar({ role }: { role: UserRole }) {
    const pathname = usePathname();
    const items = SIDEBAR_ITEMS[role] || [];

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                <h1 className="text-xl font-bold text-primary-600">Diva Market</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        'mr-3 h-5 w-5 flex-shrink-0',
                                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={() => logout()}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut
                        className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500"
                        aria-hidden="true"
                    />
                    Sair
                </button>
            </div>
        </div>
    );
}
