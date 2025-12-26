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

const YEAR = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year

export default function IndicatorChart({ seriesId, shock }) {
  const [data, setData] = useState([]);
  const [shockMeta, setShockMeta] = useState(null);
  const [interpretation, setInterpretation] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/chart/${seriesId}?shock=${shock}`)
      .then(res => {
        let processed = res.data.data.map(d => ({
          ...d,
          dateNum: new Date(d.date).getTime()
        }));

        // 🔍 Slice data ±2 years around the shock for zoom
        if (res.data.shock) {
          const start = new Date(res.data.shock.start).getTime() - 2 * YEAR;
          const end = new Date(res.data.shock.end).getTime() + 2 * YEAR;
          processed = processed.filter(d => d.dateNum >= start && d.dateNum <= end);
        }

        setData(processed);
        setShockMeta(res.data.shock || null);
      })
      .catch(console.error);

    if (shock !== "none") {
      axios
        .get(`http://127.0.0.1:8000/shock/${shock}/${seriesId}`)
        .then(res => setInterpretation(res.data.interpretation))
        .catch(console.error);
    } else {
      setInterpretation(null);
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
          {/* XAxis auto-scales to dataMin/dataMax */}
          <XAxis
            dataKey="dateNum"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => new Date(ts).getFullYear()}
          />
          <YAxis />
          <Tooltip />

          {/* 🔴 Shock shading */}
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
    </div>
  );
}
