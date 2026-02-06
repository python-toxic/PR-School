import { Card, CardContent, CardHeader, CardTitle } from './card.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Present', value: 1245, color: '#10B981' },
  { name: 'Absent', value: 89, color: '#EF4444' },
  { name: 'On Leave', value: 56, color: '#F59E0B' },
];

export function AttendancePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-green-600">1,245</p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-red-600">89</p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-orange-600">56</p>
            <p className="text-xs text-gray-500">On Leave</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
