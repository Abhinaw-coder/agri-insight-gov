import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EconomicImpactChartProps {
  data: any[];
  title?: string;
}

export function EconomicImpactChart({ data, title = "Economic Impact Analysis" }: EconomicImpactChartProps) {
  const chartData = data.slice(0, 30).map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    economicLoss: item.economicLoss / 1000000, // Convert to millions
    vaccinationInvestment: item.vaccinationInvestment / 1000000,
    lossPreventedValue: item.lossPreventedValue / 1000000,
    netBenefit: item.netBenefit / 1000000,
    roi: item.roi
  })).reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)} {entry.name !== 'ROI' ? 'Cr' : '%'}
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
        <p className="text-sm text-gray-600">
          Financial impact of animal health measures (in Crores INR)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `₹${value.toFixed(1)}Cr`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="economicLoss"
                name="Economic Loss"
                stackId="1"
                stroke="hsl(0, 84%, 60%)"
                fill="hsl(0, 84%, 60%)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="vaccinationInvestment"
                name="Vaccination Investment"
                stackId="2"
                stroke="hsl(38, 92%, 50%)"
                fill="hsl(38, 92%, 50%)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="lossPreventedValue"
                name="Loss Prevented"
                stackId="3"
                stroke="hsl(142, 76%, 36%)"
                fill="hsl(142, 76%, 36%)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary metrics */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-600 font-medium">Total Economic Loss</p>
            <p className="text-lg font-bold text-red-700">
              ₹{chartData.reduce((sum, item) => sum + item.economicLoss, 0).toFixed(1)}Cr
            </p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-600 font-medium">Vaccination Investment</p>
            <p className="text-lg font-bold text-yellow-700">
              ₹{chartData.reduce((sum, item) => sum + item.vaccinationInvestment, 0).toFixed(1)}Cr
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 font-medium">Loss Prevented</p>
            <p className="text-lg font-bold text-green-700">
              ₹{chartData.reduce((sum, item) => sum + item.lossPreventedValue, 0).toFixed(1)}Cr
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}