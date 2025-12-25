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



export default function IndicatorChart({ seriesId, title }) {
  const [data, setData] = useState([]);
  const [shock, setShock] = useState(null);
  const [interpretation, setInterpretation] = useState(null);

  useEffect(() => {
    // Fetch chart data
    axios.get(`http://127.0.0.1:8000/chart/${seriesId.toUpperCase()}`)
      .then(res => {
        const formattedData = res.data.data.map(d => ({
          ...d,
          date: d.date.slice(0, 10)
        }));
        setData(formattedData);
        setShock({
          ...res.data.shock,
          start: res.data.shock.start,
          end: res.data.shock.end
        });
      });

    // Fetch interpretation
    axios.get(`http://127.0.0.1:8000/shock/covid/${seriesId.toUpperCase()}`)
      .then(res => setInterpretation(res.data.interpretation));

  }, [seriesId]); // ✅ important: dependency on seriesId




return (
  <div
    style={{
      marginBottom: "4rem",
      paddingBottom: "2rem",
      borderBottom: "1px solid #e5e7eb",
      // 🔑 This ensures the chart has space
      minHeight: "450px"
    }}
  >
    <h2>{title}</h2>

    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />

        {shock && (
          <ReferenceArea
            x1={shock.start}
            x2={shock.end}
            fill="rgba(255,0,0,0.15)"
          />
        )}

        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>

    {interpretation && (
      <p
        style={{
          marginTop: "1rem",
          maxWidth: "720px",
          lineHeight: "1.6",
          color: "#374151"
        }}
      >
        <strong>Interpretation:</strong> {interpretation}
      </p>
    )}
  </div>
);



}
