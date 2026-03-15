import { useState } from 'react';
import { ThemeType, getScaledItems, formatCurrency } from '@/data/eventData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, ExternalLink, ArrowRight, CheckCircle, PartyPopper } from 'lucide-react';
import BudgetBreakdown from './BudgetBreakdown';

interface Props {
  theme: ThemeType;
  budget: number;
  eventLabel: string;
  onReset: () => void;
}

const ProductShowcase = ({ theme, budget, eventLabel, onReset }: Props) => {
  const items = getScaledItems(theme, budget);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedAll, setViewedAll] = useState(false);

  const isLast = currentIndex === items.length - 1;
  const item = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;
  const totalCost = items.reduce((sum, i) => sum + i.scaledCost, 0);

  const handleNext = () => {
    if (isLast) {
      setViewedAll(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (viewedAll) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <span className="text-5xl block">🎉</span>
          <h2 className="text-3xl font-bold">Your {eventLabel} Plan is Ready!</h2>
          <p className="text-muted-foreground">
            Total Decoration Cost: <span className="font-bold text-primary">{formatCurrency(totalCost)}</span>
          </p>
        </div>

        {/* All items summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">📋 All Items Summary</h3>
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(it.scaledCost)}</p>
                  </div>
                  <a href={it.amazonUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1">
                      <ShoppingCart className="h-3 w-3" /> Buy
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <BudgetBreakdown budget={budget} />

        <div className="text-center">
          <Button onClick={onReset} size="lg" className="gap-2">
            <CheckCircle className="h-5 w-5" /> Proceed to Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Decoration Items</h2>
        <p className="text-muted-foreground">
          Item {currentIndex + 1} of {items.length}
        </p>
        <Progress value={progress} className="h-2 max-w-xs mx-auto" />
      </div>

      <Card className="overflow-hidden animate-in slide-in-from-right-5 duration-300" key={currentIndex}>
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <p className="text-3xl font-bold text-primary">{formatCurrency(item.scaledCost)}</p>
            <p className="text-sm text-muted-foreground">Estimated cost</p>
          </div>
          <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button variant="outline" size="lg" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Buy on Amazon
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleNext} size="lg" className="gap-2">
          {isLast ? (
            <>
              <CheckCircle className="h-5 w-5" /> View Full Summary
            </>
          ) : (
            <>
              Next Item <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductShowcase;
