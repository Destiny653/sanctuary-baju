"use client";

import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import {
  applyDisplayFont,
  DEFAULT_DISPLAY_FONT,
  displayFontQuery,
  readLocalDisplayFont,
} from "./site-settings";

/** Keeps `data-display-font` on <html> in sync with site settings / local cache. */
export function DisplayFontSync() {
  const { data } = useQuery(displayFontQuery);

  useLayoutEffect(() => {
    applyDisplayFont(readLocalDisplayFont() ?? DEFAULT_DISPLAY_FONT);
  }, []);

  useLayoutEffect(() => {
    if (data) applyDisplayFont(data);
  }, [data]);

  return null;
}
