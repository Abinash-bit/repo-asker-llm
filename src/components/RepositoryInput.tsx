
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseGithubUrl } from "@/services/repositoryService";
import { toast } from "sonner";

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
      <Input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
        {isLoading ? "Loading..." : "Explore Repo"}
      </Button>
    </form>
  );
};

export default RepositoryInput;
