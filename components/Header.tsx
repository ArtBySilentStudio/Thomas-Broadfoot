
import React from 'react';
import BeeIcon from './icons/BeeIcon';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center space-x-3">
        <BeeIcon className="h-10 w-10 text-sky-400" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Busy Bee
        </h1>
      </div>
       <p className="text-center text-gray-400 mt-2">AI-Powered E-commerce Insights</p>
    </header>
  );
};

export default Header;
