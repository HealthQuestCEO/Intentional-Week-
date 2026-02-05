import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { TimerWidget } from '../timer/TimerWidget';

export function Layout({
  children,
  currentDate,
  onPrevWeek,
  onNextWeek,
  showWeekNav = false
}) {
  return (
    <div className="min-h-screen bg-vanilla-sky">
      <Header
        currentDate={currentDate}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        showWeekNav={showWeekNav}
      />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
      {/* Floating Timer Widget - persists across all pages */}
      <TimerWidget />
    </div>
  );
}

export default Layout;
