import { Card, CardContent, CardHeader, CardTitle } from './card.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 52000, expense: 38000 },
  { month: 'Mar', income: 48000, expense: 35000 },
  { month: 'Apr', income: 61000, expense: 42000 },
  { month: 'May', income: 55000, expense: 38000 },
  { month: 'Jun', income: 67000, expense: 45000 },
];

export function IncomeExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
      </CardHeader>

      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="income" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#EF4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
