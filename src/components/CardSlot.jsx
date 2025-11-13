import React from 'react';

const CardSlot = ({ card, onClick, isAddButton = false }) => {
  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className="w-full h-32 sm:h-36 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all flex items-center justify-center group"
      >
        <span className="text-4xl text-gray-400 group-hover:text-primary transition-colors">
          +
        </span>
      </button>
    );
  }

  // Determine card visual state
  const getCardClasses = () => {
    const baseClasses = "w-full h-32 sm:h-36 border-2 rounded-lg transition-all flex flex-col items-center justify-center p-2";

    if (card.isRemoved) {
      return `${baseClasses} bg-red-100 border-red-300 opacity-60 cursor-not-allowed`;
    }

    if (card.isLocked) {
      return `${baseClasses} bg-gray-200 border-gray-400 opacity-50 cursor-pointer hover:opacity-70`;
    }

    return `${baseClasses} bg-white border-gray-300 hover:border-primary hover:shadow-md cursor-pointer`;
  };

  // Get card type label and color
  const getCardTypeInfo = () => {
    switch(card.type) {
      case 'base':
        return { label: 'Base', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      case 'neutral':
        return { label: 'Neutral', color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'monster':
        return { label: 'Monster', color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'forbidden':
        return { label: 'Forbidden', color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { label: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const typeInfo = getCardTypeInfo();

  // Calculate card points display
  const getCardPoints = () => {
    if (card.isRemoved) return 0;

    let points = 0;
    if (card.type === 'neutral') points = 20;
    if (card.type === 'monster') points = 80;
    if (card.type === 'forbidden') points = 20;

    if (card.epiphanyType === 'regular') points += 10;
    if (card.epiphanyType === 'divine') points += 20;

    return points;
  };

  const points = getCardPoints();

  return (
    <button
      onClick={onClick}
      className={getCardClasses()}
      disabled={card.isRemoved}
    >
      {card.isLocked ? (
        <>
          <div className="text-3xl mb-1">🔒</div>
          <div className="text-xs font-semibold text-gray-600">LOCKED</div>
          <div className="text-xs text-gray-500 mt-1">Click to unlock</div>
        </>
      ) : (
        <>
          {/* Card type badge */}
          <div className={`text-xs font-bold ${typeInfo.color} ${typeInfo.bgColor} px-2 py-1 rounded mb-1`}>
            {typeInfo.label}
          </div>

          {/* Points display */}
          <div className="text-2xl font-bold text-gray-800">
            {points} <span className="text-sm">pts</span>
          </div>

          {/* Epiphany indicator */}
          {card.epiphanyType !== 'none' && (
            <div className="text-xs font-semibold mt-1">
              {card.epiphanyType === 'regular' && '✨ Epiphany'}
              {card.epiphanyType === 'divine' && '🌟 Divine'}
            </div>
          )}

          {/* Conversion indicator */}
          {card.isConverted && (
            <div className="text-xs text-gray-500 mt-0.5">🔄 Converted</div>
          )}

          {/* Removed overlay */}
          {card.isRemoved && (
            <div className="text-xs font-bold text-red-600 mt-1">
              🗑️ REMOVED
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default CardSlot;
