import { useState } from 'react';
import { LogOut, Bell, User, Info, Download, Trash2 } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useStorage';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ReminderSettings } from './ReminderSettings';
import { Downloadables } from '../common/Downloadables';

export function Settings() {
  const { user, logout } = useAuth();
  const { settings, update } = useSettings();
  const { isGranted, requestPermission, notify } = useNotifications();
  const [activeSection, setActiveSection] = useState('reminders');

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('intentional-week-data');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intentional-week-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      if (confirm('Really delete everything?')) {
        localStorage.removeItem('intentional-week-data');
        logout();
      }
    }
  };

  const handleTestNotification = async () => {
    if (!isGranted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    notify('Test Notification', {
      body: 'Notifications are working correctly!'
    });
  };

  const sections = [
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'account', label: 'Account', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-charcoal mb-6">Settings</h1>

        {/* Section tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md
                text-sm font-medium transition-colors
                ${activeSection === section.id
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-charcoal/60 hover:text-charcoal'
                }
              `}
            >
              <section.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Reminders section */}
        {activeSection === 'reminders' && (
          <div className="space-y-4">
            {/* Notification permission */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-charcoal">Push Notifications</h3>
                  <p className="text-sm text-charcoal/60">
                    {isGranted ? 'Enabled' : 'Enable to receive reminders'}
                  </p>
                </div>
                <Button
                  variant={isGranted ? 'secondary' : 'primary'}
                  onClick={handleTestNotification}
                  size="sm"
                >
                  {isGranted ? 'Test' : 'Enable'}
                </Button>
              </div>
            </Card>

            {/* Rule reminders */}
            <ReminderSettings settings={settings} onUpdate={update} />

            {/* Quiet hours */}
            <Card>
              <h3 className="font-medium text-charcoal mb-3">Quiet Hours</h3>
              <p className="text-sm text-charcoal/60 mb-3">
                No notifications during these hours
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={settings?.quietHours?.start || '22:00'}
                  onChange={(e) => update({
                    quietHours: { ...settings?.quietHours, start: e.target.value }
                  })}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <span className="text-charcoal/50">to</span>
                <input
                  type="time"
                  value={settings?.quietHours?.end || '07:00'}
                  onChange={(e) => update({
                    quietHours: { ...settings?.quietHours, end: e.target.value }
                  })}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </Card>
          </div>
        )}

        {/* Account section */}
        {activeSection === 'account' && (
          <div className="space-y-4">
            {/* Profile */}
            <Card>
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-balanced-teal text-white flex items-center justify-center text-2xl font-medium">
                    {user?.displayName?.[0] || user?.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-charcoal">{user?.displayName}</h3>
                  <p className="text-sm text-charcoal/60">{user?.email}</p>
                </div>
              </div>
            </Card>

            {/* Data management */}
            <Card>
              <h3 className="font-medium text-charcoal mb-3">Your Data</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={handleExportData}
                  icon={Download}
                  className="w-full justify-center"
                >
                  Export Data
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDeleteAccount}
                  icon={Trash2}
                  className="w-full justify-center text-red-500 hover:bg-red-50"
                >
                  Delete All Data
                </Button>
              </div>
            </Card>

            {/* Sign out */}
            <Card>
              <Button
                variant="secondary"
                onClick={handleLogout}
                icon={LogOut}
                className="w-full justify-center"
              >
                Sign Out
              </Button>
            </Card>
          </div>
        )}

        {/* About section */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <Card>
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-balanced-teal mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📅</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal mb-1">Intentional Week</h2>
                <p className="text-sm text-charcoal/60">Version 0.1.0</p>
              </div>
            </Card>

            {/* Downloadables */}
            <Downloadables />

            <Card>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Inspired by <strong>Tranquility by Tuesday: 9 Ways to Calm the Chaos
                and Make Time for What Matters</strong> by Laura Vanderkam.
              </p>
              <a
                href="https://lauravanderkam.com/books/tranquility-by-tuesday/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-balanced-teal hover:underline"
              >
                Learn more about the book →
              </a>
            </Card>

            <Card>
              <h3 className="font-medium text-charcoal mb-2">The 9 Rules</h3>
              <ol className="text-sm text-charcoal/70 space-y-1 list-decimal list-inside">
                <li>Give yourself a bedtime</li>
                <li>Plan on Fridays</li>
                <li>Move by 3pm</li>
                <li>Three times a week is a habit</li>
                <li>Create a backup slot</li>
                <li>One big adventure, one little adventure</li>
                <li>Take one night for you</li>
                <li>Batch the little things</li>
                <li>Effortful before effortless</li>
              </ol>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Settings;
