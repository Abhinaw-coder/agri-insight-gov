import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RiskLevelIndicator } from "./RiskLevelIndicator";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataTableProps {
  data: any[];
  title?: string;
  type?: 'regional' | 'disease' | 'timeline';
}

export function DataTable({ data, title = "Data Overview", type = 'regional' }: DataTableProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const renderRegionalTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Region</TableHead>
          <TableHead className="text-right">Total Animals</TableHead>
          <TableHead className="text-right">Vaccinated</TableHead>
          <TableHead className="text-right">Vaccination Rate</TableHead>
          <TableHead className="text-right">Affected</TableHead>
          <TableHead className="text-center">Risk Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{row.region}</TableCell>
            <TableCell className="text-right">{row.totalAnimals.toLocaleString()}</TableCell>
            <TableCell className="text-right">{row.totalVaccinated.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                <span>{row.vaccinationRate.toFixed(1)}%</span>
                <div className={`h-2 w-12 rounded-full bg-gray-200 overflow-hidden`}>
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${Math.min(row.vaccinationRate, 100)}%` }}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right text-red-600 font-medium">
              {row.totalAffected.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              <RiskLevelIndicator level={row.riskLevel} size="sm" showIcon={false} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderDiseaseTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Disease</TableHead>
          <TableHead className="text-right">Animals Affected</TableHead>
          <TableHead className="text-right">Deaths</TableHead>
          <TableHead className="text-right">Mortality Rate</TableHead>
          <TableHead className="text-right">Occurrences</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 10).map((row, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="text-right">{row.affected.toLocaleString()}</TableCell>
            <TableCell className="text-right text-red-600">{row.deaths.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <Badge 
                variant="secondary" 
                className={
                  row.mortalityRate > 15 ? 'bg-red-100 text-red-700' :
                  row.mortalityRate > 5 ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }
              >
                {row.mortalityRate.toFixed(1)}%
              </Badge>
            </TableCell>
            <TableCell className="text-right">{row.occurrences}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTable = () => {
    switch (type) {
      case 'disease':
        return renderDiseaseTable();
      case 'regional':
      default:
        return renderRegionalTable();
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {renderTable()}
        </div>
        {data.length > 10 && type === 'disease' && (
          <div className="text-center pt-4 border-t border-gray-200 mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all diseases →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}