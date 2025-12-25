import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import UnemploymentChart from "./components/UnemploymentChart";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Economic Shock Explorer</h1>
      <UnemploymentChart />
    </div>
  );
}

export default App;
