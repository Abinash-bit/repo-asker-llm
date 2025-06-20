import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsDialog from "@/components/SettingsDialog";

const CustomHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-center">
        <span className="font-bold text-3xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">codent.io</span>
      </div>
    </header>
  );
};

export default CustomHeader;
