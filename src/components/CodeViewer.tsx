
import { useEffect, useRef } from "react";

interface CodeViewerProps {
  content: string;
  filename: string;
}

const CodeViewer = ({ content, filename }: CodeViewerProps) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // In a real app, we'd use a syntax highlighter library like Prism.js or highlight.js
      // For simplicity, we're just showing the raw code
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

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border">
        {filename}
      </div>
      <div className="code-viewer">
        <pre ref={codeRef} className={getLanguageClass()}></pre>
      </div>
    </div>
  );
};

export default CodeViewer;
