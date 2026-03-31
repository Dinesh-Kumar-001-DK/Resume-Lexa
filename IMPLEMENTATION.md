# Resume Lexa - Implementation Details

This document covers the technical architecture, design decisions, and implementation specifics of the Resume Lexa project.

## 1. Technical Stack
- **Frontend**: React (TypeScript), React Router, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Authentication**: Supabase (Google OAuth + Email/Password)
- **AI Engine**: Google Generative AI (Gemini 2.0 Flash)
- **File Parsing**: `pdf-parse@2.4.5` (PDF extraction), `mammoth` (DOCX extraction)

## 2. System Architecture

The project follows a standard decoupled Client-Server architecture.

### Client-Side (React)
- **State Management**: React Context (`ResumeContext.tsx`) is used to manage global state such as the active resume, API interactions, and loading states.
- **Routing**: Client-side routing is handled strictly via React Router. Protected routes intercept unauthorized users and redirect to the `/login` screen.
- **API Interceptor**: An Axios interceptor (`utils/api.ts`) actively fetches the current session from Supabase (`supabase.auth.getSession()`) and injects the `Bearer` token into all outgoing requests.

### Server-Side (Node + Express)
- **Middleware Integration**: Express acts as the primary API router. 
  - The custom `protect` middleware strictly extracts the JWT token directly from the request headers and asks the Supabase Auth server to verify it via `supabase.auth.getUser(token)`.
- **Database Architecture**: Mongoose schemas map to MongoDB collections. Multi-tenant architecture dictates that every operation in the `resumes` controller matches specifically against `req.user.id` to prevent data leakage.
- **AI Processing Pipeline**: 
  1. A file reaches the `/upload` endpoint via `multer`.
  2. The parser buffers the text (`pdf-parse` for PDFs).
  3. The raw string is fed securely into the Gemini API (`@google/generative-ai`) to systematically structure and score the contents against ATS best practices.

## 3. Security Considerations
- **No Shared JWT Secret**: Unlike traditional Custom JWT solutions, this app offloads session token signing to Supabase, guaranteeing high cryptographic security without local secrets risk.
- **Data Isolation**: Database queries strictly filter across the `userId` field ensuring data segregation.

## 4. Notable Optimizations
- **PDF Parse v2**: Utilizes the modern, object-oriented memory-safe `PDFParse()` implementation with an explicit `.destroy()` hook to prevent NodeJS memory leaks during thousands of document uploads.
- **Real-Time UI Updates**: Modifying a specific field updates the React Context layer in memory instantly, followed asynchronously by an API `PUT` request, avoiding full-page reloads and keeping the user engaged.
