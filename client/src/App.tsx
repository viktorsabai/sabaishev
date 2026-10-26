import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BriefProvider } from "./brief/BriefContext";
import { lazy, Suspense, type ComponentType } from "react";

// Each page loads on demand, so a visitor downloads only the scene they open.
const Home = lazy(() => import("./pages/Home"));
const ProcessScene = lazy(() => import("./process/ProcessScene"));
const CasesScene = lazy(() => import("./cases/CasesScene"));
const ExperienceScene = lazy(() => import("./experience/ExperienceScene"));
const ShipScene = lazy(() => import("./scene/ShipScene"));
const HomeLegacy = lazy(() => import("./pages/HomeLegacy"));
const Workspace = lazy(() => import("./pages/Workspace"));
const AnimatedBackground = lazy(() => import("./components/AnimatedBackground"));

// The previous site's pages keep their own animated backdrop.
const withLegacyBackground = (Page: ComponentType) => () => (
  <>
    <AnimatedBackground />
    <Page />
  </>
);
const LegacyHome = withLegacyBackground(HomeLegacy);
const LegacyWorkspace = withLegacyBackground(Workspace);

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/legacy"} component={LegacyHome} />
      <Route path={"/v1"} component={ShipScene} />
      <Route path={"/process"} component={ProcessScene} />
      <Route path={"/cases"} component={CasesScene} />
      <Route path={"/experience"} component={ExperienceScene} />
      <Route path={"/workspace/material/:slug"} component={LegacyWorkspace} />
      <Route path={"/workspace/route/:slug"} component={LegacyWorkspace} />
      <Route path={"/workspace"} component={LegacyWorkspace} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <BriefProvider>
              <Suspense fallback={<div className="fixed inset-0" style={{ background: "#07090B" }} />}>
                <Router />
              </Suspense>
            </BriefProvider>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
