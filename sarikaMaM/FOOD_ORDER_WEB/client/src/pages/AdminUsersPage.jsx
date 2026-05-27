import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function AdminUsersPage({ api }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  async function fetchUsers() {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }

  async function openUser(userId) {
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/api/admin/users/${userId}`);
      setSelected(data);
    } catch (err) {
      alert("Failed to load user details");
    } finally {
      setDetailsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchUsers();
      if (selected?.user?._id) {
        openUser(selected.user._id);
      }
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, selected]);

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <section className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-kk-dark">Admin — Users</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchUsers} className="px-4 py-2 bg-kk-dark/5 rounded-lg hover:bg-kk-dark/10 font-bold">🔄 Refresh</button>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-kk-dark/5 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm font-bold">Auto</span>
          </label>
          {autoRefresh && (
            <select value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))} className="px-3 py-2 rounded-lg border bg-white text-sm">
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
            </select>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="p-4 rounded-xl glass-card cursor-pointer hover:shadow-md" onClick={() => openUser(u._id)}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="m-0 font-bold">{u.name}</h4>
                  <p className="text-xs text-kk-dark/50">{u.email}</p>
                </div>
                <div className="text-sm text-kk-dark/60">{u.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {detailsLoading ? (
            <div className="p-10 text-center">Loading details...</div>
          ) : selected ? (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="m-0 text-xl font-bold">{selected.user.name}</h3>
                  <p className="text-sm text-kk-dark/60">{selected.user.email}</p>
                </div>
                <div>
                  <Link to="/admin" className="px-3 py-2 bg-kk-dark/5 rounded-lg">Admin Home</Link>
                </div>
              </div>

              <section className="mb-6">
                <h4 className="text-sm font-bold text-kk-dark/60 mb-2">Orders</h4>
                {selected.orders.length === 0 ? (
                  <p className="text-kk-dark/60">No orders found for this user.</p>
                ) : (
                  <div className="space-y-3">
                    {selected.orders.map((o) => (
                      <div key={o._id} className="p-3 rounded-lg bg-kk-dark/5 flex items-center justify-between">
                        <div>
                          <div className="font-bold">#{o._id.slice(-6).toUpperCase()} — Rs {o.totalAmount}</div>
                          <div className="text-xs text-kk-dark/60">{o.status} • {new Date(o.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/admin`} className="px-3 py-1 rounded-lg bg-kk-red text-white text-sm">Manage</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-sm font-bold text-kk-dark/60 mb-2">Bookings</h4>
                {selected.bookings.length === 0 ? (
                  <p className="text-kk-dark/60">No bookings found for this user.</p>
                ) : (
                  <div className="space-y-3">
                    {selected.bookings.map((b) => (
                      <div key={b._id} className="p-3 rounded-lg bg-kk-dark/5 flex items-center justify-between">
                        <div>
                          <div className="font-bold">{b.date} • {b.time}</div>
                          <div className="text-xs text-kk-dark/60">{b.guests} Guests • {b.status}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => { await api.patch(`/api/admin/bookings/${b._id}`, { status: 'Confirmed' }); openUser(selected.user._id); }} className="px-3 py-1 rounded-lg bg-kk-green text-white text-sm">Confirm</button>
                          <button onClick={async () => { await api.patch(`/api/admin/bookings/${b._id}`, { status: 'Cancelled' }); openUser(selected.user._id); }} className="px-3 py-1 rounded-lg border border-kk-red text-kk-red text-sm">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="glass-card p-20 rounded-2xl text-center">Select a user to view details</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminUsersPage;
