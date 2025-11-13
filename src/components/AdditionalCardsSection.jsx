import React, { useState } from 'react';
import { useDeck } from '../context/DeckContext';
import CardSlot from './CardSlot';
import CardPopup from './CardPopup';
import CardTypeSelector from './CardTypeSelector';

const AdditionalCardsSection = () => {
  const { additionalCards } = useDeck();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Calculate number of empty slots to show (start with 4 slots, expand as needed)
  // Show 4 slots if empty, otherwise show 2 empty slots for adding more
  const emptySlots = additionalCards.length === 0 ? 4 : 2;

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
  };

  const handleAddClick = () => {
    setShowTypeSelector(true);
  };

  const handleClosePopup = () => {
    setSelectedCardId(null);
  };

  const handleCloseTypeSelector = () => {
    setShowTypeSelector(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Additional Cards Gained</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Render existing additional cards */}
        {additionalCards.map((card) => (
          <CardSlot
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}

        {/* Render empty slots as add buttons */}
        {Array(emptySlots).fill(null).map((_, index) => (
          <CardSlot
            key={`empty-${index}`}
            isAddButton={true}
            onClick={handleAddClick}
          />
        ))}
      </div>

      {/* Add more slots button if all are filled */}
      {emptySlots === 0 && (
        <button
          onClick={handleAddClick}
          className="w-full py-3 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all text-gray-600 hover:text-primary font-semibold"
        >
          + Add Another Card
        </button>
      )}

      {/* Card popup modal */}
      {selectedCardId && (
        <CardPopup cardId={selectedCardId} onClose={handleClosePopup} />
      )}

      {/* Card type selector modal */}
      {showTypeSelector && (
        <CardTypeSelector onClose={handleCloseTypeSelector} />
      )}
    </div>
  );
};

export default AdditionalCardsSection;
