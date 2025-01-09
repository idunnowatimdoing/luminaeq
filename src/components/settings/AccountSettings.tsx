import { LogOut, Download, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AccountSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    toast({
      title: "Export started",
      description: "Your data export has been initiated. You'll be notified when it's ready.",
    });
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
      
      <div className="space-y-2">
        <Label className="text-white">Storage Preference</Label>
        <Select
          defaultValue="cloud"
          onValueChange={(value) => console.log(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select storage preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local Storage</SelectItem>
            <SelectItem value="cloud">Cloud Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Language</Label>
        <Select
          defaultValue="en-US"
          onValueChange={(value) => console.log(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleExportData}
      >
        <Download className="mr-2 h-4 w-4" /> Export My Data
      </Button>

      <Button 
        variant="destructive" 
        className="w-full justify-start" 
        onClick={handleDeleteAccount}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => window.open('https://help.example.com', '_blank')}
      >
        <HelpCircle className="mr-2 h-4 w-4" /> Help Center
      </Button>
    </div>
  );
};