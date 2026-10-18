import type { Instrument } from "./data";

export type Session = "US Open" | "Midday" | "Power Hour";
export type FlowLevel = {
  price: number;
  bid: number;
  ask: number;
  resting: number;
};
export type FlowFrame = {
  index: number;
  time: string;
  levels: FlowLevel[];
  delta: number;
  cumulative: number;
  volume: number;
  midRow: number;
};

/** A single deterministic tape feeds the profile, delta, and liquidity views. */
export function createOrderFlowTape(
  instrument: Instrument,
  session: Session,
): FlowFrame[] {
  const seed =
    (session === "US Open" ? 1 : session === "Midday" ? 13 : 29) +
    instrument.symbol.charCodeAt(0);
  const start = session === "US Open" ? 570 : session === "Midday" ? 720 : 870;
  let cumulative = 0;
  return Array.from({ length: 48 }, (_, index) => {
    const midRow = 6 + Math.round(Math.sin(index * 0.24 + seed) * 3);
    const levels = Array.from({ length: 13 }, (_, row) => {
      const activity = Math.exp(-((row - midRow) ** 2) / 11);
      const bid = Math.round(
        3 + activity * (25 + ((index * 17 + row * 13 + seed * 7) % 95)),
      );
      const ask = Math.round(
        3 + activity * (25 + ((index * 11 + row * 23 + seed * 19) % 100)),
      );
      const shelf =
        row === 3 || row === 10 ? 180 + ((index * 13 + seed * 11) % 180) : 0;
      return {
        price: Number(
          (instrument.price + (6 - row) * instrument.tick).toFixed(4),
        ),
        bid,
        ask,
        resting: Math.round(
          8 + activity * 70 + ((index * 31 + row * 17 + seed) % 70) + shelf,
        ),
      };
    });
    const bid = levels.reduce((sum, level) => sum + level.bid, 0);
    const ask = levels.reduce((sum, level) => sum + level.ask, 0);
    const delta = ask - bid;
    cumulative += delta;
    const minutes = start + index * 2;
    return {
      index,
      time: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
      levels,
      delta,
      cumulative,
      volume: bid + ask,
      midRow,
    };
  });
}
