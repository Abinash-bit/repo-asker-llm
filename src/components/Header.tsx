
import { BrainCircuit } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border py-4 px-6 bg-card shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">RepoAsker LLM</h1>
          </div>
          <div className="text-sm text-muted-foreground hidden md:block">
            Explore repositories and chat with code
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
