
import React, { useState } from 'react';
import { AnalysisType } from '../types';

interface SearchBarProps {
  onSearch: (query: string, type: AnalysisType) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.PRODUCT);
  
  const placeholders = {
    [AnalysisType.PRODUCT]: "Enter a product idea, e.g., 'personalized wooden watch stand'",
    [AnalysisType.SHOP]: "Describe a shop, e.g., 'a store selling minimalist jewelry'",
    [AnalysisType.KEYWORD]: "Enter a keyword, e.g., 'boho wall decor'",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), analysisType);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-2 flex items-center space-x-2 mb-4">
        {Object.values(AnalysisType).map((type) => (
          <button
            key={type}
            onClick={() => setAnalysisType(type)}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              analysisType === type
                ? 'bg-sky-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[analysisType]}
          disabled={isLoading}
          className="w-full pl-4 pr-32 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none transition-all duration-200 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </>
  );
};

export default SearchBar;