import React from 'react';
import { SearchHistoryEntry, AnalysisType } from '../types';

interface SearchHistoryProps {
  history: SearchHistoryEntry[];
  onHistoryClick: (query: string, type: AnalysisType) => void;
  isLoading: boolean;
}

const typeColors: Record<AnalysisType, string> = {
  [AnalysisType.PRODUCT]: 'bg-sky-500/20 text-sky-300',
  [AnalysisType.SHOP]: 'bg-emerald-500/20 text-emerald-300',
  [AnalysisType.KEYWORD]: 'bg-purple-500/20 text-purple-300',
};

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onHistoryClick, isLoading }) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {history.map((item, index) => (
          <button
            key={`${item.query}-${item.type}-${index}`}
            onClick={() => onHistoryClick(item.query, item.type)}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full px-3 py-1.5 text-sm text-gray-200 transition-colors duration-200"
            title={`Re-run ${item.type} analysis for "${item.query}"`}
          >
            <span>{item.query}</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${typeColors[item.type]} ${isLoading ? 'opacity-50' : ''}`}
            >
              {item.type}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
