// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";

// ✅ Import Tailwind (use index.css, not output.css, if CRA handles PostCSS)
import "./output.css";

// ✅ Import your main component (no .tsx extension needed)
import JamiiBank from "./jamiibank.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('SW registration failed:', err));
  });
}

root.render(
  <React.StrictMode>
    <JamiiBank />
  </React.StrictMode>
);
