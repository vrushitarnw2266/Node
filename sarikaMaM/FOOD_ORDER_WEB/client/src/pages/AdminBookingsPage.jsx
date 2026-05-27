import { useEffect, useState } from "react";

export function AdminBookingsPage({ api }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  async function fetchBookings() {
    try {
      const { data } = await api.get("/api/admin/bookings");
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert("Failed to update booking status");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchBookings();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  if (loading) return <div className="p-20 text-center font-bold text-kk-dark/50">Loading Bookings...</div>;

  return (
    <section className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-black text-kk-dark">Table <span className="text-kk-red">Reservations</span></h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchBookings} className="px-4 py-2 bg-kk-dark/5 hover:bg-kk-dark/10 rounded-xl transition-all font-bold">🔄 Refresh</button>
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

      {bookings.length === 0 ? (
        <div className="glass-card p-20 text-center rounded-[2.5rem] premium-shadow">
          <div className="text-6xl mb-4">🪑</div>
          <h3 className="text-xl font-bold text-kk-dark">No reservation requests yet</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div key={b._id} className="glass-card premium-shadow rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="m-0 text-xl font-bold text-kk-dark">{b.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    b.status === 'Confirmed' ? 'bg-kk-green/10 text-kk-green' : 
                    b.status === 'Cancelled' ? 'bg-kk-red/10 text-kk-red' : 
                    'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-kk-dark/60">
                  <p className="m-0">📞 {b.phone}</p>
                  <p className="m-0">📅 {b.date}</p>
                  <p className="m-0">🕒 {b.time}</p>
                  <p className="m-0">👥 {b.guests} Guests</p>
                </div>
                {b.note && <p className="mt-4 p-3 bg-kk-dark/5 rounded-xl text-sm italic text-kk-dark/70">"{b.note}"</p>}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {b.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(b._id, 'Confirmed')} className="flex-1 md:flex-none px-6 py-3 bg-kk-green text-white rounded-xl font-bold hover:opacity-90 transition">Confirm</button>
                    <button onClick={() => updateStatus(b._id, 'Cancelled')} className="flex-1 md:flex-none px-6 py-3 border border-kk-red/20 text-kk-red rounded-xl font-bold hover:bg-kk-red/5 transition">Cancel</button>
                  </>
                )}
                {b.status !== 'Pending' && (
                  <button onClick={() => updateStatus(b._id, 'Pending')} className="px-4 py-2 text-xs font-bold text-kk-dark/40 hover:text-kk-dark transition">Reset to Pending</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
