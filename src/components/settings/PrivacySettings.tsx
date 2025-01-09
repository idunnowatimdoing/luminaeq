import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PrivacySettingsProps {
  leaderboardOptOut: boolean;
  onUpdate: (value: boolean) => void;
}

export const PrivacySettings = ({ leaderboardOptOut, onUpdate }: PrivacySettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="leaderboard-opt-out" className="text-white">
          Opt out of Leaderboard
        </Label>
        <Switch
          id="leaderboard-opt-out"
          checked={leaderboardOptOut}
          onCheckedChange={onUpdate}
        />
      </div>
    </div>
  );
};