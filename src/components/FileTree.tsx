
import { useState } from "react";
import { TreeItem } from "@/types";
import { ChevronDown, ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  items: TreeItem[];
  onFileSelect: (file: TreeItem) => void;
  selectedFilePath: string | null;
}

const FileTree = ({ items, onFileSelect, selectedFilePath }: FileTreeProps) => {
  return (
    <div className="file-tree overflow-auto">
      <ul className="pl-0">
        {items.sort((a, b) => {
          // Sort directories before files
          if (a.type === 'tree' && b.type !== 'tree') return -1;
          if (a.type !== 'tree' && b.type === 'tree') return 1;
          // Then sort alphabetically
          return a.path.localeCompare(b.path);
        }).map((item) => (
          <FileTreeItem 
            key={item.path} 
            item={item} 
            onFileSelect={onFileSelect}
            isSelected={selectedFilePath === item.path}
          />
        ))}
      </ul>
    </div>
  );
};

interface FileTreeItemProps {
  item: TreeItem;
  onFileSelect: (file: TreeItem) => void;
  isSelected: boolean;
}

const FileTreeItem = ({ item, onFileSelect, isSelected }: FileTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDirectory = item.type === 'tree';
  const filename = item.path.split('/').pop() || item.path;

  const toggleExpand = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleFileClick = () => {
    if (!isDirectory) {
      onFileSelect(item);
    } else {
      toggleExpand();
    }
  };

  return (
    <li>
      <div 
        className={cn(
          "flex items-center cursor-pointer hover:bg-secondary/50 rounded px-1 py-1.5 transition-colors",
          isSelected && !isDirectory ? "bg-secondary text-primary font-medium" : ""
        )}
        onClick={handleFileClick}
      >
        {isDirectory ? (
          <>
            <span className="mr-1" onClick={toggleExpand}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            <FolderIcon size={16} className="mr-1 text-yellow-300" />
          </>
        ) : (
          <FileIcon size={16} className="mr-1 ml-4 text-blue-300" />
        )}
        <span className="truncate">{filename}</span>
      </div>
      
      {isDirectory && isExpanded && item.children && item.children.length > 0 && (
        <ul>
          {item.children
            .sort((a, b) => {
              // Sort directories before files
              if (a.type === 'tree' && b.type !== 'tree') return -1;
              if (a.type !== 'tree' && b.type === 'tree') return 1;
              // Then sort alphabetically
              return a.path.localeCompare(b.path);
            })
            .map((child) => (
              <FileTreeItem 
                key={child.path} 
                item={child} 
                onFileSelect={onFileSelect}
                isSelected={selectedFilePath === child.path}
              />
            ))}
        </ul>
      )}
    </li>
  );
};

export default FileTree;
