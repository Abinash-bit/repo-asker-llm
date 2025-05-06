
import { createContext, useContext, useState, ReactNode } from "react";
import { Repository, TreeItem, ChatState, Message } from "@/types";
import { fetchRepositoryFiles, fetchFileContent, parseGithubUrl } from "@/services/repositoryService";
import { processCodeQuestion } from "@/services/aiService";
import { toast } from "sonner";

interface RepositoryContextType {
  repository: Repository;
  selectedFile: TreeItem | null;
  fileContent: string | null;
  chat: ChatState;
  handleRepositorySubmit: (url: string) => Promise<void>;
  handleFileSelect: (file: TreeItem) => Promise<void>;
  handleSendMessage: (content: string) => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export function RepositoryProvider({ children }: { children: ReactNode }) {
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
      role: 'user' as const,
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
        role: 'assistant' as const,
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
        role: 'assistant' as const,
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
    <RepositoryContext.Provider
      value={{
        repository,
        selectedFile,
        fileContent,
        chat,
        handleRepositorySubmit,
        handleFileSelect,
        handleSendMessage
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};
