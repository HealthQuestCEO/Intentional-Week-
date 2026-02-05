import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input, TextArea } from '../common/Input';
import { Button } from '../common/Button';
import { TASK_STATUS } from '../../utils/constants';

export function FridayPlanCard({ currentDate }) {
  const { weekData, updateFridayPlan, markFridayPlanDone, addTask, updateTask, removeTask } = useWeekData(currentDate);
  const [expandedSection, setExpandedSection] = useState('career');
  const [newTaskName, setNewTaskName] = useState('');

  const fridayPlan = weekData?.fridayPlan || {
    done: false,
    career: { notes: '', tasks: [] },
    relationships: { notes: '', plans: [] },
    self: { notes: '', plans: [] }
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask({
        name: newTaskName.trim(),
        plannedMinutes: 0
      });
      setNewTaskName('');
    }
  };

  const handleToggleTask = (taskId, currentStatus) => {
    const newStatus = currentStatus === TASK_STATUS.DONE ? TASK_STATUS.NOT_STARTED : TASK_STATUS.DONE;
    updateTask(taskId, { status: newStatus });
  };

  const tasks = fridayPlan.career?.tasks || [];
  const completedTasks = tasks.filter(t => t.status === TASK_STATUS.DONE).length;

  const sections = [
    { id: 'career', label: 'Career / Work', icon: '💼', color: 'bg-balanced-teal' },
    { id: 'relationships', label: 'Relationships', icon: '💜', color: 'bg-teasel-lilac' },
    { id: 'self', label: 'Self', icon: '🌱', color: 'bg-gelato-mint' }
  ];

  return (
    <div className="space-y-4">
      {/* Planning complete toggle */}
      <div className="flex items-center justify-between p-3 bg-balanced-teal/10 rounded-lg">
        <span className="text-sm font-medium text-charcoal">Friday planning done?</span>
        <button
          onClick={() => markFridayPlanDone(!fridayPlan.done)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${fridayPlan.done
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
            }
          `}
        >
          {fridayPlan.done ? '✓ Done' : 'Mark done'}
        </button>
      </div>

      {/* Collapsible sections */}
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{section.icon}</span>
              <span className="font-medium text-charcoal">{section.label}</span>
            </div>
            {expandedSection === section.id ? (
              <ChevronUp className="w-4 h-4 text-charcoal/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal/40" />
            )}
          </button>

          {expandedSection === section.id && (
            <div className="p-3 pt-0 border-t border-gray-100 animate-expand">
              {section.id === 'career' ? (
                <CareerSection
                  tasks={tasks}
                  notes={fridayPlan.career?.notes || ''}
                  onNotesChange={(notes) => updateFridayPlan('career', { notes })}
                  newTaskName={newTaskName}
                  setNewTaskName={setNewTaskName}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onRemoveTask={removeTask}
                  completedTasks={completedTasks}
                />
              ) : (
                <SimpleSection
                  notes={fridayPlan[section.id]?.notes || ''}
                  onNotesChange={(notes) => updateFridayPlan(section.id, { notes })}
                  placeholder={
                    section.id === 'relationships'
                      ? 'Who will you connect with? What relationships need attention?'
                      : 'What personal priorities matter this week?'
                  }
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CareerSection({
  tasks,
  notes,
  onNotesChange,
  newTaskName,
  setNewTaskName,
  onAddTask,
  onToggleTask,
  onRemoveTask,
  completedTasks
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddTask();
    }
  };

  return (
    <div className="space-y-4 mt-3">
      {/* Notes */}
      <TextArea
        placeholder="Top work priorities for the week..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={2}
      />

      {/* Add task form */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={onAddTask} size="sm" icon={Plus}>
          Add
        </Button>
      </div>

      {/* Task list - simple bullets */}
      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
            >
              <button
                onClick={() => onToggleTask(task.id, task.status)}
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                  ${task.status === TASK_STATUS.DONE
                    ? 'bg-balanced-teal border-balanced-teal text-white'
                    : 'border-gray-300 hover:border-balanced-teal'
                  }
                `}
              >
                {task.status === TASK_STATUS.DONE && <Check className="w-3 h-3" />}
              </button>
              <span className={`flex-1 text-sm ${task.status === TASK_STATUS.DONE ? 'line-through text-charcoal/50' : 'text-charcoal'}`}>
                {task.name}
              </span>
              <button
                onClick={() => onRemoveTask(task.id)}
                className="text-charcoal/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Summary */}
      {tasks.length > 0 && (
        <p className="text-sm text-charcoal/50 text-center pt-2 border-t border-gray-100">
          {completedTasks} of {tasks.length} tasks done
        </p>
      )}
    </div>
  );
}

function SimpleSection({ notes, onNotesChange, placeholder }) {
  return (
    <div className="mt-3">
      <TextArea
        placeholder={placeholder}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}

export default FridayPlanCard;
