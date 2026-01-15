# EKIN

**what did you ship?**

A brutally simple weekly accountability tool where your team logs what they actually shipped. Three sentences. No fluff. No bullshit.

---

## Features

- **Weekly updates** — 280 characters max, forces clarity
- **Team feed** — See what everyone shipped this week
- **Public profiles** — Each user gets a public page at ekin.io/[username]
- **Zero friction** — Log in, type, ship it
- **Black & white** — Monospace terminal aesthetic

---

## Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Prisma** — Database ORM
- **SQLite** — Simple database (MVP)
- **JWT** — Authentication
- **bcryptjs** — Password hashing

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your values (the defaults work for local dev).

### 3. Initialize database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Routes

- `/` — Landing page
- `/signup` — Create account
- `/login` — Log in
- `/dashboard` — Team feed (logged in)
- `/ship` — Write/edit this week's update (logged in)
- `/[username]` — **Public** profile page (anyone can view)

---

## Data Model

### User
- `username` — unique, lowercase, URL-safe
- `email` — unique
- `name` — display name
- `title` — optional job title
- `passwordHash` — bcrypt hashed

### Update
- `userId` — FK to User
- `weekStart` — Monday of that week
- `content` — max 280 chars
- `publishedAt` — null if draft
- Unique constraint: `(userId, weekStart)`

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` (use Vercel Postgres or similar)
   - `JWT_SECRET` (generate secure random string)
   - `NEXT_PUBLIC_BASE_URL` (your production URL)
4. Deploy

For production, consider switching from SQLite to PostgreSQL.

---

## Design Philosophy

- Outcomes only — Did it ship? Yes or no.
- Three sentences max — Forces clarity
- Weekly cadence — One update per week
- Zero friction — No task management, no comments, no integrations

Inspired by justcancel.io — bold typography, black and white, lots of whitespace.

---

**Built with Next.js. Deploy anywhere.**
