import { Calculator, FileText, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: 'converter' | 'conversion' | 'history';
  onTabChange: (tab: 'converter' | 'conversion' | 'history') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'converter' as const, label: 'Converter', icon: Calculator },
    { id: 'conversion' as const, label: 'Conversion', icon: FileText },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-app-gradient-start to-app-gradient-end border-t border-white/20">
      <div className="flex justify-around items-center h-16 px-4 safe-area-inset-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 py-2 transition-all duration-200",
                "text-white/70 hover:text-white",
                isActive && "text-white"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}