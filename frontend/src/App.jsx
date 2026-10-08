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

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main application area */}
      <div className="app-main">

        {/* Top header */}
        <Header
          onMenu={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <main className="page-content">
          <Routes>

            {/* Default route */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* Main Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* City Simulator */}
            <Route
              path="/simulator"
              element={<CitySimulator />}
            />

            {/* AI Waste Classifier */}
            <Route
              path="/classifier"
              element={<AIClassifier />}
            />

            {/* Route Optimizer */}
            <Route
              path="/route"
              element={<RouteOptimizer />}
            />

            {/* Overflow Prediction */}
            <Route
              path="/prediction"
              element={<OverflowPrediction />}
            />

            {/* Citizen Reports */}
            <Route
              path="/reports"
              element={<CitizenReports />}
            />

            {/* Report History */}
            <Route
              path="/history"
              element={<ReportsHistory />}
            />

            {/* Unknown URL */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;