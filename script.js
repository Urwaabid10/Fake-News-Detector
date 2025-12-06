import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "./config.js";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

// Make Analyse function globally available since it's called from HTML onclick
window.Analyse = async function () {
  const analyzeBtn = document.querySelector(".analysebtn");
  const inputElement = document.querySelector("#entertext");
  const textToAnalyze = inputElement.value;

  if (!textToAnalyze.trim()) {
    alert("Please enter some text to analyze.");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";

  try {
    const prompt = `Analyze the credibility of the following news text. 
        Provide the response in the following JSON format ONLY:
        {
            "score": number (0-100),
            "classification": string ("Fake", "Suspicious", "Credible"),
            "highlighted_phrase": string (a short phrase from the text that is most critical/suspicious),
            "trusted_sources": array of strings (list of potential trusted sources if relevant, otherwise empty)
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
    /*
    const sourcesDiv = document.querySelector(".sources ul");
    if (data.trusted_sources && data.trusted_sources.length > 0) {
         sourcesDiv.innerHTML = data.trusted_sources.map(src => `<li>${src}</li>`).join('');
    }
    */

  } catch (error) {
    console.error("Error analyzing text:", error);
    alert("An error occurred during analysis. Check the console for details.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyse";
  }
}
