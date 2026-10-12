# SoloDesk AI ⚡
> **Private Freelance Ledger & Financial Intelligence Powered by Google Gemma 2**  
> *Built for Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Gemma 2 Powered](https://img.shields.io/badge/Model-Gemma%202%20(2B--IT%20%7C%209B--IT)-indigo.svg)](https://ai.google.dev/gemma)
[![Privacy: Zero Egress](https://img.shields.io/badge/Privacy-100%25%20On--Device%20(Zero%20Egress)-34d399.svg)](#why-open-innovation-matters)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25%20Ready-blue.svg)](#offline-resilience)

---

## 🎯 What is SoloDesk AI?

SoloDesk AI is a **privacy-first, zero-marginal-cost financial copilot and invoice intelligence engine** engineered specifically for freelancers, consultants, and solo agency founders.

Freelancers frequently sign strict client Non-Disclosure Agreements (NDAs) and manage sensitive project rates, banking remittance numbers, and client deliverables. Uploading client contracts and billing invoices to proprietary third-party cloud AI APIs breaches confidentiality and incurs heavy per-token cloud costs that destroy micro-margins.

SoloDesk AI runs **Google's open-weight Gemma 2 model family** directly on the user's laptop. It audits billed line items against contracts, recovers revenue leaks (such as unbilled out-of-scope revisions and forgotten cloud expenses), crafts strategically calibrated payment follow-ups, and projects Schedule C tax deductions—all with **0 outbound cloud network packets**.

---

## 🚀 Key Features

### 1. 🔍 Gemma 2 Financial Audit & Leak Recovery
- **Scope Creep Detection**: Flags surplus revision cycles and unbilled feature requests outside signed Statements of Work (SOWs).
- **Contract Rate Underbilling**: Automatically catches line items billed below contracted hourly rates.
- **Overdue Terms & Interest Enforcement**: Automatically calculates statutory late penalties (e.g. 2.5% monthly on Net-14 terms) when clients delay payments.
- **Unreimbursed Expenses**: Detects pass-through cloud hosting, domain registrations, or software licenses paid on personal cards.
- **One-Click Remediation**: Click *"Apply Gemma Remediation"* to instantly append recovered items to the invoice and recalculate totals.

### 2. ✉️ Strategic Client Tone Engine
Freelancers struggle to balance relationship warmth with firm cash-flow enforcement. SoloDesk's Gemma Tone Engine generates tailored communications:
- **Gentle & Friendly**: Polite check-ins for newly issued milestones.
- **Firm & Professional**: Direct remittance reminders citing Net-14 due dates.
- **Executive Escalation**: High-urgency notices citing contract interest penalties and accounting repo holds.
- **Retainer Upsell**: Converts completed sprint invoices into recurring monthly retainers.

### 3. ⚡ Local Unstructured Note & Receipt Scanner
Paste messy Slack time logs, WhatsApp client chats, or raw text receipts. Gemma extracts client details, line items, hours, and rates into structured invoice entities without ever touching external servers.

### 4. 📊 Private Freelance Ledger & Tax Deduction Forecaster
- 100% local persistence.
- Aggregates Total Pipeline Volume, Receivables At Risk, Recovered Capital, and Schedule C Tax Deductions.
- Instant JSON/CSV ledger exports and milestone confetti celebrations.

---

## 🧠 Why Open Innovation & Gemma Matter

| Feature | Closed Cloud APIs (OpenAI / Anthropic) | SoloDesk AI (Google Gemma 2 Open Weights) |
| :--- | :--- | :--- |
| **Client Privacy & NDAs** | ❌ Data leaves device; logged & processed on remote servers | ✅ **100% On-Device:** 0 bytes egress; safe for strict NDAs |
| **Ongoing Operating Cost** | ❌ $30–$150+/month in API tokens and SaaS subscription tiers | ✅ **$0.00 / month:** Runs on local CPU / Metal / WebGPU |
| **Offline Independence** | ❌ Requires constant, stable internet connection | ✅ **Works 100% offline:** Airplanes, trains, remote sites |
| **Model Sovereignty** | ❌ Risk of endpoint deprecation and abrupt pricing spikes | ✅ **Permanent ownership:** Swap between Gemma 2B and 9B |

---

## 🏗️ Architecture & Gemma Prompt Pipeline

```mermaid
flowchart TD
    A[Freelance Invoice / Raw Note] --> B[Gemma Prompt Formatter]
    B --> C[<start_of_turn>user\n[STRICT FINANCIAL AUDIT PROTOCOL]\n...]
    C --> D[Gemma 2 Open-Weight Engine]
    D --> E[Neural Reasoning & Thought Trace]
    E --> F[Structured Audit Findings]
    F --> G[Scope Creep Alert]
    F --> H[Rate Leak Remediation]
    F --> I[Overdue Penalty Accrual]
    F --> J[Schedule C Tax Write-off]
    G & H & I & J --> K[One-Click Ledger Update]
```

---

## 🛠️ Tech Stack

- **AI Model**: Google Gemma 2 (2B-IT & 9B-IT) Open-Weight Family
- **Frontend Core**: React 19 + TypeScript + Vite
- **Styling**: Cyber-editorial Vanilla CSS Design System with Glassmorphism
- **Icons**: Lucide Icons
- **Interactive FX**: Canvas Confetti
- **Session Preservation**: DevRelay Gateway (`{% agent_session 859 %}`)

---

## 💻 Local Setup & Quickstart

```bash
# 1. Clone repository
git clone https://github.com/dr5t/solodesk-ai.git
cd solodesk-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 🏆 Hacktoberfest 2026 Submission

- **Challenge**: Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle
- **Category Targets**: 
  - **Overall Winner ($250)**
  - **Best Use of Gemma ($200 Featured Category)**
- **Author**: Shaurya Tiwari ([@dr5t](https://dev.to/dr5t))
- **Live Agent Session**: [View Session Transcript #859 on DEV](https://dev.to/agent_sessions/solodesk-ai-private-freelance-financial-intelligence-with-gemma-2-pkvxaj)

---

## 📄 License

MIT License — free for solo creators, freelancers, and builders worldwide.
