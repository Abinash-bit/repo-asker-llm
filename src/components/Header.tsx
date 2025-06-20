import { Star } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border py-4 px-6 bg-card shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">opsynth.io</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
