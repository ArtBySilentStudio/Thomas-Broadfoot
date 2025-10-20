
import React from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {icon && <div className="text-gray-500">{icon}</div>}
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
    </div>
  );
};

export default DataCard;
