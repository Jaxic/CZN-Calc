import React, { useState, useMemo } from 'react';
import { calculateCardPoints } from '../utils/calculations';

const QuickLookupSection = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed
  const [cardType, setCardType] = useState('base');
  const [epiphanyType, setEpiphanyType] = useState('none');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicatePosition, setDuplicatePosition] = useState(1);

  // Calculate duplication cost based on position
  const getDuplicationCost = (position) => {
    const costs = [0, 0, 10, 30, 50];
    if (position >= 5) return 70;
    return costs[position] || 0;
  };

  // Calculate the result
  const result = useMemo(() => {
    // Create a mock card object for the calculation
    const mockCard = {
      type: cardType,
      epiphanyType: epiphanyType === 'none' ? null : epiphanyType,
      isDuplicate: false,
      isConverted: false,
    };

    const cardValue = calculateCardPoints(mockCard);
    const duplicationCost = isDuplicate ? getDuplicationCost(duplicatePosition) : 0;
    const total = cardValue + duplicationCost;

    return { cardValue, duplicationCost, total };
  }, [cardType, epiphanyType, isDuplicate, duplicatePosition]);

  const cardTypeButtons = [
    { value: 'base', label: 'Base', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-300' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 dark:bg-gray-700 border-gray-500 text-gray-800 dark:text-gray-300' },
    { value: 'monster', label: 'Monster', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-800 dark:text-purple-300' },
    { value: 'forbidden', label: 'Forbidden', color: 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300' },
  ];

  const epiphanyOptions = [
    { value: 'none', label: 'None' },
    { value: 'regular', label: 'Regular (+10)' },
    { value: 'divine', label: 'Divine (+20)' },
  ];

  const duplicatePositions = [
    { value: 1, label: '1st (0 pts)' },
    { value: 2, label: '2nd (10 pts)' },
    { value: 3, label: '3rd (30 pts)' },
    { value: 4, label: '4th (50 pts)' },
    { value: 5, label: '5th+ (70 pts)' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ⚡ Quick Lookup
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calculate the cost of adding a single card
          </p>
        </div>
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Card Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Card Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cardTypeButtons.map((button) => (
                <button
                  key={button.value}
                  onClick={() => setCardType(button.value)}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    cardType === button.value
                      ? button.color + ' shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Epiphany Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Epiphany
            </label>
            <div className="grid grid-cols-3 gap-2">
              {epiphanyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEpiphanyType(option.value)}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    epiphanyType === option.value
                      ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-800 dark:text-orange-300 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Special notes */}
            {cardType === 'base' && epiphanyType === 'regular' && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                ✓ Regular Epiphany is FREE on Base cards
              </p>
            )}
            {cardType === 'monster' && epiphanyType === 'regular' && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                ⚠️ Bug: Regular Epiphany is FREE on Monster cards
              </p>
            )}
            {cardType === 'neutral' && epiphanyType === 'divine' && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                ⚠️ Bug: Divine costs 30 pts on Neutral cards (should be 20)
              </p>
            )}
          </div>

          {/* Duplicate Toggle */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <input
                type="checkbox"
                checked={isDuplicate}
                onChange={(e) => setIsDuplicate(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span>Is this a duplicate?</span>
            </label>

            {isDuplicate && (
              <div className="ml-6 mt-2">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Duplicate Position
                </label>
                <select
                  value={duplicatePosition}
                  onChange={(e) => setDuplicatePosition(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {duplicatePositions.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Result
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Card Value:</span>
                <span className="font-semibold">{result.cardValue} pts</span>
              </div>
              {isDuplicate && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Duplication Cost:</span>
                  <span className="font-semibold">{result.duplicationCost} pts</span>
                </div>
              )}
              <div className="border-t-2 border-blue-300 dark:border-blue-600 pt-2 mt-2">
                <div className="flex justify-between text-gray-900 dark:text-gray-100 text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {result.total} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLookupSection;
