import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import studentService from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { getStatusColor } from '../../utils/helpers';

export const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedStudentId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStudentId) {
      try {
        await studentService.deleteStudent(selectedStudentId);
        setStudents((prev) => prev.filter(s => s.id !== selectedStudentId));
      } catch (error) {
        console.error('Error deleting student', error);
      } finally {
        setDeleteModalOpen(false);
        setSelectedStudentId(null);
      }
    }
  };

  const columns = [
    { header: 'Roll No', accessor: 'rollNo', cell: (row) => <span className="font-mono text-xs font-semibold">{row.rollNo}</span> },
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            {row.name.charAt(0)}
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
        </div>
      ),
    },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Year / Sem', accessor: 'year', cell: (row) => <span>{row.year} ({row.semester} Sem)</span> },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <div className="flex space-x-1.5">
      <Button
        variant="secondary"
        onClick={() => navigate(`/students/${row.id}`)}
        className="!p-2 hover:bg-indigo-500/10 hover:text-indigo-600"
        icon={<Eye size={15} />}
      />
      {user?.role === 'admin' && (
        <>
          <Button
            variant="secondary"
            onClick={() => navigate(`/students/edit/${row.id}`)}
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
            Students Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and manage all registered student accounts, departments, and active semester standings.
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button onClick={() => navigate('/students/add')} icon={<Plus size={16} />}>
            Register Student
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={students}
        searchField="name"
        searchPlaceholder="Search student by name..."
        actions={actions}
        loading={loading}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Student Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you absolutely sure you want to delete this student account? This action is permanent and cannot be undone. All active attendance logs and feedback records will be archived.
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

export default Students;
