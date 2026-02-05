import { useAuth } from '../../hooks/useAuth';
import { Calendar, Settings, LogOut, ChevronLeft, ChevronRight, LayoutDashboard, BookOpen, Timer, Sparkles, CalendarDays } from 'lucide-react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { getWeekRangeDisplay } from '../../utils/dateUtils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/planner', icon: CalendarDays, label: 'Planner' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/timer', icon: Timer, label: 'Timer' },
  { path: '/extras', icon: Sparkles, label: 'Wellness' },
];

export function Header({
  currentDate = new Date(),
  onPrevWeek,
  onNextWeek,
  showWeekNav = false
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/journal':
        return 'Journal';
      case '/calendar':
        return 'Calendar';
      case '/planner':
        return 'Weekly Planner';
      case '/settings':
        return 'Settings';
      case '/extras':
        return 'Wellness';
      default:
        return 'Intentional Week';
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-lg bg-balanced-teal flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-charcoal hidden sm:block">
                {getPageTitle()}
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-balanced-teal/10 text-balanced-teal'
                      : 'text-charcoal/60 hover:text-charcoal hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Week navigation (when on dashboard - mobile only) */}
          {showWeekNav && (
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onPrevWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
              <span className="text-sm font-medium text-charcoal min-w-[100px] text-center">
                {getWeekRangeDisplay(currentDate)}
              </span>
              <button
                onClick={onNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5 text-charcoal" />
              </button>
            </div>
          )}

          {/* Right: User menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-charcoal" />
            </button>

            {user && (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-balanced-teal text-white flex items-center justify-center text-sm font-medium">
                    {user.displayName?.[0] || user.email?.[0] || '?'}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5 text-charcoal" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
