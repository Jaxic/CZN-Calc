import React, { useState } from 'react';
import { useDeck } from '../context/DeckContext';
import { getPointsBreakdown, getStatus } from '../utils/calculations';

const BreakdownPanel = () => {
  const { deckState, currentPoints, cap, resetRun } = useDeck();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const breakdown = getPointsBreakdown(deckState);
  const status = getStatus(currentPoints, cap);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleResetRun = () => {
    if (window.confirm('Are you sure you want to reset the entire run? This will clear all cards and progress.')) {
      resetRun();
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600">
      {/* Header with collapse toggle for mobile */}
      <div className="flex justify-between items-center mb-3 lg:mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Breakdown of Current Score</h3>
        <button
          onClick={toggleCollapse}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Breakdown content (collapsible on mobile) */}
      <div className={`space-y-3 ${isCollapsed ? 'hidden' : 'block'} lg:block`}>
        {/* Card types */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Base Cards: {breakdown.baseCards.count}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{breakdown.baseCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Neutral Cards: {breakdown.neutralCards.count}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{breakdown.neutralCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Monster Cards: {breakdown.monsterCards.count}</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{breakdown.monsterCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Forbidden Cards: {breakdown.forbiddenCards.count}</span>
            <span className="font-semibold text-red-600 dark:text-red-400">{breakdown.forbiddenCards.points} pts <span className="text-xs text-green-600 dark:text-green-400">(prioritized)</span></span>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

        {/* Epiphanies */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">✨ Epiphanies: {breakdown.regularEpiphanies.count}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{breakdown.regularEpiphanies.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">🌟 Divine Epiphanies: {breakdown.divineEpiphanies.count}</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{breakdown.divineEpiphanies.points} pts</span>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

        {/* Modifications */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              🗑️ Removals: {breakdown.removals.count}
              {breakdown.removals.bonusCount > 0 && (
                <span className="text-xs"> (+{breakdown.removals.bonusCount} bonus)</span>
              )}
            </span>
            <span className="font-semibold text-red-600 dark:text-red-400">{breakdown.removals.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">📋 Duplications: {breakdown.duplications.count}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{breakdown.duplications.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">🔄 Conversions: {breakdown.conversions.count}</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{breakdown.conversions.points} pts</span>
          </div>
        </div>

        <div className="border-t-2 border-gray-400 dark:border-gray-600 pt-3 mt-3">
          {/* Total */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">TOTAL:</span>
            <span className="text-2xl font-bold text-primary dark:text-blue-400">
              {currentPoints} / {cap}
            </span>
          </div>

          {/* Status */}
          <div className={`text-center font-bold py-2 rounded ${
            status.type === 'danger' ? 'bg-red-100 dark:bg-red-900 dark:bg-opacity-40 text-danger dark:text-red-300' :
            status.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-40 text-warning dark:text-yellow-300' :
            'bg-green-100 dark:bg-green-900 dark:bg-opacity-40 text-success dark:text-green-300'
          }`}>
            {status.icon} {status.message}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetRun}
          className="w-full mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          Reset Run
        </button>
      </div>

      {/* Mobile: Show summary when collapsed */}
      {isCollapsed && (
        <div className="lg:hidden text-center">
          <div className="text-xl font-bold text-primary dark:text-blue-400">
            {currentPoints} / {cap}
          </div>
          <div className={`text-sm font-semibold ${
            status.type === 'danger' ? 'text-danger dark:text-red-300' :
            status.type === 'warning' ? 'text-warning dark:text-yellow-300' :
            'text-success dark:text-green-300'
          }`}>
            {status.icon} {status.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownPanel;
