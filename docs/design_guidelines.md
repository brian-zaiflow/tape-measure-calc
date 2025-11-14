# Design Guidelines: Imperial Tape Measure Calculator

## Design Approach

**Selected Approach:** Utility-First Design System
**Rationale:** This is a function-critical tool for professionals requiring precision, readability, and reliability in challenging environments (construction sites, workshops). Design prioritizes usability over aesthetics.

**Core Principles:**
- Mobile-first architecture (primary device context)
- Maximum touch target sizes for glove-friendly operation
- High contrast for outdoor/low-light visibility
- Zero cognitive load - instant comprehension
- Professional tool aesthetic, not consumer app

## Typography System

**Font Family:** 
- Primary: SF Mono, Consolas, 'Liberation Mono', monospace (for numerical display)
- UI Elements: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)

**Type Scale:**
- Display (Result): text-5xl to text-6xl, font-bold (48-60px) - massive for quick reading
- Input Display: text-3xl to text-4xl, font-semibold (30-36px)
- Button Labels: text-xl, font-medium (20px) - highly legible
- Settings/Labels: text-base, font-normal (16px)
- Helper Text: text-sm (14px)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4, p-6
- Button spacing: gap-2, gap-4
- Section margins: mb-6, mb-8
- Touch targets: min-h-16 (64px minimum)

**Grid Structure:**
- Container: max-w-md mx-auto (optimized for phones/small tablets)
- Calculator buttons: 4-column grid for operations, custom grid for measurement input
- Vertical stacking with clear visual separation

## Component Architecture

### Display Area
**Result Display:**
- Full-width container at top
- Monospace font for alignment
- Right-aligned text (standard calculator pattern)
- Two-line display: calculation history + current result
- Min-height of h-32 for stability
- Reduced fraction shown by default, with toggle to 16ths

**Input Echo:**
- Shows current input as user types
- Display format: "5' 3 1/2" + 2' 7 3/4""
- Clear visual distinction from result

### Calculator Button Grid

**Number & Fraction Buttons:**
- Large square buttons in 4-column grid
- Numbers 0-9 prominently displayed
- Dedicated buttons for: feet ('), inches ("), fraction bar (/)
- Common fractions as quick-access: 1/2, 1/4, 1/8, 1/16, 3/4, 3/8, etc.
- Min touch target: h-16 w-full (64px height)
- Active state with clear visual feedback

**Operation Buttons:**
- Vertically aligned on right side (traditional calculator layout)
- Operations: + (add), - (subtract), ÷ (divide)
- Equals button larger/emphasized (h-20)
- Clear (C) and Delete (←) buttons at top

### Settings Panel

**Precision Selector:**
- Toggle button group: "1/8 inch" | "1/16 inch"
- Segmented control pattern
- Clear active state indication
- Positioned above calculator grid

**Display Format Toggle:**
- Switch component: "Reduced" ↔ "16ths"
- Label: "Show as:" with clear current state
- Persistent setting across calculations

**Layout Placement:**
- Settings bar fixed at top of calculator
- Horizontal arrangement on wider screens
- Stacks vertically on very narrow devices (<320px)

### Additional Controls

**Clear/Reset:**
- Prominent "Clear All" button
- Secondary "Delete" button for backspace functionality
- Positioned in top row of calculator grid

**Memory/History (Enhancement):**
- Collapsible history panel showing last 5 calculations
- Tap to reuse previous calculation
- Swipe to dismiss individual entries

## Interaction Patterns

**Touch Interactions:**
- Large button sizing (minimum 64px × 64px)
- Generous spacing between buttons (gap-2)
- Immediate visual feedback on tap
- No hover states (mobile-primary)
- Haptic feedback on button press (where supported)

**Input Flow:**
- Natural measurement entry: feet → inches → fraction
- Automatic formatting as user types
- Smart cursor placement
- Error prevention (invalid fraction combinations blocked)

**Visual Feedback:**
- Active button state during tap
- Calculation animation (brief highlight on result)
- Error states with clear messaging (e.g., "Cannot divide by zero")

## Responsive Behavior

**Mobile Portrait (< 640px):** Primary design target
- Single column layout
- Full-width calculator buttons
- Settings stacked horizontally at top
- Max-width: 448px (max-w-md)

**Mobile Landscape / Tablet (640px - 1024px):**
- Slightly larger touch targets
- Same single-column approach
- Increased padding for readability

**Desktop (> 1024px):**
- Centered calculator with max-width constraint
- No expansion beyond tablet size
- Maintains mobile-optimized interface

## Accessibility Standards

**Touch Targets:**
- Minimum 64px × 64px for all interactive elements
- 8px minimum spacing between adjacent buttons

**Typography:**
- Minimum 16px for UI text
- Minimum 48px for result display
- High contrast ratios (4.5:1 minimum for text)

**Semantic Structure:**
- Proper button roles
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators for accessibility

## Special Considerations

**Job Site Optimization:**
- Anti-glare consideration in visual contrast
- Fat-finger friendly button sizing
- No critical information in extreme corners
- Landscape orientation support for tablets

**Professional Tool Aesthetic:**
- Clean, uncluttered interface
- Industrial-strength feel (not playful/consumer)
- Precision-focused visual language
- No unnecessary animations or decorations

**Error Handling:**
- Invalid fraction inputs prevented at input stage
- Division by zero with clear error message
- Fraction reduction errors handled gracefully
- Clear messaging when result exceeds tape measure scale

## Images
**No images required** - This is a pure utility calculator application where visual imagery would detract from functionality and clarity.