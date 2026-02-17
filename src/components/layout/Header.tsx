'use client';

import { Bell, MessageCircle } from 'lucide-react';
import SystemImage from '@/components/ui/SystemImage';

export default function Header({ className }: { className?: string }) {
    return (
        <header className={className}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-2">
                    {/* Cloud-native logo using SystemImage */}
                    <SystemImage
                        storagePath="assets/logos/diva-market-small.png"
                        alt="Diva Market Logo"
                        width={32}
                        height={32}
                        className="rounded-lg"
                        fallbackSrc="/favicon.ico"
                    />
                    <h1 className="text-xl font-bold text-[#880E4F]">Diva Market</h1>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Bell size={20} className="text-gray-700" />
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </button>
                    <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <MessageCircle size={20} className="text-gray-700" />
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </button>
                </div>
            </div>
        </header>
    );
}
