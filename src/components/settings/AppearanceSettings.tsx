import { Sun, Moon, Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppearanceSettingsProps {
  theme: string;
  onUpdate: (value: 'light' | 'dark' | 'system') => void;
}

export const AppearanceSettings = ({ theme, onUpdate }: AppearanceSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Theme</Label>
        <Select
          value={theme}
          onValueChange={(value: 'light' | 'dark' | 'system') => onUpdate(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center">
                <Monitor className="mr-2 h-4 w-4" />
                System
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};