import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import feedbackService from '../../services/feedbackService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const AddFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!comment.trim()) newErrors.comment = 'Feedback comment is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        studentId: user.id || 'std-1',
        studentName: user.name || 'Marcus Sterling',
        rating,
        comment,
      };
      await feedbackService.createFeedback(payload);
      navigate('/feedback');
    } catch (err) {
      setErrors({ api: err.message || 'Failed to submit review. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/feedback')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Submit Campus Review</h2>
      </div>

      {errors.api && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          {errors.api}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        {/* Rating Selector */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
            Overall Rating Score
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-amber-500 focus:outline-none p-1"
              >
                <Star
                  size={26}
                  fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                  className={star <= (hoverRating || rating) ? '' : 'text-slate-200 dark:text-slate-800'}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <Input
          label="Review Details"
          name="comment"
          type="textarea"
          rows={5}
          placeholder="Briefly state your review, suggestions, or concerns regarding campus facilities or courses..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) setErrors({});
          }}
          error={errors.comment}
          required
        />

        <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={() => navigate('/feedback')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} icon={<Send size={15} />}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFeedback;
