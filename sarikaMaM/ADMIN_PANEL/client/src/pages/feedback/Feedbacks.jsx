import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import feedbackService from '../../services/feedbackService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

export const Feedbacks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        let data = [];
        if (user.role === 'student') {
          // Students see their own feedback
          data = await feedbackService.getFeedbackByUserId(user.id || 'std-1');
        } else {
          // Admin/Faculty see all reviews
          data = await feedbackService.getAllFeedback();
        }
        setFeedbacks(data);
      } catch (err) {
        console.error('Error fetching feedbacks list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [user]);

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? 'currentColor' : 'none'}
            className={star <= rating ? '' : 'text-slate-200 dark:text-slate-800'}
          />
        ))}
      </div>
    );
  };

  const columns = [
    { header: 'Student Name', accessor: 'studentName', cell: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.studentName}</span> },
    {
      header: 'Score Rating',
      accessor: 'rating',
      cell: (row) => renderStars(row.rating),
    },
    { header: 'Comments', accessor: 'comment', cell: (row) => <span className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{row.comment}</span> },
    { header: 'Posted Date', accessor: 'date', cell: (row) => <span>{formatDate(row.date)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Student Feedback & Reviews
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse suggestions and reviews submitted by campus students.
          </p>
        </div>

        {user?.role === 'student' && (
          <Button onClick={() => navigate('/feedback/add')} icon={<Plus size={16} />}>
            Submit Feedback
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={feedbacks}
        searchField="studentName"
        searchPlaceholder="Search student name..."
        loading={loading}
      />
    </div>
  );
};

export default Feedbacks;
