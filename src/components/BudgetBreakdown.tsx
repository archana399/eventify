import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/data/eventData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  budget: number;
}

const COLORS = ['hsl(340, 65%, 47%)', 'hsl(36, 80%, 55%)', 'hsl(200, 60%, 50%)'];

const BudgetBreakdown = ({ budget }: Props) => {
  const data = [
    { name: 'Decoration', value: Math.round(budget * 0.5), percent: '50%' },
    { name: 'Food & Catering', value: Math.round(budget * 0.3), percent: '30%' },
    { name: 'Services & Misc', value: Math.round(budget * 0.2), percent: '20%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{formatCurrency(item.value)}</span>
                  <span className="text-muted-foreground text-sm ml-2">({item.percent})</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-bold">Total Budget</span>
              <span className="font-bold text-primary">{formatCurrency(budget)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetBreakdown;
