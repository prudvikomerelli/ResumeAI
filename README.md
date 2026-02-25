# ResumeAI — ATS Resume & Cover Letter Tailoring Platform

A production-style SaaS that transforms your resume into an **ATS-optimized, job-specific resume** and **tailored cover letter** using AI. Includes ATS match scoring, keyword gap analysis, and application history.

## Features

- **AI Resume Optimization** — Paste JD + resume, get ATS-optimized output
- **Tailored Cover Letters** — Role-specific, non-generic cover letters
- **ATS Score (0-100)** — Keyword coverage, role alignment, skills completeness
- **Keyword Gap Analysis** — Matched & missing keywords at a glance
- **Application History** — Track, revisit, edit, and regenerate past applications
- **ATS-Safe DOCX Export** — Clean formatting with no tables/columns/graphics
- **Stripe Billing** — Free tier (3 generations/day) + Pro tier ($19/mo unlimited)
- **Supabase Auth** — Google, GitHub OAuth + email/password
- **Rate Limiting** — Plan-based daily limits for generations and exports

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Supabase (OAuth + email/password)
- **Payments**: Stripe (Checkout, Customer Portal, Webhooks)
- **AI**: OpenAI GPT-4o-mini (provider-agnostic design)
- **Export**: docx library for ATS-safe DOCX generation

## Project Structure

```
webapp/
├── prisma/schema.prisma          # Database schema
├── scripts/                      # CLI test scripts
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── auth/callback/        # OAuth callback
│   │   ├── app/                  # Protected app routes
│   │   │   ├── page.tsx          # Dashboard (history)
│   │   │   ├── new/              # Generation form
│   │   │   ├── result/[id]/      # Result viewer + editor
│   │   │   ├── settings/         # Account settings
│   │   │   └── billing/          # Subscription management
│   │   └── api/
│   │       ├── generate/         # POST: AI generation pipeline
│   │       ├── generation/[id]/  # CRUD for generations
│   │       ├── score/            # POST: keyword scoring
│   │       ├── export/docx/      # POST: DOCX export
│   │       ├── stripe/           # checkout, portal, webhook
│   │       └── user/             # profile, billing info
│   ├── components/               # UI components
│   └── lib/                      # Utilities, auth, Prisma, Stripe, LLM
└── .env.example                  # Environment template
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase project (for auth)
- Stripe account (for billing)
- OpenAI API key (for AI generation)

### Setup

1. **Install dependencies**
   ```bash
   cd webapp
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3001](http://localhost:3001)

### Local Testing (CLI)

Test the generation pipeline without the UI:

```bash
# Edit scripts/jd.txt and scripts/resume.txt with your content
npx tsx scripts/generate-test.ts
# Results written to outputs/
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/generate` | Generate optimized resume + cover letter |
| POST | `/api/score` | Keyword extraction + match scoring |
| GET/PATCH/DELETE | `/api/generation/[id]` | CRUD for generations |
| POST | `/api/export/docx` | Export ATS-safe DOCX |
| POST | `/api/stripe/checkout` | Create Stripe Checkout session |
| POST | `/api/stripe/portal` | Create Customer Portal session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET/PATCH/DELETE | `/api/user/profile` | User profile management |
| GET | `/api/user/billing` | Billing & usage info |

## Security

- All secrets in `.env` only (never in client bundle)
- Rate limiting per user per day (plan-based)
- Input size limits (JD: 10K chars, Resume: 15K chars)
- Prompt injection guardrails (system rules override user text)
- Output sanitization (XSS prevention)
- Webhook idempotency (Stripe event deduplication)
- Protected routes via Supabase middleware
