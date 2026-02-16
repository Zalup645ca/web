
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMarketInsight(coin: string, symbol: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a brief, professional market sentiment analysis for ${coin} (${symbol}) for the next 24 hours. Focus on technical indicators. 2 sentences. Output in English.`,
      config: { temperature: 0.7 }
    });
    return response.text || "Insight unavailable.";
  } catch (error) {
    return "Error generating AI insight.";
  }
}

export async function analyzeTradingChart(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: `Act as a world-class Quant Trader and Technical Analyst. Analyze this image.
            
            1. VERDICT: Start with a clear header 'VERDICT: [RISE]' or 'VERDICT: [FALL]'.
            2. ANALYSIS: Provide a stunningly professional technical report in English. 
            3. IF IT IS A CHART: Use terms like 'Order Block Reclamation', 'Fair Value Gap filling', 'RSI Bullish Divergence', and 'Liquidity Sweep'. Explain the specific levels and patterns you see.
            4. IF IT IS NOT A CHART: Note that this is not a financial asset, but provide a 'Cosmic Correlation' report. Link the visual features of the image (colors, shapes) to a metaphorical market movement. Be creative and still give a 'RISE' or 'FALL' verdict based on the 'energy' of the photo.
            
            Format the output with professional headers, bullet points, and high-end financial vocabulary. Make it look like a $500/month research note.`
          }
        ]
      }
    });
    return response.text;
  } catch (e) {
    return "ANALYSIS_FAILED: Node transmission error.";
  }
}

export async function quickSentimentScan(symbol: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sentiment for ${symbol}. Return as: SENTIMENT: [Type], SCORE: [0-100]. English only.`,
      config: { temperature: 0.4 }
    });
    return response.text;
  } catch (e) {
    return "Scan failed.";
  }
}

export async function generateMarketingCopy() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, 4-word aggressive cyberpunk trading headline in English.",
      config: {
        systemInstruction: "You are an elite high-frequency trading bot from the year 2099."
      }
    });
    return response.text;
  } catch (error) {
    return "DECODE THE VOID. PROFIT.";
  }
}
