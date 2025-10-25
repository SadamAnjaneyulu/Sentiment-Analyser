
import React, { useState, useCallback } from 'react';
import { analyzeSentiment } from './services/geminiService';
import { FeedbackAnalysis } from './types';
import SentimentChart from './components/SentimentChart';
import SentimentResultCard from './components/SentimentResultCard';
import { SparklesIcon, LoaderIcon } from './components/icons';

const App: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeSentiment(feedbackText);
      const newFeedback: FeedbackAnalysis = {
        id: new Date().toISOString(),
        text: feedbackText,
        ...result,
        timestamp: new Date()
      };
      setFeedbackHistory(prev => [newFeedback, ...prev]);
      setFeedbackText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [feedbackText, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Sentiment Analyzer AI
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyze customer feedback instantly. Gain insights from text and visualize sentiment trends with the power of Gemini.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input and Results */}
          <div className="flex flex-col space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <form onSubmit={handleSubmit}>
                <label htmlFor="feedback-input" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Enter Customer Feedback
                </label>
                <textarea
                  id="feedback-input"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g., 'The new feature is amazing, but the documentation could be clearer.'"
                  className="w-full h-36 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || !feedbackText.trim()}
                  className="mt-4 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Analyze Sentiment
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="space-y-4">
              {feedbackHistory.length > 0 && <h2 className="text-xl font-bold">Analysis History</h2>}
              {feedbackHistory.map((result) => (
                <SentimentResultCard key={result.id} result={result} />
              ))}
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className="h-full">
            <SentimentChart data={feedbackHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
