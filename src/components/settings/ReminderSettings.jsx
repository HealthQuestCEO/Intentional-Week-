import { RULES } from '../../utils/constants';
import { Card } from '../common/Card';

export function ReminderSettings({ settings, onUpdate }) {
  const reminders = settings?.reminders || {};

  const handleToggle = (ruleId, enabled) => {
    onUpdate({
      reminders: {
        ...reminders,
        [ruleId]: { ...reminders[ruleId], enabled }
      }
    });
  };

  const handleTimeChange = (ruleId, time) => {
    onUpdate({
      reminders: {
        ...reminders,
        [ruleId]: { ...reminders[ruleId], time }
      }
    });
  };

  const reminderConfig = [
    { ruleId: 'bedtime', label: 'Bedtime reminder', description: '30 min before your target bedtime' },
    { ruleId: 'planOnFridays', label: 'Friday planning', description: 'Reminder to plan your week' },
    { ruleId: 'moveBy3pm', label: 'Move by 3pm', description: 'Reminder to get moving' },
    { ruleId: 'habits', label: 'Habit check-in', description: 'Daily habit reminder' },
    { ruleId: 'effortfulFirst', label: 'Effortful first', description: 'Evening reminder' },
  ];

  return (
    <Card>
      <h3 className="font-medium text-charcoal mb-4">Rule Reminders</h3>
      <div className="space-y-4">
        {reminderConfig.map(({ ruleId, label, description }) => {
          const reminder = reminders[ruleId] || { enabled: false };
          const rule = RULES.find(r => r.id === ruleId);

          return (
            <div
              key={ruleId}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: rule?.color }}
                />
                <div>
                  <p className="text-sm font-medium text-charcoal">{label}</p>
                  <p className="text-xs text-charcoal/50">{description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminder.enabled}
                  onChange={(e) => handleToggle(ruleId, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-balanced-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-balanced-teal"></div>
              </label>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ReminderSettings;
