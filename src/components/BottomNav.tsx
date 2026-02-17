'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, LogIn } from 'lucide-react';

// Simular estado de autenticação (em prod, viria de context/auth)
const isAuthenticated = false;

const navItemsAuthenticated = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cart', label: 'Carrinho', icon: ShoppingBag },
  { href: '/profile', label: 'Perfil', icon: User },
];

const navItemsUnauthenticated = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cart', label: 'Carrinho', icon: ShoppingBag },
  { href: '/login', label: 'Entrar', icon: LogIn },
];

export default function BottomNav() {
  const pathname = usePathname();
  const navItems = isAuthenticated ? navItemsAuthenticated : navItemsUnauthenticated;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center
                  px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600'
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-primary-600' : 'text-gray-400'}
                />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
