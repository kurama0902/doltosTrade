export type Instrument = {
  name: string;
  symbol: string;
  glyph: string;
  color: string;
  price: number;
  change: number;
  tick: number;
};
export const instruments: Instrument[] = [
  {
    name: "E-mini S&P 500",
    symbol: "ES",
    glyph: "ES",
    color: "#6267db",
    price: 5842.25,
    change: 0.64,
    tick: 0.25,
  },
  {
    name: "E-mini Nasdaq-100",
    symbol: "NQ",
    glyph: "NQ",
    color: "#886bc6",
    price: 20416.5,
    change: 0.92,
    tick: 0.25,
  },
  {
    name: "Crude Oil",
    symbol: "CL",
    glyph: "CL",
    color: "#428d97",
    price: 71.84,
    change: 0.38,
    tick: 0.01,
  },
  {
    name: "Gold",
    symbol: "GC",
    glyph: "GC",
    color: "#b59a55",
    price: 2694.6,
    change: 0.27,
    tick: 0.1,
  },
];
export const money = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: n < 2 ? 4 : 2,
    maximumFractionDigits: n < 2 ? 4 : 2,
  });
export function sparkData(seed = 1, down = false) {
  return Array.from({ length: 32 }, (_, i) => ({
    time: i,
    value:
      35 +
      Math.sin(i * 0.7 + seed) * 7 +
      Math.cos(i * 1.9) * 4 +
      i * (down ? -0.35 : 0.8),
  }));
}
export function candleData(seed = 1, base = 5842.25) {
  return Array.from({ length: 44 }, (_, i) => {
    const open =
      base *
      (0.958 +
        i * 0.00082 +
        Math.sin(i * 0.63 + seed) * 0.004 +
        Math.sin(i * 1.7) * 0.002);
    const close = open + Math.sin(i * 2.3 + seed) * base * 0.003;
    return {
      time: `${String(9 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
      open,
      close,
      low: Math.min(open, close) - base * 0.001,
      high: Math.max(open, close) + base * 0.0015,
      range: [Math.min(open, close), Math.max(open, close)],
      volume: 12 + Math.abs(Math.sin(i * 1.7)) * 40,
    };
  });
}
