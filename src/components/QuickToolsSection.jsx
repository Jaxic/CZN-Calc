import React, { useState, useMemo } from 'react';
import { calculateCardPoints } from '../utils/calculations';

const QuickToolsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed
  const [cardType, setCardType] = useState('base');
  const [epiphanyType, setEpiphanyType] = useState('none');
  const [isCopy, setIsCopy] = useState(false);
  const [copiesBefore, setCopiesBefore] = useState(0);
  const [isConverted, setIsConverted] = useState(false);

  // Calculate duplication cost based on how many copies came before
  const getDuplicationCost = (copiesBefore) => {
    // If there are X copies before, this is the (X+1)th copy
    const copyNumber = copiesBefore + 1;
    const costs = [0, 0, 10, 30, 50]; // Index: 0=N/A, 1=1st copy, 2=2nd copy, etc.
    if (copyNumber >= 5) return 70;
    return costs[copyNumber] || 0;
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
    const copyCost = isCopy ? getDuplicationCost(copiesBefore) : 0;
    const conversionCost = isConverted ? 10 : 0;
    const total = cardValue + copyCost + conversionCost;

    return { cardValue, copyCost, conversionCost, total };
  }, [cardType, epiphanyType, isCopy, copiesBefore, isConverted]);

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

  const copyOptions = [
    { value: 0, label: '0 copies before (1st copy - 0 pts)' },
    { value: 1, label: '1 copy before (2nd copy - 10 pts)' },
    { value: 2, label: '2 copies before (3rd copy - 30 pts)' },
    { value: 3, label: '3 copies before (4th copy - 50 pts)' },
    { value: 4, label: '4+ copies before (5th+ copy - 70 pts)' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors">
      {/* Header with toggle */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Quick Check
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
        <div className="space-y-6 mt-4">
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

          {/* Copy Toggle */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <input
                type="checkbox"
                checked={isCopy}
                onChange={(e) => setIsCopy(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span>Is this a copy of an existing card?</span>
            </label>

            {isCopy && (
              <div className="ml-6 mt-2">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  How many copies exist before this one?
                </label>
                <select
                  value={copiesBefore}
                  onChange={(e) => setCopiesBefore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {copyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Conversion Toggle */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isConverted}
                onChange={(e) => setIsConverted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span>Is this a converted card? (+10 pts)</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
              Conversion changes the card type to Neutral and adds 10 pts
            </p>
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
              {isCopy && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Copy Cost:</span>
                  <span className="font-semibold">{result.copyCost} pts</span>
                </div>
              )}
              {isConverted && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Conversion Cost:</span>
                  <span className="font-semibold">{result.conversionCost} pts</span>
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

export default QuickToolsSection;
