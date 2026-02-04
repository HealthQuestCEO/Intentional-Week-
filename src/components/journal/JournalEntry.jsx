import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { MoodSelector } from './MoodSelector';
import { TextArea } from '../common/Input';
import { Button } from '../common/Button';
import { JOURNAL_PROMPTS, MOOD_EMOJIS } from '../../utils/constants';
import { useJournal } from '../../hooks/useStorage';
import { getDateKey, formatDate } from '../../utils/dateUtils';

export function JournalEntry({ date = new Date(), onSave, onClose }) {
  const { getEntry, saveEntry } = useJournal();
  const dateKey = getDateKey(date);

  const [mood, setMood] = useState(null);
  const [prompts, setPrompts] = useState({});
  const [freeWrite, setFreeWrite] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing entry
  useEffect(() => {
    const existing = getEntry(dateKey);
    if (existing) {
      setMood(existing.mood?.value || null);
      setPrompts(existing.prompts || {});
      setFreeWrite(existing.freeWrite || '');
    }
  }, [dateKey, getEntry]);

  const handlePromptChange = (promptId, value) => {
    setPrompts(prev => ({ ...prev, [promptId]: value }));
  };

  const handleSave = async () => {
    if (!mood) return;

    setSaving(true);
    const entry = {
      mood: {
        emoji: MOOD_EMOJIS[mood].name,
        value: mood
      },
      prompts,
      freeWrite,
      timestamp: new Date().toISOString()
    };

    const success = saveEntry(dateKey, entry);
    setSaving(false);

    if (success && onSave) {
      onSave(entry);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-charcoal">
          {formatDate(date, 'EEEE, MMMM d')}
        </h2>
        <p className="text-sm text-charcoal/60">How are you feeling?</p>
      </div>

      {/* Mood selector */}
      <div className="py-4">
        <MoodSelector value={mood} onChange={setMood} size="lg" />
        {mood && (
          <p className="text-center mt-3 text-sm text-charcoal/70">
            {MOOD_EMOJIS[mood].label}
          </p>
        )}
      </div>

      {/* Prompts */}
      {mood && (
        <div className="space-y-4">
          {JOURNAL_PROMPTS.map((prompt) => (
            <div key={prompt.id}>
              <TextArea
                label={prompt.label}
                value={prompts[prompt.id] || ''}
                onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
                rows={2}
                placeholder="(optional)"
              />
            </div>
          ))}

          {/* Free write */}
          <TextArea
            label="Anything else on your mind?"
            value={freeWrite}
            onChange={(e) => setFreeWrite(e.target.value)}
            rows={4}
            placeholder="Write freely..."
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onClose && (
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!mood || saving}
          loading={saving}
          className="flex-1"
          icon={Save}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}

export default JournalEntry;
