import React from 'react';
import { useDeck } from '../context/DeckContext';
import { getCharacterList } from '../data/characters';

const CharacterSelector = () => {
  const { selectedCharacter, selectCharacter } = useDeck();
  const characters = getCharacterList();

  const handleCharacterChange = (e) => {
    const characterName = e.target.value;
    if (characterName) {
      selectCharacter(characterName);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="character-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Select Character
      </label>
      <select
        id="character-select"
        value={selectedCharacter || ''}
        onChange={handleCharacterChange}
        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      >
        <option value="">-- Choose a Character --</option>
        {characters.map((character) => (
          <option key={character.name} value={character.name}>
            {character.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CharacterSelector;
