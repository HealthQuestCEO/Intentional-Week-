import { Header } from './Header';
import { BottomNav } from './BottomNav';

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
    </div>
  );
}

export default Layout;
