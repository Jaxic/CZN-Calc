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
