import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Timer, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/timer', icon: Timer, label: 'Timer' },
  { path: '/extras', icon: Sparkles, label: 'Wellness' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-balanced-teal'
                  : 'text-charcoal/50 hover:text-charcoal'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
