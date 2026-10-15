"use client";
const COLORS = ["#1B47F5", "#E8552B", "#13875B", "#8A3FFC", "#C77700", "#0B8FAF", "#D92D4B", "#5B6B99"];
export const colorFor = (i: number) => COLORS[((i % COLORS.length) + COLORS.length) % COLORS.length];
export const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
export function Avatar({ name, i, size = 32 }: { name: string; i: number; size?: number }) {
  return <span className="ott-av" aria-hidden style={{ width: size, height: size, fontSize: size * 0.4, background: colorFor(i) }}>{initials(name)}</span>;
}
export const dl = (name: string, text: string, type = "text/plain") => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "meeting";
