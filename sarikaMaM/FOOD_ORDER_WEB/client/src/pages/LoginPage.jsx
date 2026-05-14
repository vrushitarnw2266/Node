import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage({ onLogin, api }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      onLogin(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="animate-fade-in flex min-h-[60vh] items-center justify-center">
      <div className="glass-card premium-shadow w-full max-w-md rounded-[2.5rem] p-10">
        <h2 className="text-3xl font-bold text-kk-dark mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Please enter your details to login</p>
        
        {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-xs uppercase tracking-widest text-gray-400">Email Address</label>
            <input 
              className="rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-kk-red/20 outline-none transition-all"
              type="email" 
              required 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-xs uppercase tracking-widest text-gray-400">Password</label>
            <input 
              className="rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-kk-red/20 outline-none transition-all"
              type="password" 
              required 
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-gradient w-full py-4 text-lg mt-4">Login</button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-kk-red hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}
