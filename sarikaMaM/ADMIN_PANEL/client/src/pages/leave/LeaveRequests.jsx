import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Check, X, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import leaveService from '../../services/leaveService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { getStatusColor, formatDate } from '../../utils/helpers';

export const LeaveRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let data = [];
      if (user.role === 'admin') {
        data = await leaveService.getAllLeaves();
      } else if (user.role === 'faculty') {
        // Faculty can inspect department leaves, or see their own. Let's list all for admin/faculty logs.
        data = await leaveService.getAllLeaves();
      } else {
        // Students see their own leaves
        data = await leaveService.getLeavesByUserId(user.id || 'std-1');
      }
      setLeaves(data);
    } catch (err) {
      console.error('Error fetching leaves list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      await leaveService.updateLeaveStatus(id, status);
      setLeaves(prev =>
        prev.map(item => (item.id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error('Error updating leave status', err);
    }
  };

  const columns = [
    { header: 'Applicant Name', accessor: 'userName', cell: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.userName}</span> },
    { header: 'Role', accessor: 'userRole', cell: (row) => <span className="capitalize font-bold text-xs text-slate-400">{row.userRole}</span> },
    { header: 'Leave Type', accessor: 'type', cell: (row) => <span className="font-bold text-slate-700 dark:text-slate-350">{row.type}</span> },
    { header: 'Duration', accessor: 'startDate', cell: (row) => <span>{formatDate(row.startDate)} to {formatDate(row.endDate)}</span> },
    { header: 'Reason Description', accessor: 'reason', cell: (row) => <span className="text-xs text-slate-450 dark:text-slate-500 line-clamp-1 max-w-[200px]">{row.reason}</span> },
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

  const actions = (row) => {
    // Only administrators or faculty can approve/reject student/peer requests
    const canApprove = (user?.role === 'admin' || user?.role === 'faculty') && row.status === 'pending';
    if (!canApprove) return null;

    return (
      <div className="flex space-x-1.5">
        <Button
          variant="secondary"
          onClick={() => handleStatusChange(row.id, 'approved')}
          className="!p-1.5 hover:bg-emerald-500/10 hover:text-emerald-500"
          icon={<Check size={14} />}
        />
        <Button
          variant="secondary"
          onClick={() => handleStatusChange(row.id, 'rejected')}
          className="!p-1.5 hover:bg-rose-500/10 hover:text-rose-500"
          icon={<X size={14} />}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Leave Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse leave applications submitted by campus staff and student classes.
          </p>
        </div>

        {user?.role !== 'admin' && (
          <Button onClick={() => navigate('/leave/apply')} icon={<Plus size={16} />}>
            Apply Leave
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={leaves}
        searchField="userName"
        searchPlaceholder="Search applicant name..."
        actions={actions}
        loading={loading}
      />
    </div>
  );
};

export default LeaveRequests;
