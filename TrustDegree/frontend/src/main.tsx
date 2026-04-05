import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Lenis } from "@studio-freight/react-lenis";
import App from "./App";
import "./i18n";
import "./index.css";
import { ToastProvider } from "@/components/magic/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ReactApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Lenis
        root
        options={{
          lerp: 0.1,
          smoothWheel: true,
          touchMultiplier: 2,
          infinite: false,
        }}
      >
        <ErrorBoundary>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ErrorBoundary>
      </Lenis>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactApp />
  </React.StrictMode>
);
