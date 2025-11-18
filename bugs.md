# In-Game Bugs Documentation

This file tracks known bugs in Chaos Zero Nightmare that affect the calculator's logic. Each bug is documented with the changes made to accommodate it, making it easy to revert these changes once the bugs are fixed in the game.

---

## Bug #1: Neutral Cards with Divine Epiphanies

**Status:** Fixed
**Date Reported:** 2025-11-14
**Date Fixed:** 2025-11-17
**Severity:** Affects point calculations for neutral cards with divine epiphanies

### Bug Description
Neutral cards (+20) incorrectly count both the proc of regular epiphany (+10) and the cost of divine epiphany (+20) when a divine epiphany is selected, resulting in a total cost of +50 instead of the expected +40.

**Expected Behavior:** Neutral card (20) + Divine epiphany (20) = 40 points
**Actual Behavior (BUG):** Neutral card (20) + Divine epiphany (20) + Regular epiphany proc (10) = 50 points
**Current Behavior (FIXED):** Neutral card (20) + Divine epiphany (20) = 40 points

### Changes Made

#### Files Modified
1. **src/utils/calculations.js**
   - Modified `calculateCardPoints()` function (lines 57-65)
   - Modified `getPointsBreakdown()` function (lines 230-233, 239)

2. **src/App.jsx**
   - Added red bug report banner (lines 55-60)

### Code Changes

#### src/utils/calculations.js - calculateCardPoints()
```javascript
// Line 57-65
} else if (card.epiphanyType === 'divine') {
  points += 20; // Divine always costs 20 regardless of card type

  // IN-GAME BUG: Neutral cards with divine epiphanies incorrectly also count
  // the regular epiphany proc (+10), making them cost 50 instead of 40
  if (card.type === 'neutral') {
    points += 10; // Bug: adds regular epiphany proc
  }
}
```

#### src/utils/calculations.js - getPointsBreakdown()
```javascript
// Line 230-233
// Count neutral cards with divine epiphanies (for in-game bug calculation)
const neutralCardsWithDivine = activeCards.filter(c => c.type === 'neutral' && c.epiphanyType === 'divine').length;

// Line 239
const divineEpiphaniesPoints = divineEpiphanies * 20 + neutralCardsWithDivine * 10; // Bug: +10 for neutral cards with divine
```

#### src/App.jsx - Bug Report Banner
```javascript
// Lines 55-60
{/* Bug Report Banner */}
<div className="bg-red-600 dark:bg-red-700 rounded-lg shadow-md p-4 md:p-6 mb-6">
  <p className="text-black font-semibold text-center text-sm md:text-base">
    --BUG REPORT-- Neutral cards (+20) count both the proc of regular epiphany (+10) and the cost of the divine (+20) when selected for a total cost of +50 in your Memory cap
  </p>
</div>
```

### Fix Applied

The bug has been fixed in the game! The following changes were made to remove the bug workaround:

1. **Removed the bug banner** from `src/App.jsx`
2. **Reverted calculations** in `src/utils/calculations.js`:
   - Removed the +10 bonus for neutral cards with divine epiphanies from `calculateCardPoints()`
   - Removed the neutral cards with divine filter from `getPointsBreakdown()`
   - Simplified divine epiphanies calculation to just `divineEpiphanies * 20`

### Related Commits
- `861185d` - Update calculations to match in-game bug for neutral cards with divine epiphanies
- `219e476` - Add in-game bug report banner for neutral card epiphany issue
- `ee1c2c1` - Update bug report banner text
- `314bc3a` - Remove bug report banner and fix neutral divine epiphany calculation (FIX APPLIED)

---

## Bug #2: Neutral Cards with Epiphanies Get Removal Bonus

**Status:** Fixed
**Date Reported:** 2025-11-18
**Date Fixed:** 2025-11-18
**Severity:** Affects removal cost calculations for converted neutral cards with epiphanies

### Bug Description
When a base card is converted to neutral and has an epiphany added, removing that card incorrectly applies the +20 removal bonus. Neutral cards should never receive the removal bonus, regardless of whether they have epiphanies.

**Expected Behavior:** Convert to neutral (10) + Add epiphany + Remove (1st removal): 10 points total
**Actual Behavior (BUG):** Convert to neutral (10) + Add epiphany + Remove (1st removal): 30 points total (incorrect +20 bonus)
**Current Behavior (FIXED):** Convert to neutral (10) + Add epiphany + Remove (1st removal): 10 points total

### Test Scenarios

| Scenario | Conversion | Epiphany | Removal # | Expected Total | Bug Total |
|----------|-----------|----------|-----------|----------------|-----------|
| Convert + Remove (no epi) | 10 | - | 1st | 10 pts | 10 pts ✓ |
| Convert + Regular Epi + Remove | 10 | +10 | 1st | 10 pts | 30 pts ✗ |
| Convert + Divine Epi + Remove | 10 | +20 | 1st | 10 pts | 30 pts ✗ |
| Convert + Remove (no epi) | 10 | - | 2nd | 20 pts | 20 pts ✓ |
| Convert + Divine Epi + Remove | 10 | +20 | 2nd | 20 pts | 40 pts ✗ |

### Changes Made

#### Files Modified
1. **src/context/DeckContext.jsx**
   - Modified `removeCard()` function (lines 176 and 194)

### Code Changes

#### src/context/DeckContext.jsx - removeCard()
```javascript
// BEFORE (Line 176 and 194):
const hasBonus = cardToRemove.type === 'base' || cardToRemove.epiphanyType !== 'none';

// AFTER (Fixed):
const hasBonus = cardToRemove.type === 'base' || (cardToRemove.epiphanyType !== 'none' && cardToRemove.type !== 'neutral');
```

