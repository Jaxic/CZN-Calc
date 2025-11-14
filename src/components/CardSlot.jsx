import React from 'react';

const CardSlot = ({ card, onClick, isAddButton = false }) => {
  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className="w-full h-32 sm:h-36 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-primary transition-all flex items-center justify-center group"
      >
        <span className="text-4xl text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
          +
        </span>
      </button>
    );
  }

  // Determine card visual state
  const getCardClasses = () => {
    const baseClasses = "w-full h-32 sm:h-36 border-2 rounded-lg transition-all flex flex-col items-center justify-center p-2";

    if (card.isRemoved) {
      return `${baseClasses} bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border-red-300 dark:border-red-700 opacity-60 cursor-not-allowed`;
    }

    if (card.isLocked) {
      return `${baseClasses} bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 opacity-50 cursor-pointer hover:opacity-70`;
    }

    return `${baseClasses} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-primary hover:shadow-md cursor-pointer`;
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

  // Calculate duplication cost based on index
  const getDuplicationCost = (index) => {
    if (index === 0) return 0;
    if (index === 1) return 10;
    if (index === 2) return 30;
    if (index === 3) return 50;
    return 70;
  };

  // Calculate card points display
  const getCardPoints = () => {
    if (card.isRemoved) {
      // Show removal penalty for base cards
      if (card.type === 'base') return 20;
      return 0;
    }

    let points = 0;
    if (card.type === 'neutral') points = 20;
    if (card.type === 'monster') points = 80;
    if (card.type === 'forbidden') points = 20;

    // Regular epiphanies are FREE on ORIGINAL base cards only
    // Duplicates always cost 10 points for regular epiphanies
    if (card.epiphanyType === 'regular') {
      if (card.isDuplicate || card.type !== 'base') {
        points += 10;
      }
      // else: free for original base cards only
    }
    if (card.epiphanyType === 'divine') points += 20;

    // Add duplication cost if this is a duplicated card
    if (card.isDuplicate && card.duplicationIndex !== undefined) {
      points += getDuplicationCost(card.duplicationIndex);
    }

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
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">LOCKED</div>
          {card.cardName && (
            <div className="text-sm font-bold text-gray-900 dark:text-gray-900 mt-2 px-2 py-1 text-center line-clamp-2 bg-white bg-opacity-80 rounded">
              {card.cardName}
            </div>
          )}
          {!card.cardName && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to unlock</div>
          )}
        </>
      ) : (
        <>
          {/* Card name (if available) or type badge */}
          {card.cardName ? (
            <div className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 px-2 text-center line-clamp-2 leading-tight">
              {card.cardName}
            </div>
          ) : (
            <div className={`text-xs font-bold ${typeInfo.color} ${typeInfo.bgColor} px-2 py-1 rounded mb-1`}>
              {typeInfo.label}
            </div>
          )}

          {/* Points display */}
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {points} <span className="text-sm">pts</span>
          </div>

          {/* Epiphany indicator */}
          {card.epiphanyType !== 'none' && (
            <div className="text-xs font-semibold mt-1 dark:text-gray-200">
              {card.epiphanyType === 'regular' && 'Epiphany'}
              {card.epiphanyType === 'divine' && 'Divine'}
            </div>
          )}

          {/* Conversion indicator */}
          {card.isConverted && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Converted</div>
          )}

          {/* Removed overlay */}
          {card.isRemoved && (
            <div className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">
              REMOVED
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default CardSlot;
