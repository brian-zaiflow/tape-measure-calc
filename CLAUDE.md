# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An imperial tape measure calculator designed for construction professionals. Mobile-first React application with TypeScript that handles precise fractional arithmetic with 1/16" precision. Includes two main tools:
1. **Calculator** - Add, subtract, multiply, and divide imperial measurements
2. **Intervals** - Divide lengths into equal parts or generate evenly spaced marks with custom intervals

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs both Vite dev server (frontend) and Express server (backend) with HMR on port 5000 (or PORT env var).

**Type checking:**
```bash
npm run check
```
Runs TypeScript compiler in check mode without emitting files.

**Production build:**
```bash
npm run build
```
Compiles client with Vite and bundles server with esbuild to `dist/` directory.

**Start production server:**
```bash
npm start
```
Runs the built application from `dist/index.js`.

**Database schema push:**
```bash
npm run db:push
```
Pushes Drizzle schema to database (PostgreSQL setup is configured but currently using in-memory storage).

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

**Calculator state** (`shared/schema.ts`):
- `CalculatorState` tracks: currentInput, displayValue, previousValue, operation, shouldResetInput
- `OperationType`: 'add' | 'subtract' | 'multiply' | 'divide' | 'none'
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
- `intervals.tsx`: Tape measure interval generator with two modes:
  - Divide mode: Divide a total length into N equal parts with optional offset
  - Custom mode: Generate marks at custom intervals starting from a custom point

### Backend Structure

**Server setup** (`server/index.ts`):
- Express.js with ESM modules
- Middleware: body parsing (json + urlencoded), request logging for /api routes
- Error handling middleware catches all errors
- Development: Vite middleware with HMR
- Production: serves static files from dist/

**API endpoints** (`server/routes.ts`):
- Currently minimal, placeholder for future API routes
- All routes should be prefixed with `/api`
- Storage interface available via `storage` export

**Storage** (`server/storage.ts`):
- `IStorage` interface defines contract
- `MemStorage` provides in-memory implementation (current default)
- PostgreSQL/Drizzle setup configured but not actively used
- User model exists with UUID-based IDs

### Design System

**Per design_guidelines.md:**
- Mobile-first with max-width: 768px
- Large touch targets (minimum 64px height) for glove operation
- Monospace fonts (SF Mono, Consolas) for numerical displays
- High contrast for outdoor visibility
- Professional tool aesthetic (not consumer app)
- Tailwind spacing units: 2, 4, 6, 8
- Two-line calculator display: history + current result

**Typography:**
- Display results: text-5xl to text-6xl, font-bold (48-60px)
- Input display: text-3xl to text-4xl
- Button labels: text-xl
- Helper text: text-sm

**Components:**
- Result display: monospace, right-aligned, min-height h-32
- Calculator grid: 4-column layout with large buttons
- Quick fraction buttons: 1/2", 1/4", 3/4", 1/8" for common measurements
- Operations: vertical alignment on right (traditional calculator layout)

## Type System

**Shared schemas** (`shared/schema.ts`):
- Use Zod for runtime validation of enums
- TypeScript interfaces for complex types (ImperialMeasurement, CalculatorState)
- Shared between client and server for type safety

**Type checking:**
- Run `npm run check` before committing
- No TypeScript errors should exist in the codebase
- Use strict TypeScript configuration

## Testing

No test framework currently configured. Tests would need to be set up if required.

## Database

Drizzle ORM configured for PostgreSQL but not actively used:
- Schema defined but storage is in-memory by default
- Connection config in `drizzle.config.ts`
- Use `npm run db:push` to sync schema if switching to PostgreSQL
- User model available with UUID IDs, username, and password fields

## Key Implementation Notes

1. **Fraction arithmetic is the core complexity**: all calculations flow through decimal conversion, operation, then back to imperial with 1/16" rounding
2. **Simplified architecture**: No feet (inches only), no negative numbers, fixed 1/16" precision, always reduced fractions
3. **No backend API currently**: this is a pure frontend calculator, routes.ts is mostly empty
4. **Recent changes**:
   - Commit df58c2d removed calculation history and backend API features
   - Commit 2a616af added multiply operation
   - Simplified to inches-only with fixed 1/16" precision and always-reduced fractions
