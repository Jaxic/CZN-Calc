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
    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
      {/* Header with collapse toggle for mobile */}
      <div className="flex justify-between items-center mb-3 lg:mb-4">
        <h3 className="text-lg font-bold text-gray-800">Breakdown of Current Score</h3>
        <button
          onClick={toggleCollapse}
          className="lg:hidden text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Breakdown content (collapsible on mobile) */}
      <div className={`space-y-3 ${isCollapsed ? 'hidden' : 'block'} lg:block`}>
        {/* Card types */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Base Cards: {breakdown.baseCards.count}</span>
            <span className="font-semibold text-gray-800">{breakdown.baseCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Neutral Cards: {breakdown.neutralCards.count}</span>
            <span className="font-semibold text-blue-600">{breakdown.neutralCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Monster Cards: {breakdown.monsterCards.count}</span>
            <span className="font-semibold text-purple-600">{breakdown.monsterCards.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Forbidden Cards: {breakdown.forbiddenCards.count}</span>
            <span className="font-semibold text-gray-500">(auto-saved)</span>
          </div>
        </div>

        <div className="border-t border-gray-300 my-2"></div>

        {/* Epiphanies */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">✨ Epiphanies: {breakdown.regularEpiphanies.count}</span>
            <span className="font-semibold text-blue-600">{breakdown.regularEpiphanies.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">🌟 Divine Epiphanies: {breakdown.divineEpiphanies.count}</span>
            <span className="font-semibold text-purple-600">{breakdown.divineEpiphanies.points} pts</span>
          </div>
        </div>

        <div className="border-t border-gray-300 my-2"></div>

        {/* Modifications */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              🗑️ Removals: {breakdown.removals.count}
              {breakdown.removals.bonusCount > 0 && (
                <span className="text-xs"> (+{breakdown.removals.bonusCount} bonus)</span>
              )}
            </span>
            <span className="font-semibold text-red-600">{breakdown.removals.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">📋 Duplications: {breakdown.duplications.count}</span>
            <span className="font-semibold text-indigo-600">{breakdown.duplications.points} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">🔄 Conversions: {breakdown.conversions.count}</span>
            <span className="font-semibold text-green-600">{breakdown.conversions.points} pts</span>
          </div>
        </div>

        <div className="border-t-2 border-gray-400 pt-3 mt-3">
          {/* Total */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-800">TOTAL:</span>
            <span className="text-2xl font-bold text-primary">
              {currentPoints} / {cap}
            </span>
          </div>

          {/* Status */}
          <div className={`text-center font-bold py-2 rounded ${
            status.type === 'danger' ? 'bg-red-100 text-danger' :
            status.type === 'warning' ? 'bg-yellow-100 text-warning' :
            'bg-green-100 text-success'
          }`}>
            {status.icon} {status.message}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetRun}
          className="w-full mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          Reset Run
        </button>
      </div>

      {/* Mobile: Show summary when collapsed */}
      {isCollapsed && (
        <div className="lg:hidden text-center">
          <div className="text-xl font-bold text-primary">
            {currentPoints} / {cap}
          </div>
          <div className={`text-sm font-semibold ${
            status.type === 'danger' ? 'text-danger' :
            status.type === 'warning' ? 'text-warning' :
            'text-success'
          }`}>
            {status.icon} {status.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownPanel;
