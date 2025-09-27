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

// Regional data for comprehensive dashboard
export const regions = [
  'North Region', 'South Region', 'East Region', 'West Region', 
  'Central Region', 'Northeast Region', 'Southeast Region', 'Northwest Region'
];

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
    for (const region of regions) {
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
        id: `${region.replace(' ', '_').toLowerCase()}_${date.toISOString().split('T')[0]}_${Math.random().toString(36).substr(2, 9)}`,
        totalAnimals,
        totalAnimalsVaccinated: totalVaccinated,
        diseases,
        riskLevel,
        timestamp: date,
        region
      });
    }
  }
  
  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Analytics helper functions
export const getRegionalSummary = (data: SummaryData[]) => {
  const regionalData = regions.map(region => {
    const regionData = data.filter(item => item.region === region);
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
      riskLevel: latest?.riskLevel || 'Low'
    };
  });
  
  return regionalData;
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