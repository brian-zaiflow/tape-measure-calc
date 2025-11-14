# Tape Measure Calculator

A professional imperial measurement calculator for construction professionals. Perform arithmetic with feet, inches, and fractions. Works offline.

![PWA Badge](https://img.shields.io/badge/PWA-Enabled-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Tests](https://img.shields.io/badge/Tests-75%20passing-brightgreen)

## Features

- ➕ **Calculator**: Add, subtract, multiply, divide with feet, inches, and fractions
- 📏 **Intervals**: Calculate evenly-spaced marks for fasteners, cuts, and layouts
- 🌗 **Dark Mode**: Eye-friendly theme for all lighting conditions
- 📱 **PWA**: Install on mobile, works offline after first load
- ⚡ **Precision**: 1/16" or 1/32" accuracy with automatic fraction reduction
- 🎯 **Quick Fractions**: One-tap buttons for common fractions (1/16 through 15/16)

## Quick Start

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Test
npm test
```

## Usage

### Calculator
1. Enter measurements using number pad and `'` (feet) or `"` (inches) buttons
2. Select operation (+, −, ×, ÷)
3. Enter second measurement
4. Press `=` for result
5. Tap result to toggle between fraction and decimal formats

### Intervals
- **Even Spacing**: Place screws evenly between start/end points
- **Divide Length**: Split length into equal parts
- **Custom Interval**: Generate marks at regular intervals

## Tech Stack

- React 18 + TypeScript 5
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Vitest (testing)
- PWA with offline support

## Documentation

- **[docs/CLAUDE.md](./docs/CLAUDE.md)** - Developer guide (architecture, deployment, etc.)
- **[docs/QA_TEST_PLAN.md](./docs/QA_TEST_PLAN.md)** - QA testing checklist
- **[docs/design_guidelines.md](./docs/design_guidelines.md)** - Design rationale

## Deployment

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

### PWA Installation

On mobile:
1. Visit the site
2. Tap "Add to Home Screen"
3. Use offline after first load

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari 14+
- PWA requires HTTPS

## License

MIT License

---

Built for construction professionals who need accurate, fast calculations on the job site. 🏗️
