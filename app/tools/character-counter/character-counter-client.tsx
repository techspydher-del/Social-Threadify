"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface PlatformLimit {
  name: string;
  limit: number;
  color: string;
}

const platformLimits: PlatformLimit[] = [
  { name: "Twitter/X", limit: 280, color: "text-blue-600 dark:text-blue-400" },
  { name: "Instagram Caption", limit: 2200, color: "text-pink-600 dark:text-pink-400" },
  { name: "LinkedIn", limit: 3000, color: "text-blue-700 dark:text-blue-500" },
  { name: "Meta Description", limit: 160, color: "text-green-600 dark:text-green-400" },
  { name: "Email Subject", limit: 60, color: "text-purple-600 dark:text-purple-400" },
];

export function CharacterCounterClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0,
    lines: text ? text.split(/\n/).length : 0,
  };

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

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Text</CardTitle>
          <CardDescription>
            Type or paste your content below to analyze character count, words, and more
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

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Characters</CardDescription>
            <CardTitle className="text-3xl">{stats.characters.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Characters (no spaces)</CardDescription>
            <CardTitle className="text-3xl">{stats.charactersNoSpaces.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Words</CardDescription>
            <CardTitle className="text-3xl">{stats.words.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sentences</CardDescription>
            <CardTitle className="text-3xl">{stats.sentences.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Paragraphs</CardDescription>
            <CardTitle className="text-3xl">{stats.paragraphs.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Lines</CardDescription>
            <CardTitle className="text-3xl">{stats.lines.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Platform Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Character Limits</CardTitle>
          <CardDescription>
            See how your text fits within popular social media platform limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {platformLimits.map((platform) => {
            const percentage = Math.min((stats.characters / platform.limit) * 100, 100);
            const isOver = stats.characters > platform.limit;
            
            return (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{platform.name}</span>
                  <span className={isOver ? "text-destructive font-semibold" : platform.color}>
                    {stats.characters} / {platform.limit}
                    {isOver && ` (+${stats.characters - platform.limit})`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${
                      isOver ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
