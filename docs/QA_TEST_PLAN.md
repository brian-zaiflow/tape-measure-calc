# QA Test Plan - Tape Measure Calculator

This document provides comprehensive test cases for validating the Tape Measure Calculator functionality.

## Test Environment Setup

- **Browsers**: Chrome, Safari, Firefox, Mobile Safari (iOS), Chrome (Android)
- **Devices**: Desktop, iPhone, Android phone
- **PWA**: Test both browser and installed PWA versions

---

## 1. Basic Arithmetic Operations

### Test 1.1: Addition
| Input | Expected Result |
|-------|----------------|
| `5 + 3 =` | `8"` |
| `1/2 + 1/4 =` | `3/4"` |
| `5 3/4 + 2 1/8 =` | `7 7/8"` |
| `10 + 5 1/2 =` | `15 1/2"` |

### Test 1.2: Subtraction
| Input | Expected Result |
|-------|----------------|
| `10 - 3 =` | `7"` |
| `5 1/2 - 2 1/4 =` | `3 1/4"` |
| `1 - 1/4 =` | `3/4"` |
| `7/8 - 1/2 =` | `3/8"` |

### Test 1.3: Multiplication
| Input | Expected Result |
|-------|----------------|
| `5 × 2 =` | `10"` |
| `3 1/2 × 2 =` | `7"` |
| `1/2 × 3 =` | `1 1/2"` |
| `12 × 3/4 =` | `9"` |

### Test 1.4: Division
| Input | Expected Result |
|-------|----------------|
| `10 ÷ 2 =` | `5"` |
| `12 ÷ 3 =` | `4"` |
| `5 ÷ 2 =` | `2 1/2"` |
| `3/4 ÷ 2 =` | `3/8"` |

### Test 1.5: Division by Zero
| Input | Expected Result |
|-------|----------------|
| `5 ÷ 0 =` | `Error` (display shows "Error") |

### Test 1.6: Chained Operations
| Input | Expected Result |
|-------|----------------|
| `5 + 3 + 2 =` | `10"` |
| `10 - 2 - 3 =` | `5"` |
| `2 × 3 × 4 =` | `24"` |
| `5 + 3 - 2 =` | `6"` |

---

## 2. Manual Fraction Entry

### Test 2.1: Whole Number + Fraction
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5 3/4` | `5 3/4"` | `5 3/4"` |
| `12 1/2` | `12 1/2"` | `12 1/2"` |
| `3 1/8` | `3 1/8"` | `3 1/8"` |

**Steps**: Type number, press Space, type numerator, press `/`, type denominator

### Test 2.2: Fraction Only
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `1/2` | `1/2"` | `1/2"` |
| `3/4` | `3/4"` | `3/4"` |
| `7/8` | `7/8"` | `7/8"` |

### Test 2.3: Improper Fractions (Auto-Convert)
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5/4` | `5/4"` | `1 1/4"` |
| `9/8` | `9/8"` | `1 1/8"` |

---

## 3. Quick Fraction Buttons

### Test 3.1: Single Quick Fraction
Click each quick fraction button and verify display:

| Button Click | Expected Display |
|-------------|-----------------|
| `1/16"` | `1/16"` |
| `1/8"` | `1/8"` |
| `1/4"` | `1/4"` |
| `1/2"` | `1/2"` |
| `3/4"` | `3/4"` |
| `7/8"` | `7/8"` |
| `15/16"` | `15/16"` |

### Test 3.2: Whole Number + Quick Fraction
| Input | Expected Display |
|-------|-----------------|
| Type `5`, click `1/2"` | `5 1/2"` |
| Type `12`, click `3/4"` | `12 3/4"` |
| Type `3`, click `1/8"` | `3 1/8"` |

**Expected**: Space automatically added between number and fraction

---

## 4. Decimal to Fraction Conversion

