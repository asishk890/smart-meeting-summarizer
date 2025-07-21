import fs from 'fs';
import path from 'path';
import { User } from '@/types/auth';
import { Meeting } from '@/types/meeting';

// Mock data file paths
const DATA_DIR = path.join(process.cwd(), 'src/data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MEETINGS_FILE = path.join(DATA_DIR, 'meetings.json');

// Ensure data directory and files exist
function ensureDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(MEETINGS_FILE)) {
    fs.writeFileSync(MEETINGS_FILE, JSON.stringify([], null, 2));
  }
}

// Generic file operations
function readJsonFile<T>(filePath: string): T[] {
  ensureDataFiles();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  ensureDataFiles();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// User operations
export class MockUserService {
  static getAllUsers(): User[] {
    return readJsonFile<User>(USERS_FILE);
  }

  static getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  static createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getAllUsers();
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    writeJsonFile(USERS_FILE, users);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    writeJsonFile(USERS_FILE, users);
    return users[userIndex];
  }

  static deleteUser(id: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    writeJsonFile(USERS_FILE, filteredUsers);
    return true;
  }

  private static generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Meeting operations
export class MockMeetingService {
  static getAllMeetings(): Meeting[] {
    return readJsonFile<Meeting>(MEETINGS_FILE);
  }

  static getMeetingById(id: string): Meeting | null {
    const meetings = this.getAllMeetings();
    return meetings.find(meeting => meeting.id === id) || null;
  }

  static getMeetingsByUserId(userId: string): Meeting[] {
    const meetings = this.getAllMeetings();
    return meetings.filter(meeting => meeting.userId === userId);
  }

  static createMeeting(meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting {
    const meetings = this.getAllMeetings();
    const newMeeting: Meeting = {
      ...meetingData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    meetings.push(newMeeting);
    writeJsonFile(MEETINGS_FILE, meetings);
    return newMeeting;
  }

  static updateMeeting(id: string, updates: Partial<Meeting>): Meeting | null {
    const meetings = this.getAllMeetings();
    const meetingIndex = meetings.findIndex(meeting => meeting.id === id);
    
    if (meetingIndex === -1) return null;
    
    meetings[meetingIndex] = {
      ...meetings[meetingIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    writeJsonFile(MEETINGS_FILE, meetings);
    return meetings[meetingIndex];
  }

  static deleteMeeting(id: string): boolean {
    const meetings = this.getAllMeetings();
    const filteredMeetings = meetings.filter(meeting => meeting.id !== id);
    
    if (filteredMeetings.length === meetings.length) return false;
    
    writeJsonFile(MEETINGS_FILE, filteredMeetings);
    return true;
  }

  static getMeetingsWithPagination(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: { status?: string; searchTerm?: string }
  ) {
    let meetings = this.getMeetingsByUserId(userId);
    
    // Apply filters
    if (filters?.status) {
      meetings = meetings.filter(meeting => meeting.status === filters.status);
    }
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      meetings = meetings.filter(meeting =>
        meeting.title.toLowerCase().includes(searchLower) ||
        meeting.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by creation date (newest first)
    meetings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const total = meetings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeetings = meetings.slice(startIndex, endIndex);
    
    return {
      meetings: paginatedMeetings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  private static generateId(): string {
    return `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Storage utilities
export class MockStorageService {
  static saveFile(file: Buffer, filename: string): string {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, file);
    
    return `/uploads/${filename}`;
  }

  static deleteFile(filename: string): boolean {
    try {
      const filePath = path.join(process.cwd(), 'public/uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  static fileExists(filename: string): boolean {
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    return fs.existsSync(filePath);
  }
}