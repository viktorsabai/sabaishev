import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BriefProvider } from "./brief/BriefContext";
import { lazy, Suspense, type ComponentType } from "react";
import { useIsMobile } from "./mobile/useIsMobile";

// Each page loads on demand, so a visitor downloads only the scene they open.
const HomeScene = lazy(() => import("./pages/Home"));
const ProcessScene = lazy(() => import("./process/ProcessScene"));
const CasesScene = lazy(() => import("./cases/CasesScene"));
const ExperienceScene = lazy(() => import("./experience/ExperienceScene"));
const MobileHome = lazy(() => import("./mobile/MobileHome"));
const MobileProcess = lazy(() => import("./mobile/MobileProcess"));
const MobileCases = lazy(() => import("./mobile/MobileCases"));
const MobileExperience = lazy(() => import("./mobile/MobileExperience"));

// Phones get vertical pages; wider screens the 1440×900 scene.
const responsive = (Desktop: ComponentType, Mobile: ComponentType) => () => (useIsMobile() ? <Mobile /> : <Desktop />);
const Home = responsive(HomeScene, MobileHome);
const Process = responsive(ProcessScene, MobileProcess);
const Cases = responsive(CasesScene, MobileCases);
const Experience = responsive(ExperienceScene, MobileExperience);
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
      <Route path={"/process"} component={Process} />
      <Route path={"/cases"} component={Cases} />
      <Route path={"/experience"} component={Experience} />
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
