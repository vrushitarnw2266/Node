import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Trash2, ToggleLeft, ToggleRight, Calendar, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user: currentUser, getAuthHeaders, API_URL } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to retrieve user accounts');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Check if backend server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${targetRole.toUpperCase()}?`)) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: targetRole }),
      });

      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(u => u._id === userId ? { ...u, role: targetRole } : u)
        );
      } else {
        const data = await response.json();
        alert(data.message || 'Role change failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will remove their account and ALL tasks assigned to them. Proceed?')) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      } else {
        const data = await response.json();
        alert(data.message || 'User deletion failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="main-content-layout">
      <Navbar title="System Admin Panel" />

      <div className="page-container">
        <div className="dashboard-title-section">
          <h1>User & System Management</h1>
          <p>View, edit roles, and manage all user accounts in the university system.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '25px' }}>
            {error}
          </div>
        )}

        <div className="admin-grid">
          {/* User management list */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--primary)" />
              <span>Registered Accounts ({users.length})</span>
            </h3>

            {loading ? (
              <div className="flex-center" style={{ padding: '40px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255, 255, 255, 0.05)',
                  borderTopColor: 'var(--primary)',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No registered users found.
              </div>
            ) : (
              <div className="user-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered On</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const isSelf = user._id === currentUser?._id;
                      return (
                        <tr key={user._id}>
                          <td style={{ fontWeight: '500' }}>
                            {user.name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '6px' }}>(You)</span>}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'badge-completed' : 'badge-progress'}`} style={{ fontSize: '0.7rem' }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(user.createdAt)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                              {!isSelf ? (
                                <>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleToggleRole(user._id, user.role)}
                                    title="Toggle Role"
                                    style={{ padding: '6px' }}
                                  >
                                    {user.role === 'admin' ? <ToggleRight size={18} color="var(--success)" /> : <ToggleLeft size={18} color="var(--text-muted)" />}
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteUser(user._id)}
                                    title="Delete Account"
                                    style={{ padding: '6px' }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingRight: '10px' }}>Locked</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
