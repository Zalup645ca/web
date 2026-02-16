
import React from 'react';
import { Home, TrendingUp, CreditCard, User } from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'predictions', icon: TrendingUp, label: 'Signals' },
    { id: 'subscriptions', icon: CreditCard, label: 'Premium' },
    { id: 'dashboard', icon: User, label: 'Profile' }
  ];

  const handleTabClick = (id: string) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
    onNavigate(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-area-pb">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'tab-active' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
