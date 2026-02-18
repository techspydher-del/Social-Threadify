"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, Mic } from "lucide-react";

// Average reading speed: 200-250 words per minute (we'll use 225)
const READING_SPEED_WPM = 225;
// Average speaking speed: 130-150 words per minute (we'll use 140)
const SPEAKING_SPEED_WPM = 140;

export function WordCounterClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    
    // Calculate reading time
    const readingMinutes = Math.floor(words / READING_SPEED_WPM);
    const readingSeconds = Math.round(((words % READING_SPEED_WPM) / READING_SPEED_WPM) * 60);
    
    // Calculate speaking time
    const speakingMinutes = Math.floor(words / SPEAKING_SPEED_WPM);
    const speakingSeconds = Math.round(((words % SPEAKING_SPEED_WPM) / SPEAKING_SPEED_WPM) * 60);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: { minutes: readingMinutes, seconds: readingSeconds },
      speakingTime: { minutes: speakingMinutes, seconds: speakingSeconds },
      averageWordLength: words > 0 ? (charactersNoSpaces / words).toFixed(1) : "0",
    };
  }, [text]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
  }, []);

  const formatTime = (minutes: number, seconds: number) => {
    if (minutes === 0 && seconds === 0) return "0s";
    if (minutes === 0) return `${seconds}s`;
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Text</CardTitle>
          <CardDescription>
            Type or paste your content below to analyze word count, reading time, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Textarea
              id="text-input"
              placeholder="Start typing or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] resize-y font-mono text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!text}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!text}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Primary Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <CardDescription>Words</CardDescription>
            <CardTitle className="text-4xl">{stats.words.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <CardDescription>Characters</CardDescription>
            <CardTitle className="text-4xl">{stats.characters.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Time Estimates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardDescription>Reading Time</CardDescription>
            <CardTitle className="text-2xl">
              {formatTime(stats.readingTime.minutes, stats.readingTime.seconds)}
            </CardTitle>
            <CardDescription className="text-xs">
              Based on {READING_SPEED_WPM} words/minute
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Mic className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardDescription>Speaking Time</CardDescription>
            <CardTitle className="text-2xl">
              {formatTime(stats.speakingTime.minutes, stats.speakingTime.seconds)}
            </CardTitle>
            <CardDescription className="text-xs">
              Based on {SPEAKING_SPEED_WPM} words/minute
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sentences</CardDescription>
            <CardTitle className="text-2xl">{stats.sentences.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Paragraphs</CardDescription>
            <CardTitle className="text-2xl">{stats.paragraphs.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Characters (no spaces)</CardDescription>
            <CardTitle className="text-2xl">{stats.charactersNoSpaces.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Word Length</CardDescription>
            <CardTitle className="text-2xl">{stats.averageWordLength}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Content Type Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Content Type Guidelines</CardTitle>
          <CardDescription>
            Typical word count ranges for different types of content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "Social Media Post", range: "50-100 words", match: stats.words >= 50 && stats.words <= 100 },
              { type: "Blog Post", range: "800-2,000 words", match: stats.words >= 800 && stats.words <= 2000 },
              { type: "Long-form Article", range: "2,000-5,000 words", match: stats.words >= 2000 && stats.words <= 5000 },
              { type: "Short Story", range: "1,000-7,500 words", match: stats.words >= 1000 && stats.words <= 7500 },
              { type: "Academic Essay", range: "1,500-3,000 words", match: stats.words >= 1500 && stats.words <= 3000 },
            ].map((guideline) => (
              <div
                key={guideline.type}
                className={`flex items-center justify-between rounded-lg border p-3 text-sm ${
                  guideline.match ? "border-primary bg-primary/5" : ""
                }`}
              >
                <span className="font-medium">{guideline.type}</span>
                <span className="text-muted-foreground">{guideline.range}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
