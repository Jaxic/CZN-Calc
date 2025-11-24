import React, { useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { DeckProvider } from './context/DeckContext';
import { ThemeProvider } from './context/ThemeContext';
import TeamTabs from './components/TeamTabs';
import CharacterSelector from './components/CharacterSelector';
import TierSelector from './components/TierSelector';
import StatusBar from './components/StatusBar';
import BaseCardsSection from './components/BaseCardsSection';
import AdditionalCardsSection from './components/AdditionalCardsSection';
import RemovalTracker from './components/RemovalTracker';
import DuplicationTracker from './components/DuplicationTracker';
import BreakdownPanel from './components/BreakdownPanel';
import ThemeToggle from './components/ThemeToggle';
import KnownIssuesSection from './components/KnownIssuesSection';
import QuickToolsSection from './components/QuickToolsSection';

function App() {
  const detailsRef = useRef(null);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    // Check localStorage and set initial state (default is collapsed)
    if (localStorage.getItem('czn-guide-expanded') === 'true') {
      details.setAttribute('open', '');
    }

    // Listen for toggle events
    const handleToggle = () => {
      localStorage.setItem('czn-guide-expanded', details.open);
    };

    details.addEventListener('toggle', handleToggle);

    return () => {
      details.removeEventListener('toggle', handleToggle);
    };
  }, []);

  return (
    <ThemeProvider>
      <DeckProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Header */}
          <header className="bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-700 dark:to-yellow-600 text-white py-6 shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1"></div>
                <h1 className="text-3xl md:text-4xl font-bold text-center flex-1">
                  CZN Chaos Run Save Data Calculator
                </h1>
                <div className="flex-1 flex justify-end">
                  <ThemeToggle />
                </div>
              </div>
              <p className="text-center text-orange-100 dark:text-orange-200 mt-2 text-sm md:text-base">
                Chaos Zero Nightmare
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {/* Collapsible Guide Section */}
            <section className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
              <details ref={detailsRef} className="group">
                <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2 list-none">
                  Chaos Run Guide: Caps, Formulas & Tips (click to expand)
                </summary>
                <div className="mt-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md space-y-6 text-gray-800 dark:text-gray-200">
                  <p>
                    <strong>Chaos Zero Nightmare (CZN)</strong> is Smilegate's hit gacha roguelike RPG – build decks with 3 characters (Strikers + Partners), battle cosmic horrors in loop runs. Chaos Runs (Zero System) are endgame: farm "Save Data" for permanent upgrades like card copies & epiphanies. But overcap "Cap Faint Memory" and the game auto-prunes your deck! This calc tracks points live to max Tier 14+ saves.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Cap Faint Memory Tiers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>T1: 30</div><div>T2: 40</div><div>T3: 50</div><div>T4: 60</div>
                      <div>T5: 70</div><div>T6: 80</div><div>T7: 90</div><div>T8: 100</div>
                      <div>T9: 110</div><div>T10: 120</div><div>T11: 130</div><div>T12: 140</div>
                      <div>T13: 150</div><div>T14: 160</div><div>NM: +10</div><div>Lab0: +10 max</div>
                    </div>
                    <p className="text-xs mt-2">Tiers from diff + affixes/debuffs. Nightmare +1 tier. Re-observe planets for +4 tiers max.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Save Data Formula</h3>
                    <p>Own cards: FREE (even normal epiphany). Track:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Deletes/Copies: [0,10,30,50,70] (+20 own cards)</li>
                      <li>Divine Epiphany: 20/card (all types)</li>
                      <li>Neutral: 20/card (+10 normal epiphany)</li>
                      <li>Monster: 80/card (ignores normal epiphany)</li>
                      <li>Conversion: 10/card (even if deleted/kept)</li>
                    </ul>
                    <p className="font-mono bg-gray-100 dark:bg-gray-600 p-2 rounded mt-2 text-xs">Ex: 2 own deletes (50pts) + 1 divine (20) + 1 neutral epiph (30) = 100pts (T8 cap)</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Pro Tips for Tier 14 Farms</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Copy own cards 3x FREE/cheap (0+10+30=40pts)</li>
                      <li>Avoid monsters (80pts killer)</li>
                      <li>Convert + delete neutrals: Low cost removal</li>
                      <li>Exceptions: [REMOVE] converts = 0pts; Forbidden: cards +20</li>
                      <li>Rewind strat: Overcap → game refunds to fit (test!)</li>
                    </ul>
                  </div>

                  <p className="text-sm border-t dark:border-gray-600 pt-4">
                    <a href="https://discord.com/invite/chaoszeronightmare" className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">Official Discord</a> | 
                    <a href="https://www.reddit.com/r/ChaosZeroNightmare/" className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 ml-1">r/ChaosZeroNightmare</a>
                  </p>
                </div>
              </details>
            </section>

            {/* Known Issues - Collapsible */}
            <KnownIssuesSection />

            {/* Character, Tier Selector & Status Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors">
              <div className="space-y-4">
                <CharacterSelector />
                <TierSelector />
                <StatusBar />
              </div>
            </div>

            {/* Quick Check */}
            <QuickToolsSection />

            {/* Team Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-colors">
              <TeamTabs />
            </div>

            {/* Two-column layout on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* Base Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors">
                  <BaseCardsSection />
                </div>

                {/* Additional Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors">
                  <AdditionalCardsSection />
                </div>
              </div>

            {/* Right column: Breakdown Panel and Trackers */}
            <div className="lg:col-span-1">
              <div id="breakdown-panel" className="lg:sticky lg:top-6 space-y-4">
                <BreakdownPanel />

                {/* Compact Trackers */}
                <div className="space-y-3">
                  <RemovalTracker />
                  <DuplicationTracker />
                </div>
              </div>
            </div>
          </div>
        </main>

          {/* Footer */}
          <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-6 mt-12 transition-colors">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">
                © 2025 CZN-Calc | <a href="https://discord.com/invite/chaoszeronightmare" className="underline hover:text-white">Discord</a> | <a href="https://www.reddit.com/r/ChaosZeroNightmare/" className="underline hover:text-white">Reddit</a> | Free for CZN players
              </p>
            </div>
          </footer>
        </div>
      </DeckProvider>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
