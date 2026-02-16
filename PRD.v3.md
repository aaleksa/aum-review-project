# Product Requirements Document (PRD)

## Project Overview
A financial advisor marketing automation platform with AI-powered content generation and compliance workflows, specifically designed for FINRA/SEC-regulated financial advisors.


---

## Project File Architecture

Рекомендована структура для TypeScript monorepo (Vercel + AWS Lambda):

```
aum-review-project/
├─ backend/                # Serverless API (Vercel Functions)
│  ├─ content.ts           # CRUD Content API
│  ├─ approval.ts          # Approval workflow API
│  ├─ stripe.ts            # Stripe webhook API
│  ├─ sendgrid.ts          # Email triggers API
│  ├─ linkedin.ts          # LinkedIn triggers API
│  ├─ facebook.ts          # Facebook triggers API
│  └─ audit.ts             # Audit trail API
├─ lambda/                 # AWS Lambda heavy functions
│  ├─ ai-content.ts        # AI content generation
│  ├─ pdf-export.ts        # PDF/Word export
│  ├─ linkedin-post.ts     # LinkedIn posting
│  ├─ facebook-post.ts     # Facebook posting
│  └─ fb-ad.ts             # Facebook Ad creation
├─ src/                    # Frontend (React/Next.js)
│  ├─ pages/
│  ├─ components/
│  └─ ...                  # UI, forms, dashboard, etc.
├─ db/                     # DB schema/migrations
│  └─ schema.sql
├─ storage/                # S3 config/scripts (якщо потрібно)
├─ vercel.json             # Vercel config (тільки backend/ як serverless)
├─ package.json
├─ README.md
└─ ...existing code...
```

**Пояснення:**
- backend/ — легкі API (Vercel), CRUD, workflow, інтеграції, webhooks
- lambda/ — важкі функції (AWS Lambda): AI, PDF, соцмережі, Ads
- src/ — фронтенд (React/Next.js)
- db/ — схема бази даних, міграції
- storage/ — скрипти для S3 (опціонально)
- vercel.json — налаштування деплою (тільки backend/ як serverless)

---
## 1 MVP Phase 1 — Features & Scope

### Core Platform Features
| Feature                                 | Description                                                                                 | Tech / Stack                        |
|------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------|
| **AI Content Generation (FINRA/SEC)**    | Advisors input prompt (e.g., "Roth conversions"). LLM generates compliant content for social, email, ads. Must incorporate FINRA/SEC rules. | AWS Lambda (TypeScript), OpenAI/Claude, Compliance prompt engineering |
| **Content CRUD**                        | Advisors create/edit content. Includes validation, versioning, and audit trail.              | Vercel API Routes, PostgreSQL       |
| **Approval Workflow**                   | Multi-step: Draft → Pending → Needs Changes → Approved → Posted. Compliance user can edit, approve, or request changes. | Vercel API, PostgreSQL              |
| **Compliance Gating**                   | Content cannot be published until compliance-approved.                                      | Role-based access, API checks       |
| **PDF/Word Export for Compliance**      | Generate PDF/Word of content for compliance review. Email to compliance team.                | AWS Lambda, S3, SendGrid            |
| **Audit Trail**                         | Track all content changes, approvals, and status history.                                   | PostgreSQL                          |
| **Email Templating & Sequencing**       | Create/send email campaigns, basic automation.                                              | SendGrid API, Vercel API            |
| **Stripe Subscription & Billing**       | Subscription management, checkout, webhook handling.                                        | Stripe API, Vercel API              |

### LinkedIn Workstream
| Feature                                 | Description                                                                                 | Tech / Stack                        |
|------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------|
| **Direct LinkedIn Posting**             | Post approved content to LinkedIn via official API.                                         | LinkedIn API, AWS Lambda            |
| **LinkedIn Messaging Automation**       | Message sequencing and campaign automation via LinkedIn API.                                | AWS Lambda, LinkedIn API            |

### Facebook Workstream
| Feature                                 | Description                                                                                 | Tech / Stack                        |
|------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------|
| **Direct Facebook Posting**             | Post approved content to Facebook via official API.                                         | Facebook API, AWS Lambda            |
| **Facebook Ad Creation**                | Create/manage FB ads via Facebook Ad Form API.                                              | AWS Lambda, FB Ad API               |

---

## 2 Tech Stack by Layer

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

## 3 Architecture Overview

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

## 4 Estimations per Stack

### Frontend (React + Next.js + TypeScript + Tailwind)
| Task                       | Estimation (days) | Notes                                      |
| -------------------------- | ----------------- | ------------------------------------------ |
| Auth Integration (Clerk)   | 2                 | Signup, login, roles                       |
| Dashboard / Tables / Forms | 6                 | Content list, status view, inline comments |
| Approval Workflow UI       | 3                 | Status buttons, modals, comments           |
| Stripe Pricing Page        | 2                 | Checkout integration                       |
| Email / Notification UI    | 1                 | Basic email triggers                       |
| LinkedIn Posting UI        | 1                 | LI post interface                           |
| Facebook Posting/Ad UI     | 1                 | FB post, ad forms                           |
| **Total Frontend**         | **16 days**       |                                            |

