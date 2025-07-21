'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '../ui/card';

interface UploadModalProps {
  onUploadSuccess: (newMeeting: any) => void;
  onClose: () => void;
}

export function UploadModal({ onUploadSuccess, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [], 'video/*': [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Please provide a title and select a file.');
      return;
    }
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed.');
      }
      onUploadSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-5 w-5"/>
        </Button>
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input 
                        placeholder="Meeting Title (e.g., Q2 Project Kickoff)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isUploading}
                        required
                    />
                </div>
                <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors ${isDragActive ? 'border-primary bg-primary/10' : ''}`}>
                    <input {...getInputProps()} disabled={isUploading} />
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Audio or Video files (MP3, WAV, MP4, etc.)</p>
                </div>
                
                {file && (
                    <div className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                            <FileIcon className="h-4 w-4" />
                            <span>{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-6 w-6">
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>Cancel</Button>
                    <Button type="submit" disabled={!file || !title || isUploading}>
                        {isUploading && <Spinner size="sm" className="mr-2" />}
                        {isUploading ? 'Processing...' : 'Upload & Summarize'}
                    </Button>
                </div>
            </form>
        </div>
      </Card>
    </div>
  );
}