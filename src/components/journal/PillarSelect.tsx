import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PillarSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const PillarSelect = ({ value, onValueChange }: PillarSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="pillar">EQ Pillar</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a pillar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="self_awareness">Self Awareness</SelectItem>
          <SelectItem value="self_regulation">Self Regulation</SelectItem>
          <SelectItem value="motivation">Motivation</SelectItem>
          <SelectItem value="empathy">Empathy</SelectItem>
          <SelectItem value="social_skills">Social Skills</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};