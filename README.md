# The Editorial Intelligence

AI-powered resume analysis and editing platform. Built with the MERN stack (MongoDB, Express, React TypeScript, Node.js).

---

## Features

- **Editor** — Rich text resume editor with inline AI fix suggestions (vague language, spelling errors, missing keywords)
- **Compare** — Benchmark your resume against top 1% applicants; gap analysis and editorial traits
- **Twin Score** — Uniqueness & originality scoring; generic phrase detector with rewrites
- **Interview Prep** — AI-generated behavioral questions with STAR-method evaluation and scoring
- **Format Wizard** — Chronological / Functional / Hybrid resume format selection
- **Dashboard** — Resume management with ATS score history
- **Auth** — JWT-based register/login/session management

---

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 18 + TypeScript, React Router v6   |
| Styling   | Pure CSS (no framework), custom design system |
| State     | React Context + Hooks                    |
| Backend   | Node.js, Express 4                       |
| Database  | MongoDB + Mongoose                       |
| Auth      | JWT (jsonwebtoken) + bcryptjs            |
| File upload | Multer (PDF/TXT/DOCX, max 10MB)        |
| Validation | express-validator                        |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### 1. Clone / Download

```bash
git clone <your-repo-url>
cd editorial-intelligence
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs root, server, and client dependencies in one command.

### 3. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/editorial-intelligence
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

For MongoDB Atlas, replace MONGODB_URI with your connection string.

### 4. Run in development

```bash
npm run dev
```

This starts both:
- **API server** at `http://localhost:5000`
- **React dev server** at `http://localhost:3000`

The React app is pre-configured to proxy `/api/*` requests to the Express server.

---

## Production Build

```bash
# Build the React client
npm run build

# Start the production server (serves built React + API)
NODE_ENV=production npm start
```

The Express server will serve the React build from `client/build/` in production.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user (protected) |
| PUT  | `/api/auth/change-password` | Change password (protected) |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/resumes` | List all resumes |
| GET    | `/api/resumes/:id` | Get one resume |
| POST   | `/api/resumes` | Create resume |
| PUT    | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST   | `/api/resumes/upload` | Upload resume file |
| POST   | `/api/resumes/:id/apply-fix` | Apply an AI fix |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/:resumeId` | Run full analysis |
| POST | `/api/analysis/:resumeId/interview-answer` | Submit & evaluate interview answer |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/dashboard` | Dashboard stats |
| PUT | `/api/users/profile` | Update profile |

---

## Folder Structure

```
editorial-intelligence/
├── package.json               ← Root: dev script, concurrently
│
├── server/
│   ├── index.js               ← Express app + MongoDB connection
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── User.js            ← bcrypt password, JWT helpers
│   │   └── Resume.js          ← Full schema with embedded Analysis
│   ├── middleware/
│   │   └── auth.js            ← JWT protect + generateToken
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resumes.js         ← CRUD + multer file upload
│   │   ├── analysis.js        ← NLP scoring engine + interview grader
│   │   └── users.js
│   └── uploads/               ← Uploaded resume files (auto-created)
│
└── client/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── App.tsx            ← Routes (protected/public)
        ├── index.tsx
        ├── index.css          ← Full design system (CSS variables)
        ├── types/index.ts     ← All TypeScript interfaces
        ├── utils/api.ts       ← Axios + JWT interceptor
        ├── context/
        │   ├── AuthContext.tsx
        │   └── ResumeContext.tsx
        ├── components/
        │   ├── common/
        │   │   ├── ScoreRing.tsx
        │   │   └── ProgressBar.tsx
        │   ├── layout/
        │   │   └── Navbar.tsx
        │   ├── editor/
        │   │   └── EditorTab.tsx
        │   ├── compare/
        │   │   └── CompareTab.tsx
        │   ├── twinscore/
        │   │   └── TwinScoreTab.tsx
        │   └── interviewprep/
        │       └── InterviewPrepTab.tsx
        └── pages/
            ├── LandingPage.tsx
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── DashboardPage.tsx
            ├── NewResumePage.tsx
            └── EditorPage.tsx
```

---

## Running Tests

```bash
# Server tests (Jest + Supertest)
cd server && npm test

# Client tests (React Testing Library)
cd client && npm test
```

---

## Design System

The app uses a custom CSS design system (no Bootstrap/Tailwind) defined in `client/src/index.css`:

- **Fonts**: Playfair Display (serif headings) + DM Sans (body) + DM Mono (code)
- **Colors**: Navy `#1a1f3a`, Indigo `#3d4fac`, Cream `#f7f5f0`, Gold `#c9a84c`
- **Components**: `.btn`, `.card`, `.badge`, `.form-input`, `.progress-bar-track`, `.score-ring`
- **Animations**: `fadeUp`, `fadeIn`, `spin`, `pulse-dot`

---

## Scaling to Production

1. Use [MongoDB Atlas](https://mongodb.com/cloud/atlas) (free tier available)
2. Set `JWT_SECRET` to a cryptographically random 64-char string
3. Add rate limiting: `npm install express-rate-limit`
4. Deploy to [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io) (all have free tiers)
5. Set `NODE_ENV=production` in your deployment environment

---

## License

MIT
