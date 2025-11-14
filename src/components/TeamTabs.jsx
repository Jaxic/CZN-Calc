import React from 'react';
import { useDeck } from '../context/DeckContext';

const TeamTabs = () => {
  const { activeTeamMember, switchTeamMember, getTeamMemberCharacter } = useDeck();

  const tabs = [
    { id: 1, label: 'Team Member 1' },
    { id: 2, label: 'Team Member 2' },
    { id: 3, label: 'Team Member 3' },
  ];

  return (
    <div className="flex gap-2 border-b-2 border-gray-300 dark:border-gray-600 mb-4">
      {tabs.map((tab) => {
        const characterName = getTeamMemberCharacter(tab.id);
        const isActive = activeTeamMember === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => switchTeamMember(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors relative ${
              isActive
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <div className="text-sm">{tab.label}</div>
            {characterName && (
              <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {characterName}
              </div>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 dark:bg-orange-400"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TeamTabs;
