import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Remove Emergent badge completely
const removeBadge = () => {
  const badge = document.getElementById('emergent-badge');
  if (badge) badge.remove();
  document.querySelectorAll('a[href*="emergent"]').forEach(el => el.remove());
};
removeBadge();
setInterval(removeBadge, 500);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
