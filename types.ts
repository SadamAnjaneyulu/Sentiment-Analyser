
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export interface FeedbackAnalysis {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  summary: string;
  timestamp: Date;
}

export interface SentimentAnalysisResponse {
  sentiment: Sentiment;
  confidence: number;
  summary: string;
}
