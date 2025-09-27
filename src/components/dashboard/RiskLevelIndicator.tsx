import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskLevelIndicatorProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskLevelIndicator({ level, size = 'md', showIcon = true }: RiskLevelIndicatorProps) {
  const getRiskConfig = () => {
    switch (level) {
      case 'Critical':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-500'
        };
      case 'High':
        return {
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          dotColor: 'bg-orange-500'
        };
      case 'Medium':
        return {
          icon: AlertCircle,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
      case 'Low':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-500'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-2';
      default:
        return 'text-sm px-2.5 py-1.5';
    }
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "font-medium border",
        config.className,
        getSizeClasses()
      )}
    >
      <div className="flex items-center space-x-1.5">
        {showIcon && (
          <Icon className={cn(
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          )} />
        )}
        <span>{level} Risk</span>
        <div className={cn(
          "rounded-full animate-pulse",
          config.dotColor,
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
        )} />
      </div>
    </Badge>
  );
}