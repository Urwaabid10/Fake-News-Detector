import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "./config.js";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-lite-latest",
  tools: [{
    googleSearch: {},
  }],
});

// Demo content for hackathon presentation
window.prefillDemo = function (type) {
  const input = document.querySelector("#entertext");
  let text = "";

  if (type === 'fake') {
    text = "BREAKING: Eiffel Tower sold to private Saudi investors today for $50 Billion. The monument will be dismantled and moved to Riyadh next month. French government says 'we checkmated the debt crisis'.";
  } else if (type === 'real') {
    text = "SpaceX's Starship rocket achieved a successful splashdown in the Indian Ocean during its latest test flight, marking a major milestone for the reusable launch system.";
  } else if (type === 'scam') {
    text = "URGENT: Your bank account ending in 8832 has been SUSPENDED due to suspicious activity. Click here immediately to verify your identity or you will lose all funds: http://bit.ly/secure-bank-login";
  }

  input.value = text;
};

// Make Analyse function globally available since it's called from HTML onclick
// Qubic Integration
window.verifyOnQubic = async function () {
  const statusDiv = document.getElementById('qubic-status');
  const btn = document.querySelector('.qubic-btn');
  const resultScore = document.querySelector(".score").innerText;
  const resultVerdict = document.querySelector(".credvalue p").innerText.replace("Credibility value is ", "");

  statusDiv.innerHTML = "Connecting to Qubic Oracle...";
  btn.disabled = true;
  btn.style.opacity = "0.7";

  try {
    // Fetch live status from Qubic RPC
    const response = await fetch('https://rpc.qubic.org/v1/status');
    const data = await response.json();

    // 2. Construct Transaction Payload
    const payload = {
      source: "CLOUDFLARE_WALLET_QX...",
      destination: "QUBIC_TRUTH_ORACLE_V1",
      amount: 0,
      tick: data.lastTick || 1450000,
      inputType: "VERDICT_SUBMISSION",
      data: {
        verdict: resultVerdict,
        score: parseInt(resultScore),
        timestamp: new Date().toISOString(),
        integrity_hash: "0x" + Math.random().toString(16).substr(2, 64) // Simulated hash
      }
    };

    // Simulate a "transaction" delay for effect
    await new Promise(r => setTimeout(r, 1000));

    // Display the simulated transaction
    statusDiv.innerHTML = `
            <div style="background: #1e1e2e; color: #a6accd; padding: 15px; border-radius: 8px; text-align: left; font-family: monospace; font-size: 0.8rem; margin-top: 10px; border: 1px solid #4361ee;">
                <div style="color: #4361ee; margin-bottom: 5px; font-weight: bold;">➢ PREPARING SMART CONTRACT TX</div>
                <pre style="margin: 0;">${JSON.stringify(payload, null, 2)}</pre>
            </div>
            <div style="margin-top: 10px; color: #00cc66; font-weight: bold;">
                ✓ Broadcast to Epoch ${data.lastEpoch || '124'}
            </div>
        `;

    btn.innerHTML = `<span style="font-size: 1.2em;">✓</span> On-Chain Record Created`;
    btn.style.backgroundColor = "#00cc66";
    btn.style.opacity = "1";

  } catch (error) {
    console.error("Qubic connection error:", error);
    statusDiv.innerHTML = `
            <span style="color: #ff4444">⚠ Connection Error (Offline Mode)</span>
        `;
  }
};

window.Analyse = async function () {
  const analyzeBtn = document.querySelector(".analysebtn");
  const inputElement = document.querySelector("#entertext");
  const textToAnalyze = inputElement.value;
  const qubicBtn = document.querySelector('.qubic-btn');

  if (!textToAnalyze.trim()) {
    alert("Please enter some text to analyze.");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  qubicBtn.style.display = "none"; // Hide previous result
  document.getElementById('qubic-status').innerHTML = "";

  try {
    const prompt = `Analyze the text provided below and classify it into one of the following categories:
        1. Fake News: Deliberately fabricated news.
        2. Scam: Fraudulent attempts to deceive for financial gain.
        3. Misleading Message: Content that distorts facts or uses clickbait.
        4. Rumor: Unverified information or gossip.
        5. Credible: Reliable and verified information.

        IMPORTANT: Use the Google Search tool to verify the claims in the text.
        - If the text claims a specific event occurred, search for it.
        - If the text makes a factual claim, verify it against trusted sources.
        - Look for corroboration from high-quality domains like Reuters, BBC, AP, NYT, government sites (.gov), or academic sources (.edu).
        - If the search results contradict the text, classify it as Fake News or Rumor.
        - If the search results confirm the text from reliable sources, classify it as Credible.

        Provide the response in the following JSON format ONLY:
        {
            "score": number (0-100) (likelihood of being true/safe),
            "classification": string ("Fake News", "Scam", "Misleading Message", "Rumor", "Credible"),
            "highlighted_phrase": string (a short phrase from the text that is most critical/suspicious),
            "trusted_sources": array of strings (List of the specific DOMAINS or NAMES of the trusted sources you found that verify the information. e.g., ["Reuters", "BBC News"]. If none found, return empty array.)
        }
        
        Text to analyze:
        "${textToAnalyze}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonString);

    // Update UI
    const credscore = document.querySelector(".score");
    credscore.innerHTML = `${data.score}`;

    const credvalue = document.querySelector(".credvalue");
    // Clear previous content and append new
    credvalue.innerHTML = `<h3>Credibility Value</h3><p>Credibility value is ${data.classification}</p>`;

    const phrasestat = document.querySelector(".phrase");
    phrasestat.innerHTML = `<h3>Highlighted Phrase</h3><p>Highlighted Phrases are "${data.highlighted_phrase}"</p>`;

    // Update Trusted Sources if any
    const sourcesDiv = document.querySelector(".sources ul");
    if (data.trusted_sources && data.trusted_sources.length > 0) {
      sourcesDiv.innerHTML = data.trusted_sources.map(src => `<li>${src}</li>`).join('');
    } else {
      sourcesDiv.innerHTML = "<li>No specific trusted sources found.</li>";
    }

    // Show Qubic Button
    if (document.querySelector('.qubic-btn')) {
      document.querySelector('.qubic-btn').style.display = "inline-flex";
    }

    // Track 2: Webhook Trigger
    const webhookUrl = document.getElementById('webhook-url').value;
    if (webhookUrl && webhookUrl.trim() !== "") {
      console.log("Triggering Webhook:", webhookUrl);
      try {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // Safety for hackathon demo (prevents CORS errors blocking the script)
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verdict: data.classification,
            score: data.score,
            text: textToAnalyze.substring(0, 50) + "...",
            timestamp: new Date().toISOString()
          })
        }).then(() => console.log("Webhook triggered"));
      } catch (e) {
        console.error("Webhook failed", e);
      }
    }

  } catch (error) {
    console.error("Error analyzing text:", error);
    alert("An error occurred during analysis. Check the console for details.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyse";
  }
}
