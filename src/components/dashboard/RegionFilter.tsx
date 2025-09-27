import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { regions } from "@/data/mockData";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regionCounts?: Record<string, number>;
}

export function RegionFilter({ selectedRegion, onRegionChange, regionCounts }: RegionFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 text-gray-500" />
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center justify-between w-full">
              <span>All Regions</span>
              {regionCounts && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(regionCounts).reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </div>
          </SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              <div className="flex items-center justify-between w-full">
                <span>{region}</span>
                {regionCounts && regionCounts[region] && (
                  <Badge variant="secondary" className="ml-2">
                    {regionCounts[region]}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}