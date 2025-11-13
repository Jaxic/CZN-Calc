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

        {/* Duplication cost breakdown */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Duplication cost:</span>
          <span className="font-semibold text-indigo-600">{baseDuplicationCost} pts</span>
        </div>

        {/* Duplicate card values */}
        {duplicateCardValues > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Duplicate card values:</span>
            <span className="font-semibold text-indigo-700">{duplicateCardValues} pts</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-semibold">Total duplication points:</span>
            <span className="font-bold text-indigo-600">{totalDuplicationPoints} pts</span>
          </div>
        </div>

        {/* Next duplication cost */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Next copy adds:</span>
          <span className="font-semibold text-gray-700">{nextDuplicationCost} pts + card value</span>
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
