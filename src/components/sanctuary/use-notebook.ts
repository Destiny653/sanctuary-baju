import { useCallback, useEffect, useState } from "react";
import type { Intention, Visit } from "./data";

const KEY = "olm-notebook";

function isIntention(value: unknown): value is Intention {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["name"] === "string" &&
    typeof o["text"] === "string" &&
    typeof o["at"] === "number"
  );
}

function isVisit(value: unknown): value is Visit {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["name"] === "string" &&
    typeof o["day"] === "string" &&
    typeof o["party"] === "string" &&
    typeof o["note"] === "string" &&
    typeof o["at"] === "number"
  );
}

export function useNotebook() {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { intentions?: unknown; visits?: unknown };
        if (Array.isArray(parsed.intentions)) {
          setIntentions(parsed.intentions.filter(isIntention).slice(0, 40));
        }
        if (Array.isArray(parsed.visits)) {
          setVisits(parsed.visits.filter(isVisit).slice(0, 20));
        }
      }
    } catch {
      /* a damaged notebook simply starts empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ intentions, visits }));
  }, [intentions, visits, ready]);

  const addIntention = useCallback((name: string, text: string) => {
    const entry: Intention = {
      id: crypto.randomUUID(),
      name: name.trim(),
      text: text.trim(),
      at: Date.now(),
    };
    setIntentions((prev) => [entry, ...prev].slice(0, 40));
  }, []);

  const removeIntention = useCallback((id: string) => {
    setIntentions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addVisit = useCallback((visit: Omit<Visit, "id" | "at">) => {
    const entry: Visit = { ...visit, id: crypto.randomUUID(), at: Date.now() };
    setVisits((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  return { intentions, visits, ready, addIntention, removeIntention, addVisit };
}

export type Notebook = ReturnType<typeof useNotebook>;
