import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTotalPoints, TIER_CAPS } from '../utils/calculations';

const DeckContext = createContext();

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};

// Helper function to generate unique IDs
let cardIdCounter = 0;
const generateCardId = () => `card-${++cardIdCounter}`;

// Helper to create a new card
const createCard = (type = 'base', isLocked = false) => ({
  id: generateCardId(),
  type,
  isLocked,
  epiphanyType: 'none',
  isRemoved: false,
  isConverted: false,
  isDuplicate: false,
  originalCardId: null,
});

export const DeckProvider = ({ children }) => {
  // Initialize with 8 base cards (4 active, 4 locked)
  const initialBaseCards = [
    ...Array(4).fill(null).map(() => createCard('base', false)),
    ...Array(4).fill(null).map(() => createCard('base', true)),
  ];

  const [tier, setTier] = useState(8); // Default: Tier 8
  const [baseCards, setBaseCards] = useState(initialBaseCards);
  const [additionalCards, setAdditionalCards] = useState([]);

  // Global counters
  const [totalRemovals, setTotalRemovals] = useState(0);
  const [removalsBonusCount, setRemovalsBonusCount] = useState(0);
  const [totalDuplications, setTotalDuplications] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);

  // Calculate current deck state
  const deckState = {
    tier,
    baseCards,
    additionalCards,
    totalRemovals,
    removalsBonusCount,
    totalDuplications,
    totalConversions,
  };

  const currentPoints = calculateTotalPoints(deckState);
  const cap = TIER_CAPS[tier];

  // Unlock a base card (remove locked state)
  const unlockBaseCard = (cardId) => {
    setBaseCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isLocked: false } : card
      )
    );
  };

  // Add a new additional card
  const addAdditionalCard = (type) => {
    const newCard = createCard(type, false);
    setAdditionalCards(prev => [...prev, newCard]);
    return newCard.id;
  };

  // Remove a card (mark as removed, don't delete)
  const removeCard = (cardId) => {
    let cardToRemove = null;

    // Find card in base cards
    const baseCard = baseCards.find(c => c.id === cardId);
    if (baseCard) {
      cardToRemove = baseCard;
      setBaseCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId ? { ...card, isRemoved: true } : card
        )
      );
    }

    // Find card in additional cards
    const additionalCard = additionalCards.find(c => c.id === cardId);
    if (additionalCard) {
      cardToRemove = additionalCard;
      setAdditionalCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId ? { ...card, isRemoved: true } : card
        )
      );
    }

    // Update counters
    setTotalRemovals(prev => prev + 1);

    // Check if bonus applies (Base card OR has epiphany)
    if (cardToRemove && (cardToRemove.type === 'base' || cardToRemove.epiphanyType !== 'none')) {
      setRemovalsBonusCount(prev => prev + 1);
    }
  };

  // Add epiphany to a card
  const addEpiphany = (cardId, epiphanyType) => {
    const updateCard = (card) => {
      if (card.id === cardId && card.epiphanyType === 'none') {
        return { ...card, epiphanyType };
      }
      return card;
    };

    setBaseCards(prevCards => prevCards.map(updateCard));
    setAdditionalCards(prevCards => prevCards.map(updateCard));
  };

  // Convert a card to neutral
  const convertCard = (cardId) => {
    const updateCard = (card) => {
      if (card.id === cardId && !card.isConverted) {
        return { ...card, type: 'neutral', isConverted: true };
      }
      return card;
    };

    setBaseCards(prevCards => prevCards.map(updateCard));
    setAdditionalCards(prevCards => prevCards.map(updateCard));

    // Increment conversion counter (only once per card)
    const card = [...baseCards, ...additionalCards].find(c => c.id === cardId);
    if (card && !card.isConverted) {
      setTotalConversions(prev => prev + 1);
    }
  };

  // Duplicate a card (creates copy in additional cards)
  const duplicateCard = (cardId) => {
    const sourceCard = [...baseCards, ...additionalCards].find(c => c.id === cardId);

    if (sourceCard) {
      const duplicateCard = {
        ...createCard(sourceCard.type, false),
        epiphanyType: sourceCard.epiphanyType,
        isConverted: sourceCard.isConverted,
        isDuplicate: true,
        originalCardId: cardId,
      };

      setAdditionalCards(prev => [...prev, duplicateCard]);
      setTotalDuplications(prev => prev + 1);

      return duplicateCard.id;
    }
  };

  // Get a specific card by ID
  const getCard = (cardId) => {
    return [...baseCards, ...additionalCards].find(c => c.id === cardId);
  };

  const value = {
    // State
    tier,
    setTier,
    baseCards,
    additionalCards,
    totalRemovals,
    removalsBonusCount,
    totalDuplications,
    totalConversions,
    currentPoints,
    cap,
    deckState,

    // Actions
    unlockBaseCard,
    addAdditionalCard,
    removeCard,
    addEpiphany,
    convertCard,
    duplicateCard,
    getCard,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};
