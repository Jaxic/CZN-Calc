// Tier caps mapping (Tier 1-15)
export const TIER_CAPS = {
  1: 30,
  2: 40,
  3: 50,
  4: 60,
  5: 70,
  6: 80,
  7: 90,
  8: 100,
  9: 110,
  10: 120,
  11: 130,
  12: 140,
  13: 150,
  14: 160,
  15: 170,
};

/**
 * Calculate points for a single card
 * @param {Object} card - Card object with type and epiphany info
 * @returns {number} Point value of the card
 */
export function calculateCardPoints(card) {
  // Removed cards don't contribute to deck value
  if (card.isRemoved) return 0;

  let points = 0;

  // Base value by card type
  switch(card.type) {
    case 'base':
      points = 0;
      break;
    case 'neutral':
      points = 20;
      break;
    case 'monster':
      points = 80;
      break;
    case 'forbidden':
      // Forbidden cards are 20 points and DO count toward limit (prioritized when over cap)
      points = 20;
      break;
    default:
      points = 0;
  }

  // Add epiphany modifiers (only ONE per card)
  // Special rule: Regular epiphanies on base cards are FREE (even duplicates)
  // IN-GAME BUG: Regular epiphanies on monster cards are also FREE
  if (card.epiphanyType === 'regular') {
    if (card.type !== 'base' && card.type !== 'monster') {
      points += 10;
    }
    // else: free for base and monster cards (including duplicates)
  } else if (card.epiphanyType === 'divine') {
    points += 20; // Divine always costs 20 regardless of card type

    // IN-GAME BUG: Neutral cards with divine epiphanies incorrectly also count
    // the regular epiphany proc (+10), making them cost 50 instead of 40
    if (card.type === 'neutral') {
      points += 10; // Bug: adds regular epiphany proc
    }
  }

  return points;
}

/**
 * Calculate removal points based on global removal count and bonuses
 * @param {number} totalRemovals - Total number of cards removed
 * @param {number} bonusCount - Number of Base/Epiphany cards removed (get +20 each)
 * @returns {number} Total removal points
 */
export function calculateRemovalPoints(totalRemovals, bonusCount) {
  // Progressive costs: 1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70
  const removalCosts = [0, 10, 30, 50];
  let total = 0;

  for (let i = 0; i < totalRemovals; i++) {
    if (i === 0) {
      // First removal is free
      total += 0;
    } else if (i <= 3) {
      // 2nd, 3rd, 4th removals use the cost array
      total += removalCosts[i];
    } else {
      // 5th+ removals cost 70 each
      total += 70;
    }
  }

  // Add bonus for Base/Epiphany card removals
  total += bonusCount * 20;

  return total;
}

/**
 * Calculate duplication points based on duplicated cards
 * @param {Array} duplicatedCards - Array of cards that were duplicated
 * @returns {number} Total duplication points
 */
export function calculateDuplicationPoints(duplicatedCards) {
  // Progressive base costs: 1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70
  // NOTE: This function ONLY returns the progressive duplication costs
  // The card values themselves are counted in their respective categories (epiphanies, card types, etc.)
  const dupCosts = [0, 10, 30, 50];
  let total = 0;

  duplicatedCards.forEach((card, index) => {
    // Add ONLY the progressive duplication cost (not the card value)
    if (index === 0) {
      total += 0; // First duplication is free
    } else if (index <= 3) {
      total += dupCosts[index]; // 2nd, 3rd, 4th use cost array
    } else {
      total += 70; // 5th+ cost 70 each
    }
  });

  return total;
}

/**
 * Calculate conversion points (10 points per conversion)
 * @param {number} totalConversions - Total number of cards converted
 * @returns {number} Total conversion points
 */
export function calculateConversionPoints(totalConversions) {
  // Each conversion adds 10 points (per PRD 2.5)
  return totalConversions * 10;
}

/**
 * Calculate total deck points
 * @param {Object} deckState - Complete deck state with all cards and counters
 * @returns {number} Total point value
 */
export function calculateTotalPoints(deckState) {
  // Sum all active cards (both base and additional, including duplicates)
  // Duplicates are included here because duplicationPoints only contains progressive costs
  const allCards = [...deckState.baseCards, ...deckState.additionalCards];
  const cardPoints = allCards
    .map(card => calculateCardPoints(card))
    .reduce((sum, points) => sum + points, 0);

  // Get duplicated cards for cost calculation
  const duplicatedCards = deckState.additionalCards.filter(card => card.isDuplicate);

  // Add modification points
  const removalPoints = calculateRemovalPoints(
    deckState.totalRemovals,
    deckState.removalsBonusCount
  );

  const duplicationPoints = calculateDuplicationPoints(duplicatedCards);

  const conversionPoints = calculateConversionPoints(
    deckState.totalConversions
  );

  return cardPoints + removalPoints + duplicationPoints + conversionPoints;
}

/**
 * Get status indicator based on percentage of cap used
 * @param {number} current - Current points
 * @param {number} cap - Tier cap
 * @returns {Object} Status object with type and message
 */
export function getStatus(current, cap) {
  const percentage = (current / cap) * 100;

  if (percentage > 100) {
    return {
      type: 'danger',
      message: 'OVER LIMIT - Cards Will Be Lost',
      color: 'red',
      icon: ''
    };
  } else if (percentage === 100) {
    return {
      type: 'success',
      message: 'PERFECT - Exactly at Cap',
      color: 'green',
      icon: ''
    };
  } else if (percentage >= 90) {
    return {
      type: 'warning',
      message: 'WARNING - Close to Limit',
      color: 'yellow',
      icon: ''
    };
  } else {
    return {
      type: 'success',
      message: 'SAFE',
      color: 'green',
      icon: ''
    };
  }
}

/**
 * Calculate breakdown of points by category
 * @param {Object} deckState - Complete deck state
 * @returns {Object} Breakdown object with all categories
 */
export function getPointsBreakdown(deckState) {
  const allCards = [...deckState.baseCards, ...deckState.additionalCards];

  // Count cards by type (excluding removed cards, including duplicates)
  // Duplicates are included because Duplications section only shows progressive costs
  const activeCards = allCards.filter(card => !card.isRemoved);

  const baseCardsCount = activeCards.filter(c => c.type === 'base').length;
  const neutralCardsCount = activeCards.filter(c => c.type === 'neutral').length;
  const monsterCardsCount = activeCards.filter(c => c.type === 'monster').length;
  const forbiddenCardsCount = activeCards.filter(c => c.type === 'forbidden').length;

  // Count epiphanies (including duplicates)
  const regularEpiphanies = activeCards.filter(c => c.epiphanyType === 'regular').length;
  const divineEpiphanies = activeCards.filter(c => c.epiphanyType === 'divine').length;

  // Count neutral cards with divine epiphanies (for in-game bug calculation)
  const neutralCardsWithDivine = activeCards.filter(c => c.type === 'neutral' && c.epiphanyType === 'divine').length;

  // Count regular epiphanies that cost points (NOT on base or monster cards - those are free)
  // Base cards (including duplicates) get free regular epiphanies
  // IN-GAME BUG: Monster cards also get free regular epiphanies
  const regularEpiphaniesOnNonBase = activeCards.filter(c =>
    c.epiphanyType === 'regular' && c.type !== 'base' && c.type !== 'monster'
  ).length;

  // Calculate points by category
  const baseCardsPoints = 0; // Base cards are always 0
  const neutralCardsPoints = neutralCardsCount * 20;
  const monsterCardsPoints = monsterCardsCount * 80;
  const forbiddenCardsPoints = forbiddenCardsCount * 20; // 20 pts each, prioritized when over cap
  const regularEpiphaniesPoints = regularEpiphaniesOnNonBase * 10; // Regular epiphanies on base cards are FREE
  const divineEpiphaniesPoints = divineEpiphanies * 20 + neutralCardsWithDivine * 10; // Bug: +10 for neutral cards with divine

  // Get duplicated cards for cost calculation
  const duplicatedCards = deckState.additionalCards.filter(card => card.isDuplicate);

  const removalPoints = calculateRemovalPoints(
    deckState.totalRemovals,
    deckState.removalsBonusCount
  );

  const duplicationPoints = calculateDuplicationPoints(duplicatedCards);

  const conversionPoints = calculateConversionPoints(
    deckState.totalConversions
  );

  return {
    baseCards: { count: baseCardsCount, points: baseCardsPoints },
    neutralCards: { count: neutralCardsCount, points: neutralCardsPoints },
    monsterCards: { count: monsterCardsCount, points: monsterCardsPoints },
    forbiddenCards: { count: forbiddenCardsCount, points: forbiddenCardsPoints },
    regularEpiphanies: { count: regularEpiphanies, points: regularEpiphaniesPoints },
    divineEpiphanies: { count: divineEpiphanies, points: divineEpiphaniesPoints },
    removals: { count: deckState.totalRemovals, bonusCount: deckState.removalsBonusCount, points: removalPoints },
    duplications: { count: deckState.totalDuplications, points: duplicationPoints },
    conversions: { count: deckState.totalConversions, points: conversionPoints },
  };
}
