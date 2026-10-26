import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BriefProvider } from "./brief/BriefContext";
import { lazy, Suspense, type ComponentType } from "react";
import { isMobileNow, useIsMobile } from "./mobile/useIsMobile";
import PageTransition from "./scene/PageTransition";

// Each page loads on demand, so a visitor downloads only the scene they open. The same loaders
// let the page transition fetch the next page while the current one is being covered.
const pages = {
  home: () => import("./pages/Home"),
  process: () => import("./process/ProcessScene"),
  cases: () => import("./cases/CasesScene"),
  experience: () => import("./experience/ExperienceScene"),
  mHome: () => import("./mobile/MobileHome"),
  mProcess: () => import("./mobile/MobileProcess"),
  mCases: () => import("./mobile/MobileCases"),
  mExperience: () => import("./mobile/MobileExperience"),
};
const PRELOAD: Record<string, [() => Promise<unknown>, () => Promise<unknown>]> = {
  "/": [pages.home, pages.mHome],
  "/process": [pages.process, pages.mProcess],
  "/cases": [pages.cases, pages.mCases],
  "/experience": [pages.experience, pages.mExperience],
};
const preload = (path: string) => PRELOAD[path]?.[isMobileNow() ? 1 : 0]();
const HomeScene = lazy(pages.home);
const ProcessScene = lazy(pages.process);
const CasesScene = lazy(pages.cases);
const ExperienceScene = lazy(pages.experience);
const MobileHome = lazy(pages.mHome);
const MobileProcess = lazy(pages.mProcess);
const MobileCases = lazy(pages.mCases);
const MobileExperience = lazy(pages.mExperience);

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
              <PageTransition preload={preload} />
            </BriefProvider>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
