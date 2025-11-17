// src/App.jsx
import './App.css';
import ActivityTracker from './Pages/ActivityTracker';
import Dashboard from './Pages/Dashboard';
import {  Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>   
        <Route path="/" element={<ActivityTracker />} />
        <Route path="/dashboard" element={<Dashboard/>} />

    </Routes>

  );
}

export default App;