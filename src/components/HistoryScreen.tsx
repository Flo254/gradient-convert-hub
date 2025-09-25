import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatSystemLabel, type ConversionResult } from '@/utils/numberConverter';

interface HistoryScreenProps {
  history: ConversionResult[];
  onSelectResult: (result: ConversionResult) => void;
  onClearHistory: () => void;
}

export default function HistoryScreen({ history, onSelectResult, onClearHistory }: HistoryScreenProps) {
  if (history.length === 0) {
    return (
      <div className="flex-1 p-6 pb-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Conversion History</h1>
          
          <div className="converter-card text-center">
            <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-card-foreground mb-2">No History Yet</h3>
            <p className="text-muted-foreground">
              Your conversion history will appear here after you perform some conversions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">History</h1>
            <p className="text-white/80">{history.length} conversion{history.length !== 1 ? 's' : ''}</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Trash2 size={16} className="mr-2" />
            Clear
          </Button>
        </div>

        {/* History List */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {history.slice().reverse().map((result) => (
              <button
                key={result.id}
                onClick={() => onSelectResult(result)}
                className="w-full text-left converter-card hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-card-foreground">
                        {formatSystemLabel(result.inputSystem)}
                      </span>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span className="text-xs text-muted-foreground">All Systems</span>
                    </div>
                    
                    <div className="font-mono text-lg text-card-foreground mb-2">
                      {result.input}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Dec: {result.results.decimal}</div>
                      <div>Hex: {result.results.hexadecimal}</div>
                      <div>Bin: {result.results.binary.length > 8 ? 
                        result.results.binary.substring(0, 8) + '...' : 
                        result.results.binary}
                      </div>
                      <div>Oct: {result.results.octal}</div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-muted-foreground">
                    <Clock size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}