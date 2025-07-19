This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🤖 Smart Meeting Summarizer

A powerful application built with Next.js and integrated with cutting-edge AI to automatically transcribe, summarize, and analyze your meeting recordings. Turn long audio files into concise summaries, action items, and key decisions instantly.

This project is fully functional out-of-the-box using a mock backend and simulated AI responses. It is ready to be connected to a real AI service like OpenAI.

<!-- ![Project Screenshot](https://storage.googleapis.com/generativeai-downloads/images/smart-meeting-summarizer-screenshot.png) -->

## ✨ Features

- **Seamless File Upload**: Modern drag-and-drop UI to upload meeting audio files (e.g., MP3, WAV, M4A).
- **Mock AI Processing**: Simulates transcription and summarization without needing an API key for immediate use.
- **Structured Summarization**: Generates three key outputs:
  - A concise **summary** of the conversation.
  - A bulleted list of **actionable items**.
  - A list of **key decisions** made.
- **Real-time Status Updates**: The UI reflects the current status of a file (`Processing`, `Transcribing`, `Completed`, `Failed`).
- **Meeting History**: View and manage all your past summarized meetings in a clean, organized list.
- **Ready for Production**: Easily swap the mock AI functions with real OpenAI API calls.

---

## 🌊 Control Flow

This diagram illustrates the end-to-end process, from a user uploading an audio file to viewing the final AI-generated summary.

```mermaid
graph TD
    subgraph "User Interaction (Client-Side)"
        A[User visits page and selects audio file] --> B{Uploads File via UI};
        B --> C[UI optimistically displays "Processing" status & adds to list];
        C --> D{UI polls for status updates periodically};
        D -- Is 'Completed'? --> E[Renders Full Summary, Action Items & Decisions];
        D -- No --> C;
    end

    subgraph "Backend Process (Next.js & Mock Server)"
        B --> F[POST /api/meetings];
        F -->|1. Creates entry in db.json with 'processing' status| G(json-server);
        G -->|2. Simulate AI Processing| H{Delay & update status to 'transcribing'};
        H -->|3. Simulate AI Summarization| I{Delay & update status to 'completed' with mock data};
    end

    style E fill:#d4edda,stroke:#155724
    style I fill:#d4edda,stroke:#155724
```

gantt
title Smart Meeting Summarizer Development Roadmap
dateFormat YYYY-MM-DD
axisFormat %b %d

    section Phase 1: Foundation & UI (Complete)
    Project Initialization        :done, P1, 2024-05-20, 1d
    Mock Server & Data Schema     :done, P1, after P1, 1d
    Build UI Components           :done, P1, after P1, 3d

    section Phase 2: Core Functionality (Complete)
    API Routes for CRUD           :done, P2, 2024-05-23, 2d
    File Upload & Processing Logic:done, P2, after P2, 2d
    Dynamic Status Updates        :done, P2, after P2, 1d

    section Phase 3: AI Integration (Next Steps)
    Implement Real Whisper API    :todo, P3, 2024-05-29, 2d
    Implement Real GPT-4 API      :todo, P3, after P3, 2d
    Error Handling for AI APIs    :todo, P3, after P3, 1d

    section Phase 4: Polish & Deploy
    Add Authentication            :todo, P4, 2024-06-03, 3d
    Testing and Refinement        :todo, P4, after P4, 2d
    Deployment                    :todo, P4, after P4, 2d



/smart-meeting-summarizer

    ├── /app # Next.js App Router (pages & API routes)
    │ ├── /api/meetings/[id]/...
    │ ├── layout.tsx
    │ └── page.tsx
    ├── /components # Reusable React components
    │ ├── /ui # Base UI elements (Button, Card, etc.)
    │ ├── audio-uploader.tsx
    │ └── meeting-list.tsx
    ├── /lib # Helper functions, AI clients, types
    │ ├── ai.ts # (IMPORTANT) AI logic lives here
    │ ├── types.ts # TypeScript type definitions
    │ └── utils.ts
    ├── /mock-db # Contains db.json for json-server
    ├── /public # Static assets
    ├── .env.local # For API keys (Git ignored)
    └── package.json

##################################################################################

Check This Before:- 
    
    Smart Meeting Summarizer i want to make a project on next.js latest version with ai integration if store user use mock server to store in json file and use proper ai integration so for now give me folder structure for the project, A step-by-step roadmap, Integration ideas for OpenAI / Whisper / HuggingFace for summarization

