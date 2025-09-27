import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendAnalysisChartProps {
  data: any[];
  title?: string;
}

export function TrendAnalysisChart({ data, title = "Trend Analysis" }: TrendAnalysisChartProps) {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    affected: item.totalAffected,
    deaths: item.totalDeaths,
    riskScore: item.avgRisk * 25, // Scale risk to 0-100
    mortalityRate: item.totalAffected > 0 ? ((item.totalDeaths / item.totalAffected) * 100).toFixed(1) : 0
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'mortalityRate' || entry.dataKey === 'riskScore' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="affected" 
                name="Animals Affected"
                stroke="hsl(38, 92%, 50%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(38, 92%, 50%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(38, 92%, 50%)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="deaths" 
                name="Deaths"
                stroke="hsl(0, 84%, 60%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(0, 84%, 60%)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="riskScore" 
                name="Risk Score (%)"
                stroke="hsl(271, 81%, 56%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(271, 81%, 56%)', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}