
import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";

import CitySimulator from "./pages/CitySimulator";
import AIClassifier from "./pages/AIClassifier";
import RouteOptimizer from "./pages/RouteOptimizer";
import OverflowPrediction from "./pages/OverflowPrediction";
import CitizenReports from "./pages/CitizenReports";
import ReportsHistory from "./pages/ReportsHistory";

export default function App() {
  return (
    <Routes>
      {/* Home and authentication */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />

      {/* Dashboard and profile */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfile />} />

      {/* SmartBin AI modules */}
      <Route path="/city-simulator" element={<CitySimulator />} />
      <Route path="/ai-classifier" element={<AIClassifier />} />
      <Route path="/route-optimizer" element={<RouteOptimizer />} />
      <Route
        path="/overflow-prediction"
        element={<OverflowPrediction />}
      />
      <Route
        path="/citizen-reports"
        element={<CitizenReports />}
      />
      <Route
        path="/reports-history"
        element={<ReportsHistory />}
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
