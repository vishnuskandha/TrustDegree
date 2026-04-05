import { Navigate, type RouteObject } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { SkipLink } from "./components/Accessibility/SkipLink";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDegrees from "./pages/AdminDegrees";
import IssuePage from "./pages/IssuePage";
import Verify from "./pages/Verify";
import StudentDegrees from "./pages/StudentDegrees";
import Home from "./pages/Home";
import HowItWorksPage from "./pages/HowItWorksPage";
import TechnicalDocsPage from "./pages/TechnicalDocsPage";
import ComponentLibraryTest from "./test-component-library";

// Define route configuration
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/technical-docs",
    element: <TechnicalDocsPage />,
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: "/test",
          element: <ComponentLibraryTest />,
        },
      ]
    : []),
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/degrees",
    element: <AdminDegrees />,
  },
  {
    path: "/issue",
    element: <IssuePage />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/student/:address",
    element: <StudentDegrees />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-mesh text-slate-800 relative overflow-x-hidden">
      <SkipLink />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      <div className="pointer-events-none absolute inset-0 opacity-40 [background:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:44px_44px]"></div>

      {/* Navigation */}
      <Navbar />

      {/* Main content area with page transitions */}
      <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pt-28">
        <AnimatedRoutes routes={routes} />
      </main>
    </div>
  );
}

export default App;
