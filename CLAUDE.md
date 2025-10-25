# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An imperial tape measure calculator designed for construction professionals. Mobile-first React application with TypeScript that handles precise fractional arithmetic with 1/16" precision.

**Progressive Web App (PWA)** - Works offline and can be installed on mobile devices for use on job sites without internet.

Includes two main tools:
1. **Calculator** - Add, subtract, multiply, and divide imperial measurements
2. **Intervals** - Divide lengths into equal parts or generate evenly spaced marks with custom intervals

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs Vite dev server on port 5173 with HMR.

**Type checking:**
```bash
npm run check
```
Runs TypeScript compiler in check mode without emitting files.

**Production build:**
```bash
npm run build
```
Builds static files to `dist/` directory.

**Preview production build:**
```bash
npm run preview
```
Serves the built static files locally for testing.

## Architecture

### Core Business Logic

**Imperial measurement system** (`client/src/lib/fraction-math.ts`):
- `ImperialMeasurement` interface: `{inches, numerator, denominator}` (inches and fractions only)
- All arithmetic converts to decimal inches, performs operation, then converts back
- All values are positive (no negative numbers - use subtract operation instead)
- Fraction reduction uses GCD algorithm - fractions always displayed in reduced form
- Fixed 1/16" precision - always rounds to nearest 1/16" mark
- Tape measure rounding: ties (halfway points) round up per construction practice
- `toDecimalInches()`: converts measurement to decimal for calculations
- `toImperialMeasurement()`: converts decimal back, rounding to 1/16" and reducing fractions
- `performOperation()`: handles add, subtract, multiply, divide operations
- `formatImperialMeasurement()`: converts to display string (always shows inches only, e.g., "63 1/2"")
- `parseInput()`: parses multiple formats including feet notation (e.g., "5' 3 1/2"", "8'", "3 1/2"") - feet are converted to inches internally for storage/display

**Calculator state** (`client/src/types/index.ts`):
- `CalculatorState` tracks: currentInput, displayValue, previousValue, operation, shouldResetInput
- `OperationType`: 'add' | 'subtract' | 'multiply' | 'divide' | 'none'
- `ImperialMeasurement` type definition
- No precision or display format settings - always uses 1/16" with reduced fractions

### Frontend Structure

**Tech stack:**
- React 18 + TypeScript with Vite build system
- Wouter for routing (lightweight alternative to React Router)
- React Query (@tanstack/react-query) for server state
- shadcn/ui components (New York variant) built on Radix UI primitives
- Tailwind CSS v4 with CSS variables for theming

**Key directories:**
- `client/src/pages/`: Page components (calculator.tsx and intervals.tsx)
- `client/src/components/ui/`: shadcn/ui components
- `client/src/lib/`: Utilities and business logic
- `client/src/hooks/`: Custom React hooks

**Routing** (`client/src/App.tsx`):
- Route "/" shows Calculator component
- Route "/intervals" shows Intervals component
- 404 handled by NotFound component
- Wrapped in QueryClientProvider and TooltipProvider

**Pages:**
- `calculator.tsx`: Main arithmetic calculator with operation buttons and quick fraction shortcuts
  - Collapsible header with settings (collapsed by default to fit on phone screens)
  - Precision toggle: 1/16" or 1/32"
  - Display mode: Fraction or Decimal
  - Reduce toggle: Reduce fractions or show exact values
  - Compact layout optimized for iPhone screens
- `intervals.tsx`: Tape measure interval generator with two modes:
  - Divide mode: Divide a total length into N equal parts with optional offset
  - Custom mode: Generate marks at custom intervals starting from a custom point

### Pure Static Site

This is a 100% client-side application:
- No backend server required
- No database or API calls
- All calculation logic runs in the browser
- Perfect for hosting on GitHub Pages or any static hosting service

### Design System

**Per design_guidelines.md:**
- Mobile-first with max-width: 768px
- Optimized for iPhone screens - compact layout fits on standard phone screen without scrolling
- Large touch targets (minimum 56px/14rem height) for glove operation
- Monospace fonts (SF Mono, Consolas) for numerical displays
- High contrast for outdoor visibility
- Professional tool aesthetic (not consumer app)
- Compact spacing for mobile: gaps of 1.5 (6px), padding reduced throughout
- Two-line calculator display: history + current result

**Typography:**
- Display results: text-4xl, font-bold (36px) - optimized for mobile screens
- Input display: text-3xl to text-4xl
- Button labels: text-xl
- Helper text: text-xs to text-sm

**Components:**
- Result display: monospace, right-aligned, min-height h-28 (112px)
- Calculator grid: 4-column layout with compact buttons (min-h-14)
- Quick fraction buttons: 15 buttons in 5x3 grid for all common 16ths
- Operations: vertical alignment on right (traditional calculator layout)
- Collapsible header: Settings and title hidden by default to maximize screen space
  - Toggle with Settings button at top of screen
  - Contains: title, precision settings (1/16" vs 1/32"), display mode (fraction vs decimal), reduce toggle

## Type System

**Types** (`client/src/types/index.ts`):
- Use Zod for runtime validation of enums (OperationType)
- TypeScript interfaces for complex types (ImperialMeasurement, CalculatorState)
- All types are client-side only

**Type checking:**
- Run `npm run check` before committing
- No TypeScript errors should exist in the codebase
- Use strict TypeScript configuration

## Testing

**Test framework:** Vitest with React Testing Library and happy-dom

**Running tests:**
```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
npm run test:ui       # Open Vitest UI
npm run test:coverage # Run with coverage report
```

**Test files:**
- `client/src/lib/fraction-math.test.ts` - 54 tests covering all core arithmetic operations
- `client/src/lib/intervals.test.ts` - 12 tests covering divide mode and custom interval mode

**Test coverage:**
- All fraction math operations (add, subtract, multiply, divide)
- Input parsing (feet notation, fractions, mixed measurements)
- Rounding behavior (1/16" and 1/32" precision)
- Fraction reduction
- Intervals calculator logic (both divide and custom modes)

## Key Implementation Notes

1. **Fraction arithmetic is the core complexity**: all calculations flow through decimal conversion, operation, then back to imperial with 1/16" rounding
2. **Simplified architecture**: Display shows inches only (no feet in output), no negative numbers, fixed 1/16" precision, always reduced fractions
3. **Input parsing accepts feet notation**: Users can input "5' 3 1/2"" which is converted to "63 1/2"" internally and for display
4. **Pure static site**: 100% client-side, no backend, perfect for GitHub Pages
5. **Two-page application**: Calculator (/) and Intervals (/intervals) with client-side routing

## Deployment

See `DEPLOY.md` for GitHub Pages deployment instructions. The app is configured with:
- GitHub Actions workflow for automatic deployment
- Hash-based routing (wouter with `useHashLocation`) for GitHub Pages compatibility
- Static build outputs to `dist/` directory
- Base path set to `/tape-measure-calc/` in `vite.config.ts`

## Progressive Web App (PWA)

The app includes full PWA support via `vite-plugin-pwa`:
- **Service Worker**: Automatically generated with Workbox for offline caching
- **Manifest**: Configured for installation on mobile devices
- **Offline-first**: All app functionality works without internet after first visit
- **Asset caching**: Caches app bundle, CSS, fonts (Google Fonts), and images
- **Auto-updates**: Service worker updates automatically when new versions deploy

**Key files:**
- PWA config in `vite.config.ts` with VitePWA plugin
- Icons: `client/public/pwa-192x192.png` and `pwa-512x512.png` (generate with `generate-icons.html`)
- Service worker and manifest generated automatically during build
