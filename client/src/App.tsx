import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ReloadPrompt } from "@/components/ReloadPrompt";
import Calculator from "@/pages/calculator";
import Intervals from "@/pages/intervals";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Calculator} />
        <Route path="/intervals" component={Intervals} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tape-calc-theme">
      <TooltipProvider>
        <Toaster />
        <ReloadPrompt />
        <AppRouter />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
