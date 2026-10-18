import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { instruments, money } from "../data";
import type { Instrument } from "../data";
import { createOrderFlowTape } from "../orderFlowData";
import type { FlowFrame, Session } from "../orderFlowData";
import { Icon } from "./Icons";

const tooltipStyle = {
  background: "#171c2c",
  border: "1px solid #454c72",
  borderRadius: 8,
  fontSize: 11,
  color: "#e1e5f5",
};
const tickStyle = { fill: "#78849e", fontSize: 9 };
const signed = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toLocaleString("en-US")}`;

/** Three linked views of the same simulated session, with user-controlled replay. */
export function OrderFlowLab() {
  const [symbol, setSymbol] = useState("ES");
  const [session, setSession] = useState<Session>("US Open");
  const instrument = instruments.find((item) => item.symbol === symbol)!;
  return (
    <section
      className="orderflow-lab"
      aria-labelledby="analysis-heading"
      id="analytics"
    >
      <div className="section-heading reveal">
        <div>
          <div className="eyebrow">GET HANDS-ON WITH THE DATA</div>
          <h2 id="analysis-heading">
            One session.
            <br />
            <span className="muted">Three ways to read it.</span>
          </h2>
        </div>
        <p className="section-description">
          Explore volume, follow delta, and inspect liquidity.
          <br />
          Scrub the replay to see every view move together.
        </p>
      </div>
      <div className="lab-controls">
        <div className="lab-status">
          <span className="status-dot" /> INTERACTIVE MARKET LAB{" "}
          <span>Simulated data</span>
        </div>
        <div className="lab-selects">
          <label>
            Contract
            <select
              aria-label="Analysis contract"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
            >
              {instruments.map((item) => (
                <option value={item.symbol} key={item.symbol}>
                  {item.symbol} · {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Session
            <select
              aria-label="Analysis session"
              value={session}
              onChange={(event) => setSession(event.target.value as Session)}
            >
              {["US Open", "Midday", "Power Hour"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <ReplayWorkspace
        key={`${symbol}-${session}`}
        instrument={instrument}
        session={session}
      />
    </section>
  );
}

function ReplayWorkspace({
  instrument,
  session,
}: {
  instrument: Instrument;
  session: Session;
}) {
  const tape = useMemo(
    () => createOrderFlowTape(instrument, session),
    [instrument, session],
  );
  const [cursor, setCursor] = useState(32);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const workspace = useRef<HTMLDivElement>(null);
  const frames = useMemo(() => tape.slice(0, cursor), [tape, cursor]);
  const current = frames[frames.length - 1];
  const volume = frames.reduce((sum, frame) => sum + frame.volume, 0);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setCursor((value) => Math.min(value + 1, tape.length)),
      800 / speed,
    );
    return () => window.clearInterval(timer);
  }, [playing, speed, tape.length]);
  useEffect(() => {
    if (cursor === tape.length) setPlaying(false);
  }, [cursor, tape.length]);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) setPlaying(false);
    });
    if (workspace.current) observer.observe(workspace.current);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return (
    <div ref={workspace} className="replay-workspace">
      <div className="replay-toolbar">
        <div className="replay-buttons">
          <button
            className="replay-play"
            onClick={() => {
              if (cursor === tape.length) setCursor(1);
              setPlaying((value) => !value);
            }}
            aria-label={playing ? "Pause replay" : "Play replay"}
          >
            {playing ? (
              <span aria-hidden="true">Ⅱ</span>
            ) : (
              <Icon name="play" size={14} />
            )}{" "}
            {playing ? "Pause" : "Replay"}
          </button>
          <button
            className="replay-step"
            aria-label="Step replay forward"
            disabled={cursor === tape.length}
            onClick={() => {
              setPlaying(false);
              setCursor((value) => Math.min(value + 1, tape.length));
            }}
          >
            <Icon name="arrow" size={16} />
          </button>
          <button
            className="replay-reset"
            onClick={() => {
              setPlaying(false);
              setCursor(1);
            }}
          >
            Reset
          </button>
        </div>
        <label className="replay-timeline">
          <span className="sr-only">Replay position</span>
          <input
            aria-label="Replay position"
            type="range"
            min={1}
            max={tape.length}
            value={cursor}
            onChange={(event) => {
              setPlaying(false);
              setCursor(Number(event.target.value));
            }}
          />
        </label>
        <output className="replay-position">
          {String(cursor).padStart(2, "0")} / {tape.length}
        </output>
        <select
          aria-label="Replay speed"
          className="replay-speed"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        >
          {[1, 2, 4].map((value) => (
            <option key={value} value={value}>
              {value}×
            </option>
          ))}
        </select>
      </div>
      <div className="lab-metrics">
        <div>
          <span>REPLAY TIME · ET</span>
          <strong>{current.time}</strong>
        </div>
        <div>
          <span>TRADED VOLUME</span>
          <strong>
            {volume.toLocaleString("en-US")} <small>ct</small>
          </strong>
        </div>
        <div>
          <span>CUMULATIVE DELTA</span>
          <strong className={current.cumulative >= 0 ? "positive" : "negative"}>
            {signed(current.cumulative)}
          </strong>
        </div>
        <div>
          <span>CONTRACT</span>
          <strong>
            {instrument.symbol} <small>{session}</small>
          </strong>
        </div>
      </div>
      <div className="analysis-grid">
        <ProfileChart frames={frames} />
        <DeltaChart frames={frames} />
        <LiquidityChart frames={frames} />
      </div>
      <p className="lab-disclosure">
        All charts use the same illustrative session. Replay controls historical
        samples; this is not a live market feed.
      </p>
    </div>
  );
}

function ProfileChart({ frames }: { frames: FlowFrame[] }) {
  const [mode, setMode] = useState<"Volume" | "Delta">("Volume");
  const [selected, setSelected] = useState(6);
  const levels = useMemo(
    () =>
      frames[0].levels.map((level, index) => {
        const bid = frames.reduce(
          (sum, frame) => sum + frame.levels[index].bid,
          0,
        );
        const ask = frames.reduce(
          (sum, frame) => sum + frame.levels[index].ask,
          0,
        );
        return {
          price: money(level.price),
          bid,
          ask,
          delta: ask - bid,
          volume: bid + ask,
        };
      }),
    [frames],
  );
  const poc = levels.reduce(
    (best, level) => (level.volume > best.volume ? level : best),
    levels[0],
  );
  const level = levels[selected];
  return (
    <article className="analysis-card profile-card">
      <div className="analysis-card-heading">
        <div>
          <span className="chart-eyebrow">PARTICIPATION AT EVERY PRICE</span>
          <h3>Volume & Delta Profile</h3>
        </div>
        <Icon name="chart" size={20} />
      </div>
      <div className="chart-card-toolbar">
        <div className="chart-segment" aria-label="Profile mode">
          {(["Volume", "Delta"] as const).map((item) => (
            <button
              aria-pressed={mode === item}
              key={item}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="poc-label">
          POC <strong>{poc.price}</strong>
        </span>
      </div>
      <div className="analysis-chart" aria-label={`${mode} profile chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={levels}
            layout="vertical"
            margin={{ top: 4, right: 15, left: 0, bottom: 4 }}
            barCategoryGap="22%"
          >
            <CartesianGrid stroke="#ffffff08" horizontal={false} />
            <XAxis
              type="number"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                Math.abs(value) >= 1000
                  ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
                  : value
              }
            />
            <YAxis
              type="category"
              dataKey="price"
              tick={tickStyle}
              width={64}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#8b8fff0b" }}
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#bcc3df" }}
              formatter={(value) =>
                `${Number(value).toLocaleString("en-US")} ct`
              }
            />
            {mode === "Volume" ? (
              <>
                <Bar
                  dataKey="bid"
                  stackId="volume"
                  name="Aggressive sells"
                  fill="#d57b99"
                  isAnimationActive={false}
                  onClick={(_, index) => setSelected(index)}
                >
                  {levels.map((_, index) => (
                    <Cell key={index} opacity={selected === index ? 1 : 0.55} />
                  ))}
                </Bar>
                <Bar
                  dataKey="ask"
                  stackId="volume"
                  name="Aggressive buys"
                  fill="#7479ee"
                  radius={[0, 3, 3, 0]}
                  isAnimationActive={false}
                  onClick={(_, index) => setSelected(index)}
                >
                  {levels.map((_, index) => (
                    <Cell key={index} opacity={selected === index ? 1 : 0.6} />
                  ))}
                </Bar>
              </>
            ) : (
              <>
                <ReferenceLine x={0} stroke="#67708d" />
                <Bar
                  dataKey="delta"
                  name="Delta"
                  isAnimationActive={false}
                  onClick={(_, index) => setSelected(index)}
                >
                  {levels.map((item, index) => (
                    <Cell
                      key={index}
                      fill={item.delta >= 0 ? "#53cfa7" : "#e27c93"}
                      opacity={selected === index ? 1 : 0.65}
                    />
                  ))}
                </Bar>
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="profile-inspector">
        <label>
          Inspect price
          <select
            aria-label="Inspect profile price"
            value={selected}
            onChange={(event) => setSelected(Number(event.target.value))}
          >
            {levels.map((item, index) => (
              <option value={index} key={item.price}>
                {item.price}
              </option>
            ))}
          </select>
        </label>
        <output>
          <span>Buy {level.ask.toLocaleString("en-US")}</span>
          <span>Sell {level.bid.toLocaleString("en-US")}</span>
          <strong className={level.delta >= 0 ? "positive" : "negative"}>
            Δ {signed(level.delta)}
          </strong>
        </output>
      </div>
      <p className="chart-help">
        Click a bar to inspect a level. POC marks the highest traded volume.
      </p>
    </article>
  );
}

