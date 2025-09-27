import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";
import { RiskLevelIndicator } from "./RiskLevelIndicator";

interface Alert {
  id: string;
  type: 'outbreak' | 'vaccination' | 'mortality' | 'general';
  title: string;
  description: string;
  region: string;
  timestamp: Date;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'outbreak':
        return AlertTriangle;
      case 'vaccination':
        return Shield;
      case 'mortality':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'outbreak':
        return 'bg-red-100 text-red-700';
      case 'vaccination':
        return 'bg-blue-100 text-blue-700';
      case 'mortality':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const sortedAlerts = alerts
    .sort((a, b) => {
      const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    })
    .slice(0, 5);

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Active Alerts</span>
          <Badge variant="secondary" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p>No active alerts</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type);
            return (
              <div key={alert.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-md ${getAlertTypeColor(alert.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <RiskLevelIndicator level={alert.severity} size="sm" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.region}
                  </Badge>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="capitalize">{alert.type.replace('_', ' ')} Alert</span>
                  <span>{alert.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            );
          })
        )}
        
        {alerts.length > 5 && (
          <div className="text-center pt-2 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all {alerts.length} alerts →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}