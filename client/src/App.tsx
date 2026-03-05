import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation } from "wouter";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// Import pages
import About from "@/pages/About";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import EventRegister from "@/pages/EventRegister";
import Timeline from "@/pages/Timeline";
import Sponsors from "@/pages/Sponsors";
import Merch from "@/pages/Merch";
import Core from "@/pages/Core";

// Import navbar
import Navbar from "./components/layout/Navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/events/:slug" component={EventDetails} />
      <Route path="/register/:slug" component={EventRegister} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/merch" component={Merch} />
      <Route path="/core" component={Core} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;