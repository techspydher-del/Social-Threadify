import { useState, useCallback, useEffect, useRef } from "react";

const MAX_HISTORY = 100;

export interface GeneratorState {
  content: string;
  presetHashtags: string;
  numberingEnabled: boolean;
  appendHashtags: boolean;
  generatedPosts: string[];
}

export function useHistory(initial: GeneratorState) {
  const [past, setPast] = useState<GeneratorState[]>([]);
  const [present, setPresent] = useState<GeneratorState>(initial);
  const [future, setFuture] = useState<GeneratorState[]>([]);
  const isInitRef = useRef(false);

  useEffect(() => {
    if (!isInitRef.current) {
      setPresent(initial);
      setPast([]);
      setFuture([]);
      isInitRef.current = true;
    }
  }, [initial]);

  const pushState = useCallback(
    (newState: GeneratorState) => {
      setPast((prev) => {
        const updated = [...prev, present];
        return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
      });
      setPresent(newState);
      setFuture([]);
    },
    [present]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [present, ...prev]);
    setPresent(previous);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setPast((prev) => {
      const updated = [...prev, present];
      return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
    });
    setPresent(next);
  }, [future, present]);

  const reset = useCallback((state: GeneratorState) => {
    setPresent(state);
    setPast([]);
    setFuture([]);
    isInitRef.current = true;
  }, []);

  return {
    state: present,
    pushState,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
