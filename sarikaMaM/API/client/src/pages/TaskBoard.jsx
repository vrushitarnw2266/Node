import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Trash2, 
  Edit3, 
  Play, 
  Check, 
  RotateCcw, 
  X,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const TaskBoard = () => {
  const { user, getAuthHeaders, API_URL } = useAuth();
  
  // State variables
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // for admin assignment dropdown
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Modal control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // New/Edit task form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formAssignedTo, setFormAssignedTo] = useState('');

  // Fetch all tasks and user list (if admin)
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch Tasks
      const tasksRes = await fetch(`${API_URL}/tasks`, {
        headers: getAuthHeaders(),
      });
      const tasksData = await tasksRes.json();
      
      if (tasksRes.ok) {
        setTasks(tasksData);
      } else {
        setErrorMsg(tasksData.message || 'Failed to fetch tasks');
      }

      // If admin, fetch users for assignment
      if (user?.role === 'admin') {
        const usersRes = await fetch(`${API_URL}/users`, {
          headers: getAuthHeaders(),
        });
        const usersData = await usersRes.json();
        if (usersRes.ok) {
          setUsers(usersData);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error occurred while retrieving tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set form values when editing a task
  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormTitle(task.title);
      setFormDescription(task.description || '');
      setFormPriority(task.priority);
      setFormDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
      setFormCategory(task.category || 'General');
      setFormAssignedTo(task.assignedTo?._id || task.assignedTo || '');
    } else {
      setEditingTask(null);
      setFormTitle('');
      setFormDescription('');
      setFormPriority('medium');
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormDueDate(tomorrow.toISOString().substring(0, 10));
      setFormCategory('General');
      setFormAssignedTo(user?._id || '');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Submit new task or task edits
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formDueDate) {
      alert('Please fill out the Title and Due Date fields.');
      return;
    }

    const taskPayload = {
      title: formTitle,
      description: formDescription,
      priority: formPriority,
      dueDate: formDueDate,
      category: formCategory,
      assignedTo: user?.role === 'admin' ? formAssignedTo : undefined,
    };

    try {
      let response;
      if (editingTask) {
        // Edit Task
        response = await fetch(`${API_URL}/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(taskPayload),
        });
      } else {
        // Create Task
        response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(taskPayload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        closeModal();
        fetchData(); // Reload tasks
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  // Transition task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Optimistically update status in state
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t)
        );
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Extract unique categories from tasks for filter dropdown
  const uniqueCategories = ['All', ...new Set(tasks.map(t => t.category || 'General'))];

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = 
      filterCategory === 'All' || 
      (task.category || 'General') === filterCategory;

    const matchesPriority = 
      filterPriority === 'All' || 
      task.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getStatusColumnTasks = (status) => {
    return filteredTasks.filter(t => t.status === status);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="main-content-layout">
      <Navbar title="Project Tasks Board" />

      <div className="page-container">
        {/* Filters and Add Task Section */}
        <div className="board-filters">
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '44px' }}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <select
              className="glass-input filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {uniqueCategories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="glass-input filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button 
              className="btn btn-primary"
              onClick={() => openModal()}
              style={{ flexShrink: 0 }}
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '25px' }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.05)',
              borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        ) : (
          /* Kanban Layout */
          <div className="kanban-layout">
            
            {/* COLUMN 1: PENDING */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-title">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
                  <span>Pending</span>
                </div>
                <span className="task-count-badge">{getStatusColumnTasks('pending').length}</span>
              </div>
              
              <div className="tasks-list">
                {getStatusColumnTasks('pending').map(task => (
                  <div key={task._id} className="task-card">
                    <div className="task-card-header flex-between">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.category || 'General'}</span>
                    </div>
                    <h4 className="task-card-title">{task.title}</h4>
                    {task.description && <p className="task-card-desc">{task.description}</p>}
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                      >
                        <Play size={12} />
                        <span>Start</span>
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleStatusChange(task._id, 'completed')}
                      >
                        <Check size={12} />
                        <span>Complete</span>
                      </button>
                    </div>

                    <div className="task-card-footer">
                      <div className="task-meta">
                        <Calendar size={12} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Edit3 size={14} style={{ cursor: 'pointer' }} onClick={() => openModal(task)} />
                        <Trash2 size={14} style={{ cursor: 'pointer', color: 'var(--danger)' }} onClick={() => handleDeleteTask(task._id)} />
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '10px', paddingTop: '8px' }}>
                        Assigned to: <span style={{ color: 'var(--text-secondary)' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-title">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--info)' }} />
                  <span>In Progress</span>
                </div>
                <span className="task-count-badge">{getStatusColumnTasks('in-progress').length}</span>
              </div>

              <div className="tasks-list">
                {getStatusColumnTasks('in-progress').map(task => (
                  <div key={task._id} className="task-card">
                    <div className="task-card-header flex-between">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.category || 'General'}</span>
                    </div>
                    <h4 className="task-card-title">{task.title}</h4>
                    {task.description && <p className="task-card-desc">{task.description}</p>}
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleStatusChange(task._id, 'completed')}
                      >
                        <Check size={12} />
                        <span>Complete</span>
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleStatusChange(task._id, 'pending')}
                      >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="task-card-footer">
                      <div className="task-meta">
                        <Calendar size={12} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Edit3 size={14} style={{ cursor: 'pointer' }} onClick={() => openModal(task)} />
                        <Trash2 size={14} style={{ cursor: 'pointer', color: 'var(--danger)' }} onClick={() => handleDeleteTask(task._id)} />
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '10px', paddingTop: '8px' }}>
                        Assigned to: <span style={{ color: 'var(--text-secondary)' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-title">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                  <span>Completed</span>
                </div>
                <span className="task-count-badge">{getStatusColumnTasks('completed').length}</span>
              </div>

              <div className="tasks-list">
                {getStatusColumnTasks('completed').map(task => (
                  <div key={task._id} className="task-card" style={{ opacity: 0.75 }}>
                    <div className="task-card-header flex-between">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.category || 'General'}</span>
                    </div>
                    <h4 className="task-card-title" style={{ textDecoration: 'line-through' }}>{task.title}</h4>
                    {task.description && <p className="task-card-desc">{task.description}</p>}
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                      >
                        <RotateCcw size={12} />
                        <span>Reopen</span>
                      </button>
                    </div>

                    <div className="task-card-footer">
                      <div className="task-meta">
                        <Calendar size={12} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Edit3 size={14} style={{ cursor: 'pointer' }} onClick={() => openModal(task)} />
                        <Trash2 size={14} style={{ cursor: 'pointer', color: 'var(--danger)' }} onClick={() => handleDeleteTask(task._id)} />
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '10px', paddingTop: '8px' }}>
                        Assigned to: <span style={{ color: 'var(--text-secondary)' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Task Creation / Editing Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {editingTask ? 'Edit Task Info' : 'Create New Task'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="glass-label" htmlFor="taskTitle">Task Title *</label>
                <input
                  id="taskTitle"
                  type="text"
                  className="glass-input"
                  placeholder="Review server routes..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="glass-label" htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  className="glass-input"
                  rows="3"
                  style={{ resize: 'none' }}
                  placeholder="Provide detailed instructions..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="glass-label" htmlFor="taskPriority">Priority</label>
                  <select
                    id="taskPriority"
                    className="glass-input"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="glass-label" htmlFor="taskCategory">Category</label>
                  <input
                    id="taskCategory"
                    type="text"
                    className="glass-input"
                    placeholder="Work, Study, Urgent..."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="glass-label" htmlFor="taskDueDate">Due Date *</label>
                  <input
                    id="taskDueDate"
                    type="date"
                    className="glass-input"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {user?.role === 'admin' && (
                <div className="form-group">
                  <label className="glass-label" htmlFor="taskAssignee">Assign To User</label>
                  <select
                    id="taskAssignee"
                    className="glass-input"
                    value={formAssignedTo}
                    onChange={(e) => setFormAssignedTo(e.target.value)}
                  >
                    <option value="">Choose User</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
