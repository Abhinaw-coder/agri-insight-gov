import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatewiseAnalysisChartProps {
  data: any[];
  title?: string;
}

export function StatewiseAnalysisChart({ data, title = "State-wise Performance Analysis" }: StatewiseAnalysisChartProps) {
  const chartData = data.slice(0, 15).map(state => ({
    state: state.state.length > 10 ? state.state.substring(0, 8) + '...' : state.state,
    fullState: state.state,
    totalAnimals: state.totalAnimals,
    vaccinationRate: state.vaccinationRate,
    mortalityRate: state.mortalityRate,
    affectedRate: state.affectedRate
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const stateData = chartData.find(s => s.state === label);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{stateData?.fullState}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Total Animals: <span className="font-medium">{stateData?.totalAnimals.toLocaleString()}</span>
            </p>
            <p className="text-sm text-green-600">
              Vaccination Rate: <span className="font-medium">{stateData?.vaccinationRate.toFixed(1)}%</span>
            </p>
            <p className="text-sm text-red-600">
              Mortality Rate: <span className="font-medium">{stateData?.mortalityRate.toFixed(2)}%</span>
            </p>
            <p className="text-sm text-orange-600">
              Affected Rate: <span className="font-medium">{stateData?.affectedRate.toFixed(2)}%</span>
            </p>
          </div>
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
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="state" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#666' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="totalAnimals" 
                name="Total Animals"
                fill="hsl(217, 91%, 60%)" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="vaccinationRate" 
                name="Vaccination Rate (%)"
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={3}
                dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="mortalityRate" 
                name="Mortality Rate (%)"
                stroke="hsl(0, 84%, 60%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 2, r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}