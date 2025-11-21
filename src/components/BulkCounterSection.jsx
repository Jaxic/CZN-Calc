import React, { useState, useMemo } from 'react';
import { calculateRemovalPoints, calculateDuplicationPoints, calculateConversionPoints } from '../utils/calculations';

const BulkCounterSection = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed
  const [showReference, setShowReference] = useState(false);

  // Card counts
  const [baseCards, setBaseCards] = useState(0);
  const [neutralCards, setNeutralCards] = useState(0);
  const [monsterCards, setMonsterCards] = useState(0);
  const [forbiddenCards, setForbiddenCards] = useState(0);

  // Epiphanies
  const [regularEpiphanies, setRegularEpiphanies] = useState(0);
  const [divineEpiphanies, setDivineEpiphanies] = useState(0);

  // Special counts for bugs
  const [regularOnBase, setRegularOnBase] = useState(0);
  const [regularOnMonster, setRegularOnMonster] = useState(0);
  const [divineOnNeutral, setDivineOnNeutral] = useState(0);

  // Actions
  const [removals, setRemovals] = useState(0);
  const [removalBonus, setRemovalBonus] = useState(0);
  const [duplications, setDuplications] = useState(0);
  const [conversions, setConversions] = useState(0);

  // Calculate the progressive duplication cost from count
  const calculateDuplicationCostFromCount = (count) => {
    const costs = [0, 0, 10, 30, 50];
    let total = 0;
    for (let i = 0; i < count; i++) {
      if (i >= 5) {
        total += 70;
      } else {
        total += costs[i] || 0;
      }
    }
    return total;
  };

  // Calculate all totals
  const totals = useMemo(() => {
    // Card points
    const baseCardPoints = 0;
    const neutralCardPoints = neutralCards * 20;
    const monsterCardPoints = monsterCards * 80;
    const forbiddenCardPoints = forbiddenCards * 20;

    // Epiphany points
    // Regular epiphanies cost 10, but FREE on base and monster cards
    const regularEpiphanyPoints = (regularEpiphanies - regularOnBase - regularOnMonster) * 10;

    // Divine epiphanies cost 20, but neutral cards have a bug that adds extra 10
    const divineEpiphanyPoints = (divineEpiphanies * 20) + (divineOnNeutral * 10);

    // Action points
    const removalPoints = calculateRemovalPoints(removals, removalBonus);
    const duplicationPoints = calculateDuplicationCostFromCount(duplications);
    const conversionPoints = calculateConversionPoints(conversions);

    const cardsTotal = baseCardPoints + neutralCardPoints + monsterCardPoints + forbiddenCardPoints;
    const epiphaniesTotal = regularEpiphanyPoints + divineEpiphanyPoints;
    const actionsTotal = removalPoints + duplicationPoints + conversionPoints;
    const grandTotal = cardsTotal + epiphaniesTotal + actionsTotal;

    return {
      baseCardPoints,
      neutralCardPoints,
      monsterCardPoints,
      forbiddenCardPoints,
      regularEpiphanyPoints,
      divineEpiphanyPoints,
      removalPoints,
      duplicationPoints,
      conversionPoints,
      cardsTotal,
      epiphaniesTotal,
      actionsTotal,
      grandTotal,
    };
  }, [
    baseCards, neutralCards, monsterCards, forbiddenCards,
    regularEpiphanies, divineEpiphanies, regularOnBase, regularOnMonster, divineOnNeutral,
    removals, removalBonus, duplications, conversions
  ]);

  const InputField = ({ label, value, setValue, max, hint }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Bulk Counter
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calculate total points from counts
          </p>
        </div>
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Cards & Epiphanies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                Cards
              </h3>
              <InputField
                label="Base Cards"
                value={baseCards}
                setValue={setBaseCards}
                max={8}
                hint="0 pts each"
              />
              <InputField
                label="Neutral Cards"
                value={neutralCards}
                setValue={setNeutralCards}
                hint="20 pts each"
              />
              <InputField
                label="Monster Cards"
                value={monsterCards}
                setValue={setMonsterCards}
                hint="80 pts each"
              />
              <InputField
                label="Forbidden Cards"
                value={forbiddenCards}
                setValue={setForbiddenCards}
                hint="20 pts each"
              />

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2 mt-6">
                Epiphanies
              </h3>
              <InputField
                label="Regular Epiphanies"
                value={regularEpiphanies}
                setValue={setRegularEpiphanies}
                hint="10 pts each (FREE on Base/Monster)"
              />
              <div className="ml-4 space-y-2">
                <InputField
                  label="↳ On Base Cards"
                  value={regularOnBase}
                  setValue={setRegularOnBase}
                  max={regularEpiphanies}
                  hint="FREE"
                />
                <InputField
                  label="↳ On Monster Cards"
                  value={regularOnMonster}
                  setValue={setRegularOnMonster}
                  max={regularEpiphanies}
                  hint="FREE (bug)"
                />
              </div>
              <InputField
                label="Divine Epiphanies"
                value={divineEpiphanies}
                setValue={setDivineEpiphanies}
                hint="20 pts each"
              />
              <div className="ml-4">
                <InputField
                  label="↳ On Neutral Cards"
                  value={divineOnNeutral}
                  setValue={setDivineOnNeutral}
                  max={divineEpiphanies}
                  hint="+10 bug (30 total instead of 20)"
                />
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                Actions
              </h3>
              <InputField
                label="Removals"
                value={removals}
                setValue={setRemovals}
                hint="Progressive cost (see reference below)"
              />
              <div className="ml-4">
                <InputField
                  label="↳ With Bonus"
                  value={removalBonus}
                  setValue={setRemovalBonus}
                  max={removals}
                  hint="Base cards or cards with epiphanies (+20 each)"
                />
              </div>
              <InputField
                label="Duplications"
                value={duplications}
                setValue={setDuplications}
                hint="Progressive cost (see reference below)"
              />
              <InputField
                label="Conversions"
                value={conversions}
                setValue={setConversions}
                hint="10 pts each"
              />
            </div>
          </div>

          {/* Progressive Cost Reference */}
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <button
              onClick={() => setShowReference(!showReference)}
              className="flex justify-between items-center w-full text-left"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                ℹ️ Progressive Costs Reference
              </span>
              <span className="text-gray-600 dark:text-gray-400">{showReference ? '▲' : '▼'}</span>
            </button>
            {showReference && (
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <div>
                  <span className="font-semibold">Removals & Duplications:</span>
                  <div className="ml-4 font-mono">
                    1st: 0 | 2nd: 10 | 3rd: 30 | 4th: 50 | 5th+: 70 each
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Removal Bonus:</span>
                  <div className="ml-4">
                    +20 per Base card or card with epiphany that was removed
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-600 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              {/* Cards */}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Base Cards ({baseCards}):</span>
                <span className="font-semibold">{totals.baseCardPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Neutral Cards ({neutralCards}):</span>
                <span className="font-semibold">{totals.neutralCardPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Monster Cards ({monsterCards}):</span>
                <span className="font-semibold">{totals.monsterCardPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Forbidden Cards ({forbiddenCards}):</span>
                <span className="font-semibold">{totals.forbiddenCardPoints} pts</span>
              </div>
              <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold text-base pt-1">
                <span>Cards Subtotal:</span>
                <span>{totals.cardsTotal} pts</span>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

              {/* Epiphanies */}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Regular Epiphanies ({regularEpiphanies}):</span>
                <span className="font-semibold">{totals.regularEpiphanyPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Divine Epiphanies ({divineEpiphanies}):</span>
                <span className="font-semibold">{totals.divineEpiphanyPoints} pts</span>
              </div>
              <div className="flex justify-between text-orange-600 dark:text-orange-400 font-semibold text-base pt-1">
                <span>Epiphanies Subtotal:</span>
                <span>{totals.epiphaniesTotal} pts</span>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

              {/* Actions */}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Removals ({removals}):</span>
                <span className="font-semibold">{totals.removalPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Duplications ({duplications}):</span>
                <span className="font-semibold">{totals.duplicationPoints} pts</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Conversions ({conversions}):</span>
                <span className="font-semibold">{totals.conversionPoints} pts</span>
              </div>
              <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold text-base pt-1">
                <span>Actions Subtotal:</span>
                <span>{totals.actionsTotal} pts</span>
              </div>

              <div className="border-t-2 border-purple-400 dark:border-purple-500 pt-2 mt-2">
                <div className="flex justify-between text-gray-900 dark:text-gray-100 text-xl">
                  <span className="font-bold">Grand Total:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {totals.grandTotal} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkCounterSection;
