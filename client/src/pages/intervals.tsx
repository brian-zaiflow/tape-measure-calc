import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, AlertCircle } from "lucide-react";
import type { ImperialMeasurement } from "@/types";
import {
  parseInput,
  formatImperialMeasurement,
  toDecimalInches,
  toImperialMeasurement,
} from "@/lib/fraction-math";

type Mode = "fastener" | "divide";

export default function Intervals() {
  const [mode, setMode] = useState<Mode>("fastener");

  // Fastener Spacing mode
  const [spacing, setSpacing] = useState("8\"");
  const [boardLength, setBoardLength] = useState("");
  const [startOffset, setStartOffset] = useState("1\"");
  const [endOffset, setEndOffset] = useState("1\"");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Divide mode
  const [totalLength, setTotalLength] = useState("");
  const [numSections, setNumSections] = useState("");
  const [divideOffset, setDivideOffset] = useState("");

  const [marks, setMarks] = useState<ImperialMeasurement[]>([]);
  const [summary, setSummary] = useState({
    count: 0,
    actualSpacing: 0,
    desiredSpacing: 0,
    unusedLength: 0,
    span: 0,
    hasWarning: false,
    warningMessage: ""
  });

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateMarks();
  }, [mode, spacing, boardLength, startOffset, endOffset, totalLength, numSections, divideOffset]);

  const calculateMarks = () => {
    const newMarks: ImperialMeasurement[] = [];
    let newSummary = {
      count: 0,
      actualSpacing: 0,
      desiredSpacing: 0,
      unusedLength: 0,
      span: 0,
      hasWarning: false,
      warningMessage: ""
    };

    if (mode === "fastener") {
      // Fastener Spacing mode: place fasteners at regular intervals
      const spacingParsed = parseInput(spacing);
      const boardParsed = boardLength ? parseInput(boardLength) : null;
      const startParsed = parseInput(startOffset);
      const endParsed = parseInput(endOffset);

      if (!spacingParsed || !boardParsed || !startParsed || !endParsed) {
        setMarks([]);
        setSummary(newSummary);
        return;
      }

      const spacingInches = toDecimalInches(spacingParsed);
      const boardInches = toDecimalInches(boardParsed);
      const startInches = toDecimalInches(startParsed);
      const endInches = toDecimalInches(endParsed);

      if (spacingInches <= 0 || boardInches <= 0 || startInches < 0 || endInches < 0) {
        setMarks([]);
        setSummary(newSummary);
        return;
      }

      // Calculate available length for fasteners
      const availableLength = boardInches - startInches - endInches;

      if (availableLength <= 0) {
        newSummary.hasWarning = true;
        newSummary.warningMessage = "Offsets are too large for board length";
        setMarks([]);
        setSummary(newSummary);
        return;
      }

      // Calculate number of intervals and actual spacing
      const numIntervals = Math.floor(availableLength / spacingInches);
      const numFasteners = numIntervals + 1; // Including first position

      // Generate positions
      let currentPosition = startInches;
      for (let i = 0; i < numFasteners; i++) {
        newMarks.push(toImperialMeasurement(currentPosition));
        currentPosition += spacingInches;
      }

      // Calculate unused length
      const lastPosition = startInches + (numIntervals * spacingInches);
      const unusedLength = boardInches - lastPosition - endInches;

      newSummary = {
        count: numFasteners,
        actualSpacing: spacingInches,
        desiredSpacing: spacingInches,
        unusedLength: Math.max(0, unusedLength),
        span: lastPosition - startInches,
        hasWarning: false,
        warningMessage: ""
      };

      // Add warnings
      if (unusedLength < 0) {
        newSummary.hasWarning = true;
        newSummary.warningMessage = `Last fastener extends ${Math.abs(unusedLength).toFixed(2)}" beyond board`;
      } else if (unusedLength > spacingInches * 0.75) {
        newSummary.hasWarning = true;
        newSummary.warningMessage = `${unusedLength.toFixed(2)}" unused - consider adding one more fastener`;
      }

    } else {
      // Divide mode: divide length into equal sections
      const totalParsed = parseInput(totalLength);
      const sectionsNum = parseInt(numSections);
      const offsetParsed = divideOffset ? parseInput(divideOffset) : null;

      if (!totalParsed || !sectionsNum || sectionsNum <= 0) {
        setMarks([]);
        setSummary(newSummary);
        return;
      }

      const totalInches = toDecimalInches(totalParsed);
      const offsetInches = offsetParsed ? toDecimalInches(offsetParsed) : 0;
      const availableLength = totalInches - offsetInches;

      if (availableLength <= 0) {
        setMarks([]);
        setSummary(newSummary);
        return;
      }

      const sectionSize = availableLength / sectionsNum;

      // Generate cut marks (N-1 marks for N sections)
      for (let i = 1; i <= sectionsNum; i++) {
        const markPosition = offsetInches + (sectionSize * i);
        if (markPosition <= totalInches) {
          newMarks.push(toImperialMeasurement(markPosition));
        }
      }

      newSummary = {
        count: newMarks.length,
        actualSpacing: sectionSize,
        desiredSpacing: sectionSize,
        unusedLength: 0,
        span: availableLength,
        hasWarning: false,
        warningMessage: ""
      };
    }

    setMarks(newMarks);
    setSummary(newSummary);
  };

  const handlePreset = (presetSpacing: string) => {
    setSpacing(presetSpacing);
  };

  const clearAll = () => {
    setSpacing("8\"");
    setBoardLength("");
    setStartOffset("1\"");
    setEndOffset("1\"");
    setTotalLength("");
    setNumSections("");
    setDivideOffset("");
    setMarks([]);
    setSummary({
      count: 0,
      actualSpacing: 0,
      desiredSpacing: 0,
      unusedLength: 0,
      span: 0,
      hasWarning: false,
      warningMessage: ""
    });
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
            Fastener & Interval Calculator
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Mark screws at regular intervals or divide lengths evenly
          </p>
        </div>

        <Card className="p-6 shadow-xl">
          {/* Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={mode === "fastener" ? "default" : "outline"}
              onClick={() => setMode("fastener")}
              className="flex-1 transition-all duration-200"
            >
              📌 Fastener Spacing
            </Button>
            <Button
              variant={mode === "divide" ? "default" : "outline"}
              onClick={() => setMode("divide")}
              className="flex-1 transition-all duration-200"
            >
              ✂️ Divide Evenly
            </Button>
          </div>

          {/* Fastener Spacing Mode */}
          {mode === "fastener" && (
            <div className="space-y-4 mb-6">
              {/* Quick Presets */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">Quick Presets</Label>
                <div className="flex gap-2 flex-wrap">
                  {["16\"", "12\"", "8\"", "6\""].map((preset) => (
                    <Button
                      key={preset}
                      variant={spacing === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreset(preset)}
                      className="text-xs"
                    >
                      {preset} {preset === "16\"" ? "OC" : preset === "8\"" ? "(Common)" : ""}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Primary Inputs */}
              <div>
                <Label htmlFor="spacing" className="text-base font-semibold">
                  Fastener Spacing <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="spacing"
                  value={spacing}
                  onChange={(e) => setSpacing(e.target.value)}
                  placeholder='8" (most common for drywall)'
                  className="font-mono text-lg mt-1"
                />
              </div>

              <div>
                <Label htmlFor="boardLength" className="text-base font-semibold">
                  Board Length <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="boardLength"
                  value={boardLength}
                  onChange={(e) => setBoardLength(e.target.value)}
                  placeholder={'96" or 8\' or 48 1/2"'}
                  className="font-mono text-lg mt-1"
                />
              </div>

              {/* Advanced Options */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span className="text-xs">Advanced Options</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="startOffset" className="text-sm">
                      Start Offset (from edge)
                    </Label>
                    <Input
                      id="startOffset"
                      value={startOffset}
                      onChange={(e) => setStartOffset(e.target.value)}
                      placeholder='1" (typical edge clearance)'
                      className="font-mono mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endOffset" className="text-sm">
                      End Offset (from edge)
                    </Label>
                    <Input
                      id="endOffset"
                      value={endOffset}
                      onChange={(e) => setEndOffset(e.target.value)}
                      placeholder='1" (typical edge clearance)'
                      className="font-mono mt-1"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* Divide Mode */}
          {mode === "divide" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="totalLength" className="text-base font-semibold">
                  Total Length <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalLength"
                  value={totalLength}
                  onChange={(e) => setTotalLength(e.target.value)}
                  placeholder={'96" or 8\' or 48 1/2"'}
                  className="font-mono text-lg mt-1"
                />
              </div>
              <div>
                <Label htmlFor="numSections" className="text-base font-semibold">
                  Number of Sections <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numSections"
                  type="number"
                  value={numSections}
                  onChange={(e) => setNumSections(e.target.value)}
                  placeholder="4"
                  className="text-lg mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="divideOffset" className="text-sm">
                  Starting Offset (optional)
                </Label>
                <Input
                  id="divideOffset"
                  value={divideOffset}
                  onChange={(e) => setDivideOffset(e.target.value)}
                  placeholder='4" (optional)'
                  className="font-mono mt-1"
                />
              </div>
            </div>
          )}

          {/* Clear Button */}
          <div className="mb-6">
            <Button onClick={clearAll} variant="outline" className="w-full">
              Clear All
            </Button>
          </div>

          {/* Results Summary */}
          {marks.length > 0 && (
            <>
              <Card className="p-4 bg-primary/5 border-primary/20 mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-sm">Layout Summary</span>
                </h3>
                <div className="space-y-1.5 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">
                      {mode === "fastener" ? "Fasteners:" : "Cut marks:"}
                    </span>
                    <span className="font-semibold">{summary.count}</span>
                  </p>
                  {mode === "fastener" ? (
                    <>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Actual spacing:</span>
                        <span className="font-semibold font-mono">
                          {formatImperialMeasurement(toImperialMeasurement(summary.actualSpacing))}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Span:</span>
                        <span className="font-semibold font-mono">
                          {formatImperialMeasurement(toImperialMeasurement(summary.span))}
                        </span>
                      </p>
                      {summary.unusedLength > 0 && (
                        <p className="flex justify-between text-amber-600 dark:text-amber-500">
                          <span>Unused at end:</span>
                          <span className="font-semibold font-mono">
                            {formatImperialMeasurement(toImperialMeasurement(summary.unusedLength))}
                          </span>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Section size:</span>
                      <span className="font-semibold font-mono">
                        {formatImperialMeasurement(toImperialMeasurement(summary.actualSpacing))}
                      </span>
                    </p>
                  )}
                </div>
              </Card>

              {/* Warning */}
              {summary.hasWarning && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-600 dark:text-amber-500">
                    {summary.warningMessage}
                  </p>
                </div>
              )}

              {/* Mark Positions */}
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                  {mode === "fastener" ? "Fastener Positions:" : "Cut Mark Positions:"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {marks.map((mark, index) => (
                    <div
                      key={index}
                      className="bg-background rounded-lg px-3 py-2.5 text-center font-mono font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(formatImperialMeasurement(mark))}
                      title="Click to copy"
                    >
                      {formatImperialMeasurement(mark)}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === "fastener" ? (
                <>
                  <strong className="text-foreground">Fastener Spacing:</strong> Mark positions for screws or nails at regular intervals.
                  Enter your desired spacing and board length. Offsets add clearance from edges (typically 1").
                  <br />
                  <span className="text-muted-foreground/70">
                    Example: 8" spacing on 96" board with 1" offsets = 12 fasteners from 1" to 89"
                  </span>
                </>
              ) : (
                <>
                  <strong className="text-foreground">Divide Evenly:</strong> Split a length into equal sections.
                  Enter total length and number of sections needed. Marks show where to cut.
                  <br />
                  <span className="text-muted-foreground/70">
                    Example: 96" ÷ 4 sections = cut marks at 24", 48", 72"
                  </span>
                </>
              )}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
