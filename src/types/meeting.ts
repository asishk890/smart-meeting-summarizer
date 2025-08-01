// Define the structure of an ActionItem
export interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

// Define the structure for a full Meeting record
export interface Meeting {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  transcription: string;
  summary: string;
  // --- CHANGE THIS LINE ---
  actionItems: ActionItem[]; // Changed from string[] to ActionItem[]
  createdAt: string; // ISO Date String
}

// You might also have a summary type like this
export interface MeetingSummary {
    keyPoints: string[];
    actionItems: ActionItem[];
    participants: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    topics: string[];
    decisions: string[];
    nextSteps: string[];
    fullSummary: string;
    confidence: number;
}