import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, getAuthHeaders, API_URL } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await fetch(`${API_URL}/tasks/stats`, {
          headers: getAuthHeaders(),
        });
        const statsData = await statsRes.json();

        // Fetch tasks
        const tasksRes = await fetch(`${API_URL}/tasks`, {
          headers: getAuthHeaders(),
        });
        const tasksData = await tasksRes.json();

        if (statsRes.ok && tasksRes.ok) {
          setStats(statsData);
          // Get top 4 pending/in-progress tasks sorted by due date or priority
          const activeTasks = tasksData
            .filter(t => t.status !== 'completed')
            .slice(0, 4);
          setRecentTasks(activeTasks);
        } else {
          setError('Failed to fetch dashboard content');
        }
      } catch (err) {
        console.error(err);
        setError('Network error occurred while fetching dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  // Circumference for 60px radius circle is ~377
  const strokeDashoffset = 377 - (completionRate / 100) * 377;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="main-content-layout">
        <Navbar title="Dashboard" />
        <div className="page-container flex-center">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.05)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-layout">
      <Navbar title="Dashboard Overview" />
      
      <div className="page-container">
        <div className="dashboard-title-section">
          <h1>Welcome Back, {user?.name}!</h1>
          <p>Here is your task summary and team status for today.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '25px' }}>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <CheckSquare size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.total}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <CheckSquare size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-details">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-charts-layout">
          {/* Recent Action List */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary)" />
              <span>Active Assigned Tasks</span>
            </h3>

            {recentTasks.length === 0 ? (
              <div className="flex-center" style={{ flexGrow: 1, flexDirection: 'column', padding: '40px', gap: '15px' }}>
                <CheckSquare size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)' }}>All caught up! No active tasks assigned.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className="flex-between"
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{task.title}</h4>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span className={`badge badge-${task.status === 'in-progress' ? 'progress' : task.status}`}>{task.status}</span>
                        <span className={`badge badge-${task.priority}`}>{task.priority} Priority</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div style={{ fontSize: '0.8rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                        Assigned: <span style={{ color: 'var(--text-secondary)' }}>{task.assignedTo?.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Circle Card */}
          <div className="glass-card progress-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Task Progress</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Overall Completion Rate</p>

            <div className="progress-circle-container">
              <svg className="progress-circle-svg" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
                <circle className="progress-circle-bg" cx="70" cy="70" r="60" />
                <circle 
                  className="progress-circle-val" 
                  cx="70" 
                  cy="70" 
                  r="60" 
                  style={{ strokeDashoffset }}
                />
              </svg>
              <div className="progress-percent-text">{completionRate}%</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                <span>{stats.completed} Done</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
                <span>{stats.total - stats.completed} Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
