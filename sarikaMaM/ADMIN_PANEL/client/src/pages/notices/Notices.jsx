import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import noticeService from '../../services/noticeService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/helpers';

export const Notices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await noticeService.getAllNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedNoticeId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNoticeId) {
      try {
        await noticeService.deleteNotice(selectedNoticeId);
        setNotices(prev => prev.filter(n => n.id !== selectedNoticeId));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteModalOpen(false);
        setSelectedNoticeId(null);
      }
    }
  };

  const categories = ['All', 'Academic', 'Exam', 'Event', 'General'];

  const filteredNotices = notices.filter(n => {
    if (activeCategory === 'All') return true;
    return n.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'academic':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25';
      case 'exam':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
      case 'event':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25';
      case 'general':
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25';
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Noticeboard Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated with official bulletins, holiday schedules, and examination sheets.
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <Button onClick={() => navigate('/notices/add')} icon={<Plus size={16} />}>
            Post Notice
          </Button>
        )}
      </div>

      {/* Category selector tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List Feed */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
          <p className="text-sm font-semibold text-slate-400">No announcements posted under this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group"
            >
              {/* Category tag */}
              <div className="flex justify-between items-start gap-4">
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border ${getCategoryColor(notice.category)}`}>
                  {notice.category}
                </span>

                {/* Edit/Delete for authorized users */}
                {(user?.role === 'admin' || user?.role === 'faculty') && (
                  <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/notices/edit/${notice.id}`)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(notice.id)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Content */}
              <div className="space-y-2 mt-4 flex-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-normal whitespace-pre-line">
                  {notice.content}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <User size={13} className="text-slate-400" />
                  <span>{notice.author}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{formatDate(notice.date)}</span>
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
        title="Confirm Notice Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete this bulletin notice from the noticeboard? This action is permanent and cannot be undone.
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

export default Notices;
