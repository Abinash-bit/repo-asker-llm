
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseGithubUrl } from "@/services/repositoryService";
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";

interface RepositoryInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const RepositoryInput = ({ onSubmit, isLoading }: RepositoryInputProps) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    try {
      // Validate the URL
      await parseGithubUrl(repoUrl);
      onSubmit(repoUrl);
    } catch (error) {
      toast.error("Invalid GitHub repository URL format");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Github size={18} />
        </div>
        <Input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
          disabled={isLoading}
          className="pl-10 flex-1"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4" />
            Explore Repo
          </>
        )}
      </Button>
    </form>
  );
};

export default RepositoryInput;
