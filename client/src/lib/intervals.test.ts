import { describe, it, expect } from 'vitest';
import type { ImperialMeasurement } from '@/types';
import {
  parseInput,
  toDecimalInches,
  toImperialMeasurement,
  formatImperialMeasurement,
} from './fraction-math';

/**
 * Tests for the intervals calculator logic
 * These tests simulate the calculations done in client/src/pages/intervals.tsx
 */

describe('Intervals Calculator - Divide Mode', () => {
  it('divides 96" into 4 equal parts', () => {
    const totalLength = '96"';
    const divisions = 4;
    const offset = '';

    const totalParsed = parseInput(totalLength);
    const divisionsNum = divisions;
    const offsetParsed = offset ? parseInput(offset) : null;

    expect(totalParsed).not.toBeNull();
    expect(divisionsNum).toBeGreaterThan(0);

    if (!totalParsed) return;

    const totalInches = toDecimalInches(totalParsed);
    const offsetInches = offsetParsed ? toDecimalInches(offsetParsed) : 0;
    const availableLength = totalInches - offsetInches;
    const intervalSize = availableLength / divisionsNum;

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisionsNum; i++) {
      const markPosition = offsetInches + (intervalSize * i);
      marks.push(toImperialMeasurement(markPosition));
    }

    expect(marks).toHaveLength(4);
    expect(formatImperialMeasurement(marks[0])).toBe('24"');
    expect(formatImperialMeasurement(marks[1])).toBe('48"');
    expect(formatImperialMeasurement(marks[2])).toBe('72"');
    expect(formatImperialMeasurement(marks[3])).toBe('96"');
  });

  it('divides 48" into 3 equal parts with 4" offset', () => {
    const totalLength = '48"';
    const divisions = 3;
    const offset = '4"';

    const totalParsed = parseInput(totalLength);
    const divisionsNum = divisions;
    const offsetParsed = parseInput(offset);

    if (!totalParsed || !offsetParsed) {
      throw new Error('Failed to parse input');
    }

    const totalInches = toDecimalInches(totalParsed);
    const offsetInches = toDecimalInches(offsetParsed);
    const availableLength = totalInches - offsetInches;
    const intervalSize = availableLength / divisionsNum;

    // Available length: 48 - 4 = 44"
    // Interval size: 44 / 3 = 14.666..." ≈ 14 11/16"
    expect(availableLength).toBe(44);
    expect(intervalSize).toBeCloseTo(14.666666666666666, 4);

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisionsNum; i++) {
      const markPosition = offsetInches + (intervalSize * i);
      marks.push(toImperialMeasurement(markPosition));
    }

    expect(marks).toHaveLength(3);
    // Mark 1: 4 + 14.666... = 18.666... ≈ 18 11/16"
    expect(formatImperialMeasurement(marks[0])).toBe('18 11/16"');
    // Mark 2: 4 + 29.333... = 33.333... ≈ 33 5/16"
    expect(formatImperialMeasurement(marks[1])).toBe('33 5/16"');
    // Mark 3: 4 + 44 = 48"
    expect(formatImperialMeasurement(marks[2])).toBe('48"');
  });

  it('divides 5\' 3" into 5 equal parts', () => {
    const totalLength = "5' 3\"";
    const divisions = 5;

    const totalParsed = parseInput(totalLength);
    if (!totalParsed) {
      throw new Error('Failed to parse input');
    }

    const totalInches = toDecimalInches(totalParsed);
    const offsetInches = 0;
    const availableLength = totalInches - offsetInches;
    const intervalSize = availableLength / divisions;

    // 5' 3" = 63"
    expect(totalInches).toBe(63);
    // 63 / 5 = 12.6" = 12 5/8" (rounded and reduced)
    expect(intervalSize).toBe(12.6);

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisions; i++) {
      const markPosition = offsetInches + (intervalSize * i);
      marks.push(toImperialMeasurement(markPosition));
    }

    expect(marks).toHaveLength(5);
    // 12.6 → 12 5/8" (10/16 reduced)
    expect(formatImperialMeasurement(marks[0])).toBe('12 5/8"');
    // 25.2 → 25 3/16"
    expect(formatImperialMeasurement(marks[1])).toBe('25 3/16"');
    // 37.8 → 37 13/16"
    expect(formatImperialMeasurement(marks[2])).toBe('37 13/16"');
    // 50.4 → 50 3/8" (6/16 reduced)
    expect(formatImperialMeasurement(marks[3])).toBe('50 3/8"');
    // 63.0 → 63"
    expect(formatImperialMeasurement(marks[4])).toBe('63"');
  });

  it('handles fractional total length', () => {
    const totalLength = '36 1/2"';
    const divisions = 2;

    const totalParsed = parseInput(totalLength);
    if (!totalParsed) {
      throw new Error('Failed to parse input');
    }

    const totalInches = toDecimalInches(totalParsed);
    const intervalSize = totalInches / divisions;

    expect(totalInches).toBe(36.5);
    expect(intervalSize).toBe(18.25);

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisions; i++) {
      const markPosition = intervalSize * i;
      marks.push(toImperialMeasurement(markPosition));
    }

    expect(marks).toHaveLength(2);
    expect(formatImperialMeasurement(marks[0])).toBe('18 1/4"');
    expect(formatImperialMeasurement(marks[1])).toBe('36 1/2"');
  });
});

describe('Intervals Calculator - Custom Mode', () => {
  it('generates marks at 10 3/4" intervals starting at 3 1/4"', () => {
    const customInterval = '10 3/4"';
    const customStart = '3 1/4"';
    const totalLength = '96"'; // Optional limit

    const intervalParsed = parseInput(customInterval);
    const startParsed = parseInput(customStart);
    const totalParsed = parseInput(totalLength);

    if (!intervalParsed || !startParsed || !totalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = toDecimalInches(startParsed);
    const totalInches = toDecimalInches(totalParsed);

    expect(intervalInches).toBe(10.75);
    expect(startInches).toBe(3.25);
    expect(totalInches).toBe(96);

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    // First mark: 3.25 + 10.75 = 14"
    // Second mark: 14 + 10.75 = 24.75 = 24 3/4"
    // Third mark: 24.75 + 10.75 = 35.5 = 35 1/2"
    expect(marks.length).toBeGreaterThan(0);
    expect(formatImperialMeasurement(marks[0])).toBe('14"');
    expect(formatImperialMeasurement(marks[1])).toBe('24 3/4"');
    expect(formatImperialMeasurement(marks[2])).toBe('35 1/2"');
  });

  it('generates marks at 16" intervals starting at 0"', () => {
    const customInterval = '16"';
    const customStart = '';
    const totalLength = '96"';

    const intervalParsed = parseInput(customInterval);
    const startParsed = customStart ? parseInput(customStart) : null;
    const totalParsed = parseInput(totalLength);

    if (!intervalParsed || !totalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = startParsed ? toDecimalInches(startParsed) : 0;
    const totalInches = toDecimalInches(totalParsed);

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    expect(marks).toHaveLength(6);
    expect(formatImperialMeasurement(marks[0])).toBe('16"');
    expect(formatImperialMeasurement(marks[1])).toBe('32"');
    expect(formatImperialMeasurement(marks[2])).toBe('48"');
    expect(formatImperialMeasurement(marks[3])).toBe('64"');
    expect(formatImperialMeasurement(marks[4])).toBe('80"');
    expect(formatImperialMeasurement(marks[5])).toBe('96"');
  });

  it('generates marks up to 25\' when no total length specified', () => {
    const customInterval = '12"';
    const customStart = '0"';
    const totalLength = '';

    const intervalParsed = parseInput(customInterval);
    const startParsed = parseInput(customStart);
    const totalParsed = totalLength ? parseInput(totalLength) : null;

    if (!intervalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = startParsed ? toDecimalInches(startParsed) : 0;
    // Default to 25' (300 inches) if no total length specified
    const totalInches = totalParsed ? toDecimalInches(totalParsed) : 300;

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    // Should generate 25 marks (12" intervals up to 25' = 300")
    // 300 / 12 = 25
    expect(marks).toHaveLength(25);
    expect(formatImperialMeasurement(marks[0])).toBe('12"');
    expect(formatImperialMeasurement(marks[1])).toBe('24"');
    expect(formatImperialMeasurement(marks[24])).toBe('300"'); // 25 * 12 = 300" = 25'
  });

  it('handles fractional intervals', () => {
    const customInterval = '1 1/2"';
    const customStart = '0"';
    const totalLength = '12"';

    const intervalParsed = parseInput(customInterval);
    const totalParsed = parseInput(totalLength);

    if (!intervalParsed || !totalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = 0;
    const totalInches = toDecimalInches(totalParsed);

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    expect(marks).toHaveLength(8);
    expect(formatImperialMeasurement(marks[0])).toBe('1 1/2"');
    expect(formatImperialMeasurement(marks[1])).toBe('3"');
    expect(formatImperialMeasurement(marks[2])).toBe('4 1/2"');
    expect(formatImperialMeasurement(marks[7])).toBe('12"');
  });

  it('handles custom start position in the middle', () => {
    const customInterval = '8"';
    const customStart = '5"';
    const totalLength = '50"';

    const intervalParsed = parseInput(customInterval);
    const startParsed = parseInput(customStart);
    const totalParsed = parseInput(totalLength);

    if (!intervalParsed || !startParsed || !totalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = toDecimalInches(startParsed);
    const totalInches = toDecimalInches(totalParsed);

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    // First mark: 5 + 8 = 13"
    // Second mark: 13 + 8 = 21"
    // Third mark: 21 + 8 = 29"
    // Fourth mark: 29 + 8 = 37"
    // Fifth mark: 37 + 8 = 45"
    // Sixth mark: 45 + 8 = 53" (exceeds 50", so not included)
    expect(marks).toHaveLength(5);
    expect(formatImperialMeasurement(marks[0])).toBe('13"');
    expect(formatImperialMeasurement(marks[1])).toBe('21"');
    expect(formatImperialMeasurement(marks[2])).toBe('29"');
    expect(formatImperialMeasurement(marks[3])).toBe('37"');
    expect(formatImperialMeasurement(marks[4])).toBe('45"');
  });
});

describe('Intervals Calculator - Spacing Mode', () => {
  it('calculates even spacing for screws between start and end', () => {
    // Example from user: first screw at 1", last screw at 95", desired interval ~8"
    const firstScrew = '1"';
    const lastScrew = '95"';
    const desiredInterval = '8"';

    const firstParsed = parseInput(firstScrew);
    const lastParsed = parseInput(lastScrew);
    const desiredParsed = parseInput(desiredInterval);

    if (!firstParsed || !lastParsed || !desiredParsed) {
      throw new Error('Failed to parse input');
    }

    const firstInches = toDecimalInches(firstParsed);
    const lastInches = toDecimalInches(lastParsed);
    const desiredInches = toDecimalInches(desiredParsed);

    expect(firstInches).toBe(1);
    expect(lastInches).toBe(95);
    expect(desiredInches).toBe(8);

    // Calculate span and number of intervals
    const span = lastInches - firstInches;
    const numIntervals = Math.round(span / desiredInches);

    expect(span).toBe(94);
    expect(numIntervals).toBe(12); // 94 / 8 = 11.75, rounds to 12

    // Calculate actual spacing
    const actualSpacing = span / numIntervals;
    expect(actualSpacing).toBeCloseTo(7.833333, 4); // 94 / 12

    // Generate all screw positions (N+1 screws including start and end)
    const marks: ImperialMeasurement[] = [];
    for (let i = 0; i <= numIntervals; i++) {
      const position = firstInches + (actualSpacing * i);
      marks.push(toImperialMeasurement(position));
    }

    // Should have 13 screws total (12 intervals + 1)
    expect(marks).toHaveLength(13);

    // Check first, middle, and last positions
    expect(formatImperialMeasurement(marks[0])).toBe('1"');
    expect(formatImperialMeasurement(marks[1])).toBe('8 13/16"'); // 1 + 7.833... ≈ 8 13/16"
    expect(formatImperialMeasurement(marks[6])).toBe('48"'); // Halfway point
    expect(formatImperialMeasurement(marks[12])).toBe('95"'); // Last screw
  });

  it('handles small span with desired interval', () => {
    const firstScrew = '5"';
    const lastScrew = '20"';
    const desiredInterval = '3"';

    const firstParsed = parseInput(firstScrew);
    const lastParsed = parseInput(lastScrew);
    const desiredParsed = parseInput(desiredInterval);

    if (!firstParsed || !lastParsed || !desiredParsed) {
      throw new Error('Failed to parse input');
    }

    const firstInches = toDecimalInches(firstParsed);
    const lastInches = toDecimalInches(lastParsed);
    const desiredInches = toDecimalInches(desiredParsed);

    const span = lastInches - firstInches;
    const numIntervals = Math.round(span / desiredInches);

    expect(span).toBe(15);
    expect(numIntervals).toBe(5); // 15 / 3 = 5 exactly

    const actualSpacing = span / numIntervals;
    expect(actualSpacing).toBe(3); // Perfect 3" spacing

    const marks: ImperialMeasurement[] = [];
    for (let i = 0; i <= numIntervals; i++) {
      const position = firstInches + (actualSpacing * i);
      marks.push(toImperialMeasurement(position));
    }

    expect(marks).toHaveLength(6);
    expect(formatImperialMeasurement(marks[0])).toBe('5"');
    expect(formatImperialMeasurement(marks[1])).toBe('8"');
    expect(formatImperialMeasurement(marks[2])).toBe('11"');
    expect(formatImperialMeasurement(marks[3])).toBe('14"');
    expect(formatImperialMeasurement(marks[4])).toBe('17"');
    expect(formatImperialMeasurement(marks[5])).toBe('20"');
  });

  it('handles fractional start and end positions', () => {
    const firstScrew = '2 1/4"';
    const lastScrew = '50 3/4"';
    const desiredInterval = '8"';

    const firstParsed = parseInput(firstScrew);
    const lastParsed = parseInput(lastScrew);
    const desiredParsed = parseInput(desiredInterval);

    if (!firstParsed || !lastParsed || !desiredParsed) {
      throw new Error('Failed to parse input');
    }

    const firstInches = toDecimalInches(firstParsed);
    const lastInches = toDecimalInches(lastParsed);
    const desiredInches = toDecimalInches(desiredParsed);

    expect(firstInches).toBe(2.25);
    expect(lastInches).toBe(50.75);

    const span = lastInches - firstInches;
    const numIntervals = Math.round(span / desiredInches);

    expect(span).toBe(48.5);
    expect(numIntervals).toBe(6); // 48.5 / 8 = 6.0625, rounds to 6

    const actualSpacing = span / numIntervals;
    expect(actualSpacing).toBeCloseTo(8.083333, 4); // 48.5 / 6

    const marks: ImperialMeasurement[] = [];
    for (let i = 0; i <= numIntervals; i++) {
      const position = firstInches + (actualSpacing * i);
      marks.push(toImperialMeasurement(position));
    }

    expect(marks).toHaveLength(7);
    expect(formatImperialMeasurement(marks[0])).toBe('2 1/4"');
    expect(formatImperialMeasurement(marks[6])).toBe('50 3/4"');
  });

  it('handles very close start and end (rounds to 0 intervals)', () => {
    const firstScrew = '10"';
    const lastScrew = '13"';
    const desiredInterval = '8"';

    const firstParsed = parseInput(firstScrew);
    const lastParsed = parseInput(lastScrew);
    const desiredParsed = parseInput(desiredInterval);

    if (!firstParsed || !lastParsed || !desiredParsed) {
      throw new Error('Failed to parse input');
    }

    const firstInches = toDecimalInches(firstParsed);
    const lastInches = toDecimalInches(lastParsed);
    const desiredInches = toDecimalInches(desiredParsed);

    const span = lastInches - firstInches;
    const numIntervals = Math.round(span / desiredInches);

    expect(span).toBe(3);
    expect(numIntervals).toBe(0); // 3 / 8 = 0.375, rounds to 0

    // Edge case: when numIntervals is 0, should just show start and end
    const marks: ImperialMeasurement[] = [];
    if (numIntervals === 0) {
      marks.push(toImperialMeasurement(firstInches));
      marks.push(toImperialMeasurement(lastInches));
    } else {
      const actualSpacing = span / numIntervals;
      for (let i = 0; i <= numIntervals; i++) {
        const position = firstInches + (actualSpacing * i);
        marks.push(toImperialMeasurement(position));
      }
    }

    expect(marks).toHaveLength(2);
    expect(formatImperialMeasurement(marks[0])).toBe('10"');
    expect(formatImperialMeasurement(marks[1])).toBe('13"');
  });

  it('handles larger span with fractional desired interval', () => {
    const firstScrew = '0"';
    const lastScrew = '8\''; // 96"
    const desiredInterval = '16"';

    const firstParsed = parseInput(firstScrew);
    const lastParsed = parseInput(lastScrew);
    const desiredParsed = parseInput(desiredInterval);

    if (!firstParsed || !lastParsed || !desiredParsed) {
      throw new Error('Failed to parse input');
    }

    const firstInches = toDecimalInches(firstParsed);
    const lastInches = toDecimalInches(lastParsed);
    const desiredInches = toDecimalInches(desiredParsed);

    expect(firstInches).toBe(0);
    expect(lastInches).toBe(96);
    expect(desiredInches).toBe(16);

    const span = lastInches - firstInches;
    const numIntervals = Math.round(span / desiredInches);

    expect(span).toBe(96);
    expect(numIntervals).toBe(6); // 96 / 16 = 6 exactly

    const actualSpacing = span / numIntervals;
    expect(actualSpacing).toBe(16);

    const marks: ImperialMeasurement[] = [];
    for (let i = 0; i <= numIntervals; i++) {
      const position = firstInches + (actualSpacing * i);
      marks.push(toImperialMeasurement(position));
    }

    expect(marks).toHaveLength(7);
    expect(formatImperialMeasurement(marks[0])).toBe('0"');
    expect(formatImperialMeasurement(marks[1])).toBe('16"');
    expect(formatImperialMeasurement(marks[6])).toBe('96"');
  });
});

describe('Intervals Calculator - Edge Cases', () => {
  it('handles division by 1', () => {
    const totalLength = '48"';
    const divisions = 1;

    const totalParsed = parseInput(totalLength);
    if (!totalParsed) {
      throw new Error('Failed to parse input');
    }

    const totalInches = toDecimalInches(totalParsed);
    const intervalSize = totalInches / divisions;

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisions; i++) {
      const markPosition = intervalSize * i;
      marks.push(toImperialMeasurement(markPosition));
    }

    expect(marks).toHaveLength(1);
    expect(formatImperialMeasurement(marks[0])).toBe('48"');
  });

  it('handles very small intervals', () => {
    const customInterval = '1/16"';
    const customStart = '0"';
    const totalLength = '2"';

    const intervalParsed = parseInput(customInterval);
    const totalParsed = parseInput(totalLength);

    if (!intervalParsed || !totalParsed) {
      throw new Error('Failed to parse input');
    }

    const intervalInches = toDecimalInches(intervalParsed);
    const startInches = 0;
    const totalInches = toDecimalInches(totalParsed);

    const marks: ImperialMeasurement[] = [];
    let currentPosition = startInches + intervalInches;
    while (currentPosition <= totalInches && marks.length < 100) {
      marks.push(toImperialMeasurement(currentPosition));
      currentPosition += intervalInches;
    }

    // 2" / (1/16") = 32 marks
    expect(marks).toHaveLength(32);
    expect(formatImperialMeasurement(marks[0])).toBe('1/16"');
    expect(formatImperialMeasurement(marks[15])).toBe('1"');
    expect(formatImperialMeasurement(marks[31])).toBe('2"');
  });

  it('handles offset equal to total length in divide mode', () => {
    const totalLength = '48"';
    const divisions = 3;
    const offset = '48"';

    const totalParsed = parseInput(totalLength);
    const offsetParsed = parseInput(offset);

    if (!totalParsed || !offsetParsed) {
      throw new Error('Failed to parse input');
    }

    const totalInches = toDecimalInches(totalParsed);
    const offsetInches = toDecimalInches(offsetParsed);
    const availableLength = totalInches - offsetInches;
    const intervalSize = availableLength / divisions;

    expect(availableLength).toBe(0);
    expect(intervalSize).toBe(0);

    const marks: ImperialMeasurement[] = [];
    for (let i = 1; i <= divisions; i++) {
      const markPosition = offsetInches + (intervalSize * i);
      marks.push(toImperialMeasurement(markPosition));
    }

    // All marks will be at 48"
    expect(marks).toHaveLength(3);
    expect(formatImperialMeasurement(marks[0])).toBe('48"');
    expect(formatImperialMeasurement(marks[1])).toBe('48"');
    expect(formatImperialMeasurement(marks[2])).toBe('48"');
  });
});
