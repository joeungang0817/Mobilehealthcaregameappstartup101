import { Home, Heart, ShoppingBag, Users } from 'lucide-react';

type NavigationProps = {
  currentPage: 'dashboard' | 'health' | 'shop' | 'community';
  onPageChange: (page: 'dashboard' | 'health' | 'shop' | 'community') => void;
};

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: '홈' },
    { id: 'health' as const, icon: Heart, label: '건강' },
    { id: 'shop' as const, icon: ShoppingBag, label: '상점' },
    { id: 'community' as const, icon: Users, label: '커뮤니티' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg backdrop-blur-lg bg-white/80 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
                isActive ? 'text-lime-600' : 'text-gray-400'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-lime-500 rounded-full" />
              )}
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-lime-100' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}