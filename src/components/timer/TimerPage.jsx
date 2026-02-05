import { Trash2 } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { Timer } from './Timer';
import { useWeekData } from '../../hooks/useWeekData';
import { formatMinutes } from '../../utils/dateUtils';

export function TimerPage() {
  const { weekData, removeTimerLog } = useWeekData();
  const timerLogs = weekData?.timerLogs || [];

  // Calculate summary stats
  const todayLogs = timerLogs.filter(
    log => log.date === new Date().toISOString().split('T')[0]
  );
  const todayMinutes = todayLogs.reduce((sum, log) => sum + (log.minutes || 0), 0);
  const weekMinutes = timerLogs.reduce((sum, log) => sum + (log.minutes || 0), 0);

  // Group by activity
  const activitySummary = timerLogs.reduce((acc, log) => {
    const activity = log.activity || 'Other';
    acc[activity] = (acc[activity] || 0) + (log.minutes || 0);
    return acc;
  }, {});

  const sortedActivities = Object.entries(activitySummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Main timer */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <Timer expanded />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-balanced-teal">
              {formatMinutes(todayMinutes)}
            </p>
            <p className="text-sm text-charcoal/60">Today</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-balanced-teal">
              {formatMinutes(weekMinutes)}
            </p>
            <p className="text-sm text-charcoal/60">This week</p>
          </div>
        </div>

        {/* Activity breakdown */}
        {sortedActivities.length > 0 && (
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-medium text-charcoal mb-3">Time by activity</h3>
            <div className="space-y-3">
              {sortedActivities.map(([activity, minutes]) => (
                <div key={activity}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">{activity}</span>
                    <span className="text-charcoal/60">{formatMinutes(minutes)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-balanced-teal"
                      style={{ width: `${(minutes / weekMinutes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent logs */}
        {timerLogs.length > 0 && (
          <div className="bg-white rounded-xl p-4 mt-4">
            <h3 className="font-medium text-charcoal mb-3">Recent sessions</h3>
            <div className="space-y-2">
              {timerLogs.slice(-5).reverse().map((log, i) => {
                // Calculate actual index in the original array
                const actualIndex = timerLogs.length - 1 - i;
                return (
                  <div
                    key={log.id || log.timestamp || i}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 group"
                  >
                    <div>
                      <p className="text-sm text-charcoal">{log.activity}</p>
                      <p className="text-xs text-charcoal/50">{log.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-balanced-teal">
                        {formatMinutes(log.minutes)}
                      </span>
                      <button
                        onClick={() => removeTimerLog(log.id, actualIndex)}
                        className="text-charcoal/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TimerPage;
