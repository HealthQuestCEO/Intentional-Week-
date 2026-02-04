import { useState } from 'react';
import { Plus, Calendar, Search as SearchIcon } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { JournalEntry } from './JournalEntry';
import { MoodCalendar } from './MoodCalendar';
import { JournalSearch } from './JournalSearch';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function Journal() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showNewEntry, setShowNewEntry] = useState(false);

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'search', label: 'Search', icon: SearchIcon },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-charcoal">Journal</h1>
          <Button onClick={() => setShowNewEntry(true)} icon={Plus}>
            New Entry
          </Button>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md
                text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-charcoal/60 hover:text-charcoal'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'calendar' && <MoodCalendar />}
        {activeTab === 'search' && (
          <div className="bg-white rounded-xl p-4">
            <JournalSearch />
          </div>
        )}

        {/* New entry modal */}
        <Modal
          isOpen={showNewEntry}
          onClose={() => setShowNewEntry(false)}
          title="New Journal Entry"
          size="lg"
        >
          <JournalEntry
            onSave={() => setShowNewEntry(false)}
            onClose={() => setShowNewEntry(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
}

export default Journal;
