
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { testApiKey } from "@/services/aiService";

export default function SettingsDialog() {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem("openai_api_key") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.warning("Please enter an API key");
      return;
    }
    
    setIsTesting(true);
    const isValid = await testApiKey(apiKey);
    setIsTesting(false);
    
    if (isValid) {
      localStorage.setItem("openai_api_key", apiKey);
      toast.success("API key saved successfully");
      setIsOpen(false);
    } else {
      toast.error("Invalid API key. Please check and try again.");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API key to enable code AI features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isTesting}>
            {isTesting ? "Testing..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
