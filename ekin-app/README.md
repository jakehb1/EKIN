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

## Deploy to Vercel (Production)

### 1. Push code to main branch

```bash
git checkout main
git merge claude/weekly-accountability-tool-TLuNu
git push origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your EKIN repository
4. **Configure Build Settings:**
   - Root Directory: `ekin-app`
   - Framework: Next.js
   - Build Command: `npm run build`

### 3. Set up Vercel Postgres

1. In your project dashboard, go to **Storage** tab
2. Click **"Create Database"**
3. Choose **"Postgres"** → **"Hobby"** (free)
4. Click **"Connect to Project"**
5. Vercel will auto-add `DATABASE_URL` to your environment variables

### 4. Add Environment Variables

In Vercel project settings → Environment Variables:

```bash
# Auto-added by Vercel Postgres
DATABASE_URL=<auto-populated>

# Generate with: openssl rand -base64 32
JWT_SECRET=<your-secure-random-string>

# Your production domain
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

### 5. Deploy

Click **"Deploy"** and wait ~2 minutes.

### 6. Initialize Database

After first deploy, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run database migrations
vercel env pull .env.local
npx prisma db push
```

### 7. Set up Custom Domain (Optional)

1. In Vercel project → **Settings** → **Domains**
2. Add `ekin.io` (or your domain)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` to `https://ekin.io`

---

## Local Development (Alternative: Docker Postgres)

If you don't want to use a remote database for local dev:

```bash
# Run Postgres in Docker
docker run --name ekin-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ekin -p 5432:5432 -d postgres

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ekin"
```

---

## Design Philosophy

- Outcomes only — Did it ship? Yes or no.
- Three sentences max — Forces clarity
- Weekly cadence — One update per week
- Zero friction — No task management, no comments, no integrations

Inspired by justcancel.io — bold typography, black and white, lots of whitespace.

---

**Built with Next.js. Deploy anywhere.**
