import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function MyBookingsPage({ api }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMyBookings() {
    try {
      const { data } = await api.get("/api/bookings/my");
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch your bookings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyBookings();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-kk-dark/50">Loading your reservations...</div>;

  return (
    <section className="animate-fade-in space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-kk-dark">My <span className="text-kk-red">Reservations</span></h2>
        <p className="text-kk-dark/60 mt-2">Track the status of your table booking requests.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card p-20 text-center rounded-[2.5rem] premium-shadow">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-kk-dark">No reservations found</h3>
          <p className="text-kk-dark/60 mt-2">Planning a dinner? Reserve your table now!</p>
          <Link to="/book" className="btn-gradient mt-8 inline-block px-8 py-3 no-underline">Book a Table</Link>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {bookings.map((b) => (
            <div key={b._id} className="glass-card premium-shadow rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left space-y-1">
                <p className="m-0 text-xs font-bold text-kk-dark/50 uppercase tracking-widest">Reservation for</p>
                <h3 className="m-0 text-xl font-bold text-kk-dark">{b.date} at {b.time}</h3>
                <p className="m-0 text-sm text-kk-dark/70 font-medium">{b.guests} Guests • {b.name}</p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  b.status === 'Confirmed' ? 'bg-kk-green/10 text-kk-green' : 
                  b.status === 'Cancelled' ? 'bg-kk-red/10 text-kk-red' : 
                  'bg-yellow-500/10 text-yellow-600'
                }`}>
                  {b.status}
                </span>
                <p className="m-0 text-[10px] text-kk-dark/40 font-bold uppercase">Requested on {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
