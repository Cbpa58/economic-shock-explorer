import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from "recharts";

const YEAR = 365 * 24 * 60 * 60 * 1000;

export default function IndicatorChart({ seriesId, shock }) {
  const [data, setData] = useState([]);
  const [shockMeta, setShockMeta] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [summary, setSummary] = useState(null); // ✅ NEW

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/chart/${seriesId}?shock=${shock}`)
      .then(res => {
        let processed = res.data.data.map(d => ({
          ...d,
          dateNum: new Date(d.date).getTime()
        }));

        // 🔍 Slice data ±5 years around the shock
        if (res.data.shock) {
          const start = new Date(res.data.shock.start).getTime() - 5 * YEAR;
          const end = new Date(res.data.shock.end).getTime() + 5 * YEAR;
          processed = processed.filter(
            d => d.dateNum >= start && d.dateNum <= end
          );
        }

        setData(processed);
        setShockMeta(res.data.shock || null);
      })
      .catch(console.error);

    if (shock !== "none") {
      axios
        .get(`http://127.0.0.1:8000/shock/${shock}/${seriesId}`)
        .then(res => {
          setInterpretation(res.data.interpretation);
          setSummary(res.data.summary); // ✅ NEW
        })
        .catch(console.error);
    } else {
      setInterpretation(null);
      setSummary(null);
    }
  }, [seriesId, shock]);

  return (
    <div style={{ minHeight: "450px", marginBottom: "3rem" }}>
      <h2>
        {seriesId === "UNRATE"
          ? "US Unemployment Rate"
          : "Consumer Price Index"}
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis
            dataKey="dateNum"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => new Date(ts).getFullYear()}
          />
          <YAxis />
          <Tooltip />

          {shockMeta && (
            <ReferenceArea
              x1={new Date(shockMeta.start).getTime()}
              x2={new Date(shockMeta.end).getTime()}
              fill="red"
              fillOpacity={0.25}
            />
          )}

          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 📊 Analysis stats */}
      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "1.5rem"
          }}
        >
          {[
            ["Pre-shock (5y)", summary.pre_5y],
            ["During shock", summary.during],
            ["Post-shock (5y)", summary.post_5y]
          ].map(([label, s]) => (
            <div
              key={label}
              style={{
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}
            >
              <strong>{label}</strong>
              <div>Mean: {s?.mean}</div>
              <div>Std: {s?.std}</div>
              <div>Min: {s?.min}</div>
              <div>Max: {s?.max}</div>
            </div>
          ))}
        </div>
      )}

      {interpretation && (
        <p style={{ marginTop: "1rem", color: "#374151" }}>
          <strong>Interpretation:</strong> {interpretation}
        </p>
      )}
    </div>
  );
}
