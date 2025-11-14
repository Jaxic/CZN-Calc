import React from 'react';
import { useDeck } from '../context/DeckContext';

const RemovalTracker = () => {
  const { totalRemovals, removalsBonusCount } = useDeck();

  // Calculate current and next removal costs
  const getRemovalCost = (index) => {
    if (index === 0) return 0;
    if (index === 1) return 10;
    if (index === 2) return 30;
    if (index === 3) return 50;
    return 70;
  };

  // Calculate base removal cost
  const calculateBaseRemovalCost = () => {
    let total = 0;
    for (let i = 0; i < totalRemovals; i++) {
      total += getRemovalCost(i);
    }
    return total;
  };

  // Calculate starting card penalty
  const startingCardPenalty = removalsBonusCount * 20;

  // Total removal points
  const baseRemovalCost = calculateBaseRemovalCost();
  const totalRemovalPoints = baseRemovalCost + startingCardPenalty;
  const nextRemovalCost = getRemovalCost(totalRemovals);

  // Visual progress indicator (show up to 5 dots, then show "5+")
  const renderProgressDots = () => {
    const maxDots = 5;
    const dots = [];

    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < totalRemovals ? 'bg-red-500 dark:bg-red-400' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">Removals</h4>
        <span className="text-sm font-bold text-red-600 dark:text-red-400">{totalRemovals}</span>
      </div>

      {/* Visual progress */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          {renderProgressDots()}
        </div>
        {totalRemovals > 5 && (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">({totalRemovals})</span>
        )}
      </div>

      {/* Next removal cost */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-600 dark:text-gray-300">Next adds:</span>
        <span className="font-semibold text-gray-700 dark:text-gray-200">{nextRemovalCost} pts</span>
      </div>
    </div>
  );
};

export default RemovalTracker;
