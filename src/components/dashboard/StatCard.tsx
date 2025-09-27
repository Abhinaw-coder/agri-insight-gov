import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  badge?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon, 
  description,
  variant = 'default',
  badge
}: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'warning':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'danger':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getChangeStyles = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className={cn(
      "dashboard-card transition-all duration-300 hover:shadow-md",
      getVariantStyles()
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          getIconStyles()
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1 mt-1">
            <Badge 
              variant="secondary" 
              className={cn("text-xs px-2 py-1", getChangeStyles())}
            >
              {change > 0 ? '+' : ''}{change}%
            </Badge>
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}