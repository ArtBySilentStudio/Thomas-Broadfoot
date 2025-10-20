
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import HelpButton from './components/HelpButton';
import SearchHistory from './components/SearchHistory';
import { AnalysisType, AnalysisResult, SearchHistoryEntry } from './types';
import { analyzeProduct, analyzeShop, analyzeKeyword } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const isCancelled = useRef(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('busyBeeSearchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load search history from localStorage:", error);
      localStorage.removeItem('busyBeeSearchHistory');
    }
  }, []);

  const updateSearchHistory = useCallback((newEntry: SearchHistoryEntry) => {
    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(
        item => !(item.query.toLowerCase() === newEntry.query.toLowerCase() && item.type === newEntry.type)
      );
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 10);
      
      try {
        localStorage.setItem('busyBeeSearchHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save search history to localStorage:", error);
      }
      
      return updatedHistory;
    });
  }, []);

  const handleStop = useCallback(() => {
    isCancelled.current = true;
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setAnalysisType(null);
  }, []);

  const handleSearch = useCallback(async (query: string, type: AnalysisType) => {
    isCancelled.current = false;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisType(type);
    updateSearchHistory({ query, type });

    try {
      let result: AnalysisResult;
      switch (type) {
        case AnalysisType.PRODUCT:
          result = await analyzeProduct(query);
          break;
        case AnalysisType.SHOP:
          result = await analyzeShop(query);
          break;
        case AnalysisType.KEYWORD:
          result = await analyzeKeyword(query);
          break;
        default:
          throw new Error('Invalid analysis type');
      }
      if (!isCancelled.current) {
        setAnalysisResult(result);
      }
    } catch (err) {
      if (!isCancelled.current) {
        console.error("Analysis Error:", err);
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (err instanceof Error) {
          if (err.message.includes('JSON')) {
            errorMessage = 'Failed to parse the data from the AI. The response might be malformed.';
          } else if (err.message.toLowerCase().includes('api key')) {
              errorMessage = 'There seems to be an issue with the API configuration. Please contact support.';
          } else {
              errorMessage = 'Failed to fetch analysis. The AI might be busy, or a network error occurred.';
          }
        }
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateSearchHistory]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto py-8">
        <Header />
        <div className="w-full max-w-2xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {searchHistory.length > 0 && (
            <SearchHistory 
              history={searchHistory} 
              onHistoryClick={handleSearch}
              isLoading={isLoading} 
            />
          )}
        </div>
        <Dashboard
          isLoading={isLoading}
          error={error}
          analysisResult={analysisResult}
          analysisType={analysisType}
          onStop={handleStop}
        />
        <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>&copy; {new Date().getFullYear()} Busy Bee. All data is AI-generated and for illustrative purposes only.</p>
        </footer>
      </div>
      <HelpButton onOpen={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default App;
