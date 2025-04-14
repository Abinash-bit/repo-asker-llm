
import { TreeItem } from "@/types";

export async function parseGithubUrl(url: string): Promise<{ owner: string; repo: string }> {
  try {
    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubRegex);
    
    if (!match) {
      throw new Error("Invalid GitHub repository URL");
    }
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
    throw error;
  }
}

export async function fetchRepositoryFiles(owner: string, repo: string): Promise<TreeItem[]> {
  try {
    // Fetch repository contents from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
    
    if (!response.ok) {
      // Try with master branch if main doesn't exist
      const masterResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
      
      if (!masterResponse.ok) {
        throw new Error("Failed to fetch repository contents");
      }
      
      const data = await masterResponse.json();
      return buildFileTree(data.tree);
    }
    
    const data = await response.json();
    return buildFileTree(data.tree);
  } catch (error) {
    console.error("Error fetching repository files:", error);
    throw error;
  }
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file content for ${path}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns content as base64 encoded
    const content = atob(data.content);
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${path}:`, error);
    throw error;
  }
}

// Helper function to build a file tree from the flat GitHub API response
function buildFileTree(items: any[]): TreeItem[] {
  const tree: TreeItem[] = [];
  const map: Record<string, TreeItem> = {};
  
  // First pass: create all nodes
  items.forEach(item => {
    // Skip git internal files
    if (item.path.includes('.git/')) {
      return;
    }
    
    const node: TreeItem = {
      path: item.path,
      type: item.type,
      children: item.type === 'tree' ? [] : undefined
    };
    
    map[item.path] = node;
  });
  
  // Second pass: build the tree
  items.forEach(item => {
    if (item.path.includes('.git/')) {
      return;
    }
    
    const lastSlashIndex = item.path.lastIndexOf('/');
    
    if (lastSlashIndex === -1) {
      // Root level item
      tree.push(map[item.path]);
    } else {
      // Nested item
      const parentPath = item.path.substring(0, lastSlashIndex);
      const parent = map[parentPath];
      
      if (parent && parent.children) {
        parent.children.push(map[item.path]);
      }
    }
  });
  
  // Only return root level items
  return tree;
}
