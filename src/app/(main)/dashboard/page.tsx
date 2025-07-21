'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { UploadModal } from '@/components/meetings/upload-modal';
import { Meeting } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('/api/meetings');
        setMeetings(response.data);
      } catch (err) {
        setError('Failed to load meetings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleUploadSuccess = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center mt-16"><Spinner size="lg" /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 mt-16">{error}</p>;
    }
    if (meetings.length === 0) {
      return (
        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold">No Meetings Yet</h3>
          <p className="text-muted-foreground mt-2">Upload your first meeting recording to get started.</p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Upload Meeting
          </Button>
        </div>
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {meetings.map((meeting) => (
            <Link href={`/dashboard/meetings/${meeting.id}`} key={meeting.id}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                    <CardTitle className="truncate">{meeting.title}</CardTitle>
                    <CardDescription>{new Date(meeting.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Meetings</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Button>
        </div>
        {renderContent()}
      </div>
      {isModalOpen && (
        <UploadModal 
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess} 
        />
      )}
    </>
  );
}