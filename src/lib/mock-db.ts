import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { User, Meeting, UnsavedUser, UnsavedMeeting } from '@/types';

const dataPath = process.env.MOCK_DATA_PATH || 'src/data';
const usersPath = path.join(process.cwd(), dataPath, 'users.json');
const meetingsPath = path.join(process.cwd(), dataPath, 'meetings.json');

async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    if (!fileContent.trim()) {
      return [];
    }
    return JSON.parse(fileContent) as T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonString, 'utf-8');
}


// User database operations
const userDb = {
  async findByEmail(email: string): Promise<User | undefined> {
    const users = await readData<User>(usersPath);
    return users.find((user) => user.email === email);
  },
  
  async findById(id: string): Promise<User | undefined> {
    const users = await readData<User>(usersPath);
    return users.find((user) => user.id === id);
  },

  async create(user: UnsavedUser): Promise<User> {
    const users = await readData<User>(usersPath);
    const newUser: User = {
      id: crypto.randomUUID(),
      ...user,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await writeData(usersPath, users);
    return newUser;
  },
};

// Meeting database operations
const meetingDb = {
  async findByUserId(userId: string): Promise<Meeting[]> {
      const meetings = await readData<Meeting>(meetingsPath);
      return meetings.filter(m => m.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  async findById(id: string): Promise<Meeting | undefined> {
      const meetings = await readData<Meeting>(meetingsPath);
      return meetings.find(m => m.id === id);
  },

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
  
  async delete(id: string): Promise<void> {
    const meetings = await readData<Meeting>(meetingsPath);
    const updatedMeetings = meetings.filter(m => m.id !== id);
    await writeData(meetingsPath, updatedMeetings);
  }
};


// The main `db` object we export and use
export const db = {
  user: userDb,
  meeting: meetingDb
};