function DeltaChart({ frames }: { frames: FlowFrame[] }) {
  const [windowSize, setWindowSize] = useState(24);
  const [bars, setBars] = useState(true);
  const [line, setLine] = useState(true);
  const [inspect, setInspect] = useState<number | null>(null);
  const visible = frames.slice(-windowSize);
  const selected =
    visible.find((frame) => frame.index === inspect) ||
    visible[visible.length - 1];
  return (
    <article className="analysis-card delta-card">
      <div className="analysis-card-heading">
        <div>
          <span className="chart-eyebrow">FOLLOW THE AGGRESSOR</span>
          <h3>Order Flow Delta</h3>
        </div>
        <Icon name="bolt" size={20} />
      </div>
      <div className="chart-card-toolbar">
        <div className="delta-legend">
          <button
            aria-label="Show per-bar delta"
            aria-pressed={bars}
            disabled={bars && !line}
            onClick={() => setBars((value) => !value)}
          >
            <i />
            Bar delta
          </button>
          <button
            aria-label="Show cumulative delta"
            aria-pressed={line}
            disabled={line && !bars}
            onClick={() => setLine((value) => !value)}
          >
            <i />
            Cumulative
          </button>
        </div>
        <select
          aria-label="Delta chart window"
          value={windowSize}
          onChange={(event) => setWindowSize(Number(event.target.value))}
        >
          {[12, 24, 48].map((value) => (
            <option key={value} value={value}>
              {value} bars
            </option>
          ))}
        </select>
      </div>
      <div
        className="analysis-chart"
        aria-label="Cumulative and per-bar delta chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={visible}
            margin={{ top: 10, right: 0, left: -18, bottom: 4 }}
          >
            <CartesianGrid stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="time"
              tick={tickStyle}
              minTickGap={32}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="delta"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <YAxis
              yAxisId="cumulative"
              orientation="right"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <ReferenceLine yAxisId="delta" y={0} stroke="#60698670" />
            <ReferenceLine
              yAxisId="delta"
              x={selected.time}
              stroke="#8f93ff60"
              strokeDasharray="3 4"
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#bcc3df" }}
              formatter={(value) => `${signed(Number(value))} ct`}
            />
            {bars && (
              <Bar
                yAxisId="delta"
                dataKey="delta"
                name="Per-bar delta"
                isAnimationActive={false}
                radius={[2, 2, 0, 0]}
              >
                {visible.map((frame) => (
                  <Cell
                    key={frame.index}
                    fill={frame.delta >= 0 ? "#53cfa7" : "#e27c93"}
                    opacity={selected.index === frame.index ? 1 : 0.65}
                  />
                ))}
              </Bar>
            )}
            {line && (
              <Line
                yAxisId="cumulative"
                type="monotone"
                dataKey="cumulative"
                name="Cumulative delta"
                stroke="#a4a7ff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="delta-inspector">
        <label>
          Inspect bar
          <select
            aria-label="Inspect delta bar"
            value={selected.index}
            onChange={(event) => setInspect(Number(event.target.value))}
          >
            {visible.map((frame) => (
              <option key={frame.index} value={frame.index}>
                {frame.time} ET
              </option>
            ))}
          </select>
        </label>
        <output>
          <span>
            Bar{" "}
            <strong className={selected.delta >= 0 ? "positive" : "negative"}>
              {signed(selected.delta)}
            </strong>
          </span>
          <span>
            Total <strong>{signed(selected.cumulative)}</strong>
          </span>
        </output>
      </div>
      <p className="chart-help">
        Hover for details. Toggle series or change the window to explore the
        session.
      </p>
    </article>
  );
}

function LiquidityChart({ frames }: { frames: FlowFrame[] }) {
  const [threshold, setThreshold] = useState(0);
  const [inspect, setInspect] = useState<{ row: number; frame: number } | null>(
    null,
  );
  const grid = useRef<HTMLDivElement>(null);
  const visible = frames.slice(-24);
  const currentIndex = visible[visible.length - 1].index;
  const row = inspect?.row ?? 6;
  const frameIndex = Math.max(
    visible[0].index,
    Math.min(inspect?.frame ?? currentIndex, currentIndex),
  );
  const selected = frames[frameIndex];
  const level = selected.levels[row];
  const path = visible
    .map(
      (frame, index) =>
        `${index === 0 ? "M" : "L"} ${(index + 0.5) * 20} ${(frame.midRow + 0.5) * 19}`,
    )
    .join(" ");
  const navigate = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentRow: number,
    currentFrame: number,
  ) => {
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    const nextRow = Math.max(
      0,
      Math.min(
        12,
        currentRow +
          (event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0),
      ),
    );
    const nextFrame = Math.max(
      visible[0].index,
      Math.min(
        currentIndex,
        currentFrame +
          (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0),
      ),
    );
    setInspect({ row: nextRow, frame: nextFrame });
    grid.current
      ?.querySelector<HTMLButtonElement>(
        `[data-position="${nextRow}-${nextFrame}"]`,
      )
      ?.focus();
  };
  return (
    <article className="analysis-card liquidity-card">
      <div className="analysis-card-heading">
        <div>
          <span className="chart-eyebrow">SEE WHERE LIQUIDITY RESTS</span>
          <h3>DeepDOM Liquidity Heatmap</h3>
        </div>
        <div className="heatmap-scale">
          <span>Lower</span>
          <i />
          <span>Higher</span>
        </div>
      </div>
      <div className="liquidity-toolbar">
        <p>
          Resting contracts across price and time{" "}
          <span>— white line: sample traded price</span>
        </p>
        <label>
          Minimum size{" "}
          <input
            aria-label="Minimum liquidity size"
            type="range"
            min={0}
            max={400}
            step={25}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
          />
          <output>{threshold} ct</output>
        </label>
      </div>
      <div className="heatmap-layout">
        <div className="heatmap-prices">
          {frames[0].levels.map((item) => (
            <span key={item.price}>{money(item.price)}</span>
          ))}
        </div>
        <div className="heatmap-data">
          <div
            className="liquidity-grid"
            ref={grid}
            role="grid"
            aria-label="Liquidity by price and time"
            aria-rowcount={13}
            aria-colcount={visible.length}
          >
            {frames[0].levels.map((_, rowIndex) => (
              <div
                className="liquidity-grid-row"
                role="row"
                key={rowIndex}
                style={{
                  gridTemplateColumns: `repeat(${visible.length},minmax(0,1fr))`,
                }}
              >
                {visible.map((frame) => {
                  const size = frame.levels[rowIndex].resting;
                  const active = row === rowIndex && frameIndex === frame.index;
                  return (
                    <button
                      role="gridcell"
                      key={frame.index}
                      aria-selected={active}
                      aria-label={`${money(frame.levels[rowIndex].price)} at ${frame.time}: ${size} resting contracts`}
                      data-position={`${rowIndex}-${frame.index}`}
                      tabIndex={active ? 0 : -1}
                      onClick={() =>
                        setInspect({ row: rowIndex, frame: frame.index })
                      }
                      onFocus={() =>
                        setInspect({ row: rowIndex, frame: frame.index })
                      }
                      onKeyDown={(event) =>
                        navigate(event, rowIndex, frame.index)
                      }
                      style={{
                        background:
                          size < threshold
                            ? "#141927"
                            : `rgba(${size > 220 ? "171,158,255" : "80,102,191"},${Math.min(0.95, 0.14 + size / 470)})`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <svg
            className="liquidity-price-line"
            viewBox={`0 0 ${visible.length * 20} ${13 * 19}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={path}
              fill="none"
              stroke="#e5e6ff"
              strokeWidth={1.7}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="heatmap-times">
            <span>{visible[0].time} ET</span>
            <span>{visible[Math.floor(visible.length / 2)].time} ET</span>
            <span>{visible[visible.length - 1].time} ET</span>
          </div>
        </div>
      </div>
      <div className="heatmap-inspector">
        <output>
          <span>{selected.time} ET</span>
          <strong>{money(level.price)}</strong>
          <span>
            <strong>{level.resting}</strong> resting contracts
          </span>
        </output>
        <span>Click a cell or focus the grid and use arrow keys.</span>
      </div>
    </article>
  );
}
