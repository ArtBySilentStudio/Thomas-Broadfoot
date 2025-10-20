
import React from 'react';
import QuestionMarkIcon from './icons/QuestionMarkIcon';

interface HelpButtonProps {
    onOpen: () => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-6 right-6 bg-sky-500 text-white p-3 rounded-full shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-400 transition-transform hover:scale-110 z-40"
            aria-label="Open help sidebar"
        >
            <QuestionMarkIcon className="h-6 w-6" />
        </button>
    );
};

export default HelpButton;
