import React from 'react';
import { useDeck } from '../context/DeckContext';

const CardTypeSelector = ({ onClose }) => {
  const { addAdditionalCard } = useDeck();

  const handleSelectType = (type) => {
    addAdditionalCard(type);
    onClose();
  };

  const getCardClasses = (color) => {
    const classMap = {
      blue: 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 hover:bg-blue-100 dark:hover:bg-blue-800 dark:hover:bg-opacity-40 hover:border-blue-500',
      purple: 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30 hover:bg-purple-100 dark:hover:bg-purple-800 dark:hover:bg-opacity-40 hover:border-purple-500',
      red: 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 hover:bg-red-100 dark:hover:bg-red-800 dark:hover:bg-opacity-40 hover:border-red-500',
    };
    return classMap[color] || '';
  };

  const getTitleClasses = (color) => {
    const classMap = {
      blue: 'text-blue-700 dark:text-blue-300',
      purple: 'text-purple-700 dark:text-purple-300',
      red: 'text-red-700 dark:text-red-300',
    };
    return classMap[color] || '';
  };

  const getValueClasses = (color) => {
    const classMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      red: 'text-red-600 dark:text-red-400',
    };
    return classMap[color] || '';
  };

  const cardTypes = [
    {
      type: 'neutral',
      label: 'Neutral Card',
      points: 20,
      description: 'Standard card worth 20 points',
      color: 'blue',
    },
    {
      type: 'monster',
      label: 'Monster Card',
      points: 80,
      description: 'High-value card worth 80 points',
      color: 'purple',
    },
    {
      type: 'forbidden',
      label: 'Forbidden Card',
      points: 20,
      description: 'Card retained even if over limit',
      color: 'red',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Select Card Type</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {cardTypes.map(({ type, label, points, description, color }) => (
            <button
              key={type}
              onClick={() => handleSelectType(type)}
              className={`w-full py-4 px-4 rounded-lg text-left border-2 ${getCardClasses(color)} transition-colors`}
            >
              <div className={`font-bold text-lg ${getTitleClasses(color)}`}>{label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</div>
              <div className={`text-md font-semibold ${getValueClasses(color)} mt-2`}>
                Base Value: {points} pts
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CardTypeSelector;
