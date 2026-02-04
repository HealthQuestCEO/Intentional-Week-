import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Play, Pause, Check, Clock } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input, TextArea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { formatMinutes } from '../../utils/dateUtils';
import { TASK_STATUS } from '../../utils/constants';

export function FridayPlanCard({ currentDate }) {
  const { weekData, updateFridayPlan, markFridayPlanDone, addTask, updateTask, removeTask } = useWeekData(currentDate);
  const [expandedSection, setExpandedSection] = useState('career');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskHours, setNewTaskHours] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState('');

  const fridayPlan = weekData?.fridayPlan || {
    done: false,
    career: { notes: '', tasks: [] },
    relationships: { notes: '', plans: [] },
    self: { notes: '', plans: [] }
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const hours = parseInt(newTaskHours) || 0;
      const minutes = parseInt(newTaskMinutes) || 0;
      const totalMinutes = hours * 60 + minutes;

      addTask({
        name: newTaskName.trim(),
        plannedMinutes: totalMinutes
      });

      setNewTaskName('');
      setNewTaskHours('');
      setNewTaskMinutes('');
    }
  };

  const handleStatusChange = (taskId, status) => {
    updateTask(taskId, { status });
  };

  const handleActualTimeChange = (taskId, value) => {
    const minutes = parseInt(value) || 0;
    updateTask(taskId, { actualMinutes: minutes });
  };

  const tasks = fridayPlan.career?.tasks || [];
  const totalPlanned = tasks.reduce((sum, t) => sum + (t.plannedMinutes || 0), 0);
  const totalActual = tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
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
                  newTaskHours={newTaskHours}
                  setNewTaskHours={setNewTaskHours}
                  newTaskMinutes={newTaskMinutes}
                  setNewTaskMinutes={setNewTaskMinutes}
                  onAddTask={handleAddTask}
                  onStatusChange={handleStatusChange}
                  onActualTimeChange={handleActualTimeChange}
                  onRemoveTask={removeTask}
                  totalPlanned={totalPlanned}
                  totalActual={totalActual}
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
  newTaskHours,
  setNewTaskHours,
  newTaskMinutes,
  setNewTaskMinutes,
  onAddTask,
  onStatusChange,
  onActualTimeChange,
  onRemoveTask,
  totalPlanned,
  totalActual,
  completedTasks
}) {
  const statusOptions = [
    { value: TASK_STATUS.NOT_STARTED, label: 'Not started' },
    { value: TASK_STATUS.IN_PROGRESS, label: 'In progress' },
    { value: TASK_STATUS.DONE, label: 'Done' }
  ];

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
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm font-medium text-charcoal mb-2">Add Task</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="h"
              value={newTaskHours}
              onChange={(e) => setNewTaskHours(e.target.value)}
              className="w-16"
              min="0"
            />
            <span className="text-charcoal/40">:</span>
            <Input
              type="number"
              placeholder="m"
              value={newTaskMinutes}
              onChange={(e) => setNewTaskMinutes(e.target.value)}
              className="w-16"
              min="0"
              max="59"
            />
            <Button onClick={onAddTask} size="sm" icon={Plus}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Task list */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs text-charcoal/50 font-medium px-2">
            <div className="col-span-5">Task</div>
            <div className="col-span-2 text-center">Planned</div>
            <div className="col-span-2 text-center">Actual</div>
            <div className="col-span-3 text-center">Status</div>
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              className={`
                grid grid-cols-12 gap-2 items-center p-2 rounded-lg
                ${task.status === TASK_STATUS.DONE ? 'bg-green-50' : 'bg-gray-50'}
              `}
            >
              <div className="col-span-5 flex items-center gap-2">
                <button
                  onClick={() => onRemoveTask(task.id)}
                  className="text-charcoal/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className={`text-sm ${task.status === TASK_STATUS.DONE ? 'line-through text-charcoal/50' : 'text-charcoal'}`}>
                  {task.name}
                </span>
              </div>
              <div className="col-span-2 text-center text-sm text-charcoal/60">
                {formatMinutes(task.plannedMinutes)}
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={task.actualMinutes || ''}
                  onChange={(e) => onActualTimeChange(task.id, e.target.value)}
                  placeholder="min"
                  className="w-full text-center text-sm p-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-balanced-teal"
                  min="0"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="w-full text-xs p-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-balanced-teal"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t border-gray-100">
          <div>
            <p className="text-lg font-semibold text-charcoal">{formatMinutes(totalPlanned)}</p>
            <p className="text-xs text-charcoal/50">Planned</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-charcoal">{formatMinutes(totalActual)}</p>
            <p className="text-xs text-charcoal/50">Actual</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-charcoal">{completedTasks}/{tasks.length}</p>
            <p className="text-xs text-charcoal/50">Done</p>
          </div>
        </div>
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
