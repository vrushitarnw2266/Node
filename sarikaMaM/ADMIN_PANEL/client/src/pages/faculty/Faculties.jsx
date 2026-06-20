import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import facultyService from '../../services/facultyService';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { getStatusColor, formatDate } from '../../utils/helpers';

export const Faculties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getAllFaculty();
      setFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedFacultyId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFacultyId) {
      try {
        await facultyService.deleteFaculty(selectedFacultyId);
        setFaculty((prev) => prev.filter(f => f.id !== selectedFacultyId));
      } catch (error) {
        console.error('Error deleting faculty', error);
      } finally {
        setDeleteModalOpen(false);
        setSelectedFacultyId(null);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'facultyId', cell: (row) => <span className="font-mono text-xs font-semibold">{row.facultyId}</span> },
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            {row.name.charAt(row.name.startsWith('Dr.') || row.name.startsWith('Prof.') ? row.name.indexOf('.') + 2 : 0)}
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
        </div>
      ),
    },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Joining Date', accessor: 'joiningDate', cell: (row) => <span>{formatDate(row.joiningDate)}</span> },
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
      {user?.role === 'admin' && (
        <>
          <Button
            variant="secondary"
            onClick={() => navigate(`/faculty/edit/${row.id}`)}
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
            Faculty Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and coordinate academic staff profiles, departments, and titles.
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button onClick={() => navigate('/faculty/add')} icon={<Plus size={16} />}>
            Add Faculty
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={faculty}
        searchField="name"
        searchPlaceholder="Search staff by name..."
        actions={actions}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Faculty Staff Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you absolutely sure you want to delete this faculty account? This will clear all links to registered courses and active leaves.
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

export default Faculties;
