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

    // Default is expanded; collapse if user previously hid it
    if (localStorage.getItem('czn-guide-collapsed') === 'true') {
      details.removeAttribute('open');
    } else {
      details.setAttribute('open', '');
    }

    // Listen for toggle events and remember collapsed state
    const handleToggle = () => {
      const isCollapsed = !details.open;
      localStorage.setItem('czn-guide-collapsed', isCollapsed ? 'true' : 'false');
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
            {/* 1. Leaderboard right under the orange header – highest visibility */}
            <div className="text-center my-8">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7093395988392599"
                      crossOrigin="anonymous"></script>
              <ins className="adsbygoogle"
                   style={{display:"block"}}
                   data-ad-client="ca-pub-7093395988392599"
                   data-ad-slot="4985223624"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script dangerouslySetInnerHTML={{__html: "(adsbygoogle = window.adsbygoogle || []).push({});"}} />
            </div>

            {/* Collapsible Guide Section */}
            <div className="mb-8 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-850 rounded-lg shadow-lg p-6 md:p-8 border-2 border-orange-200 dark:border-orange-900">
              <details ref={detailsRef} open className="group">
                <summary className="cursor-pointer font-bold text-2xl text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2 list-none flex items-center gap-2">
                  Chaos Run Guide: Caps, Formulas & Tips
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-6 space-y-6 text-gray-800 dark:text-gray-200">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                    <p>
                      <strong>Chaos Zero Nightmare (CZN)</strong> is Smilegate's hit gacha roguelike RPG – build decks with 3 characters (Strikers + Partners), battle cosmic horrors in loop runs. Chaos Runs (Zero System) are endgame: farm "Save Data" for permanent upgrades like card copies & epiphanies. But overcap "Cap Faint Memory" and the game auto-prunes your deck! This calc tracks points live to max Tier 14+ saves.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">Cap Faint Memory Tiers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>T1: 30</div><div>T2: 40</div><div>T3: 50</div><div>T4: 60</div>
                      <div>T5: 70</div><div>T6: 80</div><div>T7: 90</div><div>T8: 100</div>
                      <div>T9: 110</div><div>T10: 120</div><div>T11: 130</div><div>T12: 140</div>
                      <div>T13: 150</div><div>T14: 160</div><div>NM: +10</div><div>Lab0: +10 max</div>
                    </div>
                    <p className="text-xs mt-2">Tiers from diff + affixes/debuffs. Nightmare +1 tier. Re-observe planets for +4 tiers max.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">Save Data Formula</h3>
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

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">Pro Tips for Tier 14 Farms</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Copy own cards 3x FREE/cheap (0+10+30=40pts)</li>
                      <li>Avoid monsters (80pts killer)</li>
                      <li>Convert + delete neutrals: Low cost removal</li>
                      <li>Exceptions: [REMOVE] converts = 0pts; Forbidden: cards +20</li>
                      <li>Rewind strat: Overcap → game refunds to fit (test!)</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                    <p className="text-sm">
                      <a href="https://discord.com/invite/chaoszeronightmare" className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">Official Discord</a> |
                      <a href="https://www.reddit.com/r/ChaosZeroNightmare/" className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 ml-1">r/ChaosZeroNightmare</a>
                    </p>
                  </div>
                </div>
              </details>
            </div>

            {/* 2. Optional second ad – large rectangle under the guide (great CTR) */}
            <div className="max-w-4xl mx-auto my-10 text-center">
              <ins className="adsbygoogle"
                   style={{display:"block"}}
                   data-ad-client="ca-pub-7093395988392599"
                   data-ad-slot="4985223624"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script dangerouslySetInnerHTML={{__html: "(adsbygoogle = window.adsbygoogle || []).push({});"}} />
            </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
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

          {/* Deck Building Guide Section */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-850 rounded-lg shadow-lg p-6 md:p-8 border-2 border-orange-200 dark:border-orange-900 mt-12 mb-8">
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white py-2 mb-6">
              General Deck Building Guide for Chaos Zero Nightmare
            </h2>

            <div className="space-y-6 text-gray-800 dark:text-gray-200">
              {/* Core Principles */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">
                  Core Deck Building Principles
                </h3>
                <div className="space-y-3">
                  <div className="pl-4 border-l-4 border-orange-300 dark:border-orange-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Optimal Deck Size:</p>
                    <p className="text-sm">Keep your deck between 12-15 cards for best results. Smaller decks cycle faster through your key cards, while larger decks offer more variety but less consistency.</p>
                  </div>
                  <div className="pl-4 border-l-4 border-yellow-300 dark:border-yellow-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Card Ratio Balance:</p>
                    <p className="text-sm">Aim for approximately 50% attack cards, 30% support cards, and 20% defense cards. Adjust this based on content - add more defense for tough bosses, or lean into attack cards when farming.</p>
                  </div>
                  <div className="pl-4 border-l-4 border-orange-300 dark:border-orange-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Energy Cost Management:</p>
                    <p className="text-sm">Balance your deck with both low-cost cards (1 energy) for consistent plays and high-cost cards (3+ energy) for powerful finishing moves. This ensures you can always make meaningful plays each turn.</p>
                  </div>
                  <div className="pl-4 border-l-4 border-yellow-300 dark:border-yellow-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Hand Limit Awareness:</p>
                    <p className="text-sm">The hand limit is 10 cards. Avoid building "greed decks" that over-retain cards, as card draw should equal or slightly exceed card usage to prevent hand clogs.</p>
                  </div>
                </div>
              </div>

              {/* Key Mechanics */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">
                  Key Mechanics to Master
                </h3>
                <ul className="space-y-3">
                  <li className="pl-4 border-l-4 border-orange-300 dark:border-orange-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Epiphany System:</p>
                    <p className="text-sm">Certain cards become significantly stronger when upgraded with Epiphanies. Prioritize cards that benefit from Epiphany buffs, especially for your main damage dealers.</p>
                  </li>
                  <li className="pl-4 border-l-4 border-yellow-300 dark:border-yellow-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Card Cycling:</p>
                    <p className="text-sm">Use discard, exhaust, and recursion cards to manage your deck actively. Remove or cycle unwanted cards during Chaos runs through Unknown Events or Dellang's Shop.</p>
                  </li>
                  <li className="pl-4 border-l-4 border-orange-300 dark:border-orange-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Synergy Over Rarity:</p>
                    <p className="text-sm">Choose cards that naturally chain together rather than just picking the highest rarity cards. A well-synergized deck of common cards often outperforms a collection of unrelated rare cards.</p>
                  </li>
                </ul>
              </div>

              {/* Strategy Tips */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md">
                <h3 className="font-bold text-xl mb-4 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 pb-2">
                  General Strategy Tips
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 dark:bg-gray-600 rounded p-3">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Thin Your Deck</p>
                    <p className="text-sm">During Chaos Manifestation runs, actively remove unwanted cards when opportunities arise. A leaner deck means you'll draw your best cards more consistently.</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-gray-600 rounded p-3">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Match Team Composition</p>
                    <p className="text-sm">Build your deck around your team's core strategy. For example, if running a follow-up attack team, prioritize cards that trigger or benefit from follow-ups.</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-gray-600 rounded p-3">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Equipment Doesn't Affect Points</p>
                    <p className="text-sm">Remember that equipment doesn't contribute to your deck's TB (Save Data) value, so you can equip the best gear without worrying about exceeding tier caps.</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-gray-600 rounded p-3">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Resource Priority</p>
                    <p className="text-sm">Focus early resources on core characters you enjoy playing. Save premium currency for stamina refreshes and key character pulls rather than cosmetic items.</p>
                  </div>
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-5 shadow-md border-2 border-red-200 dark:border-red-900">
                <h3 className="font-bold text-xl mb-4 text-red-600 dark:text-red-400 border-b-2 border-red-200 dark:border-red-800 pb-2">
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-2 text-sm list-disc pl-5">
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-white">Card Overload:</span> Adding too many high-cost cards can leave you with unplayable hands
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-white">Ignoring Defense:</span> Pure damage builds often crumble against bosses without some defensive options
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-white">Poor Card Management:</span> Not exhausting or cycling cards leads to drawing the same unwanted cards repeatedly
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-white">Mixing Strategies:</span> Trying to do everything makes your deck unfocused - commit to a clear game plan
                  </li>
                </ul>
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
