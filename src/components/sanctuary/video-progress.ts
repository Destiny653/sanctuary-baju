/** Map either scroll direction to a safe, seekable video frame. */
export function videoTimeForProgress(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const bounded = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return bounded * Math.max(0, duration - 1 / 24);
}