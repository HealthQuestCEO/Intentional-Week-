import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { useWeekData } from '../../hooks/useWeekData';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function BatchTasksCard({ currentDate }) {
  const { weekData, updateRule } = useWeekData(currentDate);
  const [newTask, setNewTask] = useState('');

  const batchTasks = weekData?.batchTasks || { tasks: [], completed: [] };

  const handleAddTask = () => {
    if (newTask.trim()) {
      updateRule('batchTasks', {
        tasks: [...batchTasks.tasks, newTask.trim()],
        completed: batchTasks.completed
      });
      setNewTask('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleRemoveTask = (task) => {
    updateRule('batchTasks', {
      tasks: batchTasks.tasks.filter(t => t !== task),
      completed: batchTasks.completed.filter(t => t !== task)
    });
  };

  const handleToggleComplete = (task) => {
    const isCompleted = batchTasks.completed.includes(task);
    updateRule('batchTasks', {
      tasks: batchTasks.tasks,
      completed: isCompleted
        ? batchTasks.completed.filter(t => t !== task)
        : [...batchTasks.completed, task]
    });
  };

  const completedCount = batchTasks.completed.length;
  const totalCount = batchTasks.tasks.length;

  return (
    <div className="space-y-4">
      {/* Add new task */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a small task to batch"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          size="sm"
          icon={Plus}
        >
          Add
        </Button>
      </div>

      {/* Task list */}
      {batchTasks.tasks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-charcoal/50 mb-2">
            No tasks yet. Add small tasks to knock out together.
          </p>
          <p className="text-xs text-charcoal/40">
            Examples: emails, scheduling, bills, returns
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {batchTasks.tasks.map((task, index) => {
            const isCompleted = batchTasks.completed.includes(task);

            return (
              <li
                key={`${task}-${index}`}
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-colors
                  ${isCompleted ? 'bg-green-50' : 'bg-gray-50'}
                `}
              >
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-colors
                    ${isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-barley-yellow'
                    }
                  `}
                >
                  {isCompleted && <Check className="w-3 h-3" />}
                </button>
                <span className={`flex-1 text-sm ${isCompleted ? 'line-through text-charcoal/40' : 'text-charcoal'}`}>
                  {task}
                </span>
                <button
                  onClick={() => handleRemoveTask(task)}
                  className="p-1 text-charcoal/30 hover:text-red-500 transition-colors"
                  aria-label="Remove task"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Progress */}
      {totalCount > 0 && (
        <div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-barley-yellow transition-all"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="text-sm text-charcoal/60 text-center mt-2">
            {completedCount} of {totalCount} batched tasks done
          </p>
        </div>
      )}
    </div>
  );
}

export default BatchTasksCard;
