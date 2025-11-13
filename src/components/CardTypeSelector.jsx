import React from 'react';
import { useDeck } from '../context/DeckContext';

const CardTypeSelector = ({ onClose }) => {
  const { addAdditionalCard } = useDeck();

  const handleSelectType = (type) => {
    addAdditionalCard(type);
    onClose();
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
      description: 'Auto-saved (doesn\'t count toward limit)',
      color: 'red',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select Card Type</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {cardTypes.map(({ type, label, points, description, color }) => (
            <button
              key={type}
              onClick={() => handleSelectType(type)}
              className={`w-full py-4 px-4 rounded-lg text-left border-2 border-${color}-300 bg-${color}-50 hover:bg-${color}-100 hover:border-${color}-500 transition-colors`}
            >
              <div className={`font-bold text-lg text-${color}-700`}>{label}</div>
              <div className="text-sm text-gray-600 mt-1">{description}</div>
              <div className={`text-md font-semibold text-${color}-600 mt-2`}>
                Base Value: {points} pts
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CardTypeSelector;
