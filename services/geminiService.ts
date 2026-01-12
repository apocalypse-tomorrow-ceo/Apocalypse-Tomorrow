
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, Region } from "../types";

// Simple in-memory cache to prevent redundant calls within a short window
const cache: Record<string, { result: AnalysisResult; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Retries a function with exponential backoff.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const analyzeRegion = async (region: Region): Promise<AnalysisResult> => {
  // Check cache first
  const cached = cache[region.id];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.debug(`Returning cached data for ${region.id}`);
    return cached.result;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const hasAssets = region.monitoredSources && region.monitoredSources.length > 0;
  
  const sourceInstruction = hasAssets
    ? `
    CLOSED-LOOP INDEPENDENT MONITORING PROTOCOL:
    You are strictly limited to the assets provided below. 
    Your goal is to extract EVERY distinct tactical event (strike, movement, protest) reported by these specific channels in the last 48 hours.
    
    TRACKED ASSETS (and their required 'sourceAlignment' value):
    ${region.monitoredSources?.map(s => `- Asset: ${s.name} | URL: ${s.url} | Alignment: ${s.alignment}`).join('\n')}
    
    SEARCH TASKS:
    1. Search the web specifically for the latest content from these URLs.
    2. DO NOT group multiple reports into one event. Create a separate JSON object for every individual report found.
    3. Tag every event found via these links as "sourceCategory": "independent".
    4. For every independent event, you MUST set "sourceAlignment" to the exact 'Alignment' string listed above for that asset.
    `
    : "The 'Independent' feed must remain empty.";

  const prompt = `
    Analyze ${region.name} for tactical shifts (last 48 hours).
    
    ${sourceInstruction}

    MAINSTREAM PROTOCOL:
    - Identify reports from major global news agencies (Reuters, AP, BBC, etc.).
    - Tag these as "sourceCategory": "mainstream".
    - "sourceAlignment" should be null for mainstream.

    DATA EXTRACTION GOAL:
    Provide as many distinct, verified event points as possible. I want a granular feed, not a summary.

    OUTPUT FORMAT:
    Provide a situational summary text, then a JSON list of events:
    [
      {
        "title": "Tactical/Short Title",
        "description": "Granular details: Who, what, weapon types, or units involved.",
        "type": "CONFLICT" | "PROTEST" | "RIOT" | "MILITARY_MOVE" | "STRIKE",
        "severity": "low" | "medium" | "high" | "critical",
        "lat": numerical_latitude,
        "lng": numerical_longitude,
        "locationName": "Precise City/Village/District",
        "timestamp": "ISO timestamp",
        "sourceUrl": "Link to the specific post or the asset home page if post URL unavailable",
        "sourceCategory": "independent" | "mainstream",
        "sourceAlignment": "The 'Alignment' string of the reporting asset"
      }
    ]

    Ensure coordinates are precise. For independent sources, provide the direct link found during search.
  `;

  const execution = async (): Promise<AnalysisResult> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || "#"
    })) || [];

    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    let events = [];
    if (jsonMatch) {
      try {
        events = JSON.parse(jsonMatch[0]).map((e: any, idx: number) => ({
          ...e,
          id: `event-${idx}-${Date.now()}`
        }));
      } catch (e) {
        console.error("Failed to parse event JSON", e);
      }
    }

    const result = {
      summary: text.split(/\[\s*\{/)[0].trim().replace(/```json|```/g, ''),
      events,
      sources
    };

    // Store in cache
    cache[region.id] = { result, timestamp: Date.now() };
    return result;
  };

  try {
    return await withRetry(execution);
  } catch (error: any) {
    console.error("Gemini API Error after retries:", error);
    throw error;
  }
};
