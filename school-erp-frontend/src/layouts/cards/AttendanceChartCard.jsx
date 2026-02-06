import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart2 } from "lucide-react";
import CardShell from "./CardShell.jsx";

export default function AttendanceChartCard({ data = [] }) {
  if (data.length === 0) {
    return (
      <CardShell title="Weekly Attendance" icon={BarChart2}>
        <p className="text-gray-500">No attendance data available</p>
      </CardShell>
    );
  }

  const chartData = data.map((d) => ({
    day: d.day,
    attendance: Math.round((d.present / d.total) * 100),
  }));

  return (
    <CardShell title="Weekly Attendance" icon={BarChart2}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line
              type="monotone"
              dataKey="attendance"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}
