# 🚗 DealerHub: AI-Powered Vehicle Financing System

> **Enterprise-grade vehicle loan management platform built for Nissan Philippines — automating the entire financing pipeline from application submission to release, powered by Google Gemini AI.**

[![Status](https://img.shields.io/badge/status-production-success)]()
[![License](https://img.shields.io/badge/license-proprietary-blue)]()
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple)]()
[![Database](https://img.shields.io/badge/database-Supabase-green)]()

---

## 📖 Overview

**DealerHub** is a full-stack enterprise application designed to modernize the vehicle financing workflow for automotive dealerships. Built to replace manual, paper-heavy approval processes, the system streamlines credit evaluation, risk assessment, and client communication — significantly reducing turnaround time from days to hours.

The platform serves **three distinct user personas**:

- **Clients** — Submit vehicle financing applications via a multi-step wizard form
- **Agents & Managers** — Receive real-time lead notifications and track pipeline progress
- **Administrators** — Evaluate applications with AI-powered risk analysis, manage the catalog, and oversee operations via an executive dashboard

---

## ✨ Key Features

### 🤖 AI Risk Assessment Engine
- Integrated with **Google Gemini 2.5 Flash** for intelligent credit evaluation
- Analyzes applicant data against configurable business rules (income thresholds, age limits, employment tenure, TIN verification)
- Generates `LOW RISK`, `MEDIUM RISK`, or `HIGH RISK` scores with detailed reasoning
- **Batch analysis mode** for processing multiple pending applications at once
- Custom AI instructions configurable via admin panel

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
│   SUPABASE (PostgreSQL)│     │   EXTERNAL APIs         │
│  • applications        │     │  • Google Gemini 2.5    │
│  • logs                │     │  • Google reCAPTCHA v2  │
│  • settings            │     │                         │
│  • catalog             │     └─────────────────────────┘
│  • team                │
└──────────────────────┘
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Backend** | Google Apps Script (Node-like runtime) |
| **Database** | Supabase (PostgreSQL) |
| **AI/LLM** | Google Gemini 2.5 Flash |
| **Authentication** | Google reCAPTCHA v2 + SHA-256 |
| **Charts** | Chart.js, Highmaps, Recharts |
| **Exports** | xlsx-js-style, jsPDF, html2canvas |
| **UI Libraries** | Choices.js, Cropper.js, Canvas-Confetti |
| **Fonts** | Inter, Poppins, Orbitron |
| **Icons** | Font Awesome 6 |

---

## 📁 Project Structure

```
DealerHub/
├── Code.gs              # Main backend logic (auth, CRUD, AI, email)
├── Supabase.gs          # Database helper module
├── Form.html            # Client-facing application wizard
├── Admin.html           # Administrator dashboard & management UI
└── README.md            # This file
```

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
// Cash/P.O. applications skip "Approved" stage
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
} catch(err) {
  // Emergency restore
  dbInsert("catalog", backup);
}
```

### Dynamic AI Prompt Engineering
Risk assessment prompts are dynamically built with applicant data, system-detected flags, and admin-configurable custom rules — producing consistent, auditable AI decisions.

---

## 📸 Screenshots

> *Screenshots coming soon — dashboard, form wizard, AI risk assessment, Kanban board*

---

## 🔒 Security & Privacy

- All credentials stored in Google Apps Script `PropertiesService` (encrypted at rest)
- Passwords hashed with SHA-256 before database storage
- Client data access requires active server-side session token
- Complete audit logging for compliance with the Philippines **Data Privacy Act of 2012**
- Automatic session expiration on logout

---

## 📊 Impact & Results

- ⚡ **Significantly reduced** manual loan processing turnaround time
- 🤖 **AI-driven** pre-screening for every application
- 📈 **Real-time analytics** replacing manual Excel reporting
- 🔐 **Zero downtime** during high-volume submission periods
- 📱 **100% responsive** across mobile, tablet, and desktop

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
