import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RegionFilter } from "@/components/dashboard/RegionFilter";
import { RiskLevelIndicator } from "@/components/dashboard/RiskLevelIndicator";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { DataTable } from "@/components/dashboard/DataTable";
import { VaccinationChart } from "@/components/dashboard/charts/VaccinationChart";
import { DiseaseBreakdownChart } from "@/components/dashboard/charts/DiseaseBreakdownChart";
import { RegionalComparisonChart } from "@/components/dashboard/charts/RegionalComparisonChart";
import { TrendAnalysisChart } from "@/components/dashboard/charts/TrendAnalysisChart";
import { StatewiseAnalysisChart } from "@/components/dashboard/charts/StatewiseAnalysisChart";
import { VaccinationEffectivenessChart } from "@/components/dashboard/charts/VaccinationEffectivenessChart";
import { EconomicImpactChart } from "@/components/dashboard/charts/EconomicImpactChart";
import { 
  mockData, 
  getRegionalSummary, 
  getDiseaseAnalytics, 
  getTimeSeriesData,
  getStatewiseAnalytics,
  getVaccinationEffectiveness,
  getEconomicImpact,
  getTopPerformingStates,
  regions,
  states,
  getRegionFromState
} from "@/data/mockData";
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  BarChart3
} from "lucide-react";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  // Filter data based on selected region/state
  const filteredData = useMemo(() => {
    if (selectedRegion === "all") return mockData;
    
    // Check if it's a region or state
    if (regions.includes(selectedRegion)) {
      // Filter by region - get all states in that region
      const regionStates = states.filter(state => getRegionFromState(state) === selectedRegion);
      return mockData.filter(item => regionStates.includes(item.region));
    } else {
      // Filter by specific state
      return mockData.filter(item => item.region === selectedRegion);
    }
  }, [selectedRegion]);

  // Calculate analytics
  const regionalSummary = useMemo(() => getRegionalSummary(mockData), []);
  const statewiseAnalytics = useMemo(() => getStatewiseAnalytics(filteredData), [filteredData]);
  const diseaseAnalytics = useMemo(() => getDiseaseAnalytics(filteredData), [filteredData]);
  const timeSeriesData = useMemo(() => getTimeSeriesData(filteredData), [filteredData]);
  const vaccinationEffectiveness = useMemo(() => getVaccinationEffectiveness(filteredData), [filteredData]);
  const economicImpact = useMemo(() => getEconomicImpact(filteredData), [filteredData]);
  const topPerformingStates = useMemo(() => getTopPerformingStates(mockData), []);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const isStateFilter = states.includes(selectedRegion);
    const isRegionFilter = regions.includes(selectedRegion);
    
    let relevantData = filteredData;
    if (selectedRegion === "all") {
      // For "all", take latest data from each state
      relevantData = filteredData.slice(0, states.length);
    } else if (isRegionFilter) {
      // For region, take latest data from each state in that region
      const regionStates = states.filter(state => getRegionFromState(state) === selectedRegion);
      relevantData = filteredData.slice(0, regionStates.length);
    } else if (isStateFilter) {
      // For state, take just that state's latest data
      relevantData = filteredData.slice(0, 1);
    }
    
    const totalAnimals = relevantData.reduce((sum, item) => sum + item.totalAnimals, 0);
    const totalVaccinated = relevantData.reduce((sum, item) => sum + item.totalAnimalsVaccinated, 0);
    const totalAffected = diseaseAnalytics.reduce((sum, disease) => sum + disease.affected, 0);
    const totalDeaths = diseaseAnalytics.reduce((sum, disease) => sum + disease.deaths, 0);
    
    const vaccinationRate = totalAnimals > 0 ? (totalVaccinated / totalAnimals) * 100 : 0;
    const affectedRate = totalAnimals > 0 ? (totalAffected / totalAnimals) * 100 : 0;
    const mortalityRate = totalAffected > 0 ? (totalDeaths / totalAffected) * 100 : 0;
    
    // Calculate high risk areas based on filter type
    let highRiskCount = 0;
    if (selectedRegion === "all") {
      highRiskCount = regionalSummary.filter(region => 
        region.riskLevel === 'High' || region.riskLevel === 'Critical'
      ).length;
    } else if (isRegionFilter) {
      highRiskCount = statewiseAnalytics.filter(state => 
        state.riskLevel === 'High' || state.riskLevel === 'Critical'
      ).length;
    } else {
      highRiskCount = statewiseAnalytics.filter(state => 
        state.riskLevel === 'High' || state.riskLevel === 'Critical'
      ).length;
    }

    return {
      totalAnimals,
      totalVaccinated,
      totalAffected,
      totalDeaths,
      vaccinationRate,
      affectedRate,
      mortalityRate,
      highRiskAreas: highRiskCount,
      activeOutbreaks: diseaseAnalytics.length,
      filterType: selectedRegion === "all" ? "regions" : isRegionFilter ? "states" : "single state"
    };
  }, [filteredData, diseaseAnalytics, regionalSummary, statewiseAnalytics, selectedRegion]);

  // Generate mock alerts
  const mockAlerts = useMemo(() => {
    const alerts: any[] = [];
    
    // High mortality rate alerts
    diseaseAnalytics.slice(0, 3).forEach(disease => {
      if (disease.mortalityRate > 10) {
        alerts.push({
          id: `alert-${disease.name}`,
          type: 'mortality',
          title: `High Mortality Rate: ${disease.name}`,
          description: `Mortality rate of ${disease.mortalityRate.toFixed(1)}% detected across affected farms`,
          region: selectedRegion === 'all' ? 'Multiple Regions' : selectedRegion,
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          severity: disease.mortalityRate > 20 ? 'Critical' : 'High'
        });
      }
    });

    // Low vaccination rate alerts
    if (overviewStats.vaccinationRate < 70) {
      alerts.push({
        id: 'alert-vaccination',
        type: 'vaccination',
        title: 'Low Vaccination Coverage',
        description: `Current vaccination rate of ${overviewStats.vaccinationRate.toFixed(1)}% is below target threshold`,
        region: selectedRegion === 'all' ? 'Multiple Regions' : selectedRegion,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        severity: overviewStats.vaccinationRate < 50 ? 'High' : 'Medium'
      });
    }

    // Outbreak alerts
    if (diseaseAnalytics.length > 0) {
      const topDisease = diseaseAnalytics[0];
      alerts.push({
        id: 'alert-outbreak',
        type: 'outbreak',
        title: `Active Outbreak: ${topDisease.name}`,
        description: `${topDisease.affected.toLocaleString()} animals affected with ${topDisease.occurrences} reported cases`,
        region: selectedRegion === 'all' ? 'Multiple Regions' : selectedRegion,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        severity: topDisease.affected > 1000 ? 'Critical' : 'High'
      });
    }

    return alerts;
  }, [diseaseAnalytics, overviewStats, selectedRegion]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Animal Health Dashboard</h1>
                <p className="text-sm text-gray-500">Government Monitoring System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <RegionFilter 
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
              />
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Animals"
            value={overviewStats.totalAnimals}
            icon={Users}
            variant="default"
            description="Across all monitored farms"
          />
          <StatCard
            title="Vaccination Rate"
            value={`${overviewStats.vaccinationRate.toFixed(1)}%`}
            icon={Shield}
            variant={overviewStats.vaccinationRate > 80 ? "success" : overviewStats.vaccinationRate > 60 ? "warning" : "danger"}
            change={Math.floor(Math.random() * 10) - 5}
            changeType={overviewStats.vaccinationRate > 75 ? "increase" : "decrease"}
          />
          <StatCard
            title="Animals Affected"
            value={overviewStats.totalAffected}
            icon={AlertTriangle}
            variant="warning"
            badge={`${overviewStats.affectedRate.toFixed(2)}%`}
          />
          <StatCard
            title={overviewStats.filterType === "single state" ? "High Risk Areas" : 
                   overviewStats.filterType === "states" ? "High Risk States" : "High Risk Regions"}
            value={overviewStats.highRiskAreas}
            icon={MapPin}
            variant={overviewStats.highRiskAreas > 2 ? "danger" : "success"}
            description={overviewStats.filterType === "single state" ? "In selected state" :
                        overviewStats.filterType === "states" ? `Out of ${statewiseAnalytics.length} states` :
                        `Out of ${regions.length} regions`}
          />
        </div>

        {/* Advanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VaccinationChart data={timeSeriesData} />
          <DiseaseBreakdownChart data={diseaseAnalytics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendAnalysisChart data={timeSeriesData} />
          <VaccinationEffectivenessChart data={vaccinationEffectiveness} />
        </div>

        {/* State-wise Analysis */}
        {(selectedRegion === "all" || regions.includes(selectedRegion)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatewiseAnalysisChart data={statewiseAnalytics} />
            <EconomicImpactChart data={economicImpact} />
          </div>
        )}

        {/* Regional Comparison - only show when viewing all regions */}
        {selectedRegion === "all" && (
          <div className="mb-8">
            <RegionalComparisonChart data={regionalSummary} />
          </div>
        )}

        {/* Alerts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AlertsPanel alerts={mockAlerts} />
          </div>
          <div className="lg:col-span-2">
            <DataTable 
              data={selectedRegion === "all" || regions.includes(selectedRegion) ? statewiseAnalytics : regionalSummary} 
              title={selectedRegion === "all" || regions.includes(selectedRegion) ? "State-wise Overview" : "Regional Overview"} 
              type={selectedRegion === "all" || regions.includes(selectedRegion) ? "statewise" : "regional"} 
            />
          </div>
        </div>

        {/* Disease Analytics Table */}
        <div className="mb-8">
          <DataTable 
            data={diseaseAnalytics} 
            title="Disease Impact Analysis" 
            type="disease" 
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Government Animal Health Monitoring System • Real-time data from {regions.length} regions</p>
          <p className="mt-1">For emergency situations, contact the veterinary response team immediately</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
