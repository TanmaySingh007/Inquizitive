export interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  createdAt: Date;
  isActive: boolean;
  endedAt?: Date;
  hasAnswered?: boolean;
}

export interface Student {
  id: string;
  name: string;
  socketId: string;
  hasAnswered: boolean;
}

export interface PollResults {
  pollId: string;
  question: string;
  results: Record<string, number>;
  totalResponses: number;
  totalStudents: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderType: 'teacher' | 'student';
  timestamp: Date;
}

export interface StudentResponse {
  studentId: string;
  studentName: string;
  answer: string;
  timestamp: Date;
}

export interface PollHistory extends Poll {
  results: Record<string, number>;
  totalResponses: number;
  studentResponses?: StudentResponse[];
}