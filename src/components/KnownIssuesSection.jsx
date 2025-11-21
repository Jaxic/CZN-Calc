import React, { useState } from 'react';

const KnownIssuesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors">
      {/* Header with toggle */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
            ⚠️ Known Issues
          </h2>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            In-game bugs affecting point calculations
          </p>
        </div>
        <button
          className="text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 text-xl font-bold"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 text-yellow-900 dark:text-yellow-100">
          <p className="text-sm">
            These are confirmed bugs in the game that affect point calculations.
            The calculator matches the game's behavior (including bugs).
          </p>

          <div className="space-y-3">
            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-3">
              <h3 className="font-semibold mb-1">🔴 Neutral + Divine Epiphany Bug</h3>
              <p className="text-sm">
                Neutral cards (+20) with Divine Epiphany (+20) incorrectly
                also add Regular Epiphany cost (+10).
              </p>
              <p className="text-sm font-bold mt-1">Total: 50 pts instead of 40 pts</p>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-3">
              <h3 className="font-semibold mb-1">🔴 Monster + Regular Epiphany Bug</h3>
              <p className="text-sm">
                Monster cards (+80) with Regular Epiphany incorrectly
                do NOT add the +10 cost.
              </p>
              <p className="text-sm font-bold mt-1">Epiphany is FREE on monsters.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnownIssuesSection;
