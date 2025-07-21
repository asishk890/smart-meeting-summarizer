'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/components/ui/sonner';
import { Trash2, FileText, ListChecks, ChevronLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Meeting } from '@/types';

export default function MeetingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchMeeting = async () => {
                try {
                    const response = await axios.get(`/api/meetings/${id}`);
                    setMeeting(response.data);
                } catch (err) {
                    setError('Failed to load meeting details or meeting not found.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMeeting();
        }
    }, [id]);
    
    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) return;

        try {
            await axios.delete(`/api/meetings/${id}`);
            toast.success('Meeting deleted successfully');
            router.push('/dashboard');
        } catch (err) {
            toast.error('Failed to delete meeting.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><Spinner size="lg" /></div>;
    }

    if (error || !meeting) {
        return <div className="container py-8 text-center text-red-500">{error || 'Meeting not found.'}</div>;
    }

    return (
        <div className="container py-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ChevronLeft className="mr-2 h-4 w-4"/> Back to Meetings
            </Button>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{meeting.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Created on {new Date(meeting.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4"/> Delete
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks /> Action Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {meeting.actionItems && meeting.actionItems.length > 0 ? (
                           <ul className="list-disc pl-5 space-y-2">
                               {meeting.actionItems.map((item, index) => <li key={index}>{item}</li>)}
                           </ul> 
                        ) : <p className="text-muted-foreground">No action items were identified.</p>}
                    </CardContent>
                </Card>
                <Card className="lg:row-span-2">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText/> Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap leading-relaxed">{meeting.summary}</p>
                    </CardContent>
                </Card>
                <Card className="lg:col-start-1 lg:row-start-2">
                     <CardHeader>
                        <CardTitle>Full Transcription</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[300px] overflow-y-auto">
                        <p className="whitespace-pre-wrap text-muted-foreground text-sm">{meeting.transcription}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}