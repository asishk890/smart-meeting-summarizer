export interface Meeting {
  id: string;
  title: string;
  description?: string;
  userId: string;
  audioFile?: string;
  transcript?: string;
  summary?: MeetingSummary;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  duration?: number; // in seconds
  fileSize?: number; // in bytes
  fileName?: string;
}

export interface MeetingSummary {
  keyPoints: string[];
  actionItems: ActionItem[];
  participants: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  decisions: string[];
  nextSteps: string[];
  fullSummary: string;
  confidence: number; // 0-1 score
}

export interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface MeetingUpload {
  title: string;
  description?: string;
  audioFile: File;
}

export interface TranscriptionRequest {
  audioFile: File;
  language?: string;
}

export interface SummarizationRequest {
  transcript: string;
  meetingTitle?: string;
  additionalContext?: string;
}

export interface AIProcessingResponse {
  success: boolean;
  data?: {
    transcript?: string;
    summary?: MeetingSummary;
  };
  error?: string;
  processingTime?: number;
}

export interface MeetingFilters {
  status?: Meeting['status'];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface MeetingsResponse {
  meetings: Meeting[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}