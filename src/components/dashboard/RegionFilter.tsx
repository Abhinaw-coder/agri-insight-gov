import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regions, states, getRegionFromState } from "@/data/mockData";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function RegionFilter({ selectedRegion, onRegionChange }: RegionFilterProps) {
  const allOptions = [
    { value: "all", label: "All Regions", type: "all" },
    ...regions.map(region => ({ value: region, label: region, type: "region" })),
    ...states.map(state => ({ value: state, label: `${state} (${getRegionFromState(state)})`, type: "state" }))
  ];

  const getDisplayValue = () => {
    if (selectedRegion === "all") return "All Regions";
    if (regions.includes(selectedRegion)) return selectedRegion;
    if (states.includes(selectedRegion)) return `${selectedRegion} (${getRegionFromState(selectedRegion)})`;
    return selectedRegion;
  };

  return (
    <Select value={selectedRegion} onValueChange={onRegionChange}>
      <SelectTrigger className="w-[280px] bg-white border-gray-300">
        <SelectValue placeholder="Select region or state">
          {getDisplayValue()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <SelectItem value="all" className="font-medium text-blue-600">
          🌏 All Regions
        </SelectItem>
        
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Regions
        </div>
        {regions.map((region) => (
          <SelectItem key={region} value={region} className="text-gray-700">
            📍 {region}
          </SelectItem>
        ))}
        
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t mt-1 pt-2">
          States
        </div>
        {states.map((state) => (
          <SelectItem key={state} value={state} className="text-gray-600 text-sm">
            🏛️ {state} <span className="text-xs text-gray-400">({getRegionFromState(state)})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}