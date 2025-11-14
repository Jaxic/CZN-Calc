import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTotalPoints, TIER_CAPS } from '../utils/calculations';
import { CHARACTERS } from '../data/characters';

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
const createCard = (type = 'base', isLocked = false, cardName = null) => ({
  id: generateCardId(),
  type,
  isLocked,
  cardName,
  epiphanyType: 'none',
  isRemoved: false,
  isConverted: false,
  isDuplicate: false,
  originalCardId: null,
});

// Helper to create initial deck state for a team member
const createInitialDeckState = () => {
  const initialBaseCards = [
    ...Array(4).fill(null).map(() => createCard('base', false)),
    ...Array(4).fill(null).map(() => createCard('base', true)),
  ];

  return {
    tier: 8,
    baseCards: initialBaseCards,
    additionalCards: [],
    selectedCharacter: null,
    totalRemovals: 0,
    removalsBonusCount: 0,
    totalDuplications: 0,
    totalConversions: 0,
  };
};

export const DeckProvider = ({ children }) => {
  // Active team member (1, 2, or 3)
  const [activeTeamMember, setActiveTeamMember] = useState(1);

  // State for all 3 team members
  const [teamMembers, setTeamMembers] = useState({
    1: createInitialDeckState(),
    2: createInitialDeckState(),
    3: createInitialDeckState(),
  });

  // History for undo functionality (per team member)
  const [history, setHistory] = useState({
    1: [],
    2: [],
    3: [],
  });

  // Get current active team member's state
  const currentState = teamMembers[activeTeamMember];

  // Helper to update current team member's state
  const updateCurrentState = (updates) => {
    // Save current state to history before updating (limit to last 20 states)
    setHistory(prev => ({
      ...prev,
      [activeTeamMember]: [...prev[activeTeamMember], currentState].slice(-20),
    }));

    setTeamMembers(prev => ({
      ...prev,
      [activeTeamMember]: {
        ...prev[activeTeamMember],
        ...updates,
      },
    }));
  };

  // Undo last action
  const undo = () => {
    const memberHistory = history[activeTeamMember];
    if (memberHistory.length === 0) return; // Nothing to undo

    // Get the last state from history
    const previousState = memberHistory[memberHistory.length - 1];

    // Remove last state from history
    setHistory(prev => ({
      ...prev,
      [activeTeamMember]: prev[activeTeamMember].slice(0, -1),
    }));

    // Restore previous state
    setTeamMembers(prev => ({
      ...prev,
      [activeTeamMember]: previousState,
    }));
  };

  // Check if undo is available
  const canUndo = history[activeTeamMember].length > 0;

  // Calculate current deck state
  const deckState = {
    tier: currentState.tier,
    baseCards: currentState.baseCards,
    additionalCards: currentState.additionalCards,
    totalRemovals: currentState.totalRemovals,
    removalsBonusCount: currentState.removalsBonusCount,
    totalDuplications: currentState.totalDuplications,
    totalConversions: currentState.totalConversions,
  };

  const currentPoints = calculateTotalPoints(deckState);
  const cap = TIER_CAPS[currentState.tier];

  // Switch to a different team member
  const switchTeamMember = (memberNumber) => {
    if (memberNumber >= 1 && memberNumber <= 3) {
      setActiveTeamMember(memberNumber);
    }
  };

  // Get character name for a specific team member
  const getTeamMemberCharacter = (memberNumber) => {
    const state = teamMembers[memberNumber];
    if (!state || !state.selectedCharacter) return null;
    const character = CHARACTERS[state.selectedCharacter];
    return character ? character.displayName : null;
  };

  // Set tier
  const setTier = (newTier) => {
    updateCurrentState({ tier: newTier });
  };

  // Unlock a base card (remove locked state)
  const unlockBaseCard = (cardId) => {
    updateCurrentState({
      baseCards: currentState.baseCards.map(card =>
        card.id === cardId ? { ...card, isLocked: false } : card
      ),
    });
  };

  // Add a new additional card
  const addAdditionalCard = (type) => {
    const newCard = createCard(type, false);
    updateCurrentState({
      additionalCards: [...currentState.additionalCards, newCard],
    });
    return newCard.id;
  };

  // Remove a card (mark as removed, don't delete)
  const removeCard = (cardId) => {
    let cardToRemove = null;

    // Find card in base cards
    const baseCard = currentState.baseCards.find(c => c.id === cardId);
    if (baseCard) {
      cardToRemove = baseCard;
      updateCurrentState({
        baseCards: currentState.baseCards.map(card =>
          card.id === cardId ? { ...card, isRemoved: true } : card
        ),
        totalRemovals: currentState.totalRemovals + 1,
        removalsBonusCount: cardToRemove.type === 'base'
          ? currentState.removalsBonusCount + 1
          : currentState.removalsBonusCount,
      });
      return;
    }

    // Find card in additional cards
    const additionalCard = currentState.additionalCards.find(c => c.id === cardId);
    if (additionalCard) {
      cardToRemove = additionalCard;
      updateCurrentState({
        additionalCards: currentState.additionalCards.map(card =>
          card.id === cardId ? { ...card, isRemoved: true } : card
        ),
        totalRemovals: currentState.totalRemovals + 1,
        removalsBonusCount: cardToRemove.type === 'base'
          ? currentState.removalsBonusCount + 1
          : currentState.removalsBonusCount,
      });
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

    updateCurrentState({
      baseCards: currentState.baseCards.map(updateCard),
      additionalCards: currentState.additionalCards.map(updateCard),
    });
  };

  // Convert a card to neutral
  const convertCard = (cardId) => {
    const updateCard = (card) => {
      if (card.id === cardId && !card.isConverted) {
        return { ...card, type: 'neutral', isConverted: true };
      }
      return card;
    };

    // Check if card needs conversion counter increment
    const card = [...currentState.baseCards, ...currentState.additionalCards].find(c => c.id === cardId);
    const shouldIncrement = card && !card.isConverted;

    updateCurrentState({
      baseCards: currentState.baseCards.map(updateCard),
      additionalCards: currentState.additionalCards.map(updateCard),
      totalConversions: shouldIncrement ? currentState.totalConversions + 1 : currentState.totalConversions,
    });
  };

  // Duplicate a card (creates copy in additional cards)
  const duplicateCard = (cardId) => {
    const sourceCard = [...currentState.baseCards, ...currentState.additionalCards].find(c => c.id === cardId);

    if (sourceCard) {
      const duplicateCard = {
        ...createCard(sourceCard.type, false),
        cardName: sourceCard.cardName,
        epiphanyType: sourceCard.epiphanyType,
        isConverted: sourceCard.isConverted,
        isDuplicate: true,
        originalCardId: cardId,
        duplicationIndex: currentState.totalDuplications,
      };

      updateCurrentState({
        additionalCards: [...currentState.additionalCards, duplicateCard],
        totalDuplications: currentState.totalDuplications + 1,
      });

      return duplicateCard.id;
    }
  };

  // Delete or reset a card
  const deleteOrResetCard = (cardId) => {
    // Check if it's a base card
    const baseCardIndex = currentState.baseCards.findIndex(c => c.id === cardId);

    if (baseCardIndex !== -1) {
      // BASE CARD: Reset to initial state but keep cardName and isLocked
      const card = currentState.baseCards[baseCardIndex];

      // Calculate counter decrements
      const removalsDecrement = card.isRemoved ? 1 : 0;
      const removalsBonusDecrement = (card.isRemoved && card.type === 'base') ? 1 : 0;
      const conversionsDecrement = card.isConverted ? 1 : 0;

      // Reset card to initial state (preserving cardName and isLocked)
      const resetCard = {
        ...card,
        type: 'base', // Restore to base if it was converted
        epiphanyType: 'none',
        isRemoved: false,
        isConverted: false,
        // Keep: cardName, isLocked, id
      };

      updateCurrentState({
        baseCards: currentState.baseCards.map((c, i) =>
          i === baseCardIndex ? resetCard : c
        ),
        totalRemovals: currentState.totalRemovals - removalsDecrement,
        removalsBonusCount: currentState.removalsBonusCount - removalsBonusDecrement,
        totalConversions: currentState.totalConversions - conversionsDecrement,
      });
      return;
    }

    // Check if it's an additional card
    const additionalCard = currentState.additionalCards.find(c => c.id === cardId);

    if (additionalCard) {
      // ADDITIONAL CARD: Delete entirely

      // Calculate counter decrements
      const removalsDecrement = additionalCard.isRemoved ? 1 : 0;
      const removalsBonusDecrement = (additionalCard.isRemoved && additionalCard.type === 'base') ? 1 : 0;
      const conversionsDecrement = additionalCard.isConverted ? 1 : 0;
      const duplicationsDecrement = additionalCard.isDuplicate ? 1 : 0;

      // Remove the card from array
      const remainingCards = currentState.additionalCards.filter(c => c.id !== cardId);

      // Reindex duplicates if we deleted a duplicate
      let finalCards = remainingCards;
      if (additionalCard.isDuplicate) {
        // Get all remaining duplicates and sort by current index
        const duplicates = remainingCards.filter(c => c.isDuplicate);
        const sortedDuplicates = [...duplicates].sort((a, b) =>
          (a.duplicationIndex || 0) - (b.duplicationIndex || 0)
        );

        // Create a map of card IDs to new indices
        const indexMap = new Map();
        sortedDuplicates.forEach((dup, newIndex) => {
          indexMap.set(dup.id, newIndex);
        });

        // Update all cards with new indices
        finalCards = remainingCards.map(card => {
          if (card.isDuplicate && indexMap.has(card.id)) {
            return { ...card, duplicationIndex: indexMap.get(card.id) };
          }
          return card;
        });
      }

      updateCurrentState({
        additionalCards: finalCards,
        totalRemovals: currentState.totalRemovals - removalsDecrement,
        removalsBonusCount: currentState.removalsBonusCount - removalsBonusDecrement,
        totalConversions: currentState.totalConversions - conversionsDecrement,
        totalDuplications: currentState.totalDuplications - duplicationsDecrement,
      });
    }
  };

  // Get a specific card by ID
  const getCard = (cardId) => {
    return [...currentState.baseCards, ...currentState.additionalCards].find(c => c.id === cardId);
  };

  // Reset the current team member's run
  const resetRun = () => {
    updateCurrentState(createInitialDeckState());
  };

  // Select a character and populate base cards with their cards
  const selectCharacter = (characterName) => {
    const character = CHARACTERS[characterName];
    if (!character) return;

    // Create 8 base cards from character data
    const characterBaseCards = [
      // 3 starting cards (active)
      ...character.startingCards.map(cardName => createCard('base', false, cardName)),
      // 1st unique card (active)
      createCard('base', false, character.uniqueCards[0]),
      // Remaining 4 unique cards (locked)
      ...character.uniqueCards.slice(1).map(cardName => createCard('base', true, cardName)),
    ];

    // Clear history when selecting a new character (it's essentially a reset)
    setHistory(prev => ({
      ...prev,
      [activeTeamMember]: [],
    }));

    setTeamMembers(prev => ({
      ...prev,
      [activeTeamMember]: {
        tier: 8,
        baseCards: characterBaseCards,
        additionalCards: [],
        selectedCharacter: characterName,
        totalRemovals: 0,
        removalsBonusCount: 0,
        totalDuplications: 0,
        totalConversions: 0,
      },
    }));
  };

  const value = {
    // Team member state
    activeTeamMember,
    switchTeamMember,
    getTeamMemberCharacter,

    // Current state
    tier: currentState.tier,
    setTier,
    baseCards: currentState.baseCards,
    additionalCards: currentState.additionalCards,
    selectedCharacter: currentState.selectedCharacter,
    totalRemovals: currentState.totalRemovals,
    removalsBonusCount: currentState.removalsBonusCount,
    totalDuplications: currentState.totalDuplications,
    totalConversions: currentState.totalConversions,
    currentPoints,
    cap,
    deckState,

    // Undo functionality
    undo,
    canUndo,

    // Actions
    unlockBaseCard,
    addAdditionalCard,
    removeCard,
    addEpiphany,
    convertCard,
    duplicateCard,
    deleteOrResetCard,
    getCard,
    resetRun,
    selectCharacter,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};
