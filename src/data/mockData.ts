// Mock data based on the provided schema for government dashboard

export interface DiseaseSummary {
  name: string;
  noOfAnimals: number;
  noOfAnimalsDied: number;
}

export interface SummaryData {
  id: string;
  totalAnimals: number;
  totalAnimalsVaccinated: number;
  diseases: DiseaseSummary[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: Date;
  region: string;
}

// Indian states mapped to regions
export const states = [
  // North Region
  'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Delhi', 'Chandigarh',
  // South Region  
  'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Puducherry',
  // East Region
  'West Bengal', 'Odisha', 'Jharkhand', 'Bihar',
  // West Region
  'Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Daman and Diu',
  // Central Region
  'Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh',
  // Northeast Region
  'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'
];

// Function to map states to regions
export const getRegionFromState = (state: string): string => {
  const regionMapping: { [key: string]: string[] } = {
    'North Region': ['Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Delhi', 'Chandigarh'],
    'South Region': ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Puducherry'],
    'East Region': ['West Bengal', 'Odisha', 'Jharkhand', 'Bihar'],
    'West Region': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Daman and Diu'],
    'Central Region': ['Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh'],
    'Northeast Region': ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim']
  };
  
  for (const [region, stateList] of Object.entries(regionMapping)) {
    if (stateList.includes(state)) {
      return region;
    }
  }
  return 'Unknown Region';
};

export const regions = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region', 'Northeast Region'];

// Disease types commonly found in livestock
export const diseaseTypes = [
  'Avian Influenza', 'Newcastle Disease', 'Foot and Mouth Disease', 
  'African Swine Fever', 'Bluetongue', 'Brucellosis', 'Tuberculosis',
  'Anthrax', 'Salmonella', 'E. coli'
];

// Generate mock data for the last 30 days
export const generateMockData = (): SummaryData[] => {
  const data: SummaryData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    for (const state of states) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate diseases for this entry
      const numDiseases = Math.floor(Math.random() * 4) + 1;
      const diseases: DiseaseSummary[] = [];
      
      for (let j = 0; j < numDiseases; j++) {
        const diseaseName = diseaseTypes[Math.floor(Math.random() * diseaseTypes.length)];
        const affected = Math.floor(Math.random() * 500) + 10;
        const died = Math.floor(affected * (Math.random() * 0.3)); // 0-30% mortality
        
        diseases.push({
          name: diseaseName,
          noOfAnimals: affected,
          noOfAnimalsDied: died
        });
      }
      
      const totalAnimals = Math.floor(Math.random() * 10000) + 5000;
      const totalVaccinated = Math.floor(totalAnimals * (0.4 + Math.random() * 0.5)); // 40-90% vaccinated
      
      // Calculate risk level based on disease impact
      const totalAffected = diseases.reduce((sum, disease) => sum + disease.noOfAnimals, 0);
      const totalDeaths = diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
      const affectedRatio = totalAffected / totalAnimals;
      const mortalityRatio = totalDeaths / totalAnimals;
      
      let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (mortalityRatio > 0.05 || affectedRatio > 0.3) riskLevel = 'Critical';
      else if (mortalityRatio > 0.02 || affectedRatio > 0.15) riskLevel = 'High';
      else if (mortalityRatio > 0.01 || affectedRatio > 0.05) riskLevel = 'Medium';
      
      data.push({
        id: `${state.replace(' ', '_').toLowerCase()}_${date.toISOString().split('T')[0]}_${Math.random().toString(36).substr(2, 9)}`,
        totalAnimals,
        totalAnimalsVaccinated: totalVaccinated,
        diseases,
        riskLevel,
        timestamp: date,
        region: state
      });
    }
  }
  
  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Analytics helper functions
