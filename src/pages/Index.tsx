
import { useState, useEffect } from "react";
import { Repository, TreeItem, Message, ChatState } from "@/types";
import RepositoryInput from "@/components/RepositoryInput";
import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";
import ChatInterface from "@/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BrainCircuit, FileWarningIcon } from "lucide-react";
import { fetchRepositoryFiles, fetchFileContent, parseGithubUrl } from "@/services/repositoryService";
import { processCodeQuestion } from "@/services/aiService";
import { toast } from "sonner";

const Index = () => {
  // Repository state
  const [repository, setRepository] = useState<Repository>({
    url: "",
    owner: "",
    repo: "",
    files: [],
    isLoading: false,
    error: null
  });
  
  // File viewing state
  const [selectedFile, setSelectedFile] = useState<TreeItem | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  
  // Chat state
  const [chat, setChat] = useState<ChatState>({
    messages: [],
    isProcessing: false
  });

  // Handle repository submission
  const handleRepositorySubmit = async (url: string) => {
    setRepository({
      ...repository,
      url,
      isLoading: true,
      error: null,
      files: []
    });
    setSelectedFile(null);
    setFileContent(null);
    setChat({ messages: [], isProcessing: false });
    
    try {
      const { owner, repo } = await parseGithubUrl(url);
      const files = await fetchRepositoryFiles(owner, repo);
      
      setRepository({
        url,
        owner,
        repo,
        files,
        isLoading: false,
        error: null
      });
      
      toast.success(`Successfully loaded repository: ${owner}/${repo}`);
    } catch (error) {
      console.error("Error loading repository:", error);
      setRepository({
        ...repository,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load repository"
      });
      
      toast.error("Failed to load repository. Please check the URL and try again.");
    }
  };
  
  // Handle file selection
  const handleFileSelect = async (file: TreeItem) => {
    if (file.type === 'blob') {
      setSelectedFile(file);
      
      try {
        const content = await fetchFileContent(repository.owner, repository.repo, file.path);
        setFileContent(content);
      } catch (error) {
        console.error("Error fetching file content:", error);
        setFileContent(null);
        toast.error(`Failed to load file: ${file.path}`);
      }
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setChat({
      messages: [...chat.messages, newMessage],
      isProcessing: true
    });
    
    try {
      const response = await processCodeQuestion(
        [...chat.messages, newMessage],
        fileContent,
        selectedFile?.path || null
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      
      setChat({
        messages: [...chat.messages, newMessage, assistantMessage],
        isProcessing: false
      });
    } catch (error) {
      console.error("Error processing question:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your question. Please try again."
      };
      
      setChat({
        messages: [...chat.messages, newMessage, errorMessage],
        isProcessing: false
      });
      
      toast.error("Failed to process your question");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">RepoAsker LLM</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Explore repositories and chat with code
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 overflow-hidden">
        <div className="mb-6">
          <RepositoryInput 
            onSubmit={handleRepositorySubmit} 
            isLoading={repository.isLoading} 
          />
        </div>
        
        {repository.error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <FileWarningIcon className="h-5 w-5" />
                <span>{repository.error}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {repository.url && !repository.error && (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-4 overflow-hidden">
            {/* Repository sidebar */}
            <div className="w-full lg:w-1/4 overflow-hidden flex flex-col">
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GitHubLogoIcon className="h-4 w-4" />
                    <span>
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
            
            {/* Main content area */}
            <div className="w-full lg:w-3/4 overflow-hidden flex flex-col">
              <Tabs defaultValue="code" className="h-full flex flex-col">
                <TabsList className="mx-auto mb-4">
                  <TabsTrigger value="code">Code Viewer</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="flex-1 overflow-hidden m-0">
                  {selectedFile && fileContent ? (
                    <CodeViewer 
                      content={fileContent} 
                      filename={selectedFile.path}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center p-6">
                        <p className="text-muted-foreground">
                          {repository.isLoading 
                            ? "Loading repository..." 
                            : "Select a file from the repository to view its content"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
                  <Card className="h-full flex flex-col overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {selectedFile 
                          ? `Chat about: ${selectedFile.path}`
                          : "Select a file to chat about"}
                      </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="flex-1 p-0 overflow-hidden">
                      <ChatInterface 
                        messages={chat.messages}
                        isProcessing={chat.isProcessing}
                        onSendMessage={handleSendMessage}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
        
        {!repository.url && !repository.isLoading && (
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <BrainCircuit className="h-16 w-16 mx-auto mb-4 text-primary opacity-80" />
              <h2 className="text-2xl font-bold mb-2">Welcome to RepoAsker LLM</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a GitHub repository URL above to explore its files and
                ask questions about the code using an AI assistant.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
