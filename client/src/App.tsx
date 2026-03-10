import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProfileSetup from "./components/ProfileSetup";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import PupilDashboard from "./pages/PupilDashboard";
import SkillPractice from "./pages/SkillPractice";
import TimedTest from "./pages/TimedTest";
import Leaderboard from "./pages/Leaderboard";
import ProblemOfTheWeek from "./pages/ProblemOfTheWeek";
import TeacherDashboard from "./pages/TeacherDashboard";
import Badges from "./pages/Badges";
import ShapeValuePuzzles from "./pages/ShapeValuePuzzles";
import QuestionBrowser from "./pages/QuestionBrowser";
import CompetitionMode from "./pages/CompetitionMode";
import GamesHub from "./pages/GamesHub";
import { useAuth } from "./_core/hooks/useAuth";
import { trpc } from "./lib/trpc";

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
      <Route path="/puzzles" component={ShapeValuePuzzles} />
      <Route path="/competition" component={CompetitionMode} />
      <Route path="/games" component={GamesHub} />
      <Route path="/admin/questions" component={QuestionBrowser} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * ProfileGate — shows the ProfileSetup modal for any authenticated user
 * who has not yet set a display name (i.e. first login).
 */
function ProfileGate({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  // Don't block render while auth is loading
  if (loading) return <>{children}</>;

  // Only show for logged-in users who haven't completed their profile
  const needsSetup = isAuthenticated && user && !user.displayName;

  if (needsSetup) {
    return (
      <>
        {children}
        <ProfileSetup onComplete={() => utils.auth.me.invalidate()} />
      </>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <ProfileGate>
            <Router />
          </ProfileGate>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
