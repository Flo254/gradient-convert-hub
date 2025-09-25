import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { convertNumber, validateInput, numberSystems, type NumberSystem, type ConversionResult } from '@/utils/numberConverter';
import { ArrowDown } from 'lucide-react';

interface ConverterScreenProps {
  onConvert: (result: ConversionResult) => void;
}

export default function ConverterScreen({ onConvert }: ConverterScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputSystem, setInputSystem] = useState<NumberSystem>('decimal');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a number to convert.",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput(inputValue, inputSystem)) {
      toast({
        title: "Invalid Input",
        description: `Please enter a valid ${inputSystem} number.`,
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    try {
      const result = convertNumber(inputValue, inputSystem);
      onConvert(result);
      
      toast({
        title: "Conversion Complete!",
        description: "Your number has been converted successfully.",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <div className="flex-1 p-6 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Number Converter</h1>
          <p className="text-white/80">Convert between different number systems</p>
        </div>

        {/* Input Section */}
        <div className="converter-card space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Select Input Number System
            </label>
            <Select value={inputSystem} onValueChange={(value: NumberSystem) => setInputSystem(value)}>
              <SelectTrigger className="bg-input border-input-border text-input-foreground focus:border-input-focus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {numberSystems.map((system) => (
                  <SelectItem 
                    key={system.value} 
                    value={system.value}
                    className="text-popover-foreground hover:bg-secondary"
                  >
                    {system.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Enter Number
            </label>
            <Input
              type="text"
              placeholder={`Enter ${inputSystem} number...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-input border-input-border text-input-foreground placeholder:text-muted-foreground focus:border-input-focus text-lg"
            />
          </div>

          {/* Convert Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-16 h-16 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all duration-200 hover:scale-105"
            >
              {isConverting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : (
                <ArrowDown size={24} />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="converter-card">
          <h3 className="font-semibold text-card-foreground mb-3">Number System Guide</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong className="text-card-foreground">Binary:</strong> Uses digits 0-1 (e.g., 1010)</div>
            <div><strong className="text-card-foreground">Decimal:</strong> Uses digits 0-9 (e.g., 42)</div>
            <div><strong className="text-card-foreground">Octal:</strong> Uses digits 0-7 (e.g., 52)</div>
            <div><strong className="text-card-foreground">Hexadecimal:</strong> Uses 0-9, A-F (e.g., 2A)</div>
          </div>
        </div>
      </div>
    </div>
  );
}