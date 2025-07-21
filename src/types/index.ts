export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Meeting {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  fileName: string;
  transcription: string;
  summary: string;
  actionItems: string[];
}