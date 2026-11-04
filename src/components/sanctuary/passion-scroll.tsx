import { useRef } from "react";
import { Tilt } from "./motion";
import { useHorizontalPin } from "./use-horizontal-pin";
import { useI18n } from "@/i18n";

const STATION_FILES = [
  "Station_01.png",
  "Station_02.png",
  "Station_03.png",
  "Station_04.png",
  "Station_05.png",
  "Station_06a.png",
  "Station_07.png",
  "Station_08.png",
  "Station_09.png",
  "Station_10.png",
  "Station_11.png",
  "Station_12.png",
  "Station_13.png",
  "Station_14.png",
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];

/** Calvary stations — pinned vertical→horizontal scrub on desktop and mobile. */
export function PassionScroll() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useHorizontalPin(section, track);
  const stations = STATION_FILES.map((file, i) => ({
    src: `/assets/stations-cross/${file}`,
    n: ROMAN[i]!,
    title: t.calvary.stations[i] ?? "",
  }));
  return (
    <section className="passion-pin band-snow" id="passion" ref={section}>
      <div className="passion-pin-fill" aria-hidden="true" />
      <div className="passion-track" ref={track}>
        <div className="passion-intro">
          <p className="kicker">{t.home.passionKicker}</p>
          <h2 className="display-xl">{t.home.passionTitle}</h2>
          <p className="serif-lead">{t.home.passionLead}</p>
        </div>
        {stations.map((p) => (
          <Tilt key={p.src} className="passion-card">
            <img src={p.src} alt={p.title} loading="lazy" />
            <div className="passion-card-cap">
              <span>{p.n}</span>
              <h3>{p.title}</h3>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
