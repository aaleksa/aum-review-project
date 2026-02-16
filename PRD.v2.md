# Product Requirements Document (PRD)

## Project Overview
A financial advisor marketing automation platform with AI-powered content generation and compliance workflows, specifically designed for FINRA/SEC-regulated financial advisors.

---

## 1️⃣ MVP Phase 1 — Features & Scope

| Feature                                 | Description                                                                                 | Tech / Stack                        |
|------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------|
| **AI Content Generation (FINRA/SEC)**    | Advisors input prompt (e.g., "Roth conversions"). LLM generates compliant content for social, email, ads. Must incorporate FINRA/SEC rules. | AWS Lambda (TypeScript), OpenAI/Claude, Compliance prompt engineering |
| **Content CRUD**                        | Advisors create/edit content. Includes validation, versioning, and audit trail.              | Vercel API Routes, PostgreSQL       |
| **Approval Workflow**                   | Multi-step: Draft → Pending → Needs Changes → Approved → Posted. Compliance user can edit, approve, or request changes. | Vercel API, PostgreSQL              |
| **Compliance Gating**                   | Content cannot be published until compliance-approved.                                      | Role-based access, API checks       |
| **PDF/Word Export for Compliance**      | Generate PDF/Word of content for compliance review. Email to compliance team.                | AWS Lambda, S3, SendGrid            |
| **Audit Trail**                         | Track all content changes, approvals, and status history.                                   | PostgreSQL                          |
| **Direct Social Posting**               | Post approved content to Facebook & LinkedIn via official APIs.                             | FB/LinkedIn API, AWS Lambda         |
| **LinkedIn Messaging Automation**       | Message sequencing and campaign automation via LinkedIn API.                                | AWS Lambda, LinkedIn API            |
| **Facebook Ad Creation**                | Create/manage FB ads via Facebook Ad Form API.                                              | AWS Lambda, FB Ad API               |
| **Email Templating & Sequencing**       | Create/send email campaigns, basic automation.                                              | SendGrid API, Vercel API            |
| **Stripe Subscription & Billing**       | Subscription management, checkout, webhook handling.                                        | Stripe API, Vercel API              |

---

## 2️⃣ Tech Stack by Layer

| Layer         | Tech Stack                              | Responsibility                                     |
| ------------- | --------------------------------------- | -------------------------------------------------- |
| Frontend      | React + Next.js + TypeScript + Tailwind | Dashboard, forms, tables, status display           |
| Backend Light | Vercel API Routes                       | CRUD API, Stripe webhook, SendGrid API triggers    |
| Backend Heavy | AWS Lambda (TypeScript)                 | AI content generation, PDF/Word export, social/ads |
| Database      | PostgreSQL (Aurora Serverless / RDS)    | Users, Content, Approvals, Audit Trail, API tokens |
| Storage       | AWS S3                                  | PDF / Word storage, download links                 |
| Auth          | Clerk                                   | User signup/login, role management, JWT            |
| Integrations  | OpenAI / Stripe / SendGrid / FB / LI    | AI content, payment, emails, social, ads           |

---

## 3️⃣ Architecture Overview

```text
[React/Next.js Frontend] 
        │
        ▼
[Vercel API Routes] ────────────────> [PostgreSQL DB]
        │
        ├─ Stripe Webhook → update DB
        ├─ SendGrid API → send email
        ├─ Lambda Trigger → AI Content / PDF Generation / Social / Ads
                 │
                 ▼
             [AWS Lambda]
                 │
                 ▼
               [S3 Storage]
```

- Frontend triggers Vercel serverless functions for CRUD, webhook handling, email sending.
- For heavy tasks (AI, PDF/Word, social, ads), Vercel functions call AWS Lambda directly.
- Generated PDFs/Words are stored in S3.
- All content + approvals stored in PostgreSQL.
- Social/Ad posting via Lambda integrations.

---

## 4️⃣ Estimations per Stack

### Frontend (React + Next.js + TypeScript + Tailwind)
| Task                       | Estimation (days) | Notes                                      |
| -------------------------- | ----------------- | ------------------------------------------ |
| Auth Integration (Clerk)   | 2                 | Signup, login, roles                       |
| Dashboard / Tables / Forms | 6                 | Content list, status view, inline comments |
| Approval Workflow UI       | 3                 | Status buttons, modals, comments           |
| Stripe Pricing Page        | 2                 | Checkout integration                       |
| Email / Notification UI    | 1                 | Basic email triggers                       |
| Social/Ad Posting UI       | 2                 | FB/LI post, ad forms                       |
| **Total Frontend**         | **16 days**       |                                            |

