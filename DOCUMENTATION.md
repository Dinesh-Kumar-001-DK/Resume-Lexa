# Resume Lexa - Official Documentation

Welcome to the documentation for **Resume Lexa**, an AI-powered resume editorial intelligence platform.

## Key Features

1. **Dashboard Overview**
   - Displays aggregated analytics of a user's uploaded resumes.
   - Shows total analyzed resumes, ATS scores, and historical modifications.

2. **Manuscript Upload & Setup**
   - **Supported Formats**: PDF, DOCX, and TXT. 
   - Evaluates optimal resume templates formats based off provided experience.

3. **The ATS Analysis Scanner**
   - Matches a resume against an optional Target Job Description.
   - Assigns a graded score (0-100) based on actionable keyword metrics.

4. **Behavioral Interview Simulator**
   - The AI infers past experiences from the resume context and constructs unique behavioral interview questions commonly expected on-site.
   - Evaluates the user's mock responses with immediate scoring and actionable advice.

## High-Level Folder Structure

```
editorial-intelligence/
├── client/
│   ├── public/              # Static assets
│   ├── src/                 
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # Central data storage (Resumes, User state)
│   │   ├── pages/           # Dedicated route views (Dashboard, Login, Editor)
│   │   └── utils/           # Helper scripts (Supabase client, Axios API)
├── server/
│   ├── middleware/          # Express route interceptors (auth verification)
│   ├── models/              # Mongoose DB schemas
│   ├── routes/              # Express API endpoints
│   ├── .env                 # Server-side environment variables
│   └── index.js             # Entrypoint server instance
```

## Core API Endpoints

- `GET /api/resumes` - Returns all resumes owned by the logged-in user.
- `POST /api/resumes/upload` - Accepts `multipart/form-data` to extract text and initialize a new Resume.
- `POST /api/analysis/:id` - Triggers the Gemini API to analyze the resume content and generate a graded document.
- `POST /api/ats/:id` - Runs specifically targeted ATS comparisons using strict job-description metrics.