### Backend Light (Vercel API Routes / TypeScript)
| Task                    | Estimation (days) | Notes                                        |
| ----------------------- | ----------------- | -------------------------------------------- |
| CRUD API (Content)      | 5                 | Create / read / update / delete + validation |
| Approval Workflow Logic | 4                 | Status changes, rules enforcement            |
| Stripe Webhook          | 2                 | Idempotency + DB sync                        |
| SendGrid Email API      | 3                 | Trigger emails on approve                    |
| Audit Trail Logging     | 2                 | Save all changes / versioning                |
| LinkedIn API Triggers    | 1                 | Call Lambda for LI                           |
| Facebook/Ad API Triggers | 1                 | Call Lambda for FB/Ad                        |
| **Total Backend Light** | **18 days**       |                                              |

### Backend Heavy (AWS Lambda + TypeScript)
| Task                            | Estimation (days) | Notes                               |
| ------------------------------- | ----------------- | ----------------------------------- |
| AI Content Generation (<60 sec) | 5                 | Lambda function + OpenAI API call   |
| PDF / Word Generation           | 5                 | Puppeteer / PDFKit, S3 upload       |
| LinkedIn Posting Integration    | 2                 | LI API, OAuth, error handling       |
| Facebook Posting Integration    | 1                 | FB API, OAuth, error handling       |
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

## 5 Key Points & Out-of-Scope (Stage 1)
- All code in TypeScript monorepo (frontend + backend + lambda functions)
- No SQS/EventBridge in Stage 1 (direct Lambda calls)
- S3 is used for all PDF/Word exports
- Social/Ad automation is basic (no advanced retry/queueing)
- Compliance workflow is enforced at all publishing points
- All integrations (FB, LI, Stripe, SendGrid) are direct, with OAuth where required
- Can scale later by introducing queues, job scheduling, retry logic

---

## 6 Optional / Deferred Features (Stage 2+)
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

## 7 Estimations for Stage 2

### Frontend (React + Next.js + TypeScript + Tailwind)
| Task                       | Estimation (days) | Notes                                      |
| -------------------------- | ----------------- | ------------------------------------------ |
| Analytics Dashboard        | 4                 | Charts, metrics, data fetching             |
| Calendar View              | 3                 | Drag-and-drop scheduling UI                |
| **Total Frontend**         | **7 days**        |                                            |

### Backend Light (Vercel API Routes / TypeScript)
| Task                    | Estimation (days) | Notes                                        |
| ----------------------- | ----------------- | -------------------------------------------- |
| API Updates for Analytics| 2                 | Endpoints for metrics, calendar data         |
| **Total Backend Light** | **2 days**        |                                              |

### Backend Heavy (AWS Lambda + TypeScript)
| Task                            | Estimation (days) | Notes                               |
| ------------------------------- | ----------------- | ----------------------------------- |
| LinkedIn Messaging Sequences    | 5                 | SQS integration, rate limiting      |
| Facebook Ads Automation         | 5                 | Advanced campaign logic, retry      |
| Advanced Retry / Idempotency    | 3                 | Across all automations              |
| Job Scheduling / Cron           | 3                 | EventBridge setup, recurring jobs   |
| Instagram Posting               | 2                 | API integration, similar to FB/LI   |
| **Total Backend Heavy**         | **18 days**       |                                     |

### Database & Storage
| Task                   | Estimation (days) | Notes                            |
| ---------------------- | ----------------- | -------------------------------- |
| Schema Updates         | 1                 | Analytics tables, scheduling     |
| **Total DB & Storage** | **1 day**         |                                  |

### Security / Auth / Logging
| Task                   | Estimation (days) | Notes                         |
| ---------------------- | ----------------- | ----------------------------- |
| Updates for New Features| 1                 | Ensure compliance             |
| **Total Security**     | **1 day**         |                               |

### Overall Stage 2 Estimation
| Layer           | Days                                |
| --------------- | ----------------------------------- |
| Frontend        | 7                                   |
| Backend Light   | 2                                   |
| Backend Heavy   | 18                                  |
| DB & Storage    | 1                                   |
| Security & Auth | 1                                   |
| **Total**       | **29 days (~1.5 months for 1 dev)** |

> Notes: QA / buffer +3–5 days; team of 2 → ~1 month

---

## 8 UI Components (MVP)
- Dashboard with analytics (basic)
- Multi-platform posting interface (LinkedIn, Facebook)
- Campaign/ad creation forms
- Calendar view (basic, optional)
- Approval workflow modals and status badges
- Email/campaign template editor

---

## 9 Compliance & Security Notes
- LLM prompts must embed FINRA/SEC rules
- All publishing is gated by compliance approval
- Audit trail is mandatory for all content changes
- PDF/Word export for compliance review is required
- Role-based access for Advisors, Compliance, Admin

---

## 10 Summary
This PRD covers all MVP Phase 1 requirements, tech stack, and realistic estimates. It ensures:
- FINRA/SEC-compliant AI content
- End-to-end compliance workflow
- Direct social/email/ad integrations
- Secure, auditable, and scalable foundation

---

*Prepared: 13 Feb 2026*
*Version: 1.0 (Consistent with requirements.md)*
