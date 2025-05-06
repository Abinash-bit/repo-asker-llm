
import { useEffect, useRef } from "react";
import { FileIcon } from "lucide-react";

interface CodeViewerProps {
  content: string;
  filename: string;
}

const CodeViewer = ({ content, filename }: CodeViewerProps) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // In a real app, we'd use a syntax highlighter library like Prism.js or highlight.js
      codeRef.current.textContent = content;
    }
  }, [content]);

  // Simple file extension detection for adding basic language class
  const getLanguageClass = () => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'language-javascript';
      case 'ts':
        return 'language-typescript';
      case 'jsx':
      case 'tsx':
        return 'language-jsx';
      case 'html':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'json':
        return 'language-json';
      case 'md':
        return 'language-markdown';
      default:
        return '';
    }
  };

  // Get file type label for the header
  const getFileTypeLabel = () => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'JavaScript';
      case 'ts':
        return 'TypeScript';
      case 'jsx':
        return 'React JSX';
      case 'tsx':
        return 'React TSX';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'json':
        return 'JSON';
      case 'md':
        return 'Markdown';
      default:
        return extension?.toUpperCase() || 'Text';
    }
  };

  return (
    <div className="rounded-md border border-border overflow-hidden bg-card shadow-sm">
      <div className="bg-muted px-4 py-2.5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{filename}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
          {getFileTypeLabel()}
        </span>
      </div>
      <div className="code-viewer p-4 bg-code text-code-foreground">
        <pre ref={codeRef} className={getLanguageClass()}></pre>
      </div>
    </div>
  );
};

export default CodeViewer;
