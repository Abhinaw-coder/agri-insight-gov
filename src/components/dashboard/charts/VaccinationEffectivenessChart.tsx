import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface VaccinationEffectivenessChartProps {
  data: any[];
  title?: string;
}

export function VaccinationEffectivenessChart({ data, title = "Vaccination Effectiveness Analysis" }: VaccinationEffectivenessChartProps) {
  const chartData = data.map(item => ({
    x: item.vaccinationRate,
    y: item.mortalityRate,
    state: item.state,
    category: item.category,
    effectiveness: item.effectiveness,
    fill: item.category === 'High Coverage' ? 'hsl(142, 76%, 36%)' : 
          item.category === 'Medium Coverage' ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.state}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Vaccination Rate: <span className="font-medium">{data.x.toFixed(1)}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Mortality Rate: <span className="font-medium">{data.y.toFixed(2)}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Coverage: <span className="font-medium">{data.category}</span>
            </p>
            <p className="text-sm text-gray-600">
              Effectiveness: <span className="font-medium">{data.effectiveness.toFixed(1)}%</span>
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
        <p className="text-sm text-gray-600">
          Relationship between vaccination coverage and mortality rates
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Vaccination Rate"
                unit="%" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                domain={[0, 100]}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Mortality Rate"
                unit="%" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for benchmarks */}
              <ReferenceLine x={70} stroke="hsl(142, 76%, 36%)" strokeDasharray="5 5" opacity={0.6} />
              <ReferenceLine y={2} stroke="hsl(0, 84%, 60%)" strokeDasharray="5 5" opacity={0.6} />
              
              <Scatter 
                name="High Coverage" 
                data={chartData.filter(d => d.category === 'High Coverage')} 
                fill="hsl(142, 76%, 36%)"
              />
              <Scatter 
                name="Medium Coverage" 
                data={chartData.filter(d => d.category === 'Medium Coverage')} 
                fill="hsl(38, 92%, 50%)"
              />
              <Scatter 
                name="Low Coverage" 
                data={chartData.filter(d => d.category === 'Low Coverage')} 
                fill="hsl(0, 84%, 60%)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend explanations */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Vaccination target line (70%)
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Mortality threshold (2%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}