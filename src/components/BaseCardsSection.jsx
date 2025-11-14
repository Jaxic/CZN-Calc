import React, { useState } from 'react';
import { useDeck } from '../context/DeckContext';
import CardSlot from './CardSlot';
import CardPopup from './CardPopup';

const BaseCardsSection = () => {
  const { baseCards, unlockBaseCard, undo, canUndo } = useDeck();
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleCardClick = (card) => {
    if (card.isLocked) {
      // First click on locked card: unlock it
      unlockBaseCard(card.id);
    } else {
      // Second click or click on active card: open popup
      setSelectedCardId(card.id);
    }
  };

  const handleClosePopup = () => {
    setSelectedCardId(null);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  // Split into starting 4 and unlockable 4
  const startingCards = baseCards.slice(0, 4);
  const unlockableCards = baseCards.slice(4, 8);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Base Cards (Character Deck)</h2>

      {/* Starting 4 cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Starting 4 (Active)</h3>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2 text-sm ${
              canUndo
                ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
            title={canUndo ? 'Undo last action' : 'No actions to undo'}
          >
            <span className="text-lg">↶</span>
            <span className="hidden sm:inline">Undo</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {startingCards.map((card) => (
            <CardSlot
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>

      {/* Unlockable 4 cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Unlockable 4</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {unlockableCards.map((card) => (
            <CardSlot
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>

      {/* Card popup modal */}
      {selectedCardId && (
        <CardPopup cardId={selectedCardId} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default BaseCardsSection;
