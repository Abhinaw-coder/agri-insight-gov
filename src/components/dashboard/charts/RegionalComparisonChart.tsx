import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RegionalComparisonChartProps {
  data: any[];
  title?: string;
}

export function RegionalComparisonChart({ data, title = "Regional Comparison" }: RegionalComparisonChartProps) {
  const chartData = data.map(region => ({
    region: region.region.replace(' Region', ''),
    animals: region.totalAnimals,
    vaccinated: region.totalVaccinated,
    affected: region.totalAffected,
    vaccinationRate: region.vaccinationRate
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label} Region</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
              {entry.dataKey === 'vaccinationRate' ? '%' : ''}
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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="region" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="animals" 
                name="Total Animals"
                fill="hsl(217, 91%, 60%)" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="vaccinated" 
                name="Vaccinated"
                fill="hsl(142, 76%, 36%)" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="affected" 
                name="Affected by Disease"
                fill="hsl(0, 84%, 60%)" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}