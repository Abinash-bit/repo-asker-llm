
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (content: string) => void;
}

const ChatInterface = ({ messages, isProcessing, onSendMessage }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput("");
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Focus input after sending message
  useEffect(() => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 flex flex-col items-center">
            <Bot className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <p className="mb-1 font-medium">No conversations yet</p>
            <p className="text-sm">Select a file and start asking questions about the code.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex items-start space-x-2 max-w-[80%] p-3 rounded-lg",
                  message.role === "user"
                    ? "bg-primary/20 text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-5 w-5 mt-1 shrink-0 text-primary" />
                ) : (
                  <Bot className="h-5 w-5 mt-1 shrink-0" />
                )}
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%] bg-secondary text-secondary-foreground p-3 rounded-lg">
              <Bot className="h-5 w-5 mt-1 shrink-0" />
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the code..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isProcessing || !input.trim()}
            className={cn(
              "transition-all",
              input.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
