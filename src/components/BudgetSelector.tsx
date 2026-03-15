import { budgetOptions, formatCurrency } from '@/data/eventData';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  onSelect: (budget: number) => void;
}

const budgetDescriptions: Record<number, string> = {
  10000: 'Simple & Sweet',
  25000: 'Comfortable',
  50000: 'Grand Celebration',
  100000: 'Premium Experience',
  200000: 'Luxury & Lavish',
};

const BudgetSelector = ({ onSelect }: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Set Your Budget</h2>
        <p className="text-muted-foreground">Choose a budget range that works for you</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {budgetOptions.map((budget) => (
          <Card
            key={budget}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-primary/50 group"
            onClick={() => onSelect(budget)}
          >
            <CardContent className="p-6 text-center space-y-2">
              <span className="text-3xl font-bold text-primary">{formatCurrency(budget)}</span>
              <p className="text-sm text-muted-foreground font-medium">{budgetDescriptions[budget]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BudgetSelector;
