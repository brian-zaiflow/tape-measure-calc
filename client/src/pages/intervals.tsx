import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";
import { Calculator, ArrowLeft } from "lucide-react";
import type { ImperialMeasurement } from "@/types";
import {
  parseInput,
  formatImperialMeasurement,
  toDecimalInches,
  toImperialMeasurement,
} from "@/lib/fraction-math";

type Mode = "divide" | "custom" | "spacing";

export default function Intervals() {
  const [mode, setMode] = useState<Mode>("spacing");
  const [totalLength, setTotalLength] = useState("");
  const [divisions, setDivisions] = useState("");
  const [offset, setOffset] = useState("");
  const [customInterval, setCustomInterval] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [firstScrew, setFirstScrew] = useState("");
  const [lastScrew, setLastScrew] = useState("");
  const [desiredInterval, setDesiredInterval] = useState("");
  const [marks, setMarks] = useState<ImperialMeasurement[]>([]);

  const calculateMarks = () => {
    const newMarks: ImperialMeasurement[] = [];

    if (mode === "spacing") {
      // Spacing mode: evenly space screws between start and end
      const firstParsed = parseInput(firstScrew);
      const lastParsed = parseInput(lastScrew);
      const desiredParsed = parseInput(desiredInterval);

      if (!firstParsed || !lastParsed || !desiredParsed) {
        setMarks([]);
        return;
      }

      const firstInches = toDecimalInches(firstParsed);
      const lastInches = toDecimalInches(lastParsed);
      const desiredInches = toDecimalInches(desiredParsed);

      if (lastInches <= firstInches || desiredInches <= 0) {
        setMarks([]);
        return;
      }

      // Calculate span and number of intervals
      const span = lastInches - firstInches;
      const numIntervals = Math.round(span / desiredInches);

      // Handle edge case where numIntervals is 0
      if (numIntervals === 0) {
        newMarks.push(toImperialMeasurement(firstInches));
        newMarks.push(toImperialMeasurement(lastInches));
      } else {
        // Calculate actual spacing
        const actualSpacing = span / numIntervals;

        // Generate all screw positions (N+1 screws including start and end)
        for (let i = 0; i <= numIntervals; i++) {
          const position = firstInches + (actualSpacing * i);
          newMarks.push(toImperialMeasurement(position));
        }
      }
    } else if (mode === "divide") {
      // Divide mode: divide total length by number of divisions
      const totalParsed = parseInput(totalLength);
      const divisionsNum = parseInt(divisions);
      const offsetParsed = offset ? parseInput(offset) : null;

      if (!totalParsed || !divisionsNum || divisionsNum <= 0) {
        setMarks([]);
        return;
      }

      const totalInches = toDecimalInches(totalParsed);
      const offsetInches = offsetParsed ? toDecimalInches(offsetParsed) : 0;
      const availableLength = totalInches - offsetInches;
      const intervalSize = availableLength / divisionsNum;

      for (let i = 1; i <= divisionsNum; i++) {
        const markPosition = offsetInches + (intervalSize * i);
        newMarks.push(toImperialMeasurement(markPosition));
      }
    } else {
      // Custom mode: custom interval and custom start
      const intervalParsed = parseInput(customInterval);
      const startParsed = customStart ? parseInput(customStart) : null;
      const totalParsed = totalLength ? parseInput(totalLength) : null;

      if (!intervalParsed) {
        setMarks([]);
        return;
      }

      const intervalInches = toDecimalInches(intervalParsed);
      const startInches = startParsed ? toDecimalInches(startParsed) : 0;
      // Default to 25' (300 inches) if no total length specified
      const totalInches = totalParsed ? toDecimalInches(totalParsed) : 300;

      let currentPosition = startInches + intervalInches;
      while (currentPosition <= totalInches && newMarks.length < 100) {
        newMarks.push(toImperialMeasurement(currentPosition));
        currentPosition += intervalInches;
      }
    }

    setMarks(newMarks);
  };

  const clearAll = () => {
    setTotalLength("");
    setDivisions("");
    setOffset("");
    setCustomInterval("");
    setCustomStart("");
    setFirstScrew("");
    setLastScrew("");
    setDesiredInterval("");
    setMarks([]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-1 text-center">
            Tape Measure Intervals
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Divide lengths & generate evenly spaced marks
          </p>
        </div>

        <Card className="p-6">
          {/* Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={mode === "spacing" ? "default" : "outline"}
              onClick={() => setMode("spacing")}
              className="flex-1"
            >
              Even Spacing
            </Button>
            <Button
              variant={mode === "divide" ? "default" : "outline"}
              onClick={() => setMode("divide")}
              className="flex-1"
            >
              Divide Length
            </Button>
            <Button
              variant={mode === "custom" ? "default" : "outline"}
              onClick={() => setMode("custom")}
              className="flex-1"
            >
              Custom Interval
            </Button>
          </div>

          {/* Spacing Mode Inputs */}
          {mode === "spacing" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="firstScrew">First Screw Position</Label>
                <Input
                  id="firstScrew"
                  value={firstScrew}
                  onChange={(e) => setFirstScrew(e.target.value)}
                  placeholder={'1"'}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="lastScrew">Last Screw Position</Label>
                <Input
                  id="lastScrew"
                  value={lastScrew}
                  onChange={(e) => setLastScrew(e.target.value)}
                  placeholder={'95"'}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="desiredInterval">Desired Spacing (approximate)</Label>
                <Input
                  id="desiredInterval"
                  value={desiredInterval}
                  onChange={(e) => setDesiredInterval(e.target.value)}
                  placeholder={'8"'}
                  className="font-mono"
                />
              </div>
            </div>
          )}

          {/* Divide Mode Inputs */}
          {mode === "divide" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="totalLength">Total Length</Label>
                <Input
                  id="totalLength"
                  value={totalLength}
                  onChange={(e) => setTotalLength(e.target.value)}
                  placeholder={'96" or 8\' or 48 1/2"'}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="divisions">Divide Into (number of parts)</Label>
                <Input
                  id="divisions"
                  type="number"
                  value={divisions}
                  onChange={(e) => setDivisions(e.target.value)}
                  placeholder="4"
                />
              </div>
              <div>
                <Label htmlFor="offset">Starting Offset (optional)</Label>
                <Input
                  id="offset"
                  value={offset}
                  onChange={(e) => setOffset(e.target.value)}
                  placeholder={'4"'}
                  className="font-mono"
                />
              </div>
            </div>
          )}

          {/* Custom Mode Inputs */}
          {mode === "custom" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="customInterval">Interval Between Marks</Label>
                <Input
                  id="customInterval"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value)}
                  placeholder={'10 3/4"'}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="customStart">Starting Point (optional)</Label>
                <Input
                  id="customStart"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  placeholder={'Starts at 0" if blank'}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="totalLengthCustom">Total Length (optional)</Label>
                <Input
                  id="totalLengthCustom"
                  value={totalLength}
                  onChange={(e) => setTotalLength(e.target.value)}
                  placeholder={"Defaults to 25' if blank"}
                  className="font-mono"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <Button onClick={calculateMarks} className="flex-1">
              Calculate Marks
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear
            </Button>
          </div>

          {/* Results */}
          {marks.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                Mark Positions ({marks.length} marks):
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {marks.map((mark, index) => (
                  <div
                    key={index}
                    className="bg-background rounded px-3 py-2 text-center font-mono font-semibold"
                  >
                    {formatImperialMeasurement(mark)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              {mode === "spacing" ? (
                <>
                  <strong>Even Spacing:</strong> Place screws evenly between start and end points.
                  Enter desired spacing (approximate) and get actual tape measure positions.
                  <br />
                  Example: First at 1&quot;, last at 95&quot;, ~8&quot; spacing = 13 screws at 7 13/16&quot; apart
                </>
              ) : mode === "divide" ? (
                <>
                  <strong>Divide Length:</strong> Enter a total length and divide it into equal parts.
                  Add an offset to start marks after a specific point.
                  <br />
                  Example: 96&quot; ÷ 4 = marks at 24&quot;, 48&quot;, 72&quot;, 96&quot;
                </>
              ) : (
                <>
                  <strong>Custom Interval:</strong> Set a specific distance between marks and
                  optionally a starting point.
                  <br />
                  Example: 10 3/4&quot; interval starting at 3 1/4&quot; = marks at 14&quot;, 24 3/4&quot;, 35 1/2&quot;...
                </>
              )}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
