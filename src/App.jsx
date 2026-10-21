import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import NearestDisposal from "./pages/NearestDisposal";

import FloatingAssistant from "./components/FloatingAssistant";

function App() {
  return (
    <BrowserRouter>
      <FloatingAssistant />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />

        <Route path="/city-simulator" element={<CitySimulator />} />
        <Route path="/ai-classifier" element={<AIClassifier />} />
        <Route path="/route-optimizer" element={<RouteOptimizer />} />
        <Route
          path="/overflow-prediction"
          element={<OverflowPrediction />}
        />
        <Route path="/citizen-reports" element={<CitizenReports />} />
        <Route path="/reports-history" element={<ReportsHistory />} />

        {/* New BBMP waste disposal page */}
        <Route
          path="/nearest-disposal"
          element={<NearestDisposal />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;