import React from 'react';

const QuickToolsSection = ({ onQuickCheckClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Quick Tools
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Helpful calculators and utilities
          </p>
        </div>

        <button
          onClick={onQuickCheckClick}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Card Cost Calculator</span>
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
          Calculate the point cost of adding a single card to your deck
        </p>
      </div>
    </div>
  );
};

export default QuickToolsSection;
