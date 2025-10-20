import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-sky-400 mb-2">{title}</h3>
        <div className="space-y-2 text-sm text-gray-300">
            {children}
        </div>
    </div>
);

const HelpItem: React.FC<{ term: string, children: React.ReactNode }> = ({ term, children }) => (
    <p><strong className="font-semibold text-white">{term}:</strong> {children}</p>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
     <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
      aria-labelledby="help-sidebar-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-800 border-l border-gray-700 text-gray-300 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 id="help-sidebar-title" className="text-xl font-bold text-white">Understanding Your Results</h2>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white"
                aria-label="Close help sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-65px)]">
            <HelpSection title="Keyword Analysis">
                <HelpItem term="Competition">
                    Estimates how many other sellers are targeting this keyword. Low competition is ideal.
                </HelpItem>
                <HelpItem term="Demand">
                    Estimates how many buyers are searching for this keyword. High demand indicates a strong market.
                </HelpItem>
                <HelpItem term="Opportunity Score">
                    A 1-100 score that balances demand and competition. A high score (e.g., 75+) suggests a market gap with high demand and low competition, representing a strong opportunity.
                </HelpItem>
            </HelpSection>
            
             <HelpSection title="Product Analysis">
                <HelpItem term="Monthly Sales/Revenue">
                    AI-generated estimates of a typical successful product's performance in this niche.
                </HelpItem>
                <HelpItem term="Views & Favorites">
                    Engagement metrics that indicate customer interest and listing visibility.
                </HelpItem>
                 <HelpItem term="Listing Age">
                    Shows how long a product has been on the market. Newer, successful listings can indicate a rising trend.
                </HelpItem>
                <HelpItem term="Sales Trend">
                    A chart showing estimated sales over the last 12 months to help you spot seasonal or growth patterns.
                </HelpItem>
            </HelpSection>

             <HelpSection title="Shop Analysis">
                <HelpItem term="Total Monthly Sales/Revenue">
                    An estimate of the entire shop's monthly performance, indicating the overall size of the business.
                </HelpItem>
                <HelpItem term="Avg. Product Price">
                    Helps you understand the shop's general pricing strategy (e.g., budget, mid-range, premium).
                </HelpItem>
                <HelpItem term="Top Products">
                    Shows which specific products are the main drivers of the shop's success.
                </HelpItem>
            </HelpSection>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;