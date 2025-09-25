import { useState, useEffect } from 'react';
import ConverterScreen from '@/components/ConverterScreen';
import ConversionScreen from '@/components/ConversionScreen';
import HistoryScreen from '@/components/HistoryScreen';
import BottomNavigation from '@/components/BottomNavigation';
import { type ConversionResult } from '@/utils/numberConverter';

type ActiveTab = 'converter' | 'conversion' | 'history';

export default function NumberConverterApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('converter');
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ConversionResult | null>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('numberConverterHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setConversionHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to load conversion history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('numberConverterHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]);

  const handleConvert = (result: ConversionResult) => {
    setCurrentResult(result);
    setConversionHistory(prev => [result, ...prev.slice(0, 99)]); // Keep only last 100 conversions
    setActiveTab('conversion');
  };

  const handleSelectHistoryResult = (result: ConversionResult) => {
    setCurrentResult(result);
    setActiveTab('conversion');
  };

  const handleClearHistory = () => {
    setConversionHistory([]);
    if (activeTab === 'conversion') {
      setCurrentResult(null);
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'converter':
        return <ConverterScreen onConvert={handleConvert} />;
      case 'conversion':
        return <ConversionScreen result={currentResult} />;
      case 'history':
        return (
          <HistoryScreen 
            history={conversionHistory}
            onSelectResult={handleSelectHistoryResult}
            onClearHistory={handleClearHistory}
          />
        );
      default:
        return <ConverterScreen onConvert={handleConvert} />;
    }
  };

  return (
    <div className="mobile-container app-gradient">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
}