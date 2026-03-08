import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import PupilDashboard from "./pages/PupilDashboard";
import SkillPractice from "./pages/SkillPractice";
import TimedTest from "./pages/TimedTest";
import Leaderboard from "./pages/Leaderboard";
import ProblemOfTheWeek from "./pages/ProblemOfTheWeek";
import TeacherDashboard from "./pages/TeacherDashboard";
import Badges from "./pages/Badges";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={PupilDashboard} />
      <Route path="/practice/:skillId?" component={SkillPractice} />
      <Route path="/test" component={TimedTest} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/potw" component={ProblemOfTheWeek} />
      <Route path="/teacher" component={TeacherDashboard} />
      <Route path="/badges" component={Badges} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
