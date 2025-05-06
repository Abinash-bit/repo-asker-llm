
import { Code, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CodeViewer from "@/components/CodeViewer";
import ChatInterface from "@/components/ChatInterface";
import { useRepository } from "@/contexts/RepositoryContext";

const ContentTabs = () => {
  const { repository, selectedFile, fileContent, chat, handleSendMessage } = useRepository();

  return (
    <div className="w-full lg:w-3/4 overflow-hidden flex flex-col">
      <Tabs defaultValue="code" className="h-full flex flex-col">
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code size={14} />
            <span>Code Viewer</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare size={14} />
            <span>Chat</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="flex-1 overflow-hidden m-0">
          {selectedFile && fileContent ? (
            <CodeViewer 
              content={fileContent} 
              filename={selectedFile.path}
            />
          ) : (
            <Card className="h-full flex items-center justify-center shadow-sm">
              <CardContent className="text-center p-8">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground font-medium mb-2">
                  {repository.isLoading 
                    ? "Loading repository..." 
                    : "No file selected"}
                </p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {!repository.isLoading && "Select a file from the repository to view its content"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
          <Card className="h-full flex flex-col overflow-hidden shadow-sm">
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
  );
};

export default ContentTabs;
