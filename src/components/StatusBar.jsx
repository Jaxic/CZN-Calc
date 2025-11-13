import React from 'react';
import { useDeck } from '../context/DeckContext';
import { getStatus } from '../utils/calculations';

const StatusBar = () => {
  const { currentPoints, cap } = useDeck();
  const status = getStatus(currentPoints, cap);
  const percentage = Math.min((currentPoints / cap) * 100, 100);

  // Determine progress bar color
  const getProgressBarColor = () => {
    if (status.type === 'danger') return 'bg-danger';
    if (status.type === 'warning') return 'bg-warning';
    return 'bg-success';
  };

  // Determine status text color
  const getStatusColor = () => {
    if (status.type === 'danger') return 'text-danger';
    if (status.type === 'warning') return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-2">
      {/* Points display */}
      <div className="flex items-baseline justify-between">
        <div className="text-xl font-bold dark:text-gray-200">
          Current Deck Value:{' '}
          <span className={getStatusColor()}>
            {currentPoints} / {cap}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressBarColor()} transition-all duration-300 ease-in-out flex items-center justify-end pr-2`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-white text-xs font-semibold">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Status message */}
      <div className={`text-center font-bold text-lg ${getStatusColor()}`}>
        {status.icon} {status.message}
      </div>
    </div>
  );
};

export default StatusBar;
