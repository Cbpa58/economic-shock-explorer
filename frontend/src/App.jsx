import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import IndicatorChart from "./components/IndicatorChart";

function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Economic Shock Explorer</h1>
      <p style={{ marginBottom: "2rem" }}>
        Exploring how major economic shocks affect key macroeconomic indicators using real-world data.
      </p>

      <IndicatorChart
        seriesId="UNRATE"
        title="US Unemployment Rate"
      />

      <IndicatorChart
        seriesId="CPIAUCSL"
        title="US Consumer Price Index (Inflation)"
      />
    </div>
  );
}

export default App;
