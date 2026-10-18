import { useId, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { candleData, instruments, money, sparkData } from "../data";
import { Icon } from "./Icons";
export function Sparkline({
  seed = 1,
  down = false,
}: {
  seed?: number;
  down?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const color = down ? "#ef727f" : "#7478ff";
  return (
    <ResponsiveContainer width="100%" height={65}>
      <AreaChart
        data={sparkData(seed, down)}
        margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          stroke={color}
          strokeWidth={1.7}
          fill={`url(#${id})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
// Recharts custom candle shape preserves chart tooltips and responsive coordinates.
function Candle(props: unknown) {
  const p = props as {
    x: number;
    y: number;
    width: number;
    height: number;
    payload: { open: number; close: number; low: number; high: number };
  };
  const green = p.payload.close >= p.payload.open;
  const color = green ? "#43c9a0" : "#f27583";
  return (
    <g>
      <line
        x1={p.x + p.width / 2}
        x2={p.x + p.width / 2}
        y1={p.y - 5}
        y2={p.y + Math.max(p.height, 2) + 5}
        stroke={color}
      />
      <rect
        x={p.x + 1}
        y={p.y}
        width={Math.max(p.width - 2, 2)}
        height={Math.max(p.height, 2)}
        fill={color}
        rx={0.7}
      />
    </g>
  );
}
export function TradingTerminal({ large = false }: { large?: boolean }) {
  const [symbol, setSymbol] = useState("ES");
  const [period, setPeriod] = useState("1H");
  const [kind, setKind] = useState<"Footprint" | "Candles" | "Area">(
    "Footprint",
  );
  const coin = instruments.find((c) => c.symbol === symbol)!;
  const data = useMemo(
    () =>
      candleData(
        period === "15M" ? 9 : period === "1H" ? 1 : period === "4H" ? 3 : 7,
        coin.price,
      ),
    [period, coin.price],
  );
  return (
    <div className={`terminal ${large ? "terminal-large" : ""}`}>
      <div className="terminal-top">
        <span className="terminal-mark">
          <span className="tiny-planet">≋</span> ExecordusTrade
        </span>
        <span className="terminal-demo">
          <i /> Simulated futures data
        </span>
        <span className="terminal-dots">•••</span>
      </div>
      <div className="terminal-content">
        <div className="terminal-chart">
          <div className="pair-row">
            <div className="pair">
              <span
                className="coin-icon small"
                style={{ background: coin.color }}
              >
                {coin.glyph}
              </span>
              <select
                aria-label="Futures contract"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                {instruments.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.symbol} · {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="pair-price">
              {money(coin.price)}{" "}
              <span className="positive">+{coin.change}%</span>
            </div>
          </div>
          <div className="chart-options">
            <div>
              {["15M", "1H", "4H", "1D"].map((p) => (
                <button
                  key={p}
                  className={period === p ? "selected" : ""}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="chart-kind"
              onClick={() =>
                setKind(
                  kind === "Footprint"
                    ? "Candles"
                    : kind === "Candles"
                      ? "Area"
                      : "Footprint",
                )
              }
              aria-label="Toggle chart type"
            >
              <Icon name="chart" size={13} />
              {kind}
            </button>
          </div>
          <div className="main-chart">
            {kind === "Footprint" ? (
              <Footprint
                seed={
                  period === "15M"
                    ? 9
                    : period === "1H"
                      ? 1
                      : period === "4H"
                        ? 3
                        : 7
                }
                price={coin.price}
                tick={coin.tick}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 15, right: 5, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={large ? "large-area" : "hero-area"}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6267ff" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6267ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 8, fill: "#737783" }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={50}
                  />
                  <YAxis
                    domain={[
                      "dataMin - dataMin * 0.002",
                      "dataMax + dataMax * 0.002",
                    ]}
                    orientation="right"
                    tick={{ fontSize: 8, fill: "#737783" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(n) =>
                      n < 2
                        ? n.toFixed(3)
                        : n.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#191c29",
                      border: "1px solid #33384c",
                      borderRadius: 8,
                      fontSize: 10,
                    }}
                    formatter={(value) =>
                      typeof value === "number" ? money(value) : String(value)
                    }
                  />
                  {kind === "Candles" ? (
                    <Bar
                      dataKey="range"
                      shape={<Candle />}
                      isAnimationActive={false}
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke="#8588ff"
                      fill={`url(#${large ? "large-area" : "hero-area"})`}
                      isAnimationActive={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="volume-bars" aria-hidden="true">
            {data.map((d, i) => (
              <i
                key={i}
                style={{
                  height: `${d.volume}%`,
                  background: d.close > d.open ? "#43c9a040" : "#f2758340",
                }}
              />
            ))}
          </div>
          <div className="chart-bottom">
            <span>
              <i /> Order-flow workspace
            </span>
            <span>UTC +00:00</span>
          </div>
        </div>
        <div className="orderbook">
          <div className="orderbook-title">
            DeepDOM <Icon name="chevron" size={12} />
          </div>
          <div className="orderbook-label">
            <span>Price (USD)</span>
            <span>Size (ct)</span>
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="order-row sell"
              key={i}
              style={
                { "--depth": `${23 + ((i * 17) % 70)}%` } as React.CSSProperties
              }
            >
              <span>{money(coin.price + (6 - i) * coin.tick)}</span>
              <span>{12 + i * 17}</span>
            </div>
          ))}
          <div className="order-current positive">{money(coin.price)} ↑</div>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="order-row buy"
              key={i}
              style={
                { "--depth": `${34 + ((i * 21) % 60)}%` } as React.CSSProperties
              }
            >
              <span>{money(coin.price - i * coin.tick)}</span>
              <span>{21 + i * 13}</span>
            </div>
          ))}
          <div className="book-ratio">
            <span>Buy 62%</span>
            <span>38% Sell</span>
          </div>
          <div className="ratio-bar">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Deterministic bid/ask volume clusters for the simulated futures preview. */
function Footprint({
  seed,
  price,
  tick,
}: {
  seed: number;
  price: number;
  tick: number;
}) {
  return (
    <div
      className="footprint-view"
      aria-label="Simulated bid and ask volume footprint"
    >
      <div className="footprint-axis">
        {Array.from({ length: 7 }, (_, row) => (
          <span key={row}>{money(price + (3 - row) * tick)}</span>
        ))}
      </div>
      <div className="footprint-candles">
        {Array.from({ length: 6 }, (_, column) => (
          <div className="footprint-candle" key={column}>
            <div className="footprint-cluster">
              {Array.from({ length: 7 }, (_, row) => {
                const bid = 12 + ((column * 37 + row * 23 + seed * 11) % 180);
                const ask = 18 + ((column * 19 + row * 41 + seed * 7) % 210);
                return (
                  <div
                    className={`footprint-cell ${ask > bid * 1.5 ? "ask-imbalance" : bid > ask * 1.5 ? "bid-imbalance" : ""}`}
                    key={row}
                  >
                    <span>{bid}</span>
                    <i>×</i>
                    <span>{ask}</span>
                  </div>
                );
              })}
            </div>
            <span className={column % 3 === 0 ? "negative" : "positive"}>
              Δ {column % 3 === 0 ? "−" : "+"}
              {80 + column * 43}
            </span>
          </div>
        ))}
      </div>
      <div className="footprint-legend">
        <span>Bid × Ask</span>
        <span className="positive">Buy imbalance</span>
        <span className="negative">Sell imbalance</span>
      </div>
    </div>
  );
}
