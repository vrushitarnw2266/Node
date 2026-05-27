import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchOrders();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  async function fetchOrders() {
    try {
      const res = await api.get("/api/orders/all");
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch all orders", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, updates) {
    try {
      await api.patch(`/api/orders/${orderId}/status`, updates);
      fetchOrders();
    } catch (error) {
      alert("Failed to update order");
    }
  }

  if (loading) return <div className="p-10 text-center">Loading all orders...</div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-kk-dark">Admin Dashboard — Manage Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchOrders} className="px-4 py-2 bg-kk-dark/5 rounded-lg hover:bg-kk-dark/10 font-bold">🔄 Refresh</button>
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

      <div className="grid gap-6">
        {orders.map((order) => (
          <article key={order._id} className="glass-card premium-shadow rounded-2xl p-6">
            <div className="flex flex-wrap justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-8 h-8 rounded-full bg-kk-red/10 flex items-center justify-center text-xs">👤</span>
                  <h3 className="m-0 text-lg font-bold">{order.userName}</h3>
                </div>
                <p className="text-xs text-gray-400 m-0">Order ID: {order._id}</p>
                <p className="text-sm font-bold text-kk-red m-0">Total: Rs {order.totalAmount}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {order.status}
                </span>
                <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Items</h4>
                <ul className="list-none p-0 m-0 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm">{item.name} <span className="font-bold">×{item.qty}</span></li>
                  ))}
                </ul>
                <p className="mt-4 text-sm"><span className="font-bold">Address:</span> {order.deliveryAddress}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, { status: e.target.value })}
                  >
                    <option>Order Placed</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                  </select>
                  <input 
                    type="number" 
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="ETA (min)"
                    defaultValue={order.etaMinutes}
                    onBlur={(e) => updateStatus(order._id, { etaMinutes: Number(e.target.value) })}
                  />
                  <input 
                    type="text" 
                    className="col-span-2 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Kitchen Message"
                    defaultValue={order.kitchenMessage}
                    onBlur={(e) => updateStatus(order._id, { kitchenMessage: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="col-span-2 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Delivery Boy Location"
                    defaultValue={order.deliveryBoyLocation}
                    onBlur={(e) => updateStatus(order._id, { deliveryBoyLocation: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
