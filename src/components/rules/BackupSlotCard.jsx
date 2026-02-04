import { useState } from 'react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input, TextArea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { DAYS_FULL } from '../../utils/constants';

export function BackupSlotCard({ currentDate }) {
  const { weekData, updateRule } = useWeekData(currentDate);
  const backupSlot = weekData?.backupSlot || { slot: '', used: null, note: '' };

  const handleSlotChange = (value) => {
    updateRule('backupSlot', { slot: value });
  };

  const handleUsedChange = (used) => {
    updateRule('backupSlot', { used });
  };

  const handleNoteChange = (note) => {
    updateRule('backupSlot', { note });
  };

  const dayOptions = DAYS_FULL.map(day => ({
    value: day,
    label: day
  }));

  return (
    <div className="space-y-4">
      {/* Set backup slot */}
      <div>
        <Input
          label="My backup slot this week"
          placeholder="e.g., Thursday 2-4pm"
          value={backupSlot.slot}
          onChange={(e) => handleSlotChange(e.target.value)}
        />
      </div>

      {/* Usage status */}
      {backupSlot.slot && (
        <div>
          <p className="text-sm font-medium text-charcoal mb-2">
            Did you use your backup slot?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleUsedChange(true)}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                ${backupSlot.used === true
                  ? 'bg-rainfall text-white'
                  : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                }
              `}
            >
              Yes, used it
            </button>
            <button
              onClick={() => handleUsedChange(false)}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                ${backupSlot.used === false
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                }
              `}
            >
              Didn't need it
            </button>
          </div>
        </div>
      )}

      {/* Note about what happened */}
      {backupSlot.used === true && (
        <div>
          <TextArea
            label="What did you catch up on?"
            placeholder="What happened that needed your backup time?"
            value={backupSlot.note}
            onChange={(e) => handleNoteChange(e.target.value)}
            rows={2}
          />
        </div>
      )}

      {/* Tip */}
      {!backupSlot.slot && (
        <div className="bg-rainfall/10 rounded-lg p-3">
          <p className="text-sm text-charcoal/70">
            <strong>Tip:</strong> Schedule 2-3 hours of buffer time during your week.
            When things inevitably come up, you'll have space to handle them without
            derailing your whole schedule.
          </p>
        </div>
      )}
    </div>
  );
}

export default BackupSlotCard;
