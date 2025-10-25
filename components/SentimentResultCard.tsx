
import React from 'react';
import { FeedbackAnalysis, Sentiment } from '../types';

interface SentimentResultCardProps {
  result: FeedbackAnalysis;
}

const sentimentStyles: Record<Sentiment, { bg: string; text: string; border: string }> = {
  [Sentiment.Positive]: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-500/50'
  },
  [Sentiment.Negative]: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-500/50'
  },
  [Sentiment.Neutral]: {
    bg: 'bg-gray-100 dark:bg-gray-700/50',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-500/50'
  }
};

const SentimentResultCard: React.FC<SentimentResultCardProps> = ({ result }) => {
  const styles = sentimentStyles[result.sentiment];
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border} transition-all duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.bg} ${styles.text}`}>
          {result.sentiment}
        </span>
        <div className="text-right">
            <div className={`text-sm font-medium ${styles.text}`}>Confidence</div>
            <div className={`text-lg font-bold ${styles.text}`}>{confidencePercentage}%</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">"{result.summary}"</p>
      <p className="text-gray-800 dark:text-gray-200 text-base break-words">
        {result.text}
      </p>
    </div>
  );
};

export default SentimentResultCard;
