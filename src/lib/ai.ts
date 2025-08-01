import OpenAI from 'openai';
import { MeetingSummary, ActionItem } from '@/types/meeting';


const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

// --- THIS IS THE UPDATE ---
// Add timeout and retry logic to handle temporary network flakes.
const openai = new OpenAI({
  apiKey: apiKey,
  timeout: 30 * 1000, // 30 second timeout
  maxRetries: 2,      // Retry a failed request up to 2 times
});
// Initialize OpenAI client
export class AIService {
  // Transcribe audio using OpenAI Whisper
  static async transcribeAudio(audioFile: File, language?: string): Promise<string> {
    try {
      console.log('Starting audio transcription...');
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: process.env.WHISPER_MODEL || 'whisper-1',
        language: language || 'en',
        response_format: 'text',
        temperature: 0.2,
      });

      console.log('Transcription completed successfully');
      return transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  // Summarize meeting transcript using GPT-4
  static async summarizeMeeting(
    transcript: string,
    meetingTitle?: string,
    additionalContext?: string
  ): Promise<MeetingSummary> {
    try {
      console.log('Starting meeting summarization...');

      const systemPrompt = `You are an AI assistant specialized in analyzing meeting transcripts and creating comprehensive summaries. Your task is to extract key information and structure it in a useful format.

Please analyze the meeting transcript and provide a JSON response with the following structure:
{
  "keyPoints": ["array of 3-7 main discussion points"],
  "actionItems": [
    {
      "id": "unique_id",
      "task": "specific task description",
      "assignee": "person assigned (if mentioned)",
      "deadline": "deadline if mentioned (ISO format or null)",
      "priority": "low|medium|high",
      "status": "pending"
    }
  ],
  "participants": ["array of participant names mentioned"],
  "sentiment": "positive|neutral|negative",
  "topics": ["array of main topics discussed"],
  "decisions": ["array of decisions made during the meeting"],
  "nextSteps": ["array of next steps or follow-up items"],
  "fullSummary": "2-3 paragraph comprehensive summary",
  "confidence": 0.85
}

Focus on being accurate and extracting actionable information. If information is unclear or not mentioned, use null or appropriate defaults.`;

      const userPrompt = `
Meeting Title: ${meetingTitle || 'Meeting'}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Transcript:
${transcript}

Please analyze this meeting transcript and provide the structured summary in JSON format.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from AI service');
      }

      const summary = JSON.parse(responseContent) as MeetingSummary;
      
      // Validate and sanitize the response
      const sanitizedSummary = this.sanitizeSummary(summary);
      
      console.log('Meeting summarization completed successfully');
      return sanitizedSummary;
    } catch (error) {
      console.error('Error summarizing meeting:', error);
      throw new Error('Failed to summarize meeting. Please try again.');
    }
  }

  // Extract action items specifically
  static async extractActionItems(transcript: string): Promise<ActionItem[]> {
    try {
      const systemPrompt = `You are an AI assistant specialized in extracting action items from meeting transcripts. Focus on identifying specific tasks, assignments, and deadlines.

Provide a JSON array of action items in this format:
[
  {
    "id": "unique_id",
    "task": "specific task description",
    "assignee": "person assigned (if mentioned, otherwise null)",
    "deadline": "deadline if mentioned (ISO format or null)",
    "priority": "low|medium|high",
    "status": "pending"
  }
]

Only include clear, actionable items. Avoid vague or general statements.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract action items from this transcript:\n\n${transcript}` }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        return [];
      }

      const result = JSON.parse(responseContent);
      return Array.isArray(result) ? result : result.actionItems || [];
    } catch (error) {
      console.error('Error extracting action items:', error);
      return [];
    }
  }

  // Analyze meeting sentiment
  static async analyzeSentiment(transcript: string): Promise<'positive' | 'neutral' | 'negative'> {
    try {
      const systemPrompt = `Analyze the overall sentiment of this meeting transcript. Consider the tone, language used, and overall atmosphere. Respond with only one word: "positive", "neutral", or "negative".`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript }
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const sentiment = completion.choices[0]?.message?.content?.toLowerCase().trim();
      
      if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'neutral') {
        return sentiment;
      }
      
      return 'neutral'; // Default fallback
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  }

  // Generate meeting title from transcript
  static async generateMeetingTitle(transcript: string): Promise<string> {
    try {
      const systemPrompt = `Generate a concise, descriptive title for this meeting based on the transcript. The title should be 3-8 words long and capture the main purpose or topic of the meeting. Do not use quotes or special formatting.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript.substring(0, 1000) } // Use first 1000 chars for efficiency
        ],
        temperature: 0.3,
        max_tokens: 20,
      });

      return completion.choices[0]?.message?.content?.trim() || 'Meeting Summary';
    } catch (error) {
      console.error('Error generating meeting title:', error);
      return 'Meeting Summary';
    }
  }

  // Sanitize AI response to ensure data integrity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static sanitizeSummary(summary: any): MeetingSummary {
    return {
      keyPoints: Array.isArray(summary.keyPoints) ? summary.keyPoints.slice(0, 10) : [],
      actionItems: Array.isArray(summary.actionItems) 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? summary.actionItems.map((item: any, index: number) => ({
            id: item.id || `action_${Date.now()}_${index}`,
            task: typeof item.task === 'string' ? item.task : 'Undefined task',
            assignee: typeof item.assignee === 'string' ? item.assignee : undefined,
            deadline: typeof item.deadline === 'string' ? item.deadline : undefined,
            priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
            status: ['pending', 'in-progress', 'completed'].includes(item.status) ? item.status : 'pending'
          }))
        : [],
      participants: Array.isArray(summary.participants) ? summary.participants.slice(0, 20) : [],
      sentiment: ['positive', 'neutral', 'negative'].includes(summary.sentiment) ? summary.sentiment : 'neutral',
      topics: Array.isArray(summary.topics) ? summary.topics.slice(0, 15) : [],
      decisions: Array.isArray(summary.decisions) ? summary.decisions.slice(0, 10) : [],
      nextSteps: Array.isArray(summary.nextSteps) ? summary.nextSteps.slice(0, 10) : [],
      fullSummary: typeof summary.fullSummary === 'string' ? summary.fullSummary : 'Summary not available',
      confidence: typeof summary.confidence === 'number' ? Math.min(Math.max(summary.confidence, 0), 1) : 0.7
    };
  }

  // Rate limiting for AI API calls
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();

  static checkAIRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const maxRequests = parseInt(process.env.AI_REQUEST_LIMIT || '10');
    const windowMs = parseInt(process.env.AI_REQUEST_WINDOW || '60000'); // 1 minute
    
    const now = Date.now();
    const userRequests = this.requestCounts.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      this.requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (userRequests.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    userRequests.count += 1;
    this.requestCounts.set(userId, userRequests);

    return { allowed: true, remaining: maxRequests - userRequests.count };
  }
}