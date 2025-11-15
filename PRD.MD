# **Chaos Zero Nightmare - Chaos Run Save Data Calculator PRD**

## **1. Project Overview**

**Project Name:** CZN Chaos Run Save Data Calculator

**Purpose:** A single-page web calculator that helps Chaos Zero Nightmare players calculate their deck's Save Data point value in real-time during Chaos runs to ensure they stay within tier limits and don't lose cards.

**Target Users:** CZN players running Chaos Manifestation or Zero System who want to:
- Track their deck value in real-time during runs
- Make informed decisions about duplicating, removing, or upgrading cards
- Avoid losing valuable Divine Epiphany cards due to exceeding save limits
- Understand the point system mechanics

**Tech Stack:**
- React 18+ with Vite
- Tailwind CSS for styling
- Mobile-first responsive design
- Single-page application (SPA)

---

## **2. Game Mechanics & Point System**

### **2.1 Card Base Values**
- **Base Cards**: 0 points
- **Neutral Cards**: 20 points
- **Monster Cards**: 80 points
- **Forbidden Cards**: 20 points (always saved with 100% chance, don't count toward limit)

### **2.2 Epiphany Modifiers (Only ONE per card)**
- **Regular Epiphany**: +10 points
  - **Exception**: FREE (0 points) on Base Cards (including duplicated base cards)
  - Costs +10 points on Neutral, Monster, and Forbidden cards
- **Divine Epiphany**: +20 points (always costs 20, regardless of card type)

### **2.3 Card Removal**
- 1st removal: 0 points
- 2nd removal: 10 points
- 3rd removal: 30 points
- 4th removal: 50 points
- 5th+ removals: 70 points each
- **Bonus**: +20 points if removed card was a Base Card OR had any Epiphany
- **Important**: Removing Neutral cards (without epiphanies) costs 0 bonus points but still increments the deletion count
  - Example: Remove 2 converted neutrals = (0+0) + (10+0) = 10 points total

### **2.4 Card Duplication**
- 1st duplicate: 0 points
- 2nd duplicate: 10 points
- 3rd duplicate: 30 points
- 4th duplicate: 50 points
- 5th+ duplicates: 70 points each
- **Important**: Duplicated cards inherit all point modifiers from the original card (Epiphany, Divine Epiphany)

### **2.5 Card Conversion**
- **10 points per conversion** (each conversion adds 10 points)
- Converted cards keep their point-affecting elements (Epiphanies)
- Conversion cost persists even if the converted card is removed
- Conversion changes the card type to Neutral (20 points base value)
- Examples:
  - Convert 1 card and keep it: 10 (conversion) + 20 (neutral) = 30 points
  - Convert 2 cards and keep both: 20 (conversions) + 40 (neutrals) = 60 points
  - Convert 1 card then delete it (1st delete): 10 (conversion stays) + 0 (delete cost) = 10 points

### **2.6 Save Data Cap by Tier**
- Tier 1: 30 points
- Tier 2: 40 points
- Tier 3: 50 points
- Tier 4: 60 points
- Tier 5: 70 points
- Tier 6: 80 points
- Tier 7: 90 points
- Tier 8: 100 points
- Tier 9: 110 points
- Tier 10: 120 points
- Tier 11: 130 points
- Tier 12: 140 points
- Tier 13: 150 points
- Tier 14: 160 points
- Tier 15: 170 points

---

## **3. User Interface Design**

### **3.1 Layout Structure**

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Chaos Run Calculator                                    │
│  Tier: [Dropdown 1-15]  Cap: 100                        │
│  Current Deck Value: 50 / 100  [████████░░] 50%        │
├─────────────────────────────────┬───────────────────────┤
│                                 │                       │
│  BASE CARDS (Character Deck)    │  BREAKDOWN OF         │
│  ┌─────────────────────────┐   │  CURRENT SCORE        │
│  │ Starting 4 (Active)     │   │                       │
│  │ [Card][Card][Card][Card]│   │  Base Cards: 0        │
│  │                         │   │  Neutral Cards: 40    │
│  │ Unlockable 4 (Greyed)   │   │  Monster Cards: 0     │
│  │ [Card][Card][Card][Card]│   │  Forbidden Cards: 0   │
│  └─────────────────────────┘   │                       │
│                                 │  Epiphanies: 10       │
│  ADDITIONAL CARDS GAINED        │  Divine Epiphanies: 0 │
│  ┌─────────────────────────┐   │                       │
│  │ [+] [+] [+] [+]        │   │  Removals: 0          │
│  │ [+] [+] [+] [+]        │   │  (0 cards removed)    │
│  │ [+] [+] [+] [+]        │   │                       │
│  └─────────────────────────┘   │  Duplications: 0      │
│                                 │  (0 copies made)      │
│  REMOVAL TRACKER                │                       │
│  Cards Removed: 0               │  Conversions: 0       │
│  [○────────] 0 pts             │  (0 conversions)      │
│  (1st=0, 2nd=10, 3rd=30...)    │                       │
│                                 │  ──────────────────── │
│  DUPLICATION TRACKER            │  TOTAL: 50 / 100      │
│  Copies Made: 0                 │  Status: ✅ SAFE      │
│  [○────────] 0 pts             │                       │
│  (1st=0, 2nd=10, 3rd=30...)    │                       │
└─────────────────────────────────┴───────────────────────┘
```

**Mobile Layout (Stacked):**
```
┌──────────────────────────┐
│ Chaos Run Calculator     │
│ Tier: [Dropdown]         │
│ Cap: 100                 │
│ Current: 50/100 (50%)    │
│ [████████░░]            │
├──────────────────────────┤
│ BASE CARDS               │
│ [Card][Card]            │
│ [Card][Card]            │
│ [Card][Card] (greyed)   │
│ [Card][Card] (greyed)   │
├──────────────────────────┤
│ ADDITIONAL CARDS         │
│ [+] [+]                 │
│ [+] [+]                 │
├──────────────────────────┤
│ TRACKERS                │
│ Removals: 0 [○────] 0pt │
│ Duplications: 0 [○──] 0pt│
├──────────────────────────┤
│ [Show Breakdown ▼]      │
│ (Collapsible panel)     │
└──────────────────────────┘
```

### **3.2 Component Specifications**

#### **3.2.1 Tier Selector & Status Bar**
**Location:** Top of page

**Elements:**
- Dropdown select for Tier (1-15)
- Display of current cap based on tier
- Current deck value display: `[Current] / [Cap]`
- Visual progress bar:
  - Green: 0-80% of cap (safe)
  - Yellow: 81-99% of cap (warning)
  - Red: 100%+ of cap (over limit)
- Status text:
  - ✅ "SAFE" (green) when under cap
  - ⚠️ "WARNING - Close to Limit" (yellow) when 81-99%
  - ❌ "OVER LIMIT - Cards Will Be Lost" (red) when 100%+

**Tailwind Classes:**
```jsx
// Container
className="bg-gray-900 text-white p-4 rounded-lg shadow-lg"

// Progress bar states
className="bg-green-500" // Safe
className="bg-yellow-500" // Warning  
className="bg-red-500" // Over limit
```

#### **3.2.2 Base Cards Section**
**Location:** Left side / top on mobile

**Elements:**
- **Starting 4 Cards**: Always visible and clickable
  - Displayed as card slots (rectangles with borders)
  - Default state: Empty base card (0 points)
  - Clickable to open card popup
  
- **Unlockable 4 Cards**: Initially greyed out
  - Visual state: Dimmed/greyed overlay
  - First click: "Gains" the card (removes grey overlay, card becomes active)
  - Second click: Opens card popup
  - State indicator: Show "LOCKED" text or lock icon when greyed

**Visual States:**
- Default: White/light background, dark border
- Greyed (locked): 50% opacity, grey overlay
- Active: Full color, clickable cursor
- Has Epiphany: Subtle glow effect (can add post-MVP)
- Removed: Red tinted overlay, dimmed

**Tailwind Classes:**
```jsx
// Card slot
className="w-24 h-32 border-2 border-gray-300 rounded-lg bg-white 
           hover:border-blue-500 cursor-pointer transition-all"

// Greyed/locked state
className="opacity-50 cursor-not-allowed"

// Removed state
className="bg-red-100 opacity-60"
```

#### **3.2.3 Additional Cards Section**
**Location:** Below base cards

**Elements:**
- Grid of blank card slots (minimum 12 slots, expandable)
- Each slot starts as a "+" button to add a card
- Clicking blank slot opens a "Card Type Selection" popup:
  - Neutral Card (20 pts)
  - Monster Card (80 pts)
  - Forbidden Card (20 pts, auto-saved)
- After selecting type, card appears and second click opens full card popup

**Add New Card Button:**
- Show "+ Add Card" button at end of grid if all slots are filled
- Dynamically add more slots as needed

**Grid Responsive:**
```jsx
// Desktop: 4 columns, Tablet: 3 columns, Mobile: 2 columns
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
```

#### **3.2.4 Card Popup Modal**

**Trigger:** Clicking any active card (base or additional)

**Layout:**
```
┌──────────────────────────────┐
│  [X Close]                   │
│                              │
│  ┌────────────┐             │
│  │ Card Icon  │             │
│  │  [Visual]  │             │
│  └────────────┘             │
│                              │
│  Card Type: [Neutral]        │
│  Current Points: 20          │
│                              │
│  ──────────────────────────  │
│                              │
│  [✨ Add Epiphany +10]       │
│  [🌟 Add Divine +20]         │
│  [🔄 Convert to Neutral]     │
│  [📋 Duplicate Card]         │
│  [🗑️ Remove Card]            │
│                              │
│  [Cancel]                    │
└──────────────────────────────┘
```

**Functionality:**

1. **Add Epiphany Button**
   - Only available if card has NO epiphany currently
   - Adds +10 points to card
   - Marks card as having "Regular Epiphany"
   - Button becomes disabled/hidden after use
   - Mutually exclusive with Divine Epiphany

2. **Add Divine Epiphany Button**
   - Only available if card has NO epiphany currently
   - Adds +20 points to card
   - Marks card as having "Divine Epiphany"
   - Button becomes disabled/hidden after use
   - Mutually exclusive with Regular Epiphany

3. **Convert to Neutral Button**
   - Changes card type to Neutral (20 pts base)
   - Keeps any existing Epiphanies
   - Adds +10 points for each conversion (tracked globally)
   - Conversion cost persists even if card is deleted
   - Button becomes disabled after use (can't convert same card twice)

4. **Duplicate Card Button**
   - Creates a copy in Additional Cards section
   - Copy inherits all properties (type, epiphanies)
   - Adds duplication points based on global duplicate count:
     - 1st duplicate globally: 0 pts
     - 2nd duplicate globally: 10 pts
     - 3rd duplicate globally: 30 pts
     - 4th duplicate globally: 50 pts
     - 5th+ duplicates globally: 70 pts each
   - Can duplicate same card multiple times

5. **Remove Card Button**
   - Marks card as removed (visual: dimmed, red overlay)
   - Card stays visible but marked as removed
   - Adds removal points based on global removal count:
     - 1st removal globally: 0 pts
     - 2nd removal globally: 10 pts
     - 3rd removal globally: 30 pts
     - 4th removal globally: 50 pts
     - 5th+ removals globally: 70 pts each
   - If removed card is Base Card OR has Epiphany: +20 pts bonus
   - Button becomes disabled after use (can't remove twice)

**Mobile Adaptations:**
- Full screen on mobile devices
- Larger touch targets (min 48px height)
- Buttons stack vertically on small screens

**Tailwind Classes:**
```jsx
// Modal overlay
className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"

// Modal content
className="bg-white rounded-lg p-6 max-w-md w-full mx-4"

// Buttons
className="w-full py-3 px-4 rounded-lg text-left border-2 
           hover:bg-blue-50 transition-colors mb-2"
```

#### **3.2.5 Removal Tracker**
**Location:** Below additional cards section

**Elements:**
- Display: "Cards Removed: [X]"
- Visual progress indicator showing position on scale:
  - `[●○○○○]` for 1 removal
  - `[●●○○○]` for 2 removals
  - `[●●●○○]` for 3 removals
  - etc.
- Text showing current cost: "Current removal cost: [X] pts"
- Reference text: "(1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70)"
- Additional display: "Bonus removals (Base/Epiphany): [X] × 20 pts"

**Calculation Display:**
```
Cards Removed: 3
[●●●○○] 30 pts
+ 2 Base/Epiphany cards removed: 40 pts
Total Removal Points: 70 pts
```

#### **3.2.6 Duplication Tracker**
**Location:** Below removal tracker

**Elements:**
- Display: "Copies Made: [X]"
- Visual progress indicator (same style as removal):
  - `[●○○○○]` for 1 copy
  - `[●●○○○]` for 2 copies
  - etc.
- Text showing current cost: "Next copy cost: [X] pts"
- Reference text: "(1st=0, 2nd=10, 3rd=30, 4th=50, 5th+=70)"

**Calculation Display:**
```
Copies Made: 4
[●●●●○] 90 pts total
Next copy: 70 pts
```

#### **3.2.7 Breakdown Panel**
**Location:** Right side / bottom collapsible on mobile

**Content:**
```
BREAKDOWN OF CURRENT SCORE

Base Cards: [count] = [points] pts
Neutral Cards: [count] = [points] pts
Monster Cards: [count] = [points] pts
Forbidden Cards: [count] (auto-saved)

Epiphanies: [count] = [points] pts
Divine Epiphanies: [count] = [points] pts

Removals: [total points] pts
  ([count] cards removed)
  ([count] Base/Epiphany bonus)

Duplications: [total points] pts
  ([count] copies made)

Conversions: [total points] pts
  ([count] conversions)

────────────────────────────
TOTAL: [X] / [Cap]
Status: [✅/⚠️/❌] [Text]
```

**Features:**
- Real-time updates as cards are modified
- Clear categorization of point sources
- Visual emphasis on total and status
- Collapsible on mobile (expand/collapse button)

**Tailwind Classes:**
```jsx
// Container
className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300"

// Section headers
className="font-bold text-lg mb-2"

// Point values
className="text-blue-600 font-semibold"

// Total section
className="border-t-2 border-gray-400 pt-4 mt-4"
```

---

## **4. Data Structure & State Management**

### **4.1 Global State (React Context or useState)**

```typescript
interface Card {
  id: string;
  type: 'base' | 'neutral' | 'monster' | 'forbidden';
  isLocked: boolean; // For unlockable base cards
  hasEpiphany: boolean;
  epiphanyType: 'none' | 'regular' | 'divine';
  isRemoved: boolean;
  isConverted: boolean;
  isDuplicate: boolean;
  originalCardId?: string; // For duplicates, references original
}

interface DeckState {
  tier: number; // 1-15
  baseCards: Card[]; // Always 8 cards
  additionalCards: Card[]; // Dynamic array
  
  // Global counters
  totalRemovals: number;
  removalsBonusCount: number; // Count of Base/Epiphany cards removed
  totalDuplications: number;
  totalConversions: number;
}
```

### **4.2 Point Calculation Logic**

**calculateCardPoints(card: Card): number**
```javascript
function calculateCardPoints(card) {
  if (card.isRemoved) return 0; // Removed cards don't add to deck
  
  let points = 0;
  
  // Base value
  switch(card.type) {
    case 'base': points = 0; break;
    case 'neutral': points = 20; break;
    case 'monster': points = 80; break;
    case 'forbidden': return 0; // Don't count forbidden
  }
  
  // Epiphany modifiers
  if (card.epiphanyType === 'regular') points += 10;
  if (card.epiphanyType === 'divine') points += 20;
  
  return points;
}
```

**calculateRemovalPoints(totalRemovals: number, bonusCount: number): number**
```javascript
function calculateRemovalPoints(totalRemovals, bonusCount) {
  const removalCosts = [0, 10, 30, 50, 70];
  let total = 0;
  
  for (let i = 0; i < totalRemovals; i++) {
    if (i < 4) {
      total += removalCosts[i + 1]; // 2nd removal = index 1
    } else {
      total += 70; // 5th+ removals
    }
  }
  
  total += bonusCount * 20; // Bonus for Base/Epiphany removals
  return total;
}
```

**calculateDuplicationPoints(totalDuplications: number): number**
```javascript
function calculateDuplicationPoints(totalDuplications) {
  const dupCosts = [0, 10, 30, 50, 70];
  let total = 0;
  
  for (let i = 0; i < totalDuplications; i++) {
    if (i < 4) {
      total += dupCosts[i + 1];
    } else {
      total += 70;
    }
  }
  
  return total;
}
```

**calculateConversionPoints(totalConversions: number): number**
```javascript
function calculateConversionPoints(totalConversions) {
  // Each conversion costs 10 points
  return totalConversions * 10;
}
```

**calculateTotalPoints(deckState: DeckState): number**
```javascript
function calculateTotalPoints(deckState) {
  // Sum all active cards
  const cardPoints = [...deckState.baseCards, ...deckState.additionalCards]
    .map(card => calculateCardPoints(card))
    .reduce((sum, points) => sum + points, 0);
  
  // Add modification points
  const removalPoints = calculateRemovalPoints(
    deckState.totalRemovals, 
    deckState.removalsBonusCount
  );
  
  const duplicationPoints = calculateDuplicationPoints(
    deckState.totalDuplications
  );
  
  const conversionPoints = calculateConversionPoints(
    deckState.totalConversions
  );
  
  return cardPoints + removalPoints + duplicationPoints + conversionPoints;
}
```

---

## **5. User Flows**

### **5.1 Starting a New Calculation**
1. User opens calculator
2. Selects tier from dropdown (default: Tier 8, Cap: 100)
3. Base cards display:
   - First 4 cards are active
   - Last 4 cards are greyed out (locked)
4. Additional cards section shows empty slots
5. Breakdown panel shows all zeros

### **5.2 Unlocking Base Cards**
1. User clicks a greyed-out base card
2. Card becomes active (grey overlay removed)
3. Card is now clickable to open popup
4. Points automatically recalculate

### **5.3 Modifying a Card**
1. User clicks active card
2. Popup modal opens showing card details
3. User selects an action:
   - **Add Epiphany**: Card gets +10 pts, button disables
   - **Add Divine**: Card gets +20 pts, button disables
   - **Convert**: Card becomes Neutral, +10 conversion pts, button disables
   - **Duplicate**: Copy appears in additional cards, duplication counter increases
   - **Remove**: Card gets red overlay/dimmed, removal counter increases
4. Popup closes
5. All calculations update in real-time
6. Breakdown panel updates

### **5.4 Adding New Cards**
1. User clicks a blank "+" slot in additional cards
2. "Select Card Type" popup opens
3. User chooses: Neutral, Monster, or Forbidden
4. Card appears in that slot
5. User can click card again to open full popup with all options

### **5.5 Tracking Removals**
1. User removes a card via popup
2. Global removal counter increments
3. If removed card was Base OR had Epiphany:
   - Bonus counter increments
   - Additional +20 pts added
4. Removal tracker visual updates:
   - Progress indicator advances
   - Points display updates
   - "Next removal cost" updates

### **5.6 Tracking Duplications**
1. User duplicates a card via popup
2. Copy appears in additional cards section
3. Copy inherits all properties (type, epiphanies)
4. Global duplication counter increments
5. Duplication tracker visual updates
6. Points automatically added based on duplication count

### **5.7 Checking Status**
1. User views progress bar at top
2. Color indicates status:
   - Green (0-80%): Safe to save
   - Yellow (81-99%): Close to limit
   - Red (100%+): Will lose cards
3. Breakdown panel shows exactly which cards/actions contribute how many points
4. User can make adjustments based on this info

---

## **6. Technical Requirements**

### **6.1 Project Setup**
```bash
npm create vite@latest czn-calculator -- --template react
cd czn-calculator
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **6.2 File Structure**
```
czn-calculator/
├── src/
│   ├── components/
│   │   ├── TierSelector.jsx
│   │   ├── StatusBar.jsx
│   │   ├── CardSlot.jsx
│   │   ├── CardPopup.jsx
│   │   ├── BaseCardsSection.jsx
│   │   ├── AdditionalCardsSection.jsx
│   │   ├── RemovalTracker.jsx
│   │   ├── DuplicationTracker.jsx
│   │   └── BreakdownPanel.jsx
│   ├── context/
│   │   └── DeckContext.jsx
│   ├── utils/
│   │   └── calculations.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

### **6.3 Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

### **6.4 Responsive Breakpoints**
```javascript
// Tailwind config
module.exports = {
  theme: {
    screens: {
      'sm': '640px',  // Mobile landscape / small tablets
      'md': '768px',  // Tablets
      'lg': '1024px', // Desktop
      'xl': '1280px', // Large desktop
    }
  }
}
```

### **6.5 Browser Support**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Android (last 2 versions)

---

## **7. MVP Feature Checklist**

### **Core Features (Must Have)**
- ✅ Tier selection (1-15) with dynamic cap
- ✅ 8 base cards (4 active, 4 unlockable)
- ✅ Additional card slots (dynamic grid)
- ✅ Card popup with 5 actions
- ✅ Epiphany/Divine Epiphany system
- ✅ Card conversion functionality
- ✅ Card duplication with global counter
- ✅ Card removal with global counter
- ✅ Removal tracker with visual progress
- ✅ Duplication tracker with visual progress
- ✅ Real-time point calculation
- ✅ Breakdown panel with categorized points
- ✅ Status indicator (Green/Yellow/Red)
- ✅ Mobile responsive design

### **Post-MVP Features (Nice to Have)**
- 🔲 Visual card art/icons
- 🔲 Glow effects for Epiphany cards
- 🔲 Save/load deck configurations (localStorage)
- 🔲 Export deck as image/text
- 🔲 Character selection (different starting decks)
- 🔲 Undo/redo functionality
- 🔲 Keyboard shortcuts
- 🔲 Dark mode toggle
- 🔲 Tutorial/help overlay
- 🔲 Animation transitions
- 🔲 Sound effects (optional)

---

## **8. Testing Scenarios**

### **8.1 Basic Calculations**
**Test Case 1: Empty Deck**
- Input: No cards modified, Tier 1
- Expected: 0 / 30, Status: Safe

**Test Case 2: Single Neutral Card**
- Input: 1 Neutral card, no modifiers, Tier 1
- Expected: 20 / 30, Status: Safe

**Test Case 3: Divine Epiphany**
- Input: 1 Neutral card with Divine Epiphany, Tier 1
- Expected: 40 / 30, Status: Over Limit

### **8.2 Removal Tracking**
**Test Case 4: Multiple Removals**
- Input: Remove 3 cards (none Base, none Epiphany), Tier 3
- Expected: Removal points = 0 + 10 + 30 = 40 pts

**Test Case 5: Removal with Bonus**
- Input: Remove 2 Base cards with Epiphanies, Tier 5
- Expected: Removal points = 0 + 10 + (2 × 20) = 50 pts

### **8.3 Duplication Tracking**
**Test Case 6: Multiple Duplicates**
- Input: Duplicate 4 cards, Tier 10
- Expected: Duplication points = 0 + 10 + 30 + 50 = 90 pts

**Test Case 7: Duplicate with Divine**
- Input: Duplicate 1 Neutral card with Divine (already in deck)
- Expected: Original = 40 pts, Duplicate = 40 pts, Dup cost = 0 pts
- Total = 80 pts from cards + 0 from dup action = 80 pts

### **8.4 Edge Cases**
**Test Case 8: Maximum Removals**
- Input: Remove 10 cards
- Expected: 0+10+30+50+70+70+70+70+70+70 = 510 pts

**Test Case 9: Forbidden Cards**
- Input: 5 Forbidden cards in deck, Tier 1
- Expected: 0 / 30 (Forbidden don't count), Status: Safe

**Test Case 10: Conversion**
- Input: Convert 1 Monster card to Neutral, Tier 5
- Expected: Card changes from 80 to 20 pts, +10 conversion = 30 pts total

---

## **9. Deployment**

### **9.1 Build Process**
```bash
npm run build
```
Generates optimized production build in `dist/` folder

### **9.2 Hosting Options**
**Recommended: Vercel (Free)**
1. Connect GitHub repo
2. Auto-deploys on push to main
3. Custom domain support
4. Zero configuration needed

**Alternative: Netlify (Free)**
1. Drag-and-drop `dist/` folder
2. Or connect GitHub repo
3. Auto-deploys on push

**Alternative: GitHub Pages**
1. Add homepage to package.json
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy scripts
4. Run `npm run deploy`

### **9.3 Performance Targets**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+
- Mobile-friendly test: Pass

---

## **10. Design References**

### **10.1 Color Palette**
```javascript
// Tailwind config
colors: {
  primary: '#3B82F6',    // Blue
  success: '#10B981',    // Green
  warning: '#F59E0B',    // Yellow
  danger: '#EF4444',     // Red
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    900: '#111827',
  }
}
```

### **10.2 Typography**
- Headings: `font-bold text-xl`
- Body: `text-base`
- Small text: `text-sm`
- Font family: System default (Tailwind sans)

### **10.3 Spacing**
- Card slots: `gap-4` between cards
- Sections: `mb-6` between major sections
- Padding: `p-4` for containers

---

## **11. Success Criteria**

**The MVP is successful when:**
1. ✅ Users can accurately calculate their deck value for any tier
2. ✅ All point calculations match the official game rules
3. ✅ Interface is intuitive (users don't need instructions)
4. ✅ Mobile experience is smooth and usable
5. ✅ Page loads in < 3 seconds on 4G connection
6. ✅ No bugs in core calculation logic
7. ✅ Responsive design works on all target devices

---

## **12. Questions for Implementation**

Before starting development, please confirm:

1. **Initial State**: Should the calculator start with all 8 base cards visible (first 4 active, last 4 locked)? Or completely empty?

2. **Card Visuals**: For MVP, use simple rectangles with borders? Or placeholder icons?

3. **Additional Cards Limit**: Should there be a maximum number of additional card slots? Or unlimited?

4. **Reset Functionality**: Should there be a "Reset All" button to clear the deck?

5. **URL State**: Should the deck state be stored in URL query params for sharing?

---

## **End of PRD**