### Fix Explanation

The removal bonus logic was applying +20 points to any card that was either:
- A base card, OR
- Had any epiphany

This caused neutral cards (from conversions) with epiphanies to incorrectly receive the bonus.

The fix ensures neutral cards never receive the removal bonus by checking that the card type is not 'neutral' when evaluating epiphany bonuses. The updated logic applies +20 bonus only to:
- Base cards (always), OR
- Non-neutral cards with epiphanies (monster, forbidden)

### Related Commits
- `4fb56ba` - Fix removal bonus incorrectly applied to neutral cards with epiphanies

---

## Bug #3: Red X Button Not Working on Removed Cards

**Status:** Fixed
**Date Reported:** 2025-11-18
**Date Fixed:** 2025-11-18
**Severity:** Affects user ability to reset/undo removed cards, includes inconsistent counter logic

### Bug Description
Two related issues were discovered:

1. **Primary Issue**: The red X (✕) button used to reset/delete cards becomes completely unclickable when a card is removed, preventing users from undoing the removal.
2. **Secondary Issue**: The `deleteOrResetCard` function uses outdated removal bonus logic that doesn't match the fix applied to the `removeCard` function, causing counter mismatches.

**Expected Behavior:**
- Red X button should always be clickable to allow resetting removed cards
- Counter logic should be consistent between adding and removing modifications

**Actual Behavior (BUG):**
- Red X button is disabled when card is removed (unclickable)
- Reset function uses old logic that includes neutral cards in epiphany bonus calculation

**Current Behavior (FIXED):**
- Red X button is always clickable, even on removed cards
- Reset function uses consistent logic that excludes neutral cards from epiphany bonus

### Root Causes

#### Issue 1: Button Structure
**File:** `src/components/CardSlot.jsx:112-127`

The red X button was nested inside the main card button. When a card was marked as removed, the parent button was disabled (`disabled={card.isRemoved}`), which made all child elements including the red X button non-interactive.

```javascript
// BEFORE (Nested structure):
<button disabled={card.isRemoved} className="relative">
  <button onClick={handleDeleteOrReset}>✕</button>  {/* Can't click when parent disabled */}
</button>
```

#### Issue 2: Inconsistent Bonus Logic
**File:** `src/context/DeckContext.jsx:279, 313`

The `deleteOrResetCard` function still used the old removal bonus logic after Bug #2 was fixed, causing a mismatch:
- When removing: Uses new logic (neutral cards excluded from epiphany bonus)
- When resetting: Uses old logic (neutral cards included in epiphany bonus)

This would cause the removal bonus counter to increment by 1 on removal but not decrement properly on reset.

### Changes Made

#### Files Modified
1. **src/components/CardSlot.jsx**
   - Restructured component to wrap card button in a container div (lines 112-188)
   - Moved red X button outside the disabled card button

2. **src/context/DeckContext.jsx**
   - Updated `deleteOrResetCard()` bonus logic for base cards (line 279)
   - Updated `deleteOrResetCard()` bonus logic for additional cards (line 313)

### Code Changes

#### src/components/CardSlot.jsx - Component Structure
```javascript
// BEFORE (lines 112-127):
return (
  <button
    onClick={onClick}
    className={`${getCardClasses()} relative`}
    disabled={card.isRemoved}
  >
    {!card.isLocked && (
      <button onClick={handleDeleteOrReset} className="absolute ...">
        ✕
      </button>
    )}
    {/* Card content */}
  </button>
);

// AFTER (Fixed):
return (
  <div className="relative w-full">
    {!card.isLocked && (
      <button onClick={handleDeleteOrReset} className="absolute ...">
        ✕
      </button>
    )}
    <button
      onClick={onClick}
      className={`${getCardClasses()}`}
      disabled={card.isRemoved}
    >
      {/* Card content */}
    </button>
  </div>
);
```

#### src/context/DeckContext.jsx - deleteOrResetCard()
```javascript
// BEFORE (Lines 279 and 313):
const hasBonus = card.type === 'base' || card.epiphanyType !== 'none';

// AFTER (Fixed):
const hasBonus = card.type === 'base' || (card.epiphanyType !== 'none' && card.type !== 'neutral');
```

### Fix Explanation

**Fix 1 - Button Structure:**
Restructured the component to use a wrapper div with relative positioning, allowing the red X button to sit outside the disabled card button. This preserves the visual layout (absolute positioning still works) while making the red X always clickable.

**Fix 2 - Consistent Logic:**
Updated the removal bonus decrement logic to match the increment logic fixed in Bug #2. This ensures:
- Base cards: Always counted in bonus
- Non-neutral cards with epiphanies: Counted in bonus
- Neutral cards with epiphanies: NOT counted in bonus (consistent with Bug #2 fix)

### Related Commits
- TBD - Fix red X button and inconsistent removal bonus logic in reset function

---

## Template for Future Bugs

```markdown
## Bug #N: [Bug Title]

**Status:** Active | Fixed
**Date Reported:** YYYY-MM-DD
**Severity:** [Brief severity description]

### Bug Description
[Detailed description of the bug]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]

### Changes Made

#### Files Modified
1. **file/path.js**
   - Description of changes

### Code Changes

#### file/path.js
```javascript
// Code snippets showing what was changed
```

### How to Revert When Bug is Fixed

1. Step-by-step instructions
2. For reverting changes
3. Once bug is fixed

### Related Commits
- `commit-hash` - Commit description
```
