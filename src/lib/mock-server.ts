import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { User, Meeting, UnsavedUser, UnsavedMeeting } from '@/types';

// The path to the data folder, configured in your .env.local file
// It defaults to 'src/data' if not set.
const dataPath = process.env.MOCK_DATA_PATH || 'src/data';
const usersPath = path.join(process.cwd(), dataPath, 'users.json');
const meetingsPath = path.join(process.cwd(), dataPath, 'meetings.json');

// Helper function to read data from a JSON file
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    // If the file is empty, return an empty array
    if (!fileContent.trim()) {
      return [];
    }
    return JSON.parse(fileContent) as T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If the file doesn't exist (ENOENT), it's not an error.
    // It just means we're starting with an empty dataset.
    if (error.code === 'ENOENT') {
      return [];
    }
    // For any other error, re-throw it.
    throw error;
  }
}

// Helper function to write data to a JSON file
async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  // Use JSON.stringify with an indent of 2 for readability
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonString, 'utf-8');
}


// User "database" operations
const userDb = {
  // Find a user by their email
  async findByEmail(email: string): Promise<User | undefined> {
    const users = await readData<User>(usersPath);
    return users.find((user) => user.email === email);
  },
  
  // Find a user by their ID
  async findById(id: string): Promise<User | undefined> {
    const users = await readData<User>(usersPath);
    return users.find((user) => user.id === id);
  },

  // Create a new user
  async create(user: UnsavedUser): Promise<User> {
    const users = await readData<User>(usersPath);
    const newUser: User = {
      id: crypto.randomUUID(), // Generate a unique ID
      ...user,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await writeData(usersPath, users);
    return newUser;
  },
};

// Meeting "database" operations
const meetingDb = {
  // Find meetings belonging to a specific user
  async findByUserId(userId: string): Promise<Meeting[]> {
      const meetings = await readData<Meeting>(meetingsPath);
      return meetings.filter(m => m.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  // Find a specific meeting by its ID
  async findById(id: string): Promise<Meeting | undefined> {
      const meetings = await readData<Meeting>(meetingsPath);
      return meetings.find(m => m.id === id);
  },

  // Create a new meeting record
  async create(meeting: UnsavedMeeting): Promise<Meeting> {
    const meetings = await readData<Meeting>(meetingsPath);
    const newMeeting: Meeting = {
        id: crypto.randomUUID(),
        ...meeting,
        createdAt: new Date().toISOString()
    };
    meetings.push(newMeeting);
    await writeData(meetingsPath, meetings);
    return newMeeting;
  },
  
  // Delete a meeting record
  async delete(id: string): Promise<void> {
    const meetings = await readData<Meeting>(meetingsPath);
    const updatedMeetings = meetings.filter(m => m.id !== id);
    await writeData(meetingsPath, updatedMeetings);
  }
};


// The main `db` object we export and use throughout the app
export const db = {
  user: userDb,
  meeting: meetingDb
};