### Test 4.1: Basic Decimal Conversion
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5.625` | `5.625"` | `5 5/8"` |
| `10.5` | `10.5"` | `10 1/2"` |
| `3.75` | `3.75"` | `3 3/4"` |
| `0.0625` | `0.0625"` | `1/16"` |
| `12.25` | `12.25"` | `12 1/4"` |

### Test 4.2: Decimal with Leading Zero
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| Click `.`, type `25` | `0.25"` | `1/4"` |
| Click `.`, type `5` | `0.5"` | `1/2"` |
| Click `.`, type `75` | `0.75"` | `3/4"` |

### Test 4.3: Decimal in Operations
| Input | Expected Result |
|-------|----------------|
| `5.625 + 3.375 =` | `9"` |
| `10.5 - 2.25 =` | `8 1/4"` |
| `2.5 × 2 =` | `5"` |

### Test 4.4: Rounding Behavior (1/16" Precision)
| Input | Expected Result | Explanation |
|-------|----------------|-------------|
| `5.03 =` | `5"` | Closer to 5" than 5 1/16" |
| `5.04 =` | `5 1/16"` | Rounds up to 5 1/16" |
| `5.64 =` | `5 5/8"` | Rounds to 5 5/8" (5.625) |
| `5.09375 =` | `5 1/8"` | Halfway between 5 1/16 and 5 1/8, rounds UP |

---

## 5. Feet Notation

### Test 5.1: Feet Only
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5'` | `5'` | `60"` |
| `2'` | `2'` | `24"` |
| `10'` | `10'` | `120"` |

### Test 5.2: Feet + Inches
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5' 3` | `5' 3"` | `63"` |
| `2' 6` | `2' 6"` | `30"` |
| `10' 11` | `10' 11"` | `131"` |

### Test 5.3: Feet + Inches + Fraction
| Input | Expected Display | After `=` |
|-------|-----------------|-----------|
| `5' 3 1/2` | `5' 3 1/2"` | `63 1/2"` |
| `2' 6 3/4` | `2' 6 3/4"` | `30 3/4"` |

### Test 5.4: Feet in Operations
| Input | Expected Result |
|-------|----------------|
| `5' + 3' =` | `96"` (8 feet) |
| `1' + 6 =` | `18"` |
| `2' 6 + 1' 6 =` | `48"` (4 feet) |

---

## 6. Precision Settings (1/16" vs 1/32")

### Test 6.1: Switch Between Precisions
1. Open Settings (click Settings button)
2. Set precision to **1/16"**
3. Type `5.03125 =`
   - **Expected**: `5"` (rounds to nearest 16th)
