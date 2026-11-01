const SHARDS = [
  { t: "8%", l: "-6%", w: "18vw", h: "46px", r: -28, dx: "24px", dy: "-36px", dur: "16s", delay: "-2s", o: 0.42, front: false, soft: false },
  { t: "18%", l: "72%", w: "16vw", h: "28px", r: 18, dx: "-30px", dy: "20px", dur: "19s", delay: "-6s", o: 0.55, front: true, soft: false },
  { t: "62%", l: "-8%", w: "26vw", h: "54px", r: -18, dx: "40px", dy: "-16px", dur: "22s", delay: "-4s", o: 0.28, front: false, soft: true },
  { t: "74%", l: "78%", w: "20vw", h: "36px", r: 24, dx: "-18px", dy: "-28px", dur: "17s", delay: "-9s", o: 0.4, front: true, soft: false },
  { t: "30%", l: "86%", w: "11vw", h: "22px", r: -12, dx: "-22px", dy: "26px", dur: "14s", delay: "-1s", o: 0.5, front: true, soft: false },
  { t: "46%", l: "6%", w: "9vw", h: "18px", r: 32, dx: "16px", dy: "30px", dur: "13s", delay: "-7s", o: 0.35, front: true, soft: false },
  { t: "4%", l: "42%", w: "14vw", h: "20px", r: -8, dx: "10px", dy: "18px", dur: "21s", delay: "-3s", o: 0.22, front: false, soft: false },
  { t: "84%", l: "28%", w: "12vw", h: "16px", r: 14, dx: "-14px", dy: "-22px", dur: "15s", delay: "-5s", o: 0.33, front: true, soft: false },
  { t: "22%", l: "18%", w: "7vw", h: "14px", r: -40, dx: "12px", dy: "-14px", dur: "12s", delay: "-8s", o: 0.48, front: false, soft: false },
  { t: "54%", l: "64%", w: "24vw", h: "40px", r: 8, dx: "20px", dy: "12px", dur: "24s", delay: "-11s", o: 0.16, front: false, soft: true },
  { t: "38%", l: "-2%", w: "8vw", h: "64px", r: 72, dx: "18px", dy: "-20px", dur: "18s", delay: "-2s", o: 0.3, front: false, soft: false },
  { t: "12%", l: "58%", w: "6vw", h: "48px", r: -64, dx: "-12px", dy: "16px", dur: "15s", delay: "-10s", o: 0.38, front: true, soft: false },
];

export function Shards({ burst = false }: { burst?: boolean }) {
  return (
    <div className={burst ? "shard-field is-burst" : "shard-field"} aria-hidden="true">
      {SHARDS.map((shard, i) => (
        <span
          key={i}
          className={
            "shard" +
            (shard.front ? " is-front" : "") +
            (shard.soft ? " is-soft" : "") +
            (i % 4 === 1 ? " is-gold" : "")
          }
          style={{
            top: shard.t,
            left: shard.l,
            width: shard.w,
            height: shard.h,
            ["--r" as string]: `${shard.r}deg`,
            ["--dx" as string]: shard.dx,
            ["--dy" as string]: shard.dy,
            ["--dur" as string]: shard.dur,
            ["--delay" as string]: shard.delay,
            ["--o" as string]: shard.o,
          }}
        />
      ))}
    </div>
  );
}

const PETALS = [
  { l: "6%", w: "11px", h: "16px", dur: "13s", delay: "-1s", dx: "40px" },
  { l: "18%", w: "8px", h: "12px", dur: "16s", delay: "-6s", dx: "-24px" },
  { l: "31%", w: "13px", h: "18px", dur: "18s", delay: "-3s", dx: "18px" },
  { l: "44%", w: "7px", h: "11px", dur: "12s", delay: "-8s", dx: "-36px" },
  { l: "57%", w: "12px", h: "15px", dur: "15s", delay: "-2s", dx: "28px" },
  { l: "69%", w: "9px", h: "13px", dur: "17s", delay: "-10s", dx: "-12px" },
  { l: "78%", w: "14px", h: "18px", dur: "14s", delay: "-4s", dx: "22px" },
  { l: "88%", w: "8px", h: "12px", dur: "19s", delay: "-7s", dx: "-30px" },
  { l: "24%", w: "6px", h: "10px", dur: "11s", delay: "-5s", dx: "16px" },
  { l: "51%", w: "10px", h: "14px", dur: "20s", delay: "-12s", dx: "-20px" },
];

export function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((petal, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: petal.l,
            width: petal.w,
            height: petal.h,
            ["--dur" as string]: petal.dur,
            ["--delay" as string]: petal.delay,
            ["--dx" as string]: petal.dx,
          }}
        />
      ))}
    </div>
  );
}
