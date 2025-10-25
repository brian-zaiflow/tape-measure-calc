import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Calculator, ArrowLeft } from "lucide-react";
import type { ImperialMeasurement } from "@/types";
import {
  parseInput,
  formatImperialMeasurement,
  toDecimalInches,
  toImperialMeasurement,
} from "@/lib/fraction-math";

type Mode = "divide" | "custom";

export default function Intervals() {
  const [mode, setMode] = useState<Mode>("divide");
  const [totalLength, setTotalLength] = useState("");
  const [divisions, setDivisions] = useState("");
  const [offset, setOffset] = useState("");
  const [customInterval, setCustomInterval] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [marks, setMarks] = useState<ImperialMeasurement[]>([]);

  const calculateMarks = () => {
    const newMarks: ImperialMeasurement[] = [];

    if (mode === "divide") {
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
      const totalInches = totalParsed ? toDecimalInches(totalParsed) : Infinity;

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
    setMarks([]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculator
            </Button>
          </Link>
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

          {/* Divide Mode Inputs */}
          {mode === "divide" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="totalLength">Total Length</Label>
                <Input
                  id="totalLength"
                  value={totalLength}
                  onChange={(e) => setTotalLength(e.target.value)}
                  placeholder="e.g., 96&quot; or 8' or 48 1/2&quot;"
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
                  placeholder="e.g., 4"
                />
              </div>
              <div>
                <Label htmlFor="offset">Starting Offset (optional)</Label>
                <Input
                  id="offset"
                  value={offset}
                  onChange={(e) => setOffset(e.target.value)}
                  placeholder="e.g., 4&quot; (marks start after this point)"
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
                  placeholder="e.g., 10 3/4&quot;"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="customStart">Starting Point (optional)</Label>
                <Input
                  id="customStart"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  placeholder="e.g., 3 1/4&quot; (default: 0&quot;)"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="totalLengthCustom">Total Length (optional)</Label>
                <Input
                  id="totalLengthCustom"
                  value={totalLength}
                  onChange={(e) => setTotalLength(e.target.value)}
                  placeholder="e.g., 96&quot; (leave blank for unlimited)"
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
              {mode === "divide" ? (
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
