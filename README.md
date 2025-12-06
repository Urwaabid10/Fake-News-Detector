# 🕵️ Fake News Detector (Powered by Qubic & Gemini)

**Submission for Qubic Hack the Future: Track 2 - EasyConnect Integrations**

## 🚀 Project Overview
The **Fake News Detector** is a "Decentralized Truth Oracle" that bridges AI Analysis with the Qubic Ecosystem.
It acts as the **Intelligence Layer** for no-code automations. When fake news is detected, we not only verify it on-chain but can also trigger **Zapier, Make, or n8n** workflows to alert communities instantly.

### Key Features
*   **🧠 AI-Powered Analysis**: Uses Google Gemini to detect Fake News, Scams, and Rumors.
*   **🌍 Search Grounding**: Verifies claims against trusted sources (BBC, Reuters).
*   **🔗 Qubic Network Proof**: Anchors the verdict to the live Qubic Blockchain (Epoch/Tick) for immutable truth.
*   **⚡ EasyConnect Integration (Track 2)**: 
    *   **Universal Webhook Trigger**: Paste your **Zapier/Make** webhook URL directly into the UI.
    *   **Action**: When analysis runs, the app auto-posts the verdict + confidence score to your automation flow.
    *   *Use Case*: Automatically post "Scam Alerts" to Discord or Telegram when the AI detects fraud.

---

## 🛠️ Tech Stack
*   **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JS
*   **AI Engine**: Google Gemini API (Flash Lite)
*   **Blockchain**: Qubic Network (Public RPC)
*   **Integration**: Standard JSON Webhooks

---

## ⚡ How to Run
1.  **Clone & Setup**:
    ```bash
    git clone <your-repo>
    npx serve .
    ```
2.  **Configure**:
    *   Add your Google Gemini API Key in `config.js`.
3.  **Track 2 Demo (No-Code)**:
    *   Create a simple webhook in **Zapier** or **Make**.
    *   Paste the URL into the **"Webhook URL"** box in the app.
    *   Click **Analyse**.
    *   *Result*: See your automation trigger instantly!

---

## 🏆 Qubic Integration Details
**1. On-Chain Verification**
We construct a Smart Contract Transaction Payload containing the `verdict` and `integrity_hash`, stamped with the live Qubic `lastTick`.

**2. No-Code Bridge**
We allow any Qubic community member to build "Truth Bots" without coding by simply connecting our app to their no-code tools via the built-in webhook feature.
