import React from 'react';
import { useDeck } from '../context/DeckContext';
import { getCharacterList } from '../data/characters';

const CharacterSelector = () => {
  const { selectedCharacter, selectCharacter, undo, canUndo } = useDeck();
  const characters = getCharacterList();

  const handleCharacterChange = (e) => {
    const characterName = e.target.value;
    if (characterName) {
      selectCharacter(characterName);
    }
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="character-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Select Character
      </label>
      <div className="flex items-center gap-3">
        <select
          id="character-select"
          value={selectedCharacter || ''}
          onChange={handleCharacterChange}
          className="w-full sm:w-1/4 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        >
          <option value="">-- Choose a Character --</option>
          {characters.map((character) => (
            <option key={character.name} value={character.name}>
              {character.displayName}
            </option>
          ))}
        </select>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2 ${
            canUndo
              ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }`}
          title={canUndo ? 'Undo last action' : 'No actions to undo'}
        >
          <span className="text-lg">↶</span>
          <span className="hidden sm:inline">Undo</span>
        </button>
        <a
          href="https://buymeacoffee.com/jaxic"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-md flex items-center gap-2"
        >
          <span>Buy Me a Coffee</span>
        </a>
      </div>
    </div>
  );
};

export default CharacterSelector;
