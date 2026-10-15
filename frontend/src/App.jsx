import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import CitySimulator from "./pages/CitySimulator";
import AIClassifier from "./pages/AIClassifier";
import RouteOptimizer from "./pages/RouteOptimizer";
import OverflowPrediction from "./pages/OverflowPrediction";
import CitizenReports from "./pages/CitizenReports";
import ReportsHistory from "./pages/ReportsHistory";
import "./App.css";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulator" element={<CitySimulator />} />
            <Route path="/classifier" element={<AIClassifier />} />
            <Route path="/routes" element={<RouteOptimizer />} />
            <Route path="/prediction" element={<OverflowPrediction />} />
            <Route path="/reports" element={<CitizenReports />} />
            <Route path="/history" element={<ReportsHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
