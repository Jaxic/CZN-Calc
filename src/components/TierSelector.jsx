import React from 'react';
import { useDeck } from '../context/DeckContext';
import { TIER_CAPS } from '../utils/calculations';

const TierSelector = () => {
  const { tier, setTier, cap } = useDeck();

  const handleTierChange = (e) => {
    setTier(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="tier-select" className="font-semibold text-lg">
          Tier:
        </label>
        <select
          id="tier-select"
          value={tier}
          onChange={handleTierChange}
          className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
        >
          {Object.keys(TIER_CAPS).map((t) => (
            <option key={t} value={t}>
              Tier {t}
            </option>
          ))}
        </select>
      </div>
      <div className="text-lg">
        <span className="text-gray-600">Cap:</span>
        <span className="font-bold text-primary ml-2">{cap} pts</span>
      </div>
    </div>
  );
};

export default TierSelector;
