import { useEffect, useState } from "react";

export function AdminDashboard({ api }) {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds

  async function fetchAll() {
    setLoading(true);
    try {
      const [oRes, bRes, uRes] = await Promise.all([
        api.get("/api/orders/all"),
        api.get("/api/admin/bookings"),
        api.get("/api/admin/users"),
      ]);
      setOrders(oRes.data.orders || []);
      setBookings(bRes.data || []);
      setUsers(uRes.data.users || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAll();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  async function updateOrder(id, updates) {
    try {
      await api.patch(`/api/orders/${id}/status`, updates);
      fetchAll();
    } catch (err) {
      alert("Failed to update order");
    }
  }

  async function updateBooking(id, status) {
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status });
      fetchAll();
    } catch (err) {
      alert("Failed to update booking");
    }
  }

  if (loading) return <div className="p-10 text-center">Loading admin dashboard...</div>;

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchAll} className="px-4 py-2 bg-kk-dark/5 rounded-lg hover:bg-kk-dark/10">🔄 Refresh Now</button>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-kk-dark/5 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm font-bold">Auto-refresh</span>
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
        <div>
          <h3 className="text-lg font-bold mb-2">Orders</h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="p-4 rounded-lg glass-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">#{order._id.slice(-6).toUpperCase()} • Rs {order.totalAmount}</div>
                    <div className="text-xs text-kk-dark/60">{order.userName} • {order.status}</div>
                    <div className="text-xs text-kk-dark/50">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <select value={order.status} onChange={(e) => updateOrder(order._id, { status: e.target.value })} className="rounded-lg border px-2 py-1">
                      <option>Order Placed</option>
                      <option>Preparing</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                    <div className="mt-2 text-xs">
                      <input type="text" defaultValue={order.deliveryBoyLocation} onBlur={(e) => updateOrder(order._id, { deliveryBoyLocation: e.target.value })} className="rounded-lg border px-2 py-1 text-sm" placeholder="Delivery location" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Reservations</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="p-4 rounded-lg glass-card flex justify-between items-center">
                <div>
                  <div className="font-bold">{b.date} • {b.time}</div>
                  <div className="text-xs text-kk-dark/60">{b.name} • {b.guests} Guests</div>
                </div>
                <div className="flex gap-2">
                  {b.status === 'Pending' && (
                    <>
                      <button onClick={() => updateBooking(b._id, 'Confirmed')} className="px-3 py-1 rounded-lg bg-kk-green text-white">Confirm</button>
                      <button onClick={() => updateBooking(b._id, 'Cancelled')} className="px-3 py-1 rounded-lg border border-kk-red text-kk-red">Cancel</button>
                    </>
                  )}
                  {b.status !== 'Pending' && (
                    <button onClick={() => updateBooking(b._id, 'Pending')} className="px-3 py-1 rounded-lg">Reset</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Users</h3>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u._id} className="p-4 rounded-lg glass-card flex justify-between items-center">
                <div>
                  <div className="font-bold">{u.name}</div>
                  <div className="text-xs text-kk-dark/60">{u.email} • {u.role}</div>
                </div>
                <div className="text-xs">{new Date(u.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
