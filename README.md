# █ XAI_Recruit

A next-generation, agentic technical talent filtering platform designed to completely automate and eliminate bias from the recruitment pipeline. Built with a brutalist, Cyber-Industrial aesthetic.

XAI_Recruit abandons traditional ATS regex matching. Instead, it deploys autonomous **Multi-Agent Neural Pipelines** to extract, empirically verify, and synthesize candidate profiles directly from unstructured PDF resumes using cutting-edge Large Language Models.

---

## ⚡ Core AI Agent Features

The backend orchestration engine is powered by Qwen 2.5 models (7B and 72B) connected via the Featherless AI API. The pipeline executes sequentially through three major phases:

### 1. Neural Extraction Agent (Qwen-7B)
Instead of relying on fragile keyword matching, the Extractor Agent aggressively parses unstructured PDF data. It understands context, extracting the candidate's exact target role and generating a strict JSON payload of claimed technical frameworks.

### 2. Empirical Verifier
Every technology claimed by the candidate is cross-referenced against public evidence (e.g., simulated GitHub / Open Source repository scanning). This generates a strict **Proof-of-Work Matrix**, definitively flagging each skill as either `Verified` or `Unverified`.

### 3. Synthesizer Agent (Qwen-72B)
The heavy-duty 72B model acts as a Principal Engineering Architect. It consumes the resume text alongside the Proof-of-Work Matrix to generate:
- **XAI Evaluation:** A precise `0-100` Match Score, backed by explicitly detected "Pros" and potential "Risk Factors".
- **30-Day Readiness Roadmap:** A custom onboarding plan outlining exactly what the candidate needs to accomplish in their first month to hit the ground running.

### 4. AI Inquisitor Playbook
If the Empirical Verifier flags any skills as `Unverified` (meaning the candidate claims a skill but has no open-source proof), the Synthesizer Agent automatically builds an **Interrogation Playbook**.
- Generates 3 highly specific, structural technical questions for the recruiter to ask out loud.
- Highlights exact **Target Keywords** the candidate should use in a genuine response.
- Flags specific **Deception Red Flags** (bluffing patterns, superficial memorization) so even non-technical recruiters can spot fake expertise.

---

## 🛠️ Architecture Stack

### Frontend (Client Portal & Recruiter Workspace)
- **Framework:** React 18 / Vite / TypeScript
- **Styling:** TailwindCSS (Strict Cyber-Industrial Dark Mode: Zinc/Emerald/Orange)
- **Motion:** Framer Motion for smooth drawer slide-outs and radial graphic animations.
- **Data Viz:** Recharts for the Talent Analytics dashboard.
- **Icons:** Lucide React

### Backend (Agentic Engine)
- **Framework:** Node.js / Express
- **Database:** MongoDB (Mongoose ORM) for Candidate persistence and System Telemetry logs.
- **LLM Middleware:** Official OpenAI Node SDK mapped to the Featherless AI inference endpoint.
- **File Processing:** `multer` (memory storage) and `pdf-parse`.
- **Real-Time Telemetry:** Implements **Server-Sent Events (SSE)** to stream the live thought-process of the AI agents directly to the frontend React UI in real-time.

---

## 🪶 The Featherless AI Infrastructure Advantage

This platform relies exclusively on the **Featherless AI** inference platform to power its agentic logic. This integration provides massive architectural advantages over traditional closed-source or locally-hosted setups:

- **Serverless Open-Weights Engine:** We can orchestrate massive, state-of-the-art open models (like the `Qwen/Qwen2.5-72B-Instruct` synthesizer) with zero infrastructure configuration, bypassing the crippling cloud GPU costs and VRAM constraints of hosting 70B+ parameter models locally.
- **Native Drop-In Compatibility:** The codebase leverages the official `openai` Node.js SDK. By simply swapping the `baseURL` to `https://api.featherless.ai/v1`, the system gains instant access to thousands of Hugging Face models without rewriting any logic.
- **Multi-Model Orchestration:** Featherless allows us to build complex, multi-agent architectures that mix and match model sizes on the fly. We trigger lightning-fast 7B models for raw data extraction, and heavy-duty 72B models for deep-reasoning synthesis within the exact same pipeline execution.
