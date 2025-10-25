import type { ImperialMeasurement, PrecisionType, DisplayFormat } from "@shared/schema";

// Convert imperial measurement to decimal inches
export function toDecimalInches(measurement: ImperialMeasurement): number {
  // Check if the measurement is negative (any component can carry the sign)
  const isNegative = measurement.feet < 0 || measurement.inches < 0 || measurement.numerator < 0;
  
  // Work with absolute values
  const feetInInches = Math.abs(measurement.feet) * 12;
  const fractionInches = measurement.denominator !== 0 
    ? Math.abs(measurement.numerator) / measurement.denominator 
    : 0;
  const total = feetInInches + Math.abs(measurement.inches) + fractionInches;
  
  // Apply the sign to the total
  return isNegative ? -total : total;
}

// Greatest common divisor for fraction reduction
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Reduce a fraction to lowest terms
export function reduceFraction(numerator: number, denominator: number): { numerator: number; denominator: number } {
  if (denominator === 0) return { numerator: 0, denominator: 1 };
  if (numerator === 0) return { numerator: 0, denominator: 1 };
  
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

// Round to nearest tape measure mark
// Ties (halfway points) round up, following construction practice
export function roundToTapeMark(decimalInches: number, precision: PrecisionType): number {
  const increment = precision === 'eighth' ? 1/8 : 1/16;
  // Use Math.floor + 0.5 to always round ties up
  return Math.floor((decimalInches / increment) + 0.5) * increment;
}

// Convert decimal inches back to imperial measurement
export function toImperialMeasurement(
  decimalInches: number, 
  precision: PrecisionType
): ImperialMeasurement {
  const isNegative = decimalInches < 0;
  const absInches = Math.abs(decimalInches);
  
  // Round to precision first
  const rounded = roundToTapeMark(absInches, precision);
  
  const feet = Math.floor(rounded / 12);
  const remainingInches = rounded - (feet * 12);
  const wholeInches = Math.floor(remainingInches);
  const fractionPart = remainingInches - wholeInches;
  
  // Convert fraction to sixteenths (common denominator)
  const sixteenths = Math.round(fractionPart * 16);
  
  let numerator = sixteenths;
  let denominator = 16;
  
  // Reduce the fraction
  if (numerator > 0) {
    const reduced = reduceFraction(numerator, denominator);
    numerator = reduced.numerator;
    denominator = reduced.denominator;
  } else {
    numerator = 0;
    denominator = 1;
  }
  
  // Preserve sign: if negative and no feet/inches, make numerator negative
  const signedNumerator = isNegative && feet === 0 && wholeInches === 0 && numerator > 0
    ? -numerator
    : numerator;
  
  return {
    feet: isNegative ? -feet : feet,
    inches: isNegative && feet === 0 ? -wholeInches : wholeInches,
    numerator: signedNumerator,
    denominator,
  };
}

// Format imperial measurement for display
export function formatImperialMeasurement(
  measurement: ImperialMeasurement, 
  displayFormat: DisplayFormat
): string {
  const { feet, inches, numerator, denominator } = measurement;
  
  let parts: string[] = [];
  const isNegative = feet < 0 || inches < 0 || numerator < 0;
  
  // Handle zero case
  if (feet === 0 && inches === 0 && numerator === 0) {
    return '0"';
  }
  
  if (feet !== 0) {
    parts.push(`${feet}'`);
  }
  
  // Add inches (without quote mark if there's a fraction coming)
  if (inches !== 0) {
    parts.push(`${Math.abs(inches)}`);
  }
  
  // Add fraction
  if (numerator !== 0) {
    let displayNumerator = Math.abs(numerator);
    let displayDenominator = denominator;
    
    // Convert to sixteenths if requested
    if (displayFormat === 'sixteenths' && denominator !== 16) {
      displayNumerator = Math.round((Math.abs(numerator) / denominator) * 16);
      displayDenominator = 16;
    }
    
    parts.push(`${displayNumerator}/${displayDenominator}`);
  }
  
  // Build result with quote mark at the end
  let result: string;
  if (parts.length === 0) {
    result = '0"';
  } else if (feet !== 0 && inches === 0 && numerator === 0) {
    // Feet only, already has the quote from feet
    result = parts.join(' ');
  } else {
    // Add quote mark at the end for inches/fractions
    result = parts.join(' ') + '"';
  }
  
  // Handle negative sign for results without feet
  if (isNegative && feet === 0) {
    return `-${result}`;
  }
  
  return result;
}

// Parse input string to imperial measurement
export function parseInput(input: string): ImperialMeasurement | null {
  if (!input.trim()) return null;
  
  // Check for negative sign at the start
  const cleaned = input.replace(/\s+/g, ' ').trim();
  const isNegative = cleaned.startsWith('-') || cleaned.startsWith('−');
  const withoutSign = isNegative ? cleaned.substring(1).trim() : cleaned;
  
  let feet = 0;
  let inches = 0;
  let numerator = 0;
  let denominator = 1;
  
  // Match patterns like: 5' 3 1/2" or 3 1/2" or 5' or 1/2" or just "2"
  const feetMatch = withoutSign.match(/(\d+)'/);
  if (feetMatch) {
    feet = parseInt(feetMatch[1]);
  }
  
  // Match inches (whole number before fraction or before ")
  const inchesMatch = withoutSign.match(/(\d+)(?:\s+\d+\/\d+)?"/);
  if (inchesMatch) {
    inches = parseInt(inchesMatch[1]);
  }
  
  // Match fraction
  const fractionMatch = withoutSign.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    numerator = parseInt(fractionMatch[1]);
    denominator = parseInt(fractionMatch[2]);
    
    // Reduce the fraction
    if (denominator !== 0) {
      const reduced = reduceFraction(numerator, denominator);
      numerator = reduced.numerator;
      denominator = reduced.denominator;
    }
  }
  
  // If no feet, inches, or fraction matched, treat plain number as inches
  if (feet === 0 && inches === 0 && numerator === 0) {
    const plainNumberMatch = withoutSign.match(/^(\d+)$/);
    if (plainNumberMatch) {
      inches = parseInt(plainNumberMatch[1]);
    }
  }
  
  // Apply negative sign to appropriate component
  if (isNegative) {
    if (feet !== 0) {
      feet = -feet;
    } else if (inches !== 0) {
      inches = -inches;
    } else if (numerator !== 0) {
      numerator = -numerator;
    }
  }
  
  return { feet, inches, numerator, denominator };
}

// Perform arithmetic operations
export function performOperation(
  left: ImperialMeasurement,
  right: ImperialMeasurement,
  operation: 'add' | 'subtract' | 'multiply' | 'divide',
  precision: PrecisionType
): ImperialMeasurement {
  const leftDecimal = toDecimalInches(left);
  const rightDecimal = toDecimalInches(right);
  
  let result: number;
  
  switch (operation) {
    case 'add':
      result = leftDecimal + rightDecimal;
      break;
    case 'subtract':
      result = leftDecimal - rightDecimal;
      break;
    case 'multiply':
      result = leftDecimal * rightDecimal;
      break;
    case 'divide':
      if (rightDecimal === 0) {
        throw new Error('Cannot divide by zero');
      }
      result = leftDecimal / rightDecimal;
      break;
    default:
      result = leftDecimal;
  }
  
  return toImperialMeasurement(result, precision);
}
