import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { Journal } from './components/journal/Journal';
import { CalendarView } from './components/calendar/CalendarView';
import { TimerPage } from './components/timer/TimerPage';
import { ExtrasPanel } from './components/extras/ExtrasPanel';
import { Settings } from './components/settings/Settings';
import { WeeklyPlanner } from './components/planner/WeeklyPlanner';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla-sky flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-balanced-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla-sky flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-balanced-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timer"
        element={
          <ProtectedRoute>
            <TimerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/extras"
        element={
          <ProtectedRoute>
            <ExtrasPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <WeeklyPlanner />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
