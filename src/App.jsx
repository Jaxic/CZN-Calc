import React from 'react';
import { DeckProvider } from './context/DeckContext';
import CharacterSelector from './components/CharacterSelector';
import TierSelector from './components/TierSelector';
import StatusBar from './components/StatusBar';
import BaseCardsSection from './components/BaseCardsSection';
import AdditionalCardsSection from './components/AdditionalCardsSection';
import RemovalTracker from './components/RemovalTracker';
import DuplicationTracker from './components/DuplicationTracker';
import BreakdownPanel from './components/BreakdownPanel';

function App() {
  return (
    <DeckProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              CZN Chaos Run Calculator
            </h1>
            <p className="text-center text-blue-100 mt-2 text-sm md:text-base">
              Track your Save Data points and stay within tier limits
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {/* Character, Tier Selector & Status Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="space-y-4">
              <CharacterSelector />
              <TierSelector />
              <StatusBar />
            </div>
          </div>

          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Base Cards */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <BaseCardsSection />
              </div>

              {/* Additional Cards */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <AdditionalCardsSection />
              </div>
            </div>

            {/* Right column: Breakdown Panel and Trackers */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 space-y-4">
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
        <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              Chaos Zero Nightmare - Chaos Run Save Data Calculator
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Calculate your deck's Save Data point value in real-time
            </p>
          </div>
        </footer>
      </div>
    </DeckProvider>
  );
}

export default App;
