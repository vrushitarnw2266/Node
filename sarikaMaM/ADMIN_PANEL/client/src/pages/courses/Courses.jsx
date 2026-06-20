import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Award, Calendar } from 'lucide-react';
import courseService from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedCourseId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCourseId) {
      try {
        await courseService.deleteCourse(selectedCourseId);
        setCourses((prev) => prev.filter(c => c.id !== selectedCourseId));
      } catch (error) {
        console.error('Error deleting course', error);
      } finally {
        setDeleteModalOpen(false);
        setSelectedCourseId(null);
      }
    }
  };

  const columns = [
    { header: 'Course Code', accessor: 'code', cell: (row) => <span className="font-mono text-xs font-bold bg-indigo-500/10 px-2 py-1 rounded-md text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">{row.code}</span> },
    { header: 'Course Name', accessor: 'name', cell: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Credits', accessor: 'credits', cell: (row) => (
      <div className="flex items-center space-x-1">
        <Award size={14} className="text-amber-500" />
        <span className="font-bold">{row.credits} Credits</span>
      </div>
    )},
    { header: 'Duration', accessor: 'duration', cell: (row) => (
      <div className="flex items-center space-x-1">
        <Calendar size={14} className="text-slate-400" />
        <span>{row.duration}</span>
      </div>
    )},
    { header: 'Syllabus Outline', accessor: 'syllabus', cell: (row) => <p className="truncate max-w-[200px] text-xs text-slate-400">{row.syllabus}</p> },
  ];

  const actions = (row) => (
    <div className="flex space-x-1.5">
      {user?.role === 'admin' && (
        <>
          <Button
            variant="secondary"
            onClick={() => navigate(`/courses/edit/${row.id}`)}
            className="!p-2 hover:bg-amber-500/10 hover:text-amber-600"
            icon={<Edit2 size={15} />}
          />
          <Button
            variant="secondary"
            onClick={() => handleDeleteClick(row.id)}
            className="!p-2 hover:bg-rose-500/10 hover:text-rose-600"
            icon={<Trash2 size={15} />}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Campus Course Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and regulate syllabus materials, credit scores, and study programs.
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button onClick={() => navigate('/courses/add')} icon={<Plus size={16} />}>
            Add Course
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={courses}
        searchField="name"
        searchPlaceholder="Search courses by title..."
        actions={actions}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Course Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you absolutely sure you want to delete this course from the university index? Doing so will dissociate students currently studying it.
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

export default Courses;
