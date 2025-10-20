import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AnalysisResult, AnalysisType, ProductAnalysis, ShopAnalysis, KeywordAnalysis } from '../types';
import DataCard from './DataCard';
import { exportAnalysisToCSV, exportRelatedKeywordsToCsv, exportRelatedKeywordsToJson, exportAnalysisToJson, exportAnalysisToPdf } from '../utils/csvExporter';
import XIcon from './icons/XIcon';

interface AnalyticsDisplayProps {
  result: AnalysisResult;
  type: AnalysisType;
  onClear: () => void;
}

const ExportAllButton: React.FC<{ onExport: (format: 'csv' | 'json' | 'pdf') => void }> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 text-sky-300 text-xs font-medium rounded-md hover:bg-gray-600 transition-colors"
        aria-label="Export all data"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export All</span>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => { onExport('csv'); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
            >
              Export as CSV
            </button>
            <button
              onClick={() => { onExport('json'); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
            >
              Export as JSON
            </button>
            <button
              onClick={() => { onExport('pdf'); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ClearButton: React.FC<{ onClear: () => void }> = ({ onClear }) => (
  <button
    onClick={onClear}
    className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 transition-colors"
    aria-label="Clear results"
  >
    <XIcon className="h-4 w-4" />
    <span>Clear</span>
  </button>
);


const TagDisplay: React.FC<{ tags: string[] }> = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);
  const TAG_LIMIT = 7;
  const hasMore = tags.length > TAG_LIMIT;

  const displayedTags = showAll ? tags : tags.slice(0, TAG_LIMIT);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {displayedTags.map((tag) => (
        <span key={tag} className="bg-gray-700 text-sky-300 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
          {tag}
        </span>
      ))}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sky-400 hover:text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors"
        >
          +{tags.length - TAG_LIMIT} more
        </button>
      )}
       {hasMore && showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
};


const ExportRelatedKeywordsButton: React.FC<{ onExport: (format: 'csv' | 'json') => void }> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 text-purple-300 text-xs font-medium rounded-md hover:bg-gray-600 transition-colors"
        aria-label="Export related keywords"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        <span>Export Related</span>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => { onExport('csv'); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
            >
              Export as CSV
            </button>
            <button
              onClick={() => { onExport('json'); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
            >
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({ result, type, onClear }) => {

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    switch (format) {
      case 'csv':
        exportAnalysisToCSV(result, type);
        break;
      case 'json':
        exportAnalysisToJson(result, type);
        break;
      case 'pdf':
        exportAnalysisToPdf(result, type);
        break;
    }
  };

  const renderProductAnalysis = (data: ProductAnalysis[]) => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-400">Product Analysis Results</h2>
        <div className="flex items-center space-x-2">
            <ExportAllButton onExport={handleExport} />
            <ClearButton onClear={onClear} />
        </div>
      </div>
      {data.map((product, index) => (
        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-bold text-sky-300">{product.productTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <DataCard title="Monthly Sales" value={product.monthlySales.toLocaleString()} />
            <DataCard title="Monthly Revenue" value={`$${product.monthlyRevenue.toLocaleString()}`} />
            <DataCard title="Total Views" value={product.totalViews.toLocaleString()} />
            <DataCard title="Favorites" value={product.favorites.toLocaleString()} />
            <DataCard title="Listing Age" value={`${product.listingAgeDays} days`} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Sales Trend (Last 12 Months)</h4>
            <p className="text-sm text-gray-400 mb-3 italic">
              {product.salesTrendAnalysis}
            </p>
            <div className="h-64 bg-gray-800 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.salesTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="month" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Line type="monotone" dataKey="sales" stroke="#38BDF8" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4, strokeWidth: 1, fill: '#1F2937' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Analysis Summary</h4>
              <p className="text-gray-300">{product.summary}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Top Tags</h4>
              <TagDisplay tags={product.tags} />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Similar & Complementary Products</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {product.relatedProducts.map((related, rIndex) => (
                <div key={rIndex} className="bg-gray-800 rounded-lg overflow-hidden text-center shadow-md transition-transform hover:scale-105">
                  <img src={related.imageUrl} alt={related.title} className="w-full h-32 object-cover bg-gray-700" loading="lazy" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-white truncate" title={related.title}>{related.title}</p>
                    <p className="text-xs text-sky-300 mt-1 font-semibold">{related.monthlySales.toLocaleString()} sales/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderShopAnalysis = (data: ShopAnalysis[]) => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-400">Shop Analysis Results</h2>
        <div className="flex items-center space-x-2">
            <ExportAllButton onExport={handleExport} />
            <ClearButton onClear={onClear} />
        </div>
      </div>
      {data.map((shop, index) => (
        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-sky-300 mb-4">{shop.shopName}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <DataCard title="Total Monthly Sales" value={shop.totalMonthlySales.toLocaleString()} />
            <DataCard title="Total Monthly Revenue" value={`$${shop.totalMonthlyRevenue.toLocaleString()}`} />
            <DataCard title="Avg. Product Price" value={`$${shop.averageProductPrice.toFixed(2)}`} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Top 5 Products</h4>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-700 text-xs text-gray-300 uppercase">
                    <tr>
                      <th className="px-6 py-3">Product Title</th>
                      <th className="px-6 py-3">Monthly Sales</th>
                      <th className="px-6 py-3">Monthly Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shop.topProducts.map((product, pIndex) => (
                      <tr key={pIndex} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-white">{product.title}</td>
                        <td className="px-6 py-4 text-gray-300">{product.monthlySales.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-300">${product.monthlyRevenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderKeywordAnalysis = (data: KeywordAnalysis[]) => (
     <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-sky-400">Keyword Analysis Results</h2>
          <div className="flex items-center space-x-2">
            <ExportRelatedKeywordsButton onExport={(format) => {
                if (format === 'csv') {
                    exportRelatedKeywordsToCsv(data);
                } else {
                    exportRelatedKeywordsToJson(data);
                }
            }} />
            <ExportAllButton onExport={handleExport} />
            <ClearButton onClear={onClear} />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-sky-300 mb-4">Keyword Opportunity Comparison</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 75 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis 
                  dataKey="keyword" 
                  stroke="#A0AEC0" 
                  tick={{ fontSize: 12 }} 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  height={100}
                />
                <YAxis domain={[0, 100]} stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568', borderRadius: '0.5rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} verticalAlign="top" align="right" />
                <Bar dataKey="opportunityScore" name="Opportunity Score" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {data.map((keywordData, index) => (
          <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-sky-300">Keyword: "{keywordData.keyword}"</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DataCard title="Competition" value={keywordData.competition} />
                <DataCard title="Demand" value={keywordData.demand} />
                <DataCard title="Opportunity Score" value={`${keywordData.opportunityScore} / 100`} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Top 5 Listings</h4>
                    <ul className="space-y-2">
                        {keywordData.topListings.map((listing, lIndex) =>(
                            <li key={lIndex} className="text-gray-300 flex justify-between">
                                <span className="w-3/4 truncate pr-2" title={listing.title}>{listing.title}</span>
                                <span className="font-bold text-white whitespace-nowrap">{listing.monthlySales.toLocaleString()} sales</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Related Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                    {keywordData.relatedKeywords.map((kw) => (
                        <span key={kw} className="bg-gray-700 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {kw}
                        </span>
                    ))}
                    </div>
                </div>
            </div>
          </div>
        ))}
    </div>
  );
  
  if (!result) return null;
  
  switch (type) {
    case AnalysisType.PRODUCT:
      return renderProductAnalysis(result as ProductAnalysis[]);
    case AnalysisType.SHOP:
      return renderShopAnalysis(result as ShopAnalysis[]);
    case AnalysisType.KEYWORD:
      return renderKeywordAnalysis(result as KeywordAnalysis[]);
    default:
      return null;
  }
};

export default AnalyticsDisplay;