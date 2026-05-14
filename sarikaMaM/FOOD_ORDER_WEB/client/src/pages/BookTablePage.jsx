import { useState } from "react";

const fieldCls = "flex flex-col gap-2 font-bold text-xs uppercase tracking-widest text-kk-dark/70";
const inputCls = "rounded-2xl border border-gray-200 px-4 py-3 text-base text-kk-dark bg-white focus:ring-2 focus:ring-kk-red/20 outline-none transition-all";

export function BookTablePage({ api }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2", note: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/bookings", form);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to request table. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-kk-dark">Reserve Your Table</h2>
        <p className="text-gray-500 mt-2">Join us for an unforgettable vegetarian dining experience.</p>
      </div>

      <div className="glass-card premium-shadow rounded-[2.5rem] p-10">
        {submitted ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-2xl font-bold text-kk-green mb-2">Booking Requested!</h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Thank you, {form.name}! We've received your request for {form.guests} guests on {form.date} at {form.time}. We'll call you shortly to confirm.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-gradient mt-8">Make Another Booking</button>
          </div>
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            <div className={fieldCls}>
              Name
              <input className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className={fieldCls}>
              Phone
              <input className={inputCls} required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number" />
            </div>
            <div className={fieldCls}>
              Date
              <input className={inputCls} required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className={fieldCls}>
              Time
              <input className={inputCls} required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className={fieldCls}>
              Guests
              <select className={inputCls} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={String(n)}>{n} Guests</option>
                ))}
              </select>
            </div>
            <div className={`${fieldCls} md:col-span-2`}>
              Special Notes
              <textarea className={inputCls} rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Any special occasion or dietary requirements?" />
            </div>
            <div className="md:col-span-2 flex justify-center mt-4">
              <button type="submit" disabled={loading} className="btn-gradient px-12 py-4 text-lg disabled:opacity-50">
                {loading ? "Processing..." : "Request Table"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
