import { useState } from 'react';
import { Plus, X, Clock, Trash2, Edit2, Check } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { useWeekData } from '../../hooks/useWeekData';
import { getWeekDays, formatDate, getDayName } from '../../utils/dateUtils';

export function WeeklyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { weekData, addEvent, updateEvent, removeEvent } = useWeekData(currentDate);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const weekDays = getWeekDays(currentDate);
  const events = weekData?.events || [];

  const getEventsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events
      .filter(e => e.date === dateStr)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  const handleAddEvent = (eventData) => {
    addEvent(eventData);
    setShowAddModal(false);
    setSelectedDay(null);
  };

  const handleUpdateEvent = (eventId, updates) => {
    updateEvent(eventId, updates);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Delete this event?')) {
      removeEvent(eventId);
    }
  };

  const openAddModal = (day) => {
    setSelectedDay(day);
    setShowAddModal(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-charcoal">Weekly Planner</h1>
          <button
            onClick={() => openAddModal(new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-balanced-teal text-white rounded-lg hover:bg-balanced-teal/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const dayName = getDayName(day);

            return (
              <div
                key={day.toISOString()}
                className={`
                  bg-white rounded-xl p-3 min-h-[200px] flex flex-col
                  ${isToday ? 'ring-2 ring-balanced-teal' : ''}
                `}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div>
                    <p className={`text-xs font-medium ${isToday ? 'text-balanced-teal' : 'text-charcoal/50'}`}>
                      {dayName}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-balanced-teal' : 'text-charcoal'}`}>
                      {day.getDate()}
                    </p>
                  </div>
                  <button
                    onClick={() => openAddModal(day)}
                    className="p-1 text-charcoal/30 hover:text-balanced-teal transition-colors"
                    title="Add event"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Events */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={() => setEditingEvent(event)}
                      onDelete={() => handleDeleteEvent(event.id)}
                      onToggleComplete={() => handleUpdateEvent(event.id, { completed: !event.completed })}
                    />
                  ))}
                  {dayEvents.length === 0 && (
                    <p className="text-xs text-charcoal/30 text-center py-4">
                      No events
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <EventModal
            day={selectedDay}
            onSave={handleAddEvent}
            onClose={() => {
              setShowAddModal(false);
              setSelectedDay(null);
            }}
          />
        )}

        {/* Edit Event Modal */}
        {editingEvent && (
          <EventModal
            day={new Date(editingEvent.date)}
            event={editingEvent}
            onSave={(updates) => handleUpdateEvent(editingEvent.id, updates)}
            onClose={() => setEditingEvent(null)}
          />
        )}
      </div>
    </Layout>
  );
}

function EventCard({ event, onEdit, onDelete, onToggleComplete }) {
  const colorClasses = {
    work: 'bg-balanced-teal/10 border-balanced-teal/30',
    personal: 'bg-teasel-lilac/10 border-teasel-lilac/30',
    health: 'bg-gelato-mint/10 border-gelato-mint/30',
    social: 'bg-rainfall/10 border-rainfall/30',
    other: 'bg-gray-100 border-gray-200'
  };

  return (
    <div
      className={`
        p-2 rounded-lg border text-xs group
        ${colorClasses[event.category] || colorClasses.other}
        ${event.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          {event.time && (
            <p className="text-charcoal/50 flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3" />
              {event.time}
            </p>
          )}
          <p className={`font-medium text-charcoal truncate ${event.completed ? 'line-through' : ''}`}>
            {event.title}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleComplete}
            className={`p-1 rounded ${event.completed ? 'text-green-500' : 'text-charcoal/30 hover:text-green-500'}`}
            title={event.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-charcoal/30 hover:text-balanced-teal"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-charcoal/30 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventModal({ day, event, onSave, onClose }) {
  const [title, setTitle] = useState(event?.title || '');
  const [time, setTime] = useState(event?.time || '');
  const [category, setCategory] = useState(event?.category || 'other');
  const [notes, setNotes] = useState(event?.notes || '');

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-balanced-teal' },
    { value: 'personal', label: 'Personal', color: 'bg-teasel-lilac' },
    { value: 'health', label: 'Health', color: 'bg-gelato-mint' },
    { value: 'social', label: 'Social', color: 'bg-rainfall' },
    { value: 'other', label: 'Other', color: 'bg-gray-400' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      date: day.toISOString().split('T')[0],
      time: time || null,
      category,
      notes: notes.trim(),
      completed: event?.completed || false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-charcoal">
            {event ? 'Edit Event' : 'Add Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-charcoal/50 hover:text-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-charcoal/60 mb-4">
          {formatDate(day)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting, appointment, task..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Time (optional)
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${category === cat.value
                      ? `${cat.color} text-white`
                      : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-balanced-teal resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-balanced-teal text-white py-2.5 rounded-xl font-medium hover:bg-balanced-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event ? 'Save Changes' : 'Add Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-charcoal/60 hover:text-charcoal font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WeeklyPlanner;
