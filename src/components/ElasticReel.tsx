"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import "./ElasticReel.css";

export type ElasticReelItem = {
  src: string;
  alt: string;
  title?: string | undefined;
  subtitle?: string | undefined;
  focus?: number | undefined;
};

export type ElasticReelHandle = {
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
};

export type ElasticReelProps = {
  items?: ElasticReelItem[];
  defaultOpen?: number;
  barWidth?: number;
  barHeight?: number;
  gap?: number;
  radius?: number;
  magnify?: number;
  lift?: number;
  influence?: number;
  align?: "center" | "bottom";
  openSize?: number;
  openAspect?: number;
  elasticity?: number;
  blur?: number;
  dim?: number;
  shadow?: number;
  rim?: number;
  autoplay?: "sweep" | "cycle" | "off";
  speed?: number;
  interval?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  captions?: boolean;
  labels?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  onOpen?: (item: ElasticReelItem, index: number) => void;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ITEMS: ElasticReelItem[] = [];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function springToward(current: number, target: number, elasticity: number) {
  const t = 1 - clamp(elasticity, 0, 0.9) * 0.72;
  return current + (target - current) * t;
}

export const ElasticReel = forwardRef<ElasticReelHandle, ElasticReelProps>(function ElasticReel(
  {
    items = DEFAULT_ITEMS,
    defaultOpen = -1,
    barWidth = 44,
    barHeight = 0.5,
    gap = 10,
    radius = 12,
    magnify = 2.4,
    lift = 1.15,
    influence = 200,
    align = "center",
    openSize = 0.72,
    openAspect = 1,
    elasticity = 0.35,
    blur = 0.5,
    dim = 0.45,
    shadow = 0.35,
    rim = 0.12,
    autoplay = "sweep",
    speed = 1.4,
    interval = 4,
    pauseOnHover = true,
    draggable = true,
    wheel = true,
    captions = true,
    labels = true,
    backgroundColor = "transparent",
    paused = false,
    ariaLabel = "Elastic reel of photographs. Hover or drag to magnify a slice; click to open.",
    onOpen,
    onClose,
    className = "",
    style,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(items.length ? (items.length - 1) / 2 : 0);
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const [hovering, setHovering] = useState(false);
  const [widths, setWidths] = useState<number[]>(() => items.map(() => barWidth));
  const focusRef = useRef(focus);
  const openRef = useRef(openIndex);
  const dragRef = useRef<{ active: boolean; startX: number; startFocus: number } | null>(null);
  focusRef.current = focus;
  openRef.current = openIndex;

  const count = items.length;

  const open = useCallback(
    (index: number) => {
      if (!count) return;
      const i = ((index % count) + count) % count;
      setOpenIndex(i);
      setFocus(i);
      const item = items[i];
      if (item) onOpen?.(item, i);
    },
    [count, items, onOpen],
  );

  const close = useCallback(() => {
    setOpenIndex(-1);
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    if (openRef.current < 0) open(Math.round(focusRef.current));
    else open(openRef.current + 1);
  }, [open]);

  const previous = useCallback(() => {
    if (openRef.current < 0) open(Math.round(focusRef.current));
    else open(openRef.current - 1);
  }, [open]);

  useImperativeHandle(ref, () => ({ open, close, next, previous }), [open, close, next, previous]);

  useEffect(() => {
    if (defaultOpen >= 0 && defaultOpen < count) setOpenIndex(defaultOpen);
  }, [defaultOpen, count]);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced || autoplay === "off" || !count || (pauseOnHover && hovering)) return;

    if (autoplay === "cycle") {
      const id = window.setInterval(() => {
        setOpenIndex((prev) => {
          const nextI = prev < 0 ? 0 : (prev + 1) % count;
          setFocus(nextI);
          const item = items[nextI];
          if (item) onOpen?.(item, nextI);
          return nextI;
        });
      }, Math.max(1.2, interval) * 1000);
      return () => window.clearInterval(id);
    }

    let raf = 0;
    let last = performance.now();
    let dir = 1;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setFocus((f) => {
        let n = f + dir * speed * dt;
        if (n >= count - 1) {
          n = count - 1;
          dir = -1;
        } else if (n <= 0) {
          n = 0;
          dir = 1;
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, speed, interval, paused, pauseOnHover, hovering, count, items, onOpen]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setWidths((prev) => {
        const nextW = items.map((_, i) => {
          const dist = Math.abs(i - focusRef.current);
          const falloff = Math.exp((-dist * dist * 400) / Math.max(40, influence * influence));
          const target = barWidth * (1 + (magnify - 1) * falloff);
          const current = prev[i] ?? barWidth;
          return springToward(current, target, elasticity);
        });
        return nextW;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [items, barWidth, magnify, influence, elasticity]);

  const labelIndex = clamp(Math.round(focus), 0, Math.max(0, count - 1));
  const openItem = openIndex >= 0 ? items[openIndex] : null;

  const onPointerMove = (clientX: number) => {
    const root = rootRef.current;
    if (!root || !count) return;
    const rect = root.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    setFocus((x / Math.max(1, rect.width)) * Math.max(1, count - 1));
  };

  const styleVars = useMemo(
    () =>
      ({
        "--er-gap": `${gap}px`,
        "--er-radius": `${radius}px`,
        "--er-bar-h": `${clamp(barHeight, 0.2, 1)}`,
        "--er-lift": String(lift),
        "--er-blur": String(blur),
        "--er-dim": String(dim),
        "--er-shadow": String(shadow),
        "--er-rim": String(rim),
        "--er-open-size": String(openSize),
        "--er-open-aspect": String(openAspect || 1),
        "--er-bg": backgroundColor,
        ...style,
      }) as CSSProperties,
    [gap, radius, barHeight, lift, blur, dim, shadow, rim, openSize, openAspect, backgroundColor, style],
  );

  if (!count) {
    return <div className={`elastic-reel ${className}`.trim()} style={styleVars} aria-label={ariaLabel} />;
  }

  return (
    <div
      ref={rootRef}
      className={["elastic-reel", openItem ? "is-open" : "", className].filter(Boolean).join(" ")}
      style={styleVars}
      data-align={align}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onPointerMove={(e) => {
        if (dragRef.current?.active) return;
        if (openIndex >= 0) return;
        onPointerMove(e.clientX);
      }}
      onPointerDown={(e) => {
        if (!draggable || e.button !== 0) return;
        dragRef.current = { active: true, startX: e.clientX, startFocus: focusRef.current };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        const drag = dragRef.current;
        if (!drag?.active) return;
        const dx = e.clientX - drag.startX;
        const moved = Math.abs(dx) > 8;
        dragRef.current = null;
        if (!moved || openIndex < 0) return;
        if (dx < -24) next();
        else if (dx > 24) previous();
      }}
      onPointerMoveCapture={(e) => {
        const drag = dragRef.current;
        if (!drag?.active) return;
        const root = rootRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const delta = ((e.clientX - drag.startX) / Math.max(1, rect.width)) * Math.max(1, count - 1);
        setFocus(clamp(drag.startFocus + delta, 0, count - 1));
      }}
      onWheel={(e) => {
        if (!wheel) return;
        e.preventDefault();
        if (openIndex >= 0) {
          if (e.deltaY > 0 || e.deltaX > 0) next();
          else previous();
          return;
        }
        setFocus((f) => clamp(f + Math.sign(e.deltaY || e.deltaX), 0, count - 1));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          previous();
        } else if (e.key === "Escape") {
          e.preventDefault();
          close();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (openIndex >= 0) close();
          else open(labelIndex);
        }
      }}
    >
      {openItem && (
        <div className="elastic-reel__stage" aria-live="polite">
          <button type="button" className="elastic-reel__open-photo" onClick={close} aria-label={openItem.alt}>
            <img src={openItem.src} alt={openItem.alt} draggable={false} />
          </button>
          {captions && (openItem.title || openItem.subtitle) && (
            <div className="elastic-reel__captions">
              {openItem.title && <p className="elastic-reel__title">{openItem.title}</p>}
              {openItem.subtitle && <p className="elastic-reel__subtitle">{openItem.subtitle}</p>}
            </div>
          )}
        </div>
      )}

      <div className="elastic-reel__dock" role="list">
        {items.map((item, i) => {
          const w = widths[i] ?? barWidth;
          const active = Math.abs(i - focus) < 0.55;
          const isOpen = i === openIndex;
          const focusY = clamp(item.focus ?? 0.5, 0, 1);
          return (
            <button
              key={`${item.src}-${i}`}
              type="button"
              role="listitem"
              className={[
                "elastic-reel__bar",
                active ? "is-active" : "",
                isOpen ? "is-open-bar" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                width: `${w}px`,
                borderRadius: `${Math.min(radius, w / 2)}px`,
              }}
              aria-label={item.title || item.alt}
              aria-pressed={isOpen}
              onClick={() => {
                if (openIndex === i) close();
                else open(i);
              }}
            >
              <span className="elastic-reel__slice">
                <img
                  src={item.src}
                  alt=""
                  draggable={false}
                  decoding="async"
                  style={{ objectPosition: `${focusY * 100}% center` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      {labels && items[labelIndex]?.title && openIndex < 0 && (
        <p className="elastic-reel__label">{items[labelIndex]?.title}</p>
      )}
    </div>
  );
});

export default ElasticReel;
