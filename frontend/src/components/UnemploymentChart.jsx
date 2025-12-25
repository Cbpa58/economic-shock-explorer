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

export default function UnemploymentChart() {
  const [data, setData] = useState([]);
  const [shock, setShock] = useState(null);

    useEffect(() => {
    axios.get("http://127.0.0.1:8000/chart/UNRATE")
        .then(res => {
        console.log("RAW RESPONSE:", res.data);

        const cleaned = res.data.data.map(d => ({
            ...d,
            date: d.date.slice(0, 10)
        }));

        console.log("CLEANED DATA:", cleaned.slice(0, 5));

        setData(cleaned);
        setShock(res.data.shock);
        })
        .catch(err => {
        console.error("API ERROR:", err);
        });
    }, []);


  return (
    <div>
      <h2>US Unemployment Rate</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          {shock && (
            <ReferenceArea
              x1={shock.start.slice(0, 10)}
              x2={shock.end.slice(0, 10)}
              fill="rgba(239,68,68,0.15)"
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