### Backend Light (Vercel API Routes / TypeScript)
| Task                    | Estimation (days) | Notes                                        |
| ----------------------- | ----------------- | -------------------------------------------- |
| CRUD API (Content)      | 5                 | Create / read / update / delete + validation |
| Approval Workflow Logic | 4                 | Status changes, rules enforcement            |
| Stripe Webhook          | 2                 | Idempotency + DB sync                        |
| SendGrid Email API      | 3                 | Trigger emails on approve                    |
| Audit Trail Logging     | 2                 | Save all changes / versioning                |
| Social/Ad API Triggers  | 2                 | Call Lambda for FB/LI/Ad                     |
| **Total Backend Light** | **18 days**       |                                              |

### Backend Heavy (AWS Lambda + TypeScript)
| Task                            | Estimation (days) | Notes                               |
| ------------------------------- | ----------------- | ----------------------------------- |
| AI Content Generation (<60 sec) | 5                 | Lambda function + OpenAI API call   |
| PDF / Word Generation           | 5                 | Puppeteer / PDFKit, S3 upload       |
| Social Posting Integrations     | 3                 | FB/LI API, OAuth, error handling    |
| Ad Creation Integrations        | 3                 | FB Ad API, campaign logic           |
| Direct Lambda Calls from Vercel | 1                 | Integration testing, error handling |
| **Total Backend Heavy**         | **17 days**       |                                     |

### Database & Storage
| Task                   | Estimation (days) | Notes                            |
| ---------------------- | ----------------- | -------------------------------- |
| PostgreSQL Schema      | 2                 | Users, Content, Approvals, Audit |
| S3 Setup               | 1                 | Bucket policies, access control  |
| **Total DB & Storage** | **3 days**        |                                  |

### Security / Auth / Logging
| Task                   | Estimation (days) | Notes                         |
| ---------------------- | ----------------- | ----------------------------- |
| Clerk auth integration | 1                 | Already partially in frontend |
| JWT / Role enforcement | 2                 | Backend API checks            |
| Audit log enforcement  | 1                 | Confirm all changes saved     |
| **Total Security**     | **4 days**        |                               |

### Overall Stage 1 Estimation
| Layer           | Days                                |
| --------------- | ----------------------------------- |
| Frontend        | 16                                  |
| Backend Light   | 18                                  |
| Backend Heavy   | 17                                  |
| DB & Storage    | 3                                   |
| Security & Auth | 4                                   |
| **Total**       | **58 days (~3 months for 1 dev)**   |

> Notes: QA / buffer +5–7 days; team of 2 → ~1.5–2 months

---

## 5️⃣ Key Points & Out-of-Scope (Stage 1)
- All code in TypeScript monorepo (frontend + backend + lambda functions)
- No SQS/EventBridge in Stage 1 (direct Lambda calls)
- S3 is used for all PDF/Word exports
- Social/Ad automation is basic (no advanced retry/queueing)
- Compliance workflow is enforced at all publishing points
- All integrations (FB, LI, Stripe, SendGrid) are direct, with OAuth where required
- Can scale later by introducing queues, job scheduling, retry logic

---

## 6️⃣ Optional / Deferred Features (Stage 2+)
| Feature                            | Notes                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------- |
| LinkedIn Messaging Sequences       | Requires queueing / rate-limit handling → SQS later                         |
| Facebook Ads Automation            | Campaign → Ad Set → Creative → Lead Form → requires retry / status checking |
| Advanced Retry Logic / Idempotency | For heavy automation / scheduled jobs                                       |
| Job Scheduling / Cron              | For recurring posting / email                                               |
| Instagram Posting                  | API integration, similar to FB/LI                                           |
| Analytics Dashboard                | Impressions, connections, campaign stats                                    |
| Calendar View                      | Scheduling, drag-and-drop UI                                                |

---

## 7️⃣ UI Components (MVP)
- Dashboard with analytics (basic)
- Multi-platform posting interface (LinkedIn, Facebook)
- Campaign/ad creation forms
- Calendar view (basic, optional)
- Approval workflow modals and status badges
- Email/campaign template editor

---

## 8️⃣ Compliance & Security Notes
- LLM prompts must embed FINRA/SEC rules
- All publishing is gated by compliance approval
- Audit trail is mandatory for all content changes
- PDF/Word export for compliance review is required
- Role-based access for Advisors, Compliance, Admin

---

## 9️⃣ Summary
This PRD covers all MVP Phase 1 requirements, tech stack, and realistic estimates. It ensures:
- FINRA/SEC-compliant AI content
- End-to-end compliance workflow
- Direct social/email/ad integrations
- Secure, auditable, and scalable foundation

---

*Prepared: 13 Feb 2026*
*Version: 1.0 (Consistent with requirements.md)*
