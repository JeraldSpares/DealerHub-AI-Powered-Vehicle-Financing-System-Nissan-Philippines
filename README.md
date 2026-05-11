# 🚗 DealerHub: AI-Powered Vehicle Financing System

> **Enterprise-grade vehicle loan management platform built for Nissan Philippines — automating the entire financing pipeline from application submission to release, powered by Google Gemini AI.**

[![Status](https://img.shields.io/badge/status-production-success)]()
[![License](https://img.shields.io/badge/license-proprietary-blue)]()
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple)]()
[![Database](https://img.shields.io/badge/database-Supabase-green)]()
[![Backend](https://img.shields.io/badge/backend-Google%20Apps%20Script-yellow)]()
[![Frontend](https://img.shields.io/badge/frontend-Vanilla%20JS-orange)]()

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [System Workflow](#-system-workflow)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Application Pipeline & Status Definitions](#-application-pipeline--status-definitions)
- [AI Risk Assessment](#-ai-risk-assessment)
- [Key Technical Highlights](#-key-technical-highlights)
- [Installation & Setup](#-installation--setup)
- [Security & Privacy](#-security--privacy)
- [Impact & Results](#-impact--results)
- [Author](#-author)
- [License](#-license)

---

## 📖 Overview

**DealerHub** is a full-stack enterprise application designed to modernize the vehicle financing workflow for automotive dealerships. Built to replace manual, paper-heavy approval processes, the system streamlines credit evaluation, risk assessment, and client communication — significantly reducing turnaround time from days to hours.

The platform serves **three distinct user personas**:

| Persona | Capabilities |
|---------|--------------|
| 👤 **Clients** | Submit vehicle financing applications via a multi-step wizard form with auto-save drafts and 256-bit SSL encryption |
| 🤝 **Agents & Managers** | Receive real-time lead notifications, monitor pipeline progress, and own the relationship with assigned clients |
| 🛡️ **Administrators** | Evaluate applications with AI-powered risk analysis, manage the vehicle catalog, oversee the sales team, and access the executive dashboard |

---

## 📸 Screenshots

### 🔐 Administrator Login Portal
> Secure access gate for authorized Nissan dealer administrators — protected by reCAPTCHA v2, SHA-256 password hashing, and login throttling.

![Administrator Login Portal](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20121733.png)

---

### 🌐 Client Landing Page
> Nissan-branded entry point for prospective buyers. Cinematic hero with the "Elevate Your Drive" CTA launches the multi-step financing application wizard.

![Client Landing Page](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20121847.png)

---

### 📝 Multi-Step Application Wizard
> Clean, guided application flow: **Principal Maker → Financial Data → Review & Submit**. Includes an optional Co-Maker toggle, auto-calculated age from DOB, Philippine province/city autocomplete, and a 256-bit SSL Secure Encryption notice covering Data Privacy Act of 2012 compliance.

![Multi-Step Application Form](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20121924.png)

---

### 📊 Analytics Dashboard
> Real-time executive view showing All Leads, Approved, Good for Release, Released, and the current Top Released model. Features an **interactive Philippine map** with regional heat mapping and a **Finance Approval Rate** doughnut chart.

![Analytics Dashboard](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122121.png)

---

### 🔥 In Progress Leads
> Active pipeline view with KPI tiles for Total In Progress, Warm, Hot, Approved, and Good for Release counts. Inline status badges, AI Recommendations button, and quick-action buttons per row.

![In Progress Leads](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122034.png)

---

### ✅ Leads Progressed
> Historical record of completed, released, lost-sale, and spam-flagged applications. Includes Top Released model tracking and segmented tabs for fast filtering.

![Leads Progressed](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122207.png)

---

### 🚙 Vehicle Catalog Management
> Centralized control for the Brand → Model → Variant → Color hierarchy that powers the client-facing form. Inline editing, active/inactive toggle, and auto-sync to the application wizard.

![Vehicle Catalog Management](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122252.png)

---

### 👥 Sales Team Directory
> Manager-Agent hierarchy management. Each manager can supervise multiple agents; status toggles control who receives lead notifications. Changes sync directly to the public form.

![Sales Team Directory](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122339.png)

---

### ⚙️ Settings Hub
> Mission control for the platform — General configuration, System Lists, Profile & Security, Database Health, Archived Records, Audit Logs, and **AI Risk Rules**. Includes maintenance mode toggle, ASMR sound effects switch, and a custom maintenance message.

![Settings Hub](DEALERHUB%20STSTEM%20SCREENSHOTS/Screenshot%202026-05-04%20122423.png)

---

## ✨ Key Features

### 🤖 AI Risk Assessment Engine
- Integrated with **Google Gemini 2.5 Flash** for intelligent credit evaluation
- Analyzes applicant data against configurable business rules (income thresholds, age limits, employment tenure, TIN verification)
- Generates `LOW RISK`, `MEDIUM RISK`, or `HIGH RISK` scores with detailed reasoning
- **Batch analysis mode** for processing multiple pending applications at once
- Custom AI instructions configurable via admin panel (the "AI Risk Rules" tab in Settings Hub)
- Recommendation history persists with each application for auditability

### 📊 Executive Analytics Dashboard
- Real-time KPI cards (Total Leads, Approved, Good for Release, Released, Top Model)
- **Interactive Philippine map** (Highmaps) with regional heat mapping for GFR and Released sales
- **Sales Momentum** line chart with time-based filters (Today, Week, Month, Year, All Time)
- **Finance Approval Rate** doughnut chart
- Dynamic leaderboards for Agents and Managers
- **Mode of Payment** distribution (Cash, In-house, P.O.)
- Fully drill-down enabled — click any chart element to filter records

### 📝 Smart Application Form
- Multi-step wizard UI with real-time validation
- **Auto-save drafts** using localStorage (never lose progress)
- Dynamic cascading dropdowns (Brand → Model → Variant → Color)
- Philippine province/city autocomplete with 80+ regions
- **Auto-calculate age** from date of birth
- Optional co-maker toggle with automatic field hiding
- reCAPTCHA v2 protection
- 256-bit SSL secure transmission notice for client trust

### 🔐 Enterprise Security
- **SHA-256 password hashing** with automatic migration from plaintext
- Server-side session management via Google Apps Script PropertiesService
- Login attempt throttling (3 attempts → 30-second lockout)
- reCAPTCHA verification on every login
- API keys secured in PropertiesService (not hardcoded)
- Complete audit trail with user actions

### 📋 Kanban Board with Drag & Drop
- Trello-style workflow management
- **Strict one-way progression** enforcement (Warm → Hot → Approved → GFR → Released)
- Smart validation blocks invalid moves (e.g., Cash applications skip "Approved" stage)
- Visual drop indicators (green for valid, red for blocked)

### 📧 Premium Email Automation
- HTML-styled email templates for:
  - Client application confirmation
  - Admin new submission alerts
  - Agent/Manager team notifications
  - Status change updates
- Color-coded status badges that match the dashboard
- Triggered automatically on submission and status changes

### 📄 Export & Reporting
- **Premium styled Excel exports** (xlsx-js-style) with:
  - Color-coded status columns
  - Proper currency formatting (₱ PHP)
  - Frozen headers and auto-column widths
  - Company branding
- **Professional PDF reports** (jsPDF + autoTable):
  - Individual application forms with status watermarks
  - Masterlist reports in landscape mode
  - Dashboard snapshot exports

### 🎨 Design System
- **25+ color themes** with seamless switching
- Auto light/dark mode based on OS preferences
- "Aurora Sweep" animated theme (rainbow mode)
- Fully responsive (mobile, tablet, desktop)
- Custom cursor, ASMR sound effects, micro-interactions
- Secret easter eggs 🎮 (try typing `friday` or `nissan`)

### 🛠️ Admin Tools
- **Vehicle Catalog Management** — Brand/Model/Variant/Color with status toggle
- **Team Hierarchy Management** — Manager-Agent relationships
- **Audit Logs** with filtering and CSV export
- **Factory Reset** with automatic Google Drive backup
- **Archive & Restore** with original status preservation
- Inline editing with auto-save

---

## 🔄 System Workflow

```
       ┌──────────────────────┐
       │   Client visits      │
       │   landing page       │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  Multi-step Wizard   │
       │  (Principal Maker →  │
       │   Financial Data →   │
       │   Review & Submit)   │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐         ┌────────────────────────┐
       │   Submission stored  │────────▶│  Auto Emails sent to:  │
       │   in Supabase        │         │  • Client (confirm)    │
       └──────────┬───────────┘         │  • Admin (new lead)    │
                  │                     │  • Agent/Manager       │
                  ▼                     └────────────────────────┘
       ┌──────────────────────┐
       │   Admin reviews +    │
       │   AI Risk Analysis   │
       │   (Gemini 2.5 Flash) │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────────────────────────────┐
       │  Kanban Pipeline (drag & drop, rank-locked): │
       │                                              │
       │  Warm → Hot → Approved → GFR → Released      │
       │                                              │
       │  • Cash / P.O. skip the "Approved" stage     │
       │  • Lost Sales / Spam are terminal states     │
       └──────────┬───────────────────────────────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  Analytics, Exports, │
       │  Audit Logs, Backup  │
       └──────────────────────┘
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  ┌──────────────────┐        ┌──────────────────┐      │
│  │  Public Form     │        │  Admin Dashboard │      │
│  │  (Wizard UI)     │        │  (Analytics)     │      │
│  └──────────────────┘        └──────────────────┘      │
└────────────┬──────────────────────────┬────────────────┘
             │                          │
             ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│              GOOGLE APPS SCRIPT BACKEND                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  • Authentication & Session Management          │   │
│  │  • Application CRUD Operations                  │   │
│  │  • Email Automation (MailApp)                   │   │
│  │  • AI Risk Assessment Engine                    │   │
│  │  • Audit Logging                                │   │
│  └─────────────────────────────────────────────────┘   │
└────────────┬──────────────────────────┬────────────────┘
             │                          │
             ▼                          ▼
┌──────────────────────┐      ┌──────────────────────────┐
│ SUPABASE (PostgreSQL)│      │   EXTERNAL APIs          │
│  • applications      │      │  • Google Gemini 2.5     │
│  • logs              │      │  • Google reCAPTCHA v2   │
│  • settings          │      │  • Google Drive (backup) │
│  • catalog           │      │                          │
│  • team              │      └──────────────────────────┘
└──────────────────────┘
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Backend** | Google Apps Script (Node-like runtime) |
| **Database** | Supabase (PostgreSQL) |
| **AI / LLM** | Google Gemini 2.5 Flash |
| **Authentication** | Google reCAPTCHA v2 + SHA-256 password hashing |
| **Charts** | Chart.js, Highmaps, Recharts |
| **Exports** | xlsx-js-style, jsPDF, html2canvas |
| **UI Libraries** | Choices.js, Cropper.js, Canvas-Confetti |
| **Fonts** | Inter, Poppins, Orbitron |
| **Icons** | Font Awesome 6 |
| **Backup Storage** | Google Drive |

---

## 📁 Project Structure

```
DealerHub/
├── Code.gs                          # Main backend logic (auth, CRUD, AI, email)
├── Supabase.gs                      # Database helper module (REST wrapper)
├── Form.html                        # Client-facing application wizard
├── Admin.html                       # Administrator dashboard & management UI
├── DEALERHUB STSTEM SCREENSHOTS/    # System screenshots used in this README
└── README.md                        # You are here
```

---

## 🚦 Application Pipeline & Status Definitions

| Status | Rank | Meaning |
|--------|:---:|---------|
| **Warm** | 1 | Newly submitted lead — pending review |
| **Hot** | 2 | Actively engaged — agent in dialogue with the client |
| **Approved** | 3 | Financing approved (In-house only — skipped for Cash / P.O.) |
| **Good for Release** | 4 | All requirements complete, unit reserved |
| **Released** | 5 | Vehicle has been turned over to the client (terminal) |
| **Lost Sale** | — | Deal fell through (terminal — not allowed on Released records) |
| **Spam** | — | Invalid / duplicate / test submission (terminal) |

> 🔒 **Rank-locked progression** — applications can only move *forward* in the pipeline. Backward moves are blocked at the UI level (red drop indicator) and validated again on the server.

### Mode of Payment Branches
- **In-house Financing** → full pipeline (Warm → Hot → **Approved** → GFR → Released)
- **Cash** → fast lane (Warm → Hot → GFR → Released, no "Approved" gate)
- **P.O. (Purchase Order)** → fast lane (Warm → Hot → GFR → Released)

---

## 🧠 AI Risk Assessment

The AI engine evaluates each application against a configurable rule set defined in the **AI Risk Rules** tab of the Settings Hub. A typical analysis considers:

- **Monthly income vs. amortization burden**
- **Age bracket** (e.g., applicants over 60 flagged for shortened-term scrutiny)
- **Employment tenure** (less than X months → flag)
- **TIN format & validity check**
- **Co-Maker presence and strength** (auto-elevates LOW risk when present and qualified)
- **Address consistency** (mismatched home vs. employer regions raise a flag)
- **Custom admin-defined rules** appended at the bottom of the prompt

The model returns a structured JSON verdict containing:

```json
{
  "risk": "LOW | MEDIUM | HIGH",
  "summary": "Concise one-line verdict for the admin table",
  "reasoning": "Bullet-pointed breakdown of the deciding factors",
  "recommended_action": "Approve | Request Documents | Decline"
}
```

Risk verdicts are persisted with the application so future reviewers see the original AI rationale alongside any human override.

---

## 🚀 Key Technical Highlights

### Smart Status Progression Logic
The system enforces business rules through a **rank-based validation engine**:

```javascript
const ranks = {
  "Warm": 1, "Hot": 2, "Approved": 3,
  "Good for Release": 4, "Released": 5
};
// Cannot move backward in the pipeline
// Cash / P.O. applications skip "Approved" stage
// Released records cannot be tagged as Lost Sales
```

### Anti-Race Condition Locking
Critical database operations use global locks to prevent concurrent write conflicts:

```javascript
if (isCatalogSyncing) return; // Skip if another sync is active
isCatalogSyncing = true;      // 🔒 LOCK
// ... database operation ...
isCatalogSyncing = false;     // 🔓 UNLOCK
```

### Backup-Before-Delete Pattern
Destructive operations (like full catalog sync) create in-memory backups first, with automatic restoration on failure:

```javascript
let backup = dbSelect("catalog", { /* ... */ });
try {
  dbDelete("catalog", { id: "gt.0" });
  dbInsert("catalog", newData);
} catch (err) {
  // Emergency restore
  dbInsert("catalog", backup);
}
```

### Dynamic AI Prompt Engineering
Risk assessment prompts are dynamically built with applicant data, system-detected flags, and admin-configurable custom rules — producing consistent, auditable AI decisions.

---

## 🧪 Installation & Setup

> DealerHub is deployed entirely on Google Cloud infrastructure — **no servers to provision and no Docker containers to maintain.**

### Prerequisites
- A Google Workspace account (for Apps Script deployment)
- A Supabase project (free tier is enough to get started)
- A Google Gemini API key
- A Google reCAPTCHA v2 site/secret key pair

### Steps
1. **Create the Apps Script project**
   - Open [script.google.com](https://script.google.com) → New Project
   - Paste `Code.gs`, `Supabase.gs`, `Form.html`, and `Admin.html` into the editor.

2. **Set Script Properties** (Project Settings → Script properties)

   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | `https://<your-project>.supabase.co` |
   | `SUPABASE_KEY` | Service-role key from Supabase |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `RECAPTCHA_SECRET` | reCAPTCHA v2 secret |
   | `ADMIN_EMAIL` | Default admin recipient |

3. **Create the Supabase tables** — `applications`, `logs`, `settings`, `catalog`, `team` (see `Supabase.gs` for the expected columns).

4. **Deploy as Web App**
   - `Deploy → New deployment → Web app`
   - Execute as: *Me*
   - Who has access: *Anyone* (for the public form) or *Anyone in your organization* (for internal only)

5. **First-time setup**
   - Visit the deployed URL → log in with the seeded admin credentials → change the password immediately (auto-hashed to SHA-256 on save).
   - Add vehicle catalog entries and seed the Sales Team Directory before sharing the public form.

---

## 🔒 Security & Privacy

- All credentials stored in Google Apps Script `PropertiesService` (encrypted at rest)
- Passwords hashed with SHA-256 before database storage
- Client data access requires an active server-side session token
- Complete audit logging for compliance with the Philippines **Data Privacy Act of 2012**
- Automatic session expiration on logout
- reCAPTCHA v2 on both the public form and the admin login
- Maintenance mode toggle for guarded downtime (custom message shown to clients)

---

## 📊 Impact & Results

- ⚡ **Significantly reduced** manual loan processing turnaround time
- 🤖 **AI-driven** pre-screening for every application
- 📈 **Real-time analytics** replacing manual Excel reporting
- 🔐 **Zero downtime** during high-volume submission periods
- 📱 **100% responsive** across mobile, tablet, and desktop
- 🗂️ **Single source of truth** — no more spreadsheets scattered across teams

---

## 👨‍💻 Author

**Jerald Rabañez Espares**
- 📧 Email: jeraldespares123@gmail.com
- 📱 Phone: +63 961 1800 374
- 🌐 Salesforce: [Trailblazer Profile](https://www.salesforce.com/trailblazer/yd37qpumn2qb37ujtp)

*AI Developer | Full-Stack Engineer | Cloud & Automation Specialist*

---

## 📝 License

This project is proprietary and developed for **Tetra Sales & Services, Inc. (Nissan Philippines)**. All rights reserved.

For inquiries about licensing or collaboration, please contact the author.

---

## 🙏 Acknowledgments

- **Nissan Philippines (Tetra Sales & Services, Inc.)** — for the opportunity to build this enterprise system
- **Enderun Colleges Business Re-Engineering Unit** — for the development environment and mentorship
- **Google Cloud Platform** — Gemini AI and Apps Script infrastructure
- **Supabase** — for the PostgreSQL backend

---

<div align="center">

**Built with ❤️ in the Philippines 🇵🇭**

*DealerHub © 2026 — Drive the future of vehicle financing.*

</div>
