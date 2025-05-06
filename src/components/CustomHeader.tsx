
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsDialog from "@/components/SettingsDialog";

const CustomHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span className="font-bold">RepoAsker LLM</span>
          </a>
        </div>
        <div className="flex-1" />
        <nav className="flex items-center space-x-2">
          <SettingsDialog />
        </nav>
      </div>
    </header>
  );
};

export default CustomHeader;