export const getRegionalSummary = (data: SummaryData[]) => {
  const regionalData = regions.map(region => {
    const regionStates = states.filter(state => getRegionFromState(state) === region);
    const regionData = data.filter(item => regionStates.includes(item.region));
    const latest = regionData[0];
    
    const totalAnimals = regionData.reduce((sum, item) => sum + item.totalAnimals, 0);
    const totalVaccinated = regionData.reduce((sum, item) => sum + item.totalAnimalsVaccinated, 0);
    const totalAffected = regionData.reduce((sum, item) => 
      sum + item.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.noOfAnimals, 0), 0
    );
    const totalDeaths = regionData.reduce((sum, item) => 
      sum + item.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.noOfAnimalsDied, 0), 0
    );
    
    return {
      region,
      totalAnimals: latest?.totalAnimals || 0,
      totalVaccinated: latest?.totalAnimalsVaccinated || 0,
      totalAffected,
      totalDeaths,
      vaccinationRate: latest ? (latest.totalAnimalsVaccinated / latest.totalAnimals) * 100 : 0,
      mortalityRate: totalAnimals > 0 ? (totalDeaths / totalAnimals) * 100 : 0,
      riskLevel: latest?.riskLevel || 'Low',
      statesCount: regionStates.length
    };
  });
  
  return regionalData;
};

// Advanced Analytics Functions
export const getVaccinationTrends = (data: SummaryData[]) => {
  const trends = getTimeSeriesData(data).map(item => ({
    ...item,
    vaccinationRate: item.totalAnimals > 0 ? (item.totalVaccinated / item.totalAnimals) * 100 : 0,
    immunityGap: item.totalAnimals - item.totalVaccinated,
    diseasePrevalence: item.totalAnimals > 0 ? (item.totalAffected / item.totalAnimals) * 100 : 0
  }));
  
  return trends;
};

export const getDiseaseHotspots = (data: SummaryData[]) => {
  const hotspots = new Map<string, { state: string; totalCases: number; severity: number; diseases: string[] }>();
  
  data.forEach(item => {
    const totalCases = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimals, 0);
    const totalDeaths = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
    const severity = totalCases > 0 ? (totalDeaths / totalCases) * 100 : 0;
    const diseaseNames = item.diseases.map(d => d.name);
    
    if (hotspots.has(item.region)) {
      const existing = hotspots.get(item.region)!;
      hotspots.set(item.region, {
        state: item.region,
        totalCases: existing.totalCases + totalCases,
        severity: Math.max(existing.severity, severity),
        diseases: [...new Set([...existing.diseases, ...diseaseNames])]
      });
    } else {
      hotspots.set(item.region, {
        state: item.region,
        totalCases,
        severity,
        diseases: diseaseNames
      });
    }
  });
  
  return Array.from(hotspots.values())
    .sort((a, b) => b.totalCases - a.totalCases)
    .slice(0, 10);
};

export const getEconomicImpact = (data: SummaryData[]) => {
  const avgAnimalValue = 15000; // Average value per animal in INR
  const vaccinationCost = 200; // Cost per vaccination in INR
  
  return data.map(item => {
    const totalDeaths = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
    const economicLoss = totalDeaths * avgAnimalValue;
    const vaccinationInvestment = item.totalAnimalsVaccinated * vaccinationCost;
    const preventedDeaths = Math.floor(item.totalAnimalsVaccinated * 0.15); // Assumed 15% would have died without vaccination
    const lossPreventedValue = preventedDeaths * avgAnimalValue;
    const roi = vaccinationInvestment > 0 ? ((lossPreventedValue - vaccinationInvestment) / vaccinationInvestment) * 100 : 0;
    
    return {
      region: item.region,
      timestamp: item.timestamp,
      economicLoss,
      vaccinationInvestment,
      lossPreventedValue,
      roi,
      netBenefit: lossPreventedValue - vaccinationInvestment
    };
  });
};

export const getSeasonalPatterns = (data: SummaryData[]) => {
  const monthlyData = new Map<string, { month: string; cases: number; deaths: number; vaccinations: number }>();
  
  data.forEach(item => {
    const month = item.timestamp.toLocaleString('default', { month: 'long' });
    const cases = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimals, 0);
    const deaths = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
    
    if (monthlyData.has(month)) {
      const existing = monthlyData.get(month)!;
      monthlyData.set(month, {
        month,
        cases: existing.cases + cases,
        deaths: existing.deaths + deaths,
        vaccinations: existing.vaccinations + item.totalAnimalsVaccinated
      });
    } else {
      monthlyData.set(month, {
        month,
        cases,
        deaths,
        vaccinations: item.totalAnimalsVaccinated
      });
    }
  });
  
  return Array.from(monthlyData.values());
};

