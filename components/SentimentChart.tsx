
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FeedbackAnalysis, Sentiment } from '../types';
import { ChartBarIcon } from './icons';

interface SentimentChartProps {
  data: FeedbackAnalysis[];
}

const COLORS = {
  [Sentiment.Positive]: '#22c55e',
  [Sentiment.Negative]: '#ef4444',
  [Sentiment.Neutral]: '#64748b',
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <p className="font-bold text-gray-700 dark:text-gray-200">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const counts = data.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<Sentiment, number>);

    return Object.values(Sentiment).map(sentiment => ({
      name: sentiment,
      count: counts[sentiment] || 0,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
        <ChartBarIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sentiment Distribution</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Submit feedback to see the analysis chart.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 px-2">Sentiment Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
