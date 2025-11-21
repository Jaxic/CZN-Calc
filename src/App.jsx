import React from 'react';
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
import QuickLookupSection from './components/QuickLookupSection';
import BulkCounterSection from './components/BulkCounterSection';

function App() {
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
                  CZN Chaos Run Calculator
                </h1>
                <div className="flex-1 flex justify-end">
                  <ThemeToggle />
                </div>
              </div>
              <p className="text-center text-orange-100 dark:text-orange-200 mt-2 text-sm md:text-base">
                Track your Save Data points and stay within tier limits
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
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

                {/* Quick Lookup */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors">
                  <QuickLookupSection />
                </div>

                {/* Bulk Counter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors">
                  <BulkCounterSection />
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
                Chaos Zero Nightmare - Chaos Run Save Data Calculator
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">
                Calculate your deck's Save Data point value in real-time
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
