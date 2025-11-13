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

  // Calculate total removal points
  const calculateTotalRemovalPoints = () => {
    let total = 0;
    for (let i = 0; i < totalRemovals; i++) {
      total += getRemovalCost(i);
    }
    total += removalsBonusCount * 20;
    return total;
  };

  const nextRemovalCost = getRemovalCost(totalRemovals);
  const totalRemovalPoints = calculateTotalRemovalPoints();

  // Visual progress indicator (show up to 5 dots, then show "5+")
  const renderProgressDots = () => {
    const maxDots = 5;
    const dots = [];

    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < totalRemovals ? 'bg-red-500' : 'bg-gray-300'
          }`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Removal Tracker</h3>

      <div className="space-y-2">
        {/* Count display */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Cards Removed:</span>
          <span className="text-lg font-bold text-red-600">{totalRemovals}</span>
        </div>

        {/* Visual progress */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {renderProgressDots()}
          </div>
          {totalRemovals > 5 && (
            <span className="text-sm font-semibold text-red-600">({totalRemovals})</span>
          )}
        </div>

        {/* Current points */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Current removal cost:</span>
          <span className="font-bold text-red-600">{totalRemovalPoints} pts</span>
        </div>

        {/* Next removal cost */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Next removal adds:</span>
          <span className="font-semibold text-gray-700">{nextRemovalCost} pts</span>
        </div>

        {/* Bonus count */}
        {removalsBonusCount > 0 && (
          <div className="flex justify-between items-center text-sm bg-red-50 p-2 rounded">
            <span className="text-gray-600">Bonus removals (Base/Epiphany):</span>
            <span className="font-semibold text-red-700">
              {removalsBonusCount} × 20 = {removalsBonusCount * 20} pts
            </span>
          </div>
        )}

        {/* Reference text */}
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
          Scale: 1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70
        </div>
      </div>
    </div>
  );
};

export default RemovalTracker;
