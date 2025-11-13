import React from 'react';
import { useDeck } from '../context/DeckContext';

const DuplicationTracker = () => {
  const { totalDuplications } = useDeck();

  // Calculate duplication costs
  const getDuplicationCost = (index) => {
    if (index === 0) return 0;
    if (index === 1) return 10;
    if (index === 2) return 30;
    if (index === 3) return 50;
    return 70;
  };

  // Calculate total duplication points
  const calculateTotalDuplicationPoints = () => {
    let total = 0;
    for (let i = 0; i < totalDuplications; i++) {
      total += getDuplicationCost(i);
    }
    return total;
  };

  const nextDuplicationCost = getDuplicationCost(totalDuplications);
  const totalDuplicationPoints = calculateTotalDuplicationPoints();

  // Visual progress indicator (show up to 5 dots)
  const renderProgressDots = () => {
    const maxDots = 5;
    const dots = [];

    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < totalDuplications ? 'bg-indigo-500' : 'bg-gray-300'
          }`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Duplication Tracker</h3>

      <div className="space-y-2">
        {/* Count display */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Copies Made:</span>
          <span className="text-lg font-bold text-indigo-600">{totalDuplications}</span>
        </div>

        {/* Visual progress */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {renderProgressDots()}
          </div>
          {totalDuplications > 5 && (
            <span className="text-sm font-semibold text-indigo-600">({totalDuplications})</span>
          )}
        </div>

        {/* Current points */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total duplication cost:</span>
          <span className="font-bold text-indigo-600">{totalDuplicationPoints} pts</span>
        </div>

        {/* Next duplication cost */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Next copy adds:</span>
          <span className="font-semibold text-gray-700">{nextDuplicationCost} pts</span>
        </div>

        {/* Reference text */}
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
          Scale: 1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70
        </div>
      </div>
    </div>
  );
};

export default DuplicationTracker;
