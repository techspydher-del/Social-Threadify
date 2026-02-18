"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Sparkles, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Predefined hashtag categories with relevant tags
const hashtagDatabase = {
  general: [
    "trending", "viral", "explore", "fyp", "instagood", "photooftheday", 
    "instadaily", "picoftheday", "love", "beautiful"
  ],
  business: [
    "entrepreneur", "business", "success", "motivation", "marketing", 
    "startup", "smallbusiness", "businessowner", "leadership", "innovation"
  ],
  tech: [
    "technology", "tech", "innovation", "ai", "coding", "developer", 
    "programming", "software", "startup", "digital"
  ],
  lifestyle: [
    "lifestyle", "life", "happy", "wellness", "selfcare", "mindfulness", 
    "health", "fitness", "motivation", "inspiration"
  ],
  travel: [
    "travel", "travelgram", "wanderlust", "adventure", "explore", 
    "vacation", "travelphotography", "instatravel", "nature", "beautiful"
  ],
  food: [
    "food", "foodie", "foodporn", "instafood", "yummy", "delicious", 
    "cooking", "recipe", "homemade", "foodstagram"
  ],
  fashion: [
    "fashion", "style", "ootd", "fashionblogger", "outfit", "fashionista", 
    "streetstyle", "trends", "fashionable", "styleblogger"
  ],
  fitness: [
    "fitness", "gym", "workout", "fitfam", "training", "exercise", 
    "health", "motivation", "bodybuilding", "weightloss"
  ],
};

type Category = keyof typeof hashtagDatabase;

export function HashtagGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateHashtags = useCallback(() => {
    if (!topic.trim()) return;

    // Get base hashtags from selected category
    const categoryTags = hashtagDatabase[category];
    
    // Convert topic to hashtags
    const topicWords = topic.trim().toLowerCase().split(/\s+/);
    const topicHashtags = topicWords.map(word => word.replace(/[^a-z0-9]/g, ""));
    
    // Combine topic words for compound hashtags
    if (topicWords.length > 1) {
      const combined = topicWords.join("").replace(/[^a-z0-9]/g, "");
      topicHashtags.push(combined);
    }

    // Create variations
    const variations = [
      ...topicHashtags,
      ...topicHashtags.map(tag => `${tag}s`),
      ...topicHashtags.map(tag => `${tag}love`),
      ...topicHashtags.map(tag => `${tag}daily`),
    ];

    // Combine with category hashtags and remove duplicates
    const allHashtags = [...new Set([...variations, ...categoryTags])];
    
    // Shuffle and limit to 30 hashtags
    const shuffled = allHashtags.sort(() => Math.random() - 0.5).slice(0, 30);
    
    setGeneratedHashtags(shuffled);
    setSelectedHashtags([]);
  }, [topic, category]);

  const toggleHashtag = useCallback((hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedHashtags(generatedHashtags);
  }, [generatedHashtags]);

  const clearSelection = useCallback(() => {
    setSelectedHashtags([]);
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (selectedHashtags.length === 0) return;
    
    const hashtagString = selectedHashtags.map(tag => `#${tag}`).join(" ");
    
    try {
      await navigator.clipboard.writeText(hashtagString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy hashtags:", err);
    }
  }, [selectedHashtags]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Hashtags</CardTitle>
          <CardDescription>
            Enter your topic and select a category to generate relevant hashtags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Keyword</Label>
              <Input
                id="topic"
                placeholder="e.g., content marketing"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateHashtags()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Post Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe your post to get more relevant hashtags..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={generateHashtags} disabled={!topic.trim()} className="gap-2 w-full sm:w-auto">
            <Sparkles className="h-4 w-4" />
            Generate Hashtags
          </Button>
        </CardContent>
      </Card>

      {/* Generated Hashtags */}
      {generatedHashtags.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Hashtags ({generatedHashtags.length})</CardTitle>
                <CardDescription>
                  Click hashtags to select them, then copy to your clipboard
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generatedHashtags.map((hashtag) => (
                <Badge
                  key={hashtag}
                  variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105"
                  onClick={() => toggleHashtag(hashtag)}
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Hashtags */}
      {selectedHashtags.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Selected Hashtags ({selectedHashtags.length})</CardTitle>
                <CardDescription>
                  Your selected hashtags ready to copy
                </CardDescription>
              </div>
              <Button onClick={copyToClipboard} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedHashtags.map((hashtag) => (
                <Badge
                  key={hashtag}
                  className="cursor-pointer px-3 py-1.5 text-sm group"
                  onClick={() => toggleHashtag(hashtag)}
                >
                  #{hashtag}
                  <X className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
            
            {/* Preview */}
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm font-mono break-all">
                {selectedHashtags.map(tag => `#${tag}`).join(" ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Hashtag Guidelines</CardTitle>
          <CardDescription>
            Recommended hashtag counts for different social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { platform: "Instagram", recommended: "9-15 hashtags", max: 30, note: "Mix popular and niche tags" },
              { platform: "Twitter/X", recommended: "1-3 hashtags", max: null, note: "Less is more for engagement" },
              { platform: "LinkedIn", recommended: "3-5 hashtags", max: null, note: "Use professional, relevant tags" },
              { platform: "TikTok", recommended: "3-5 hashtags", max: null, note: "Include trending and niche tags" },
              { platform: "Facebook", recommended: "1-2 hashtags", max: null, note: "Hashtags are less effective" },
            ].map((guideline) => (
              <div
                key={guideline.platform}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <span className="font-medium">{guideline.platform}</span>
                  <p className="text-xs text-muted-foreground">{guideline.note}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{guideline.recommended}</div>
                  {guideline.max && (
                    <div className="text-xs text-muted-foreground">Max: {guideline.max}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
