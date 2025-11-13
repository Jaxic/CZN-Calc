import React from 'react';
import { useDeck } from '../context/DeckContext';
import { calculateCardPoints } from '../utils/calculations';

const DuplicationTracker = () => {
  const { totalDuplications, additionalCards } = useDeck();

  // Calculate duplication costs
  const getDuplicationCost = (index) => {
    if (index === 0) return 0;
    if (index === 1) return 10;
    if (index === 2) return 30;
    if (index === 3) return 50;
    return 70;
  };

  // Get duplicated cards and calculate their values
  const duplicatedCards = additionalCards.filter(card => card.isDuplicate);

  // Calculate base duplication cost
  const calculateBaseDuplicationCost = () => {
    let total = 0;
    for (let i = 0; i < totalDuplications; i++) {
      total += getDuplicationCost(i);
    }
    return total;
  };

  // Calculate duplicate card values
  const calculateDuplicateCardValues = () => {
    return duplicatedCards.reduce((sum, card) => sum + calculateCardPoints(card), 0);
  };

  const baseDuplicationCost = calculateBaseDuplicationCost();
  const duplicateCardValues = calculateDuplicateCardValues();
  const totalDuplicationPoints = baseDuplicationCost + duplicateCardValues;
  const nextDuplicationCost = getDuplicationCost(totalDuplications);

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
    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800">📋 Copies</h4>
        <span className="text-sm font-bold text-indigo-600">{totalDuplications}</span>
      </div>

      {/* Visual progress */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          {renderProgressDots()}
        </div>
        {totalDuplications > 5 && (
          <span className="text-xs font-semibold text-indigo-600">({totalDuplications})</span>
        )}
      </div>

      {/* Next duplication cost */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-600">Next adds:</span>
        <span className="font-semibold text-gray-700">{nextDuplicationCost} pts + card value</span>
      </div>
    </div>
  );
};

export default DuplicationTracker;
