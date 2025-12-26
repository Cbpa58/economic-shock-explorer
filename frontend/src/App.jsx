import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import IndicatorChart from "./components/IndicatorChart";

function App() {
  const [series, setSeries] = useState("UNRATE");
  const [shock, setShock] = useState("covid");

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Economic Shock Explorer</h1>

      {/* Controls */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <select value={series} onChange={e => setSeries(e.target.value)}>
          <option value="UNRATE">Unemployment Rate</option>
          <option value="CPIAUCSL">Consumer Price Index</option>
        </select>

        <select value={shock} onChange={e => setShock(e.target.value)}>
          <option value="covid">COVID-19</option>
          <option value="gfc">Financial Crisis</option>
          <option value="none">No Shock</option>
        </select>

      </div>

      <IndicatorChart seriesId={series} shock={shock} />
    </div>
  );
}

export default App;

