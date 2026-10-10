import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles/global.css";
import "./styles/layout.css";
import "leaflet/dist/leaflet.css";
import "./styles/global.css";
import "../styles/prediction.css";
import "../styles/report.css";
import "../styles/simulator.css";
import App from "./App";
import "../styles/route.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />
    </BrowserRouter>
  </React.StrictMode>
);