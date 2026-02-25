# ResumeAI — Routes

## Pages (UI Routes)

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Landing page |
| `/login` | `src/app/login/page.tsx` | Login |
| `/signup` | `src/app/signup/page.tsx` | Signup |
| `/app` | `src/app/app/page.tsx` | Dashboard (history) |
| `/app/new` | `src/app/app/new/page.tsx` | Generation form |
| `/app/result/[id]` | `src/app/app/result/[id]/page.tsx` | Result viewer & editor |
| `/app/settings` | `src/app/app/settings/page.tsx` | Account settings |
| `/app/billing` | `src/app/app/billing/page.tsx` | Subscription management |

## API Routes

| Route | File | Description |
|-------|------|-------------|
| `POST /api/generate` | `src/app/api/generate/route.ts` | AI generation pipeline |
| `GET/PATCH/DELETE /api/generation/[id]` | `src/app/api/generation/[id]/route.ts` | CRUD for generations |
| `POST /api/score` | `src/app/api/score/route.ts` | Keyword scoring |
| `POST /api/export/docx` | `src/app/api/export/docx/route.ts` | ATS-safe DOCX export |
| `POST /api/stripe/checkout` | `src/app/api/stripe/checkout/route.ts` | Stripe Checkout session |
| `POST /api/stripe/portal` | `src/app/api/stripe/portal/route.ts` | Customer Portal session |
| `POST /api/stripe/webhook` | `src/app/api/stripe/webhook/route.ts` | Stripe webhook handler |
| `POST /api/stripe/sync` | `src/app/api/stripe/sync/route.ts` | Stripe sync |
| `GET/PATCH/DELETE /api/user/profile` | `src/app/api/user/profile/route.ts` | User profile management |
| `GET /api/user/billing` | `src/app/api/user/billing/route.ts` | Billing & usage info |

## Auth

| Route | File | Description |
|-------|------|-------------|
| `/auth/callback` | `src/app/auth/callback/route.ts` | OAuth callback |

## Layouts

| Route | File | Description |
|-------|------|-------------|
| Root | `src/app/layout.tsx` | Root layout |
| App | `src/app/app/layout.tsx` | Protected app layout |

## Summary

- **8** pages
- **10** API routes
- **1** auth route
- **2** layouts
