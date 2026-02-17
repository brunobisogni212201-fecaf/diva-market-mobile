'use client';

import { 
  Package, 
  Heart, 
  Ticket, 
  MapPin, 
  CreditCard, 
  Settings, 
  Camera 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// DashboardCard Component
interface DashboardCardProps {
  icon: LucideIcon;
  label: string;
  notificationCount?: number;
}

function DashboardCard({ icon: Icon, label, notificationCount = 0 }: DashboardCardProps) {
  return (
    <div className="relative bg-white p-6 rounded-3xl shadow-sm">
      {notificationCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {notificationCount}
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-3">
        <div className="bg-pink-100 p-3 rounded-full">
          <Icon size={24} className="text-[#880E4F]" />
        </div>
        <span className="text-slate-900 font-medium text-sm">{label}</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const menuItems = [
    { icon: Package, label: 'Meus Pedidos', notificationCount: 3 },
    { icon: Heart, label: 'Favoritos', notificationCount: 12 },
    { icon: Ticket, label: 'Cupons', notificationCount: 2 },
    { icon: MapPin, label: 'Endereços' },
    { icon: CreditCard, label: 'Cartões' },
    { icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-pink-50 pb-24">
      {/* Header Section */}
      <div className="bg-white px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          {/* Logo/Back Button Placeholder */}
          <div className="w-8 h-8 bg-[#880E4F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          
          {/* Settings Icon */}
          <Settings size={24} className="text-slate-900" />
        </div>

        {/* Hero Profile Section */}
        <div className="flex flex-col items-center space-y-4 pb-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative">
            <div className="h-24 w-24 bg-[#880E4F] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">MC</span>
            </div>
            <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2">
              <Camera size={16} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-2">
            <h1 className="text-slate-900 text-xl font-bold">Maria Clara</h1>
            <p className="text-slate-500 text-sm">maria.clara@email.com</p>
            
            {/* Gold Badge */}
            <div className="inline-flex items-center bg-yellow-400 text-white px-4 py-2 rounded-full">
              <span className="text-sm font-medium">✨ Cliente Gold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <DashboardCard
              key={index}
              icon={item.icon}
              label={item.label}
              notificationCount={item.notificationCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
