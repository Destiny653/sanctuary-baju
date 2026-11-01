import { art } from "./art";

const STARS = Array.from({ length: 12 }, (_, i) => i);

/**
 * Mary cut-out with a turning gold ring and a crown of twelve stars behind her head.
 * The ring is positioned in percentages of the image box, so it follows the figure at any size.
 */
export function MaryFigure({ className = "", alt }: { className?: string; alt: string }) {
  return (
    <div className={"mary " + className}>
      <div className="mary-float">
        <div className="nimbus" aria-hidden="true">
          <span className="nimbus-glow" />
          <span className="nimbus-ring" />
          <span className="nimbus-ring is-thin" />
          <span className="nimbus-stars">
            {STARS.map((i) => (
              <i key={i} style={{ ["--a" as string]: `${i * 30}deg` }} />
            ))}
          </span>
        </div>
        <img className="mary-img" src={art.mary} alt={alt} width={1152} height={1728} />
      </div>
    </div>
  );
}
