"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  CalendarDays, 
  Wallet, 
  Settings, 
  Menu 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Attendance', icon: <UserCircle size={20} />, active: false },
    { name: 'Time off', icon: <CalendarDays size={20} />, active: false },
  ];

  return (
    <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col fixed h-full transition-all duration-300">
      {/* Brand / Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rotate-45 rounded-sm"></div>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Dayflow</span>
      </div>

      {/* Menu Toggle for Mobile (Visual only for now) */}
      <div className="px-6 mb-4 lg:hidden">
        <Menu size={24} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              item.active 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={item.active ? 'text-white' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Optional: User Footer in Sidebar */}
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600"></div>
          <div className="text-xs">
            <p className="text-white font-semibold">Sarah Jenkins</p>
            <p className="text-slate-500 italic">Employee</p>
          </div>
        </div>
      </div>
    </aside>
  );
}