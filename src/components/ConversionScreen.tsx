import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatSystemLabel, type ConversionResult } from '@/utils/numberConverter';

interface ConversionScreenProps {
  result: ConversionResult | null;
}

export default function ConversionScreen({ result }: ConversionScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  if (!result) {
    return (
      <div className="flex-1 p-6 pb-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Conversion Result</h1>
          <div className="converter-card">
            <p className="text-muted-foreground">
              No conversion result to display. Convert a number first!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${formatSystemLabel(field as any)} value copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resultFields = [
    { key: 'binary', label: 'Binary', value: result.results.binary, prefix: '' },
    { key: 'decimal', label: 'Decimal', value: result.results.decimal, prefix: '' },
    { key: 'octal', label: 'Octal', value: result.results.octal, prefix: '0' },
    { key: 'hexadecimal', label: 'Hexadecimal', value: result.results.hexadecimal, prefix: '0x' },
  ];

  return (
    <div className="flex-1 p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Conversion Result</h1>
          <p className="text-white/80 mt-2">
            Converted on {result.timestamp.toLocaleString()}
          </p>
        </div>

        {/* Input Information */}
        <div className="converter-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground">Input</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formatSystemLabel(result.inputSystem)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-mono text-card-foreground">{result.input}</p>
            </div>
          </div>
        </div>

        {/* Conversion Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">All Conversions</h2>
          
          {resultFields.map((field) => (
            <div key={field.key} className="converter-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{field.label}</h3>
                  <p className="text-xl font-mono text-card-foreground mt-2 break-all">
                    {field.prefix}{field.value}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(field.prefix + field.value, field.key)}
                  className="ml-3 text-card-foreground hover:bg-secondary"
                >
                  {copiedField === field.key ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="converter-card">
          <h3 className="font-semibold text-card-foreground mb-2">Conversion Details</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Decimal value: {result.results.decimal}</p>
            <p>• Binary digits: {result.results.binary.length}</p>
            <p>• Hexadecimal: 0x{result.results.hexadecimal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}