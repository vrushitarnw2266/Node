import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EventChart from '../../components/charts/EventChart';
import { formatDate } from '../../utils/helpers';

export const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'all' | 'upcoming' | 'past'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedEventId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEventId) {
      try {
        await eventService.deleteEvent(selectedEventId);
        setEvents(prev => prev.filter(e => e.id !== selectedEventId));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteModalOpen(false);
        setSelectedEventId(null);
      }
    }
  };

  const filteredEvents = events.filter(evt => {
    const today = new Date();
    const eventDate = new Date(evt.date);
    if (filter === 'upcoming') {
      return eventDate >= today;
    } else if (filter === 'past') {
      return eventDate < today;
    }
    return true;
  });

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Campus Events Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Check and register for upcoming technology symposiums, seminars, and sports tournaments.
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button onClick={() => navigate('/events/add')} icon={<Plus size={16} />}>
            Create Event
          </Button>
        )}
      </div>

      {/* Visual RSVPs summary chart */}
      <div className="grid grid-cols-1 gap-6">
        <EventChart />
      </div>

      {/* Filters */}
      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
        {['upcoming', 'past', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {f} Events
          </button>
        ))}
      </div>

      {/* Cards List Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
          <p className="text-sm font-semibold text-slate-450">No events scheduled under this filter category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Coordinator: {event.coordinator || 'Department Staff'}
                    </p>
                  </div>
                </div>

                {/* Edit/Delete */}
                {user?.role === 'admin' && (
                  <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/events/edit/${event.id}`)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event.id)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-normal mt-4">
                {event.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>{formatDate(event.date)} &middot; {event.time}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Event Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to cancel and delete this event registration? Registered student participants will be notified of cancellation.
          </p>
          <div className="flex space-x-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Events;
