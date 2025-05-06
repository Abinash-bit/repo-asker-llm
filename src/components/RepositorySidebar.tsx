
import { Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FileTree from "@/components/FileTree";
import { useRepository } from "@/contexts/RepositoryContext";

const RepositorySidebar = () => {
  const { repository, handleFileSelect, selectedFile } = useRepository();

  return (
    <div className="w-full lg:w-1/4 overflow-hidden flex flex-col">
      <Card className="h-full flex flex-col overflow-hidden shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Github className="h-4 w-4" />
            <span className="truncate">
              {repository.owner}/{repository.repo}
            </span>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-auto p-2">
          {repository.files.length > 0 ? (
            <FileTree 
              items={repository.files} 
              onFileSelect={handleFileSelect}
              selectedFilePath={selectedFile?.path || null}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {repository.isLoading ? "Loading files..." : "No files found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepositorySidebar;
