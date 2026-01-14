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
    ═══════════════════════════════════════════════════════════════
    INDEPENDENT SOURCE PROTOCOL - CRITICAL PRIORITY
    ═══════════════════════════════════════════════════════════════

    You MUST search for content from the specific accounts listed below.
    These are Telegram channels and Twitter/X accounts that report conflict events.

    TRACKED ASSETS:
    ${region.monitoredSources?.map(s => `- ${s.name} | ${s.url} | Alignment: ${s.alignment}`).join('\n')}

    ═══════════════════════════════════════════════════════════════
    SEARCH STRATEGY - EXECUTE ALL OF THESE:
    ═══════════════════════════════════════════════════════════════

    For EACH asset above, perform MULTIPLE targeted searches:

    1. DIRECT CHANNEL SEARCH:
       - Search: "site:t.me/[channel_name]" OR "site:twitter.com/[handle]" OR "site:x.com/[handle]"
       - Look for posts from the last 48 hours
       - Example: "site:t.me/Intel_Rojava" or "site:twitter.com/Osinttechnical"

    2. RECENT CONTENT SEARCH:
       - Add time modifiers: "after:2026-01-11" (adjust to 48 hours ago from today)
       - Search for channel name + region name + recent keywords
       - Example: "Intel_Rojava Syria t.me after:2026-01-11"

    3. SPECIFIC EVENT SEARCH:
       - Search for: [channel name] + [region] + ["clash" OR "strike" OR "protest" OR "attack"]
       - Example: "Osinttechnical Ukraine strike"

    4. FALLBACK SEARCH:
       - If nothing found, search for the account name alone
       - Check if any aggregator sites have cached/quoted their posts

    ═══════════════════════════════════════════════════════════════
    EXTRACTION RULES:
    ═══════════════════════════════════════════════════════════════

    1. Extract EVERY individual event/incident mentioned in posts you find
    2. DO NOT summarize multiple events into one - each gets its own JSON object
    3. If a post mentions "3 strikes in different locations" - create 3 separate events
    4. Each event MUST have:
       - "sourceCategory": "independent" (mandatory)
       - "sourceAlignment": Must match the exact 'Alignment' string from the asset list above
       - "sourceUrl": Direct link to the Telegram/Twitter post if available

    5. MINIMUM GOAL: Find at least 3-5 events per tracked asset (if they exist)

    6. If you find a post, extract ALL events mentioned in it, not just the main one

    ═══════════════════════════════════════════════════════════════
    QUALITY CHECKLIST:
    ═══════════════════════════════════════════════════════════════
    ✓ Did I search each asset individually?
    ✓ Did I try multiple search strategies per asset?
    ✓ Did I extract every distinct event (not just summaries)?
    ✓ Did I set sourceAlignment correctly for each event?
    ✓ Did I provide direct sourceUrl links when possible?

    INDEPENDENT EVENTS ARE CRITICAL - Be thorough and aggressive in your searches.
    `
    : "INDEPENDENT PROTOCOL DISABLED: No tracked assets configured for this region. Skip independent searches entirely.";

  const prompt = `
    ═══════════════════════════════════════════════════════════════
    MISSION: ${region.name} Tactical Intelligence Feed (Last 48 Hours)
    ═══════════════════════════════════════════════════════════════

    ${sourceInstruction}

    ═══════════════════════════════════════════════════════════════
    MAINSTREAM PROTOCOL - SECONDARY PRIORITY
    ═══════════════════════════════════════════════════════════════

    Search for reports from major global news agencies about ${region.name}:
    - Reuters, Associated Press (AP), BBC, CNN, Al Jazeera, AFP
    - Regional major outlets relevant to ${region.name}
    - Search terms: "${region.name} conflict", "${region.name} protest", "${region.name} military"

    MAINSTREAM TAGGING:
    - "sourceCategory": "mainstream" (mandatory)
    - "sourceAlignment": null (mandatory - mainstream sources are unaligned)
    - Extract individual events (don't group multiple incidents into one)

    ═══════════════════════════════════════════════════════════════
    DATA EXTRACTION REQUIREMENTS
    ═══════════════════════════════════════════════════════════════

    CRITICAL: I need GRANULAR events, not summaries!
    - Each bombing/strike/protest/clash = separate JSON object
    - If article mentions "3 airstrikes in Damascus" = 3 separate events
    - Minimum 10-15 total events across both independent and mainstream

    ═══════════════════════════════════════════════════════════════
    OUTPUT FORMAT
    ═══════════════════════════════════════════════════════════════

    First, provide a 2-3 sentence situational summary of ${region.name}.

    Then, provide a JSON array of events:

    [
      {
        "title": "Concise tactical title (max 10 words)",
        "description": "Detailed description: Who attacked, what weapon/method, casualties, units involved, context",
        "type": "CONFLICT" | "PROTEST" | "RIOT" | "MILITARY_MOVE" | "STRIKE",
        "severity": "low" | "medium" | "high" | "critical",
        "lat": numerical_latitude,
        "lng": numerical_longitude,
        "locationName": "Precise location (City, District, Village)",
        "timestamp": "ISO 8601 timestamp (e.g., 2026-01-13T14:30:00Z)",
        "sourceUrl": "Direct link to post/article (REQUIRED - provide the actual URL you found)",
        "sourceCategory": "independent" | "mainstream",
        "sourceAlignment": "Alignment string (for independent only) or null (for mainstream)"
      }
    ]

    ═══════════════════════════════════════════════════════════════
    QUALITY STANDARDS
    ═══════════════════════════════════════════════════════════════
    ✓ Coordinates must be accurate (use Google Search to verify locations)
    ✓ Every event must have a real sourceUrl (the actual link you found during search)
    ✓ Timestamps should be as precise as possible based on post/article date
    ✓ Severity ratings: critical (mass casualties/strategic), high (combat/strikes), medium (skirmishes), low (posturing/movements)
    ✓ DO NOT invent events - only extract what you actually find in searches

    Begin your search and extraction now.
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