export const getRiskPrediction = (data: SummaryData[]) => {
  const recentData = data.slice(0, 7); // Last 7 days
  const avgAffectedRate = recentData.reduce((sum, item) => {
    const affected = item.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.noOfAnimals, 0);
    return sum + (affected / item.totalAnimals);
  }, 0) / recentData.length;
  
  const avgMortalityRate = recentData.reduce((sum, item) => {
    const deaths = item.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.noOfAnimalsDied, 0);
    const affected = item.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.noOfAnimals, 0);
    return sum + (affected > 0 ? deaths / affected : 0);
  }, 0) / recentData.length;
  
  const trendMultiplier = avgAffectedRate > 0.1 ? 1.5 : avgAffectedRate > 0.05 ? 1.2 : 1.0;
  
  return {
    riskScore: Math.min(100, (avgAffectedRate * 100 + avgMortalityRate * 100) * trendMultiplier),
    trend: avgAffectedRate > 0.1 ? 'increasing' : avgAffectedRate > 0.05 ? 'stable' : 'decreasing',
    recommendation: avgAffectedRate > 0.1 ? 'Immediate intervention required' : 
                   avgAffectedRate > 0.05 ? 'Enhanced monitoring needed' : 'Continue current protocols'
  };
};

export const getDiseaseAnalytics = (data: SummaryData[]) => {
  const diseaseMap = new Map<string, { affected: number; deaths: number; occurrences: number }>();
  
  data.forEach(item => {
    item.diseases.forEach(disease => {
      if (diseaseMap.has(disease.name)) {
        const existing = diseaseMap.get(disease.name)!;
        diseaseMap.set(disease.name, {
          affected: existing.affected + disease.noOfAnimals,
          deaths: existing.deaths + disease.noOfAnimalsDied,
          occurrences: existing.occurrences + 1
        });
      } else {
        diseaseMap.set(disease.name, {
          affected: disease.noOfAnimals,
          deaths: disease.noOfAnimalsDied,
          occurrences: 1
        });
      }
    });
  });
  
  return Array.from(diseaseMap.entries()).map(([name, stats]) => ({
    name,
    affected: stats.affected,
    deaths: stats.deaths,
    occurrences: stats.occurrences,
    mortalityRate: stats.affected > 0 ? (stats.deaths / stats.affected) * 100 : 0
  })).sort((a, b) => b.affected - a.affected);
};

export const getTimeSeriesData = (data: SummaryData[]) => {
  const timeMap = new Map<string, {
    date: string;
    totalAnimals: number;
    totalVaccinated: number;
    totalAffected: number;
    totalDeaths: number;
    avgRisk: number;
  }>();
  
  data.forEach(item => {
    const dateKey = item.timestamp.toISOString().split('T')[0];
    const riskValue = item.riskLevel === 'Critical' ? 4 : item.riskLevel === 'High' ? 3 : item.riskLevel === 'Medium' ? 2 : 1;
    
    if (timeMap.has(dateKey)) {
      const existing = timeMap.get(dateKey)!;
      const totalAffected = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimals, 0);
      const totalDeaths = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
      
      timeMap.set(dateKey, {
        date: dateKey,
        totalAnimals: existing.totalAnimals + item.totalAnimals,
        totalVaccinated: existing.totalVaccinated + item.totalAnimalsVaccinated,
        totalAffected: existing.totalAffected + totalAffected,
        totalDeaths: existing.totalDeaths + totalDeaths,
        avgRisk: (existing.avgRisk + riskValue) / 2
      });
    } else {
      const totalAffected = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimals, 0);
      const totalDeaths = item.diseases.reduce((sum, disease) => sum + disease.noOfAnimalsDied, 0);
      
      timeMap.set(dateKey, {
        date: dateKey,
        totalAnimals: item.totalAnimals,
        totalVaccinated: item.totalAnimalsVaccinated,
        totalAffected,
        totalDeaths,
        avgRisk: riskValue
      });
    }
  });
  
  return Array.from(timeMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Generate the mock data
export const mockData = generateMockData();