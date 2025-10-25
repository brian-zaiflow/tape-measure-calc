import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import type {
  CalculatorState,
  OperationType,
  ImperialMeasurement
} from "@/types";
import {
  formatImperialMeasurement,
  formatAsDecimal,
  parseInput,
  performOperation,
  toDecimalInches,
  toImperialMeasurement
} from "@/lib/fraction-math";
import { Delete, Plus, Minus, Divide, X, Ruler } from "lucide-react";

type DisplayMode = "fraction" | "decimal";
type Precision = 16 | 32;

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    currentInput: "",
    displayValue: '0"',
    displayMeasurement: null,
    previousValue: null,
    operation: 'none',
    shouldResetInput: false,
  });

  const [displayMode, setDisplayMode] = useState<DisplayMode>("fraction");
  const [precision, setPrecision] = useState<Precision>(16);
  const [reduceFractions, setReduceFractions] = useState<boolean>(true);

  // Reformat display when precision or reduce setting changes
  useEffect(() => {
    if (state.displayMeasurement && !state.currentInput) {
      const decimalInches = toDecimalInches(state.displayMeasurement);
      const reformatted = toImperialMeasurement(decimalInches, precision, reduceFractions);
      const formatted = formatImperialMeasurement(reformatted);
      setState(prev => ({
        ...prev,
        displayValue: formatted,
        displayMeasurement: reformatted,
      }));
    }
  }, [precision, reduceFractions]);

  const handleNumberClick = (num: string) => {
    if (state.shouldResetInput) {
      setState(prev => ({
        ...prev,
        currentInput: num,
        shouldResetInput: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentInput: prev.currentInput + num,
      }));
    }
  };

  const handleSymbolClick = (symbol: string) => {
    setState(prev => {
      let newInput = prev.currentInput;

      // If clicking a fraction and current input ends with a digit, add space first
      if (symbol.includes('/') && /\d$/.test(newInput)) {
        newInput += ' ';
      }

      return {
        ...prev,
        currentInput: newInput + symbol,
      };
    });
  };

  const handleClear = () => {
    setState({
      currentInput: "",
      displayValue: '0"',
      displayMeasurement: null,
      previousValue: null,
      operation: 'none',
      shouldResetInput: false,
    });
  };

  const handleDelete = () => {
    setState(prev => ({
      ...prev,
      currentInput: prev.currentInput.slice(0, -1),
    }));
  };

  const handleOperation = (op: OperationType) => {
    if (op === 'none') return;

    const parsed = parseInput(state.currentInput || state.displayValue);

    if (!parsed) return;

    if (state.previousValue && state.operation !== 'none') {
      try {
        const result = performOperation(
          state.previousValue,
          parsed,
          state.operation as 'add' | 'subtract' | 'multiply' | 'divide',
          precision,
          reduceFractions
        );
        const formatted = formatImperialMeasurement(result);

        setState(prev => ({
          ...prev,
          displayValue: formatted,
          displayMeasurement: result,
          previousValue: result,
          currentInput: "",
          operation: op,
          shouldResetInput: true,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          displayValue: "Error",
          displayMeasurement: null,
          currentInput: "",
          previousValue: null,
          operation: 'none',
          shouldResetInput: true,
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        previousValue: parsed,
        operation: op,
        currentInput: "",
        shouldResetInput: true,
      }));
    }
  };

  const handleEquals = () => {
    if (!state.previousValue || state.operation === 'none') {
      const parsed = parseInput(state.currentInput);
      if (parsed) {
        // Round single value to specified precision
        const decimalInches = toDecimalInches(parsed);
        const rounded = toImperialMeasurement(decimalInches, precision, reduceFractions);
        const formatted = formatImperialMeasurement(rounded);
        setState(prev => ({
          ...prev,
          displayValue: formatted,
          displayMeasurement: rounded,
          currentInput: "",
          shouldResetInput: true,
        }));
      }
      return;
    }

    const parsed = parseInput(state.currentInput || state.displayValue);
    if (!parsed) return;

    try {
      const result = performOperation(
        state.previousValue,
        parsed,
        state.operation as 'add' | 'subtract' | 'multiply' | 'divide',
        precision,
        reduceFractions
      );
      const formatted = formatImperialMeasurement(result);

      setState(prev => ({
        ...prev,
        displayValue: formatted,
        displayMeasurement: result,
        previousValue: null,
        currentInput: "",
        operation: 'none',
        shouldResetInput: true,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        displayValue: "Error",
        displayMeasurement: null,
        currentInput: "",
        previousValue: null,
        operation: 'none',
        shouldResetInput: true,
      }));
    }
  };

  const currentDisplay = state.currentInput || state.displayValue;
  const showOperation = state.operation !== 'none' && state.previousValue;

  // Format display based on mode
  const formatDisplay = (value: string): string => {
    if (displayMode === 'decimal') {
      const parsed = parseInput(value);
      if (parsed) {
        return formatAsDecimal(parsed);
      }
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-end mb-2">
            <Link href="/intervals">
              <Button variant="ghost" size="sm">
                <Ruler className="w-4 h-4 mr-2" />
                Intervals
              </Button>
            </Link>
          </div>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Tape Measure Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Inches & Fractions Calculator
            </p>
          </div>

          {/* Settings Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 bg-muted rounded-md p-1">
              <Button
                variant={displayMode === 'fraction' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('fraction')}
                className="text-xs px-3 flex-1"
              >
                Fraction
              </Button>
              <Button
                variant={displayMode === 'decimal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('decimal')}
                className="text-xs px-3 flex-1"
              >
                Decimal
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="flex gap-1 bg-muted rounded-md p-1 flex-1">
                <Button
                  variant={precision === 16 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPrecision(16)}
                  className="text-xs px-3 flex-1"
                >
                  1/16"
                </Button>
                <Button
                  variant={precision === 32 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPrecision(32)}
                  className="text-xs px-3 flex-1"
                >
                  1/32"
                </Button>
              </div>

              <div className="flex gap-1 bg-muted rounded-md p-1 flex-1">
                <Button
                  variant={reduceFractions ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setReduceFractions(true)}
                  className="text-xs px-3 flex-1"
                >
                  Reduce
                </Button>
                <Button
                  variant={!reduceFractions ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setReduceFractions(false)}
                  className="text-xs px-3 flex-1"
                >
                  Exact
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-6 shadow-lg">
          {/* Display */}
          <div className="mb-6 bg-gradient-to-br from-muted/50 to-muted rounded-lg p-6 min-h-36 flex flex-col justify-end border-2 border-border/50">
            {showOperation && (
              <div className="text-base text-muted-foreground font-mono mb-2 text-right" data-testid="text-previous-value">
                {displayMode === 'decimal'
                  ? formatAsDecimal(state.previousValue!)
                  : formatImperialMeasurement(state.previousValue!)
                } {
                  state.operation === 'add' ? '+' :
                  state.operation === 'subtract' ? '−' :
                  state.operation === 'multiply' ? '×' :
                  state.operation === 'divide' ? '÷' : ''
                }
              </div>
            )}
            <div
              className="text-5xl font-bold text-foreground font-mono text-right break-all"
              data-testid="text-display"
            >
              {formatDisplay(currentDisplay)}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* First Row: Clear, Delete, and Operations */}
            <Button
              variant="destructive"
              onClick={handleClear}
              className="min-h-16 text-lg font-semibold"
              data-testid="button-clear"
            >
              C
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="min-h-16"
              data-testid="button-delete"
            >
              <Delete className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick('.')}
              className="min-h-16 text-lg font-semibold"
              data-testid="button-decimal"
            >
              .
            </Button>
            <Button
              variant={state.operation === 'divide' ? 'default' : 'secondary'}
              onClick={() => handleOperation('divide')}
              className="min-h-16"
              data-testid="button-divide"
            >
              <Divide className="w-5 h-5" />
            </Button>

            {/* Number Rows with Operations */}
            <Button
              variant="outline"
              onClick={() => handleNumberClick('7')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-7"
            >
              7
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('8')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-8"
            >
              8
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('9')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-9"
            >
              9
            </Button>
            <Button
              variant={state.operation === 'multiply' ? 'default' : 'secondary'}
              onClick={() => handleOperation('multiply')}
              className="min-h-16"
              data-testid="button-multiply"
            >
              <X className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberClick('4')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-4"
            >
              4
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('5')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-5"
            >
              5
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('6')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-6"
            >
              6
            </Button>
            <Button
              variant={state.operation === 'subtract' ? 'default' : 'secondary'}
              onClick={() => handleOperation('subtract')}
              className="min-h-16"
              data-testid="button-subtract"
            >
              <Minus className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberClick('1')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-1"
            >
              1
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('2')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-2"
            >
              2
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('3')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-3"
            >
              3
            </Button>
            <Button
              variant={state.operation === 'add' ? 'default' : 'secondary'}
              onClick={() => handleOperation('add')}
              className="min-h-16"
              data-testid="button-add"
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberClick('0')}
              className="min-h-16 text-xl font-semibold"
              data-testid="button-0"
            >
              0
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick('/')}
              className="min-h-16 text-lg font-semibold"
              data-testid="button-fraction"
            >
              /
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick('"')}
              className="min-h-16 text-lg font-semibold"
              data-testid="button-inches"
            >
              "
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick(' ')}
              className="min-h-16 text-sm font-semibold"
              data-testid="button-space"
            >
              Space
            </Button>
          </div>

          {/* Second Grid - Equals Button */}
          <div className="mt-3">
            <Button
              variant="default"
              onClick={handleEquals}
              className="min-h-16 text-2xl font-bold w-full bg-primary hover:bg-primary/90 shadow-md"
              data-testid="button-equals"
            >
              =
            </Button>
          </div>

          {/* Quick Fraction Buttons - All reduced fractions from 1/16 to 15/16 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Fractions</h3>
              <div className="flex-1 h-px bg-border ml-3"></div>
            </div>
            <div className="grid grid-cols-5 gap-2">
            <Button variant="outline" onClick={() => handleSymbolClick('1/16"')} className="min-h-12 text-sm hover:bg-accent">1/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/8"')} className="min-h-12 text-sm hover:bg-accent">1/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/16"')} className="min-h-12 text-sm hover:bg-accent">3/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/4"')} className="min-h-12 text-sm hover:bg-accent">1/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/16"')} className="min-h-12 text-sm hover:bg-accent">5/16"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('3/8"')} className="min-h-12 text-sm hover:bg-accent">3/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/16"')} className="min-h-12 text-sm hover:bg-accent">7/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/2"')} className="min-h-12 text-sm hover:bg-accent">1/2"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('9/16"')} className="min-h-12 text-sm hover:bg-accent">9/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/8"')} className="min-h-12 text-sm hover:bg-accent">5/8"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('11/16"')} className="min-h-12 text-sm hover:bg-accent">11/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/4"')} className="min-h-12 text-sm hover:bg-accent">3/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('13/16"')} className="min-h-12 text-sm hover:bg-accent">13/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/8"')} className="min-h-12 text-sm hover:bg-accent">7/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('15/16"')} className="min-h-12 text-sm hover:bg-accent">15/16"</Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Enter measurements like: <span className="font-mono font-semibold text-foreground">3 1/2"</span>
              <br />
              <span className="text-[10px]">Use buttons to enter inches (") and fractions (/)</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
