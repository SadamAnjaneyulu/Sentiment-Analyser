
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackAnalysis, Sentiment, SentimentAnalysisResponse } from '../types';

const sentimentAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      enum: [Sentiment.Positive, Sentiment.Negative, Sentiment.Neutral],
      description: 'The overall sentiment of the feedback.',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'A confidence score between 0 and 1 for the sentiment classification.',
    },
    summary: {
      type: Type.STRING,
      description: 'A brief one-sentence summary of the key point in the feedback.',
    }
  },
  required: ['sentiment', 'confidence', 'summary'],
};

export const analyzeSentiment = async (feedbackText: string): Promise<SentimentAnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the sentiment of the following customer feedback: "${feedbackText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: sentimentAnalysisSchema,
        systemInstruction: "You are a highly accurate sentiment analysis model for customer feedback. Your response must be in JSON format and adhere to the provided schema.",
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as SentimentAnalysisResponse;
    
    // Basic validation
    if (!result || !result.sentiment || typeof result.confidence !== 'number') {
        throw new Error("Invalid response format from API.");
    }

    return result;

  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw new Error("Failed to analyze sentiment. Please check the console for details.");
  }
};
