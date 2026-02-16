import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const STORAGE_KEY = "threadify-cookie-consent";

interface ConsentState {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: number;
}

function getConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function getConsentState(): ConsentState | null {
  return getConsent();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, preferences: true, analytics: true, timestamp: Date.now() });
    setVisible(false);
  };

  const handleRejectOptional = () => {
    saveConsent({ necessary: true, preferences: false, analytics: false, timestamp: Date.now() });
    setVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent({ necessary: true, preferences, analytics, timestamp: Date.now() });
    setVisible(false);
    setShowPreferences(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6" data-testid="cookie-consent-banner">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" data-testid="text-cookie-title">
                  We value your privacy
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  We use localStorage to save your drafts and theme preference. Optional cookies help us understand how the tool is used.{" "}
                  <Link href="/cookies" className="underline">
                    Learn more
                  </Link>
                </p>

                {showPreferences && (
                  <div className="mt-4 space-y-3 rounded-md border p-3" data-testid="cookie-preferences-panel">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-xs font-medium">Necessary</Label>
                        <p className="text-xs text-muted-foreground">Required for the app to function (drafts, theme).</p>
                      </div>
                      <Switch checked disabled data-testid="switch-consent-necessary" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-xs font-medium">Preferences</Label>
                        <p className="text-xs text-muted-foreground">Remember your tool settings between sessions.</p>
                      </div>
                      <Switch checked={preferences} onCheckedChange={setPreferences} data-testid="switch-consent-preferences" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-xs font-medium">Analytics</Label>
                        <p className="text-xs text-muted-foreground">Help us improve by sharing anonymous usage data.</p>
                      </div>
                      <Switch checked={analytics} onCheckedChange={setAnalytics} data-testid="switch-consent-analytics" />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={handleAcceptAll} data-testid="button-accept-all">
                    Accept all
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRejectOptional} data-testid="button-reject-optional">
                    Reject optional
                  </Button>
                  {!showPreferences ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPreferences(true)}
                      data-testid="button-manage-preferences"
                    >
                      Manage preferences
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSavePreferences}
                      data-testid="button-save-preferences"
                    >
                      Save preferences
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
