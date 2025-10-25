import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Delete, Plus, Minus, Divide, X, Ruler, Settings, ChevronDown } from "lucide-react";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

      // If clicking a complete fraction (like "1/2") and current input ends with a digit, add space first
      // Don't add space for standalone "/" symbol
      const isCompleteFraction = /\d+\/\d+/.test(symbol);
      if (isCompleteFraction && /\d$/.test(newInput)) {
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

  // Helper to ensure input ends with " (auto-assume inches)
  const ensureInchMark = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return trimmed;
    if (trimmed.endsWith('"')) return trimmed;
    return trimmed + '"';
  };

  const handleOperation = (op: OperationType) => {
    if (op === 'none') return;

    const inputWithInches = ensureInchMark(state.currentInput || state.displayValue);
    const parsed = parseInput(inputWithInches);

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
      const inputWithInches = ensureInchMark(state.currentInput);
      const parsed = parseInput(inputWithInches);
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

    const inputWithInches = ensureInchMark(state.currentInput || state.displayValue);
    const parsed = parseInput(inputWithInches);
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

  // Always show " at the end of user input
  const currentDisplay = state.currentInput
    ? (state.currentInput + '"')
    : state.displayValue;
  const showOperation = state.operation !== 'none' && state.previousValue;

  // Format display based on mode (for display toggle only, not input)
  const formatDisplay = (value: string): string => {
    if (displayMode === 'decimal') {
      const parsed = parseInput(ensureInchMark(value));
      if (parsed) {
        return formatAsDecimal(parsed);
      }
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-3 pb-4">
      <div className="w-full max-w-md mx-auto flex flex-col h-full">
        {/* Collapsible Header & Settings */}
        <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                <Settings className="w-4 h-4" />
                <span className="text-xs font-semibold">Settings</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <Link href="/intervals">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Ruler className="w-4 h-4 mr-1" />
                <span className="text-xs">Intervals</span>
              </Button>
            </Link>
          </div>

          <CollapsibleContent className="mt-3 space-y-3">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">
                Tape Measure Calculator
              </h1>
              <p className="text-xs text-muted-foreground">
                Inches & Fractions Calculator
              </p>
            </div>

            {/* Settings Controls */}
            <div className="flex flex-col gap-2">
              {/* <div className="flex gap-1 bg-muted rounded-md p-1">
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
              </div> */}

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
          </CollapsibleContent>
        </Collapsible>

        <Card className="p-4 shadow-lg flex-1 flex flex-col">
          {/* Display */}
          <div className="mb-4 bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 min-h-28 flex flex-col justify-end border-2 border-border/50">
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
              className="text-4xl font-bold text-foreground font-mono text-right break-all"
              data-testid="text-display"
            >
              {formatDisplay(currentDisplay)}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* First Row: Clear, Delete, Feet mark, and Divide */}
            <Button
              variant="destructive"
              onClick={handleClear}
              className="min-h-14 text-lg font-semibold"
              data-testid="button-clear"
            >
              C
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="min-h-14"
              data-testid="button-delete"
            >
              <Delete className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick("'")}
              className="min-h-14 text-lg font-semibold"
              data-testid="button-feet"
            >
              '
            </Button>
            <Button
              variant={state.operation === 'divide' ? 'default' : 'secondary'}
              onClick={() => handleOperation('divide')}
              className="min-h-14"
              data-testid="button-divide"
            >
              <Divide className="w-5 h-5" />
            </Button>

            {/* Number Rows with Operations */}
            <Button
              variant="outline"
              onClick={() => handleNumberClick('7')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-7"
            >
              7
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('8')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-8"
            >
              8
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('9')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-9"
            >
              9
            </Button>
            <Button
              variant={state.operation === 'multiply' ? 'default' : 'secondary'}
              onClick={() => handleOperation('multiply')}
              className="min-h-14"
              data-testid="button-multiply"
            >
              <X className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberClick('4')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-4"
            >
              4
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('5')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-5"
            >
              5
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('6')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-6"
            >
              6
            </Button>
            <Button
              variant={state.operation === 'subtract' ? 'default' : 'secondary'}
              onClick={() => handleOperation('subtract')}
              className="min-h-14"
              data-testid="button-subtract"
            >
              <Minus className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberClick('1')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-1"
            >
              1
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('2')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-2"
            >
              2
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberClick('3')}
              className="min-h-14 text-xl font-semibold"
              data-testid="button-3"
            >
              3
            </Button>
            <Button
              variant={state.operation === 'add' ? 'default' : 'secondary'}
              onClick={() => handleOperation('add')}
              className="min-h-14"
              data-testid="button-add"
            >
              <Plus className="w-5 h-5" />
            </Button>

            {/* Last row: 0 (double width), /, Space */}
            <Button
              variant="outline"
              onClick={() => handleNumberClick('0')}
              className="min-h-14 text-xl font-semibold col-span-2"
              data-testid="button-0"
            >
              0
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick('/')}
              className="min-h-14 text-lg font-semibold"
              data-testid="button-fraction"
            >
              /
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSymbolClick(' ')}
              className="min-h-14 text-sm font-semibold"
              data-testid="button-space"
            >
              Space
            </Button>
          </div>

          {/* Second Grid - Equals Button */}
          <div className="mt-2">
            <Button
              variant="default"
              onClick={handleEquals}
              className="min-h-14 text-2xl font-bold w-full bg-primary hover:bg-primary/90 shadow-md"
              data-testid="button-equals"
            >
              =
            </Button>
          </div>

          {/* Quick Fraction Buttons - All reduced fractions from 1/16 to 15/16 */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Quick Fractions</h3>
              <div className="flex-1 h-px bg-border ml-2"></div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
            <Button variant="outline" onClick={() => handleSymbolClick('1/16"')} className="min-h-10 text-xs hover:bg-accent">1/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/8"')} className="min-h-10 text-xs hover:bg-accent">1/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/16"')} className="min-h-10 text-xs hover:bg-accent">3/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/4"')} className="min-h-10 text-xs hover:bg-accent">1/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/16"')} className="min-h-10 text-xs hover:bg-accent">5/16"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('3/8"')} className="min-h-10 text-xs hover:bg-accent">3/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/16"')} className="min-h-10 text-xs hover:bg-accent">7/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/2"')} className="min-h-10 text-xs hover:bg-accent">1/2"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('9/16"')} className="min-h-10 text-xs hover:bg-accent">9/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/8"')} className="min-h-10 text-xs hover:bg-accent">5/8"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('11/16"')} className="min-h-10 text-xs hover:bg-accent">11/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/4"')} className="min-h-10 text-xs hover:bg-accent">3/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('13/16"')} className="min-h-10 text-xs hover:bg-accent">13/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/8"')} className="min-h-10 text-xs hover:bg-accent">7/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('15/16"')} className="min-h-10 text-xs hover:bg-accent">15/16"</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
