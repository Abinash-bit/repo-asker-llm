
export interface Repository {
  url: string;
  owner: string;
  repo: string;
  files: TreeItem[];
  isLoading: boolean;
  error: string | null;
}

export interface TreeItem {
  path: string;
  type: 'blob' | 'tree';
  children?: TreeItem[];
  content?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
}
