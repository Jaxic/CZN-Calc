import React from 'react';
import { useDeck } from '../context/DeckContext';

const CardPopup = ({ cardId, onClose }) => {
  const { getCard, addEpiphany, convertCard, duplicateCard, removeCard, deleteOrResetCard } = useDeck();
  const card = getCard(cardId);

  if (!card) {
    onClose();
    return null;
  }

  const handleAddEpiphany = (type) => {
    addEpiphany(cardId, type);
    onClose();
  };

  const handleConvert = () => {
    convertCard(cardId);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateCard(cardId);
    onClose();
  };

  const handleRemove = () => {
    removeCard(cardId);
    onClose();
  };

  const handleDeleteOrReset = () => {
    // Determine if this is a base card (and not a duplicate of a base card)
    const isOriginalBaseCard = card.type === 'base' && !card.isDuplicate;
    const actionText = isOriginalBaseCard ? 'reset' : 'delete';
    const message = isOriginalBaseCard
      ? 'Are you sure you want to reset this card? This will remove all modifications (epiphanies, conversions, removals) but keep the card name and lock state.'
      : 'Are you sure you want to delete this card? This action cannot be undone (except via Undo button).';

    if (window.confirm(message)) {
      deleteOrResetCard(cardId);
      onClose();
    }
  };

  // Calculate duplication cost based on index
  const getDuplicationCost = (index) => {
    if (index === 0) return 0;
    if (index === 1) return 10;
    if (index === 2) return 30;
    if (index === 3) return 50;
    return 70;
  };

  // Calculate current card points
  const calculateDisplayPoints = () => {
    let points = 0;
    if (card.type === 'neutral') points = 20;
    if (card.type === 'monster') points = 80;
    if (card.type === 'forbidden') points = 20;

    // Regular epiphanies are FREE on base cards
    if (card.epiphanyType === 'regular') {
      if (card.type !== 'base') {
        points += 10;
      }
      // else: free for base cards
    }
    if (card.epiphanyType === 'divine') points += 20;

    // Add duplication cost if this is a duplicated card
    if (card.isDuplicate && card.duplicationIndex !== undefined) {
      points += getDuplicationCost(card.duplicationIndex);
    }

    return `${points} pts`;
  };

  const getCardTypeName = () => {
    const names = {
      base: 'Base Card',
      neutral: 'Neutral Card',
      monster: 'Monster Card',
      forbidden: 'Forbidden Card',
    };
    return names[card.type] || 'Unknown';
  };

  // Check if actions are available
  const canAddEpiphany = card.epiphanyType === 'none' && !card.isRemoved;
  const canConvert = !card.isConverted && card.type !== 'neutral' && !card.isRemoved;
  const canDuplicate = !card.isRemoved;
  const canRemove = !card.isRemoved;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Card Options</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Card visual representation */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 dark:bg-opacity-30 p-6 rounded-lg mb-4 text-center border-2 border-gray-300 dark:border-gray-600">
          <div className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{getCardTypeName()}</div>
          <div className="text-2xl font-bold text-primary dark:text-blue-400 mt-2">
            {calculateDisplayPoints()}
          </div>
          {card.epiphanyType !== 'none' && (
            <div className="text-sm font-semibold mt-2 text-purple-600 dark:text-purple-400">
              {card.epiphanyType === 'regular' && 'Has Regular Epiphany'}
              {card.epiphanyType === 'divine' && 'Has Divine Epiphany'}
            </div>
          )}
          {card.isConverted && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Converted to Neutral</div>
          )}
          {card.type === 'forbidden' && (
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">Prioritized when over cap</div>
          )}
        </div>

        <div className="border-t-2 border-gray-200 dark:border-gray-700 my-4"></div>

        {/* Action buttons */}
        <div className="space-y-2">
          {canAddEpiphany && (
            <>
              <button
                onClick={() => handleAddEpiphany('regular')}
                className="w-full py-3 px-4 rounded-lg text-left border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 hover:bg-blue-100 dark:hover:bg-blue-800 dark:hover:bg-opacity-40 transition-colors"
              >
                <div className="font-semibold text-blue-700 dark:text-blue-300">Add Regular Epiphany</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {card.type === 'base' ? 'FREE (0 points on base cards, including duplicates)' : '+10 points to this card'}
                </div>
              </button>

              <button
                onClick={() => handleAddEpiphany('divine')}
                className="w-full py-3 px-4 rounded-lg text-left border-2 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30 hover:bg-purple-100 dark:hover:bg-purple-800 dark:hover:bg-opacity-40 transition-colors"
              >
                <div className="font-semibold text-purple-700 dark:text-purple-300">Add Divine Epiphany</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">+20 points to this card</div>
              </button>
            </>
          )}

          {!canAddEpiphany && !card.isRemoved && (
            <div className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60">
              <div className="font-semibold text-gray-500 dark:text-gray-400">
                {card.epiphanyType !== 'none' ? 'Epiphany Already Added' : 'Epiphany Unavailable'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Each card can only have one epiphany
              </div>
            </div>
          )}

          {canConvert ? (
            <button
              onClick={handleConvert}
              className="w-full py-3 px-4 rounded-lg text-left border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900 dark:bg-opacity-30 hover:bg-green-100 dark:hover:bg-green-800 dark:hover:bg-opacity-40 transition-colors"
            >
              <div className="font-semibold text-green-700 dark:text-green-300">Convert to Neutral</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Changes card type to Neutral (+10 conversion pts)</div>
            </button>
          ) : (
            !card.isRemoved && (
              <div className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60">
                <div className="font-semibold text-gray-500 dark:text-gray-400">
                  {card.isConverted ? 'Already Converted' : 'Already Neutral'}
                </div>
              </div>
            )
          )}

          {canDuplicate && (
            <button
              onClick={handleDuplicate}
              className="w-full py-3 px-4 rounded-lg text-left border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-30 hover:bg-indigo-100 dark:hover:bg-indigo-800 dark:hover:bg-opacity-40 transition-colors"
            >
              <div className="font-semibold text-indigo-700 dark:text-indigo-300">Copy Card</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Create a copy (inherits all properties)</div>
            </button>
          )}

          {canRemove && (
            <button
              onClick={handleRemove}
              className="w-full py-3 px-4 rounded-lg text-left border-2 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 hover:bg-red-100 dark:hover:bg-red-800 dark:hover:bg-opacity-40 transition-colors"
            >
              <div className="font-semibold text-red-700 dark:text-red-300">Remove Card</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Mark as removed (adds to removal counter)
                {card.type === 'base' && (
                  <span className="font-semibold"> +20 starting card penalty</span>
                )}
              </div>
            </button>
          )}

          {/* Delete/Reset button - always show */}
          <button
            onClick={handleDeleteOrReset}
            className="w-full py-3 px-4 rounded-lg text-left border-2 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-30 hover:bg-orange-100 dark:hover:bg-orange-800 dark:hover:bg-opacity-40 transition-colors"
          >
            <div className="font-semibold text-orange-700 dark:text-orange-300">
              {card.type === 'base' && !card.isDuplicate ? '🔄 Reset Card' : '🗑️ Delete Card'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {card.type === 'base' && !card.isDuplicate
                ? 'Remove all modifications but keep card name'
                : 'Permanently remove this card from deck'}
            </div>
          </button>

          {card.isRemoved && (
            <div className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
              <div className="font-semibold text-gray-500 dark:text-gray-400">Card Already Removed</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">This card is marked as removed</div>
            </div>
          )}
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CardPopup;
