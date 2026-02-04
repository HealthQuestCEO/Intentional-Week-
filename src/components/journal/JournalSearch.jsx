import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useJournal } from '../../hooks/useStorage';
import { MoodEmoji, MoodSelector } from './MoodSelector';
import { MOOD_EMOJIS } from '../../utils/constants';
import { formatDate } from '../../utils/dateUtils';

export function JournalSearch({ onSelectEntry }) {
  const { searchEntries } = useJournal();
  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = searchEntries(query, { mood: moodFilter });

  const clearFilters = () => {
    setQuery('');
    setMoodFilter(null);
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
        <input
          type="text"
          placeholder="Search journal entries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
            showFilters || moodFilter ? 'bg-balanced-teal text-white' : 'text-charcoal/40 hover:bg-gray-100'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 animate-expand">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-charcoal">Filter by mood</span>
            {moodFilter && (
              <button
                onClick={() => setMoodFilter(null)}
                className="text-xs text-balanced-teal hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setMoodFilter(moodFilter === value ? null : value)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${moodFilter === value
                    ? 'ring-2 ring-balanced-teal bg-balanced-teal/10 scale-110'
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                <MoodEmoji mood={MOOD_EMOJIS[value]} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters display */}
      {(query || moodFilter) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/50">
            {results.length} {results.length === 1 ? 'entry' : 'entries'} found
          </span>
          <button
            onClick={clearFilters}
            className="text-xs text-balanced-teal hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-8 text-charcoal/50">
            {query || moodFilter ? 'No entries match your search' : 'Start typing to search'}
          </div>
        ) : (
          results.map((entry) => (
            <button
              key={entry.date}
              onClick={() => onSelectEntry && onSelectEntry(entry)}
              className="w-full text-left bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-start gap-3">
                {entry.mood && (
                  <MoodEmoji mood={MOOD_EMOJIS[entry.mood.value]} size="sm" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal">
                    {formatDate(entry.date, 'EEEE, MMM d')}
                  </p>
                  <p className="text-xs text-charcoal/50 truncate">
                    {entry.freeWrite || entry.prompts?.onYourMind || entry.prompts?.gratefulFor || 'No content'}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default JournalSearch;
