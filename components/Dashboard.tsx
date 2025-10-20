

import React from 'react';
import { AnalysisResult, AnalysisType } from '../types';
import AnalyticsDisplay from './AnalyticsDisplay';
import BeeIcon from './icons/BeeIcon';
import XIcon from './icons/XIcon';

interface DashboardProps {
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResult;
  analysisType: AnalysisType | null;
  onStop: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-gray-400">
        <BeeIcon className="h-16 w-16 text-sky-400 animate-pulse" />
        <p className="mt-4 text-lg font-medium">The hive is buzzing... Analyzing data!</p>
        <p className="text-sm">Please wait a moment.</p>
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="text-center text-gray-400">
        <BeeIcon className="h-20 w-20 text-sky-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Welcome to Busy Bee</h2>
        <p className="mt-2 max-w-lg mx-auto">
            Your AI-powered assistant for e-commerce research.
            Start by selecting an analysis type and entering a query above to uncover market insights.
        </p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ isLoading, error, analysisResult, analysisType, onStop }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h3 className="font-bold">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (analysisResult && analysisType) {
      return <AnalyticsDisplay result={analysisResult} type={analysisType} onClear={onStop} />;
    }
    return <WelcomeMessage />;
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
        {isLoading && (
          <button
            onClick={onStop}
            className="absolute top-4 right-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            aria-label="Stop analysis"
          >
            <XIcon className="h-4 w-4" />
            <span>Stop</span>
          </button>
        )}
        {renderContent()}
      </div>
    </main>
  );
};

export default Dashboard;