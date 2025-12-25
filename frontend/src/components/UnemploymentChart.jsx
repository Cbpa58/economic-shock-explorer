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
        setData(res.data.data);
        setShock(res.data.shock);
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
              x1={shock.start}
              x2={shock.end}
              fill="rgba(255,0,0,0.1)"
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
    </div>
  );
}
