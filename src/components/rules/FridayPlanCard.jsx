import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TASK_STATUS } from '../../utils/constants';

export function FridayPlanCard({ currentDate }) {
  const { weekData, markFridayPlanDone, addTask, updateTask, removeTask } = useWeekData(currentDate);
  const [expandedSection, setExpandedSection] = useState('career');
  const [newTaskInputs, setNewTaskInputs] = useState({
    career: '',
    relationships: '',
    self: ''
  });

  const fridayPlan = weekData?.fridayPlan || {
    done: false,
    career: { notes: '', tasks: [] },
    relationships: { notes: '', tasks: [] },
    self: { notes: '', tasks: [] }
  };

  const handleAddTask = (section) => {
    const taskName = newTaskInputs[section]?.trim();
    if (taskName) {
      addTask({ name: taskName }, section);
      setNewTaskInputs(prev => ({ ...prev, [section]: '' }));
    }
  };

  const handleToggleTask = (taskId, currentStatus, section) => {
    const newStatus = currentStatus === TASK_STATUS.DONE ? TASK_STATUS.NOT_STARTED : TASK_STATUS.DONE;
    updateTask(taskId, { status: newStatus }, section);
  };

  const handleRemoveTask = (taskId, section) => {
    removeTask(taskId, section);
  };

  const sections = [
    { id: 'career', label: 'Career / Work', icon: '💼', placeholder: 'Add a work task...' },
    { id: 'relationships', label: 'Relationships', icon: '💜', placeholder: 'Add a relationship goal...' },
    { id: 'self', label: 'Self', icon: '🌱', placeholder: 'Add a personal goal...' }
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
      {sections.map((section) => {
        const tasks = fridayPlan[section.id]?.tasks || [];
        const completedTasks = tasks.filter(t => t.status === TASK_STATUS.DONE).length;

        return (
          <div key={section.id} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{section.icon}</span>
                <span className="font-medium text-charcoal">{section.label}</span>
                {tasks.length > 0 && (
                  <span className="text-xs text-charcoal/50">
                    ({completedTasks}/{tasks.length})
                  </span>
                )}
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-4 h-4 text-charcoal/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-charcoal/40" />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="p-3 pt-0 border-t border-gray-100 animate-expand">
                <TaskList
                  tasks={tasks}
                  sectionId={section.id}
                  placeholder={section.placeholder}
                  newTaskValue={newTaskInputs[section.id] || ''}
                  onNewTaskChange={(value) => setNewTaskInputs(prev => ({ ...prev, [section.id]: value }))}
                  onAddTask={() => handleAddTask(section.id)}
                  onToggleTask={(taskId, status) => handleToggleTask(taskId, status, section.id)}
                  onRemoveTask={(taskId) => handleRemoveTask(taskId, section.id)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TaskList({
  tasks,
  sectionId,
  placeholder,
  newTaskValue,
  onNewTaskChange,
  onAddTask,
  onToggleTask,
  onRemoveTask
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddTask();
    }
  };

  return (
    <div className="space-y-3 mt-3">
      {/* Add task form */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newTaskValue}
          onChange={(e) => onNewTaskChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={onAddTask} size="sm" icon={Plus}>
          Add
        </Button>
      </div>

      {/* Task list */}
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
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
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
                className="text-charcoal/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length === 0 && (
        <p className="text-sm text-charcoal/40 text-center py-2">
          No tasks yet
        </p>
      )}
    </div>
  );
}

export default FridayPlanCard;
