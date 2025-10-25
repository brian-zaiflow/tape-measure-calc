import { useState } from "react";
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
  parseInput,
  performOperation,
  toDecimalInches,
  toImperialMeasurement
} from "@/lib/fraction-math";
import { Delete, Plus, Minus, Divide, X, Ruler } from "lucide-react";

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    currentInput: "",
    displayValue: '0"',
    previousValue: null,
    operation: 'none',
    shouldResetInput: false,
  });

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
    setState(prev => ({
      ...prev,
      currentInput: prev.currentInput + symbol,
    }));
  };

  const handleClear = () => {
    setState({
      currentInput: "",
      displayValue: '0"',
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
          state.operation as 'add' | 'subtract' | 'multiply' | 'divide'
        );
        const formatted = formatImperialMeasurement(result);
        
        setState(prev => ({
          ...prev,
          displayValue: formatted,
          previousValue: result,
          currentInput: "",
          operation: op,
          shouldResetInput: true,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          displayValue: "Error",
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
        // Round single value to 1/16"
        const decimalInches = toDecimalInches(parsed);
        const rounded = toImperialMeasurement(decimalInches);
        const formatted = formatImperialMeasurement(rounded);
        setState(prev => ({
          ...prev,
          displayValue: formatted,
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
        state.operation as 'add' | 'subtract' | 'multiply' | 'divide'
      );
      const formatted = formatImperialMeasurement(result);
      
      setState(prev => ({
        ...prev,
        displayValue: formatted,
        previousValue: null,
        currentInput: "",
        operation: 'none',
        shouldResetInput: true,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        displayValue: "Error",
        currentInput: "",
        previousValue: null,
        operation: 'none',
        shouldResetInput: true,
      }));
    }
  };

  const currentDisplay = state.currentInput || state.displayValue;
  const showOperation = state.operation !== 'none' && state.previousValue;

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
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Tape Measure Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Inches & Fractions Calculator
            </p>
          </div>
        </div>

        <Card className="p-6">
          {/* Display */}
          <div className="mb-4 bg-muted rounded-md p-4 min-h-32 flex flex-col justify-end">
            {showOperation && (
              <div className="text-sm text-muted-foreground font-mono mb-1 text-right" data-testid="text-previous-value">
                {formatImperialMeasurement(state.previousValue!)} {
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
              {currentDisplay}
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
          <div className="mt-2">
            <Button
              variant="default"
              onClick={handleEquals}
              className="min-h-16 text-xl font-semibold w-full"
              data-testid="button-equals"
            >
              =
            </Button>
          </div>

          {/* Quick Fraction Buttons - All reduced fractions from 1/16 to 15/16 */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            <Button variant="outline" onClick={() => handleSymbolClick('1/16"')} className="min-h-12 text-sm">1/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/8"')} className="min-h-12 text-sm">1/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/16"')} className="min-h-12 text-sm">3/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/4"')} className="min-h-12 text-sm">1/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/16"')} className="min-h-12 text-sm">5/16"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('3/8"')} className="min-h-12 text-sm">3/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/16"')} className="min-h-12 text-sm">7/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('1/2"')} className="min-h-12 text-sm">1/2"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('9/16"')} className="min-h-12 text-sm">9/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('5/8"')} className="min-h-12 text-sm">5/8"</Button>

            <Button variant="outline" onClick={() => handleSymbolClick('11/16"')} className="min-h-12 text-sm">11/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('3/4"')} className="min-h-12 text-sm">3/4"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('13/16"')} className="min-h-12 text-sm">13/16"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('7/8"')} className="min-h-12 text-sm">7/8"</Button>
            <Button variant="outline" onClick={() => handleSymbolClick('15/16"')} className="min-h-12 text-sm">15/16"</Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Enter measurements like: <span className="font-mono font-semibold text-foreground">3 1/2"</span>
              <br />
              Use buttons to enter inches (") and fractions (/)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
