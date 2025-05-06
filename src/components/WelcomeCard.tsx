
import { BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WelcomeCard = () => {
  return (
    <Card className="mt-8 shadow-md border-border/50">
      <CardContent className="p-8 text-center">
        <div className="bg-primary/10 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Welcome to RepoAsker LLM</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter a GitHub repository URL above to explore its files and
          ask questions about the code using an AI assistant.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