4. Change precision to **1/32"**
5. Type `5.03125 =`
   - **Expected**: `5 1/32"` (exactly 1/32")

### Test 6.2: Precision Affects Rounding
| Input | 1/16" Result | 1/32" Result |
|-------|-------------|--------------|
| `5.015625 =` | `5"` | `5 1/32"` |
| `5.046875 =` | `5 1/16"` | `5 3/64"` → rounds to `5 1/16"` |

### Test 6.3: Existing Values Update
1. Type `5.625 =` → Result: `5 5/8"`
2. Change precision to 1/32"
3. **Expected**: Display updates to show in 32nds (if not reduced: `5 20/32"`, if reduced: `5 5/8"`)

---

## 7. Reduce vs Exact Toggle

### Test 7.1: Reduce Mode (Default)
| Input | Expected Result |
|-------|----------------|
| `1/2 + 1/2 =` | `1"` |
| `2/4 =` | `1/2"` |
| `8/16 =` | `1/2"` |
| `4/8 =` | `1/2"` |

### Test 7.2: Exact Mode
1. Open Settings, toggle to **Exact**
2. Set precision to **1/16"**

| Input | Expected Result |
|-------|----------------|
| `1/2 + 1/2 =` | `1"` or `16/16"` |
| Input already `2 1/2"`, toggle to Exact | `2 8/16"` |

### Test 7.3: Toggle Updates Display
1. Type `5 1/2 =` → Shows `5 1/2"`
2. Toggle to Exact
3. **Expected**: Updates to `5 8/16"` (if precision is 1/16")

---

## 8. Display Behavior

### Test 8.1: Auto-Add Inch Mark
| User Types | Display Shows |
|-----------|--------------|
| `5` | `5"` |
| `3 1/4` | `3 1/4"` |
| `10.5` | `10.5"` |
| `1'` | `1'` (no extra ") |
| `1' 2` | `1' 2"` |

### Test 8.2: Clear Button
1. Type any input
2. Press **C** button
3. **Expected**: Display shows `0"`, all state cleared

### Test 8.3: Delete Button
1. Type `123`
2. Press **⌫** (delete) once → Display: `12"`
3. Press **⌫** again → Display: `1"`
4. Press **⌫** again → Display: `0"`

### Test 8.4: Operation Display
1. Type `5 +`
2. **Expected**: Display shows `5"` and `5" +` in history line above
3. Type `3`
4. **Expected**: Current display shows `3"`, history shows `5" +`
5. Press `=`
6. **Expected**: Display shows `8"`, history clears

---

## 9. Edge Cases

### Test 9.1: Multiple Decimal Points
| Input | Expected Behavior |
|-------|------------------|
| Type `5.5.5` | Should only allow one decimal point (ignore second) OR show invalid |

### Test 9.2: Empty Operations
| Input | Expected Result |
|-------|----------------|
| Press `+ =` | No error, should handle gracefully |
| Press `= =` multiple times | Repeat last calculation or no-op |

### Test 9.3: Very Large Numbers
| Input | Expected Result |
|-------|----------------|
| `999999 × 999999 =` | Should calculate or show error if overflow |

### Test 9.4: Very Small Fractions
| Input | Expected Result |
|-------|----------------|
| `1/32 =` (with 1/16" precision) | `1/16"` (rounds to nearest 16th) |
| `1/32 =` (with 1/32" precision) | `1/32"` |

---

## 10. Intervals Calculator

### Test 10.1: Divide Mode - Basic
1. Navigate to **Intervals** page
2. Select **Divide Length** mode
3. Enter Total Length: `96"`
4. Enter Divide Into: `4`
5. Click **Calculate Marks**

**Expected Result**: 4 marks shown:
- `24"`
- `48"`
- `72"`
- `96"`

### Test 10.2: Divide Mode - With Offset
1. Total Length: `48"`
2. Divide Into: `3`
3. Starting Offset: `4"`
4. Click **Calculate Marks**

**Expected Result**: 3 marks shown:
- `18 11/16"` (4 + 44/3)
- `33 5/16"` (4 + 88/3)
- `48"` (4 + 44)

### Test 10.3: Custom Interval Mode
1. Select **Custom Interval** mode
2. Interval Between Marks: `16"`
3. Total Length: `96"`
4. Click **Calculate Marks**

**Expected Result**: 6 marks shown:
- `16"`
- `32"`
- `48"`
- `64"`
- `80"`
- `96"`

### Test 10.4: Custom Interval with Start Point
1. Interval Between Marks: `8"`
2. Starting Point: `5"`
3. Total Length: `50"`
4. Click **Calculate Marks**

**Expected Result**: 5 marks shown:
- `13"` (5 + 8)
- `21"` (13 + 8)
- `29"` (21 + 8)
- `37"` (29 + 8)
- `45"` (37 + 8)

### Test 10.5: Feet Notation in Intervals
1. Total Length: `8'` (8 feet)
2. Divide Into: `4`
3. **Expected**: Marks at `24"`, `48"`, `72"`, `96"`

---

## 11. Progressive Web App (PWA)

### Test 11.1: Installation
1. Open app in Chrome/Safari
2. Look for "Install" or "Add to Home Screen" option
3. Install the app
4. **Expected**: App icon appears on home screen

### Test 11.2: Offline Functionality
1. Install PWA
2. Open app while online
3. Turn off WiFi/data
4. Use calculator
5. **Expected**: All features work offline

### Test 11.3: Update Notification
1. When new version is deployed
2. Open app (wait up to 60 minutes or refresh)
3. **Expected**: Update notification appears in bottom-right:
   - "New version available!"
   - "Reload" button
4. Click "Reload"
5. **Expected**: App refreshes with new version

### Test 11.4: Offline Ready Notification
1. First time visiting app
2. Wait for service worker installation
3. **Expected**: Notification appears:
   - "App ready to work offline"
   - "Close" button

---

## 12. Responsive Design

### Test 12.1: Mobile Portrait (iPhone)
1. Open on iPhone in portrait
2. **Expected**:
   - All buttons are easily tappable (min 56px height)
   - No horizontal scrolling
   - Calculator fits on screen without scrolling
   - Settings collapsible (closed by default)

### Test 12.2: Mobile Landscape
1. Rotate to landscape
2. **Expected**: Layout adjusts, still usable

### Test 12.3: Tablet/iPad
1. Open on tablet
2. **Expected**: Calculator centered, max-width applied (768px)

### Test 12.4: Desktop
1. Open on desktop browser
2. **Expected**: Calculator centered, appropriate sizing

---

## 13. Settings Persistence

### Test 13.1: Settings Survive Refresh (if implemented)
1. Change precision to 1/32"
2. Toggle to Exact mode
3. Refresh page
4. **Expected**: Settings persist (or reset to defaults)

**Note**: Document current behavior - do settings persist or reset?

---

## 14. Help Dialog

### Test 14.1: Open Help
1. Click **?** (Help) button at top
2. **Expected**: Dialog opens with help content

### Test 14.2: Help Content
Verify help dialog includes:
- ✓ Basic calculator usage
- ✓ How to enter fractions
- ✓ Decimal to fraction conversion
- ✓ Feet notation
- ✓ Rounding behavior
- ✓ Settings explanation
- ✓ Examples

### Test 14.3: Close Help
1. Click outside dialog OR click X
2. **Expected**: Dialog closes

---

## 15. Cross-Browser Testing

Test all core functionality in:
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)
- [ ] Edge (Desktop)

---

## 16. Regression Tests

After any bug fix or feature addition, run these critical paths:

1. **Basic Calculation**: `5 1/2 + 3 3/4 = 9 1/4"`
2. **Decimal Conversion**: `5.625 = 5 5/8"`
3. **Feet Notation**: `5' 3 = 63"`
4. **Quick Fractions**: Type `5`, click `1/2"` → `5 1/2"`
5. **Precision Toggle**: Switch between 1/16" and 1/32", verify rounding
6. **Chained Operations**: `10 + 5 - 3 = 12"`
7. **Intervals**: Divide 96" into 4 parts → `24", 48", 72", 96"`

---

## Bug Reporting Template

When reporting bugs, include:
- **Device/Browser**: (e.g., iPhone 15, Safari)
- **Steps to Reproduce**: (detailed steps)
- **Expected Result**: (what should happen)
- **Actual Result**: (what actually happened)
- **Screenshot**: (if applicable)
- **Settings**: (precision, reduce/exact mode)

---

## Test Coverage Summary

- [ ] All arithmetic operations tested
- [ ] Manual fraction entry tested
- [ ] Quick fraction buttons tested
- [ ] Decimal to fraction conversion tested
- [ ] Feet notation tested
- [ ] Precision settings tested
- [ ] Reduce/Exact toggle tested
- [ ] Display behavior verified
- [ ] Edge cases covered
- [ ] Intervals calculator tested
- [ ] PWA functionality verified
- [ ] Responsive design checked
- [ ] Help dialog verified
- [ ] Cross-browser testing complete
