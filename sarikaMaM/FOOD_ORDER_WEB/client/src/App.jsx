import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import axios from "axios";
import { Preloader } from "./components/Preloader.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ServicePage } from "./pages/ServicePage.jsx";
import { BookTablePage } from "./pages/BookTablePage.jsx";
import { OrderNowPage } from "./pages/OrderNowPage.jsx";
import { AdminOrdersPage } from "./pages/AdminOrdersPage.jsx";
import { AdminBookingsPage } from "./pages/AdminBookingsPage";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { TermsPage } from "./pages/TermsPage.jsx";
import { MyBookingsPage } from "./pages/MyBookingsPage.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

const btnBase =
  "rounded-lg px-4 py-2 font-semibold text-white transition hover:brightness-110 border-0 cursor-pointer font-inherit";
const btnPrimary = `${btnBase} bg-kk-red`;
const btnGreen = `${btnBase} bg-kk-green`;
const inputCls =
  "rounded-lg border border-gray-300 px-3 py-2 text-inherit max-w-xs focus:outline-none focus:ring-2 focus:ring-kk-red/40";

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderDone = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <BrowserRouter>
      {!preloaderDone && <Preloader onFinish={handlePreloaderDone} durationMs={3800} />}
      <FoodApp />
    </BrowserRouter>
  );
}



function FoodApp() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    fetchCategories();
    fetchFoods();
    loadSession();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  async function loadSession() {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
      fetchOrders();
    } catch (_error) {
      setUser(null);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/api/foods/categories");
      setCategories(res.data.categories);
    } catch (_error) {}
  }

  const fetchFoods = useCallback(async (category = "") => {
    try {
      const res = await api.get("/api/foods", { params: category ? { category } : {} });
      setFoods(res.data.foods);
    } catch (_error) {}
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get("/api/orders/my");
      setOrders(res.data.orders || []);
    } catch (_error) {
      setOrders([]);
    }
  }

  async function logout() {
    await api.post("/api/auth/logout");
    setUser(null);
    setOrders([]);
    setMessage("Logged out successfully");
  }

  function addToCart(food) {
    const existing = cart.find((item) => item.foodId === food._id);
    if (existing) {
      setCart(cart.map((item) => (item.foodId === food._id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { foodId: food._id, name: food.name, price: food.price, qty: 1 }]);
    }
  }

  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart]);

  async function placeOrder() {
    if (!user) {
      setMessage("Please login first.");
      return;
    }
    if (!cart.length) {
      setMessage("Cart is empty.");
      return;
    }
    if (!deliveryAddress) {
      setMessage("Please enter delivery address.");
      return;
    }
    await api.post("/api/orders", { items: cart, deliveryAddress });
    setCart([]);
    setDeliveryAddress("");
    setMessage("Order placed! Track below.");
    fetchOrders();
  }

  async function refreshTracking() {
    fetchOrders();
    setMessage("Tracking refreshed.");
  }

  const navLink =
    "rounded-xl px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20 hover:text-white transition-all no-underline";

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6 font-sans">
      <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-kk-red to-kk-red-dark px-8 py-5 text-white shadow-2xl premium-shadow">
        {/* Top Row: Brand and User Actions */}
        <div className="flex items-center justify-between">
          <Link to="/" className="no-underline text-white">
            <h1 className="m-0 text-2xl font-black tracking-tighter sm:text-3xl">My Vaggie</h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all border-0 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-1.5 pl-4">
                <span className="text-sm font-bold opacity-90">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="rounded-xl bg-white px-4 py-1.5 text-sm font-bold text-kk-red hover:bg-gray-100 transition border-0 cursor-pointer">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white no-underline hover:bg-white/20 transition" to="/login">Login</Link>
                <Link className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-kk-red no-underline hover:bg-gray-100 transition" to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-1 border-t border-white/10 pt-3">
          <Link className={navLink} to="/">Home</Link>
          <Link className={navLink} to="/order">Menu</Link>
          <Link className={navLink} to="/cart">Cart ({cart.length})</Link>
          <Link className={navLink} to="/track">Track</Link>
          <Link className={navLink} to="/about">About</Link>
          <Link className={navLink} to="/service">Services</Link>
          <Link className={navLink} to="/book">Book Table</Link>
          {user && <Link className={navLink} to="/my-bookings">My Bookings</Link>}
          {user?.role === "admin" && (
            <>
              <Link className={`${navLink} bg-white/20 font-bold`} to="/admin">Orders</Link>
              <Link className={`${navLink} bg-white/20 font-bold`} to="/admin/bookings">Reservations</Link>
            </>
          )}
        </nav>
      </header>


      {message && (
        <div className="animate-fade-in mb-8 flex items-center justify-between rounded-2xl bg-kk-dark/5 px-6 py-3 text-sm font-medium text-kk-dark">
          {message}
          <button onClick={() => setMessage("")} className="text-lg opacity-50 hover:opacity-100">&times;</button>
        </div>
      )}

      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<HomePage categories={categories} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/book" element={<BookTablePage api={api} />} />
          <Route path="/order" element={<OrderNowPage categories={categories} />} />
          <Route path="/category/:categoryName" element={<CategoryPage foods={foods} fetchFoods={fetchFoods} addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} totalAmount={totalAmount} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} placeOrder={placeOrder} />} />
          <Route path="/track" element={<OrdersPage orders={orders} refreshTracking={refreshTracking} />} />
          <Route path="/login" element={<LoginPage api={api} onLogin={(u) => { setUser(u); fetchOrders(); }} />} />
          <Route path="/register" element={<RegisterPage api={api} onRegister={(u) => setUser(u)} />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage api={api} />} />
          {user?.role === "admin" && (
            <>
              <Route path="/admin" element={<AdminOrdersPage api={api} />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage api={api} />} />
            </>
          )}
        </Routes>
      </main>

      <footer className="mt-20 border-t border-kk-dark/10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-kk-dark">My Vaggie</h3>
            <p className="text-sm text-kk-dark/60 leading-relaxed">
              Premium vegetarian dining experience delivered to your doorstep. We focus on health, taste, and quality in every bite.
            </p>
            <div className="flex gap-3">
              {['📸', '🐦', '📘'].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-kk-dark/5 flex items-center justify-center cursor-pointer hover:bg-kk-red/10 transition-colors">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-kk-dark uppercase tracking-widest mb-6">Menu</h4>
            <ul className="space-y-3 p-0 list-none text-sm text-kk-dark/60">
              <li><Link to="/" className="no-underline text-inherit hover:text-kk-red transition">Home</Link></li>
              <li><Link to="/order" className="no-underline text-inherit hover:text-kk-red transition">Our Menu</Link></li>
              <li><Link to="/track" className="no-underline text-inherit hover:text-kk-red transition">Track Order</Link></li>
              <li><Link to="/cart" className="no-underline text-inherit hover:text-kk-red transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="text-xs font-bold text-kk-dark uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-3 p-0 list-none text-sm text-kk-dark/60">
              <li><Link to="/book" className="no-underline text-inherit hover:text-kk-red transition">Book a Table</Link></li>
              <li><Link to="/service" className="no-underline text-inherit hover:text-kk-red transition">Our Services</Link></li>
              <li><Link to="/about" className="no-underline text-inherit hover:text-kk-red transition">About Us</Link></li>
              <li><Link to="/terms" className="no-underline text-inherit hover:text-kk-red transition">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-kk-dark uppercase tracking-widest mb-6">Reach Us</h4>
            <ul className="space-y-4 p-0 list-none text-sm text-kk-dark/60">
              <li className="flex items-start gap-3">
                <span className="opacity-50">📍</span>
                <span>123 Veggie Street, Gourmet Plaza, India</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-50">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-50">✉️</span>
                <span>hello@veggietoing.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-kk-dark/5 pt-8 text-center text-xs text-kk-dark/40 font-medium">
          <p>&copy; 2026 My Vaggie. Designed for Pure Veg Excellence.</p>
        </div>
      </footer>
    </div>
  );
}

function CategoryPage({ foods, fetchFoods, addToCart }) {
  const { categoryName } = useParams();

  useEffect(() => {
    fetchFoods(categoryName);
  }, [categoryName, fetchFoods]);

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-kk-dark">{categoryName} varieties</h2>
        <p className="text-kk-dark/60">Explore our handcrafted vegetarian {categoryName.toLowerCase()} selection.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <article key={food._id} className="glass-card hover-lift rounded-[2rem] overflow-hidden premium-shadow">
            {food.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img src={food.imageUrl} alt={food.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
            )}
            <div className="p-6">
              <h3 className="mt-0 text-2xl font-black text-kk-dark group-hover:text-kk-red transition-colors">{food.name}</h3>
              <p className="text-sm font-medium text-kk-dark/70 leading-relaxed mb-6">{food.description}</p>
              <div className="flex items-center justify-between border-t border-kk-dark/5 pt-4">
                <div>
                  <p className="m-0 text-xs font-bold uppercase tracking-widest text-kk-dark/50">Price</p>
                  <p className="m-0 font-bold text-kk-dark">Rs {food.price}</p>
                </div>
                <div>
                  <p className="m-0 text-xs font-bold uppercase tracking-widest text-kk-dark/50">Prep Time</p>
                  <p className="m-0 font-medium text-kk-dark/80">{food.prepMinutes} min</p>
                </div>
              </div>
              <button type="button" className="btn-gradient mt-6 w-full" onClick={() => addToCart(food)}>
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cart, totalAmount, deliveryAddress, setDeliveryAddress, placeOrder }) {
  return (
    <section className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-kk-dark">Your basket</h2>
        <p className="text-kk-dark/60">Ready for a delicious vegetarian meal?</p>
      </div>
      
      <div className="glass-card premium-shadow rounded-3xl p-8">
        {cart.length === 0 ? (
          <p className="text-center text-kk-dark/40 py-10 font-medium">Your basket is empty. Go find some food!</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.foodId} className="flex items-center justify-between border-b border-kk-dark/5 pb-4">
                <div>
                  <h4 className="m-0 font-bold text-kk-dark">{item.name}</h4>
                  <p className="m-0 text-sm text-kk-dark/50">Qty: {item.qty}</p>
                </div>
                <p className="m-0 font-bold text-kk-red">Rs {item.qty * item.price}</p>
              </div>
            ))}
            
            <div className="pt-4 flex items-center justify-between text-xl font-bold">
              <span className="text-kk-dark">Total</span>
              <span className="text-kk-red-dark">Rs {totalAmount}</span>
            </div>

            <div className="pt-8">
              <label className="block text-xs font-bold text-kk-dark/70 uppercase tracking-widest mb-2">Delivery Address</label>
              <textarea
                className="w-full rounded-2xl border border-kk-dark/10 bg-kk-dark/5 p-4 text-kk-dark focus:ring-2 focus:ring-kk-red/20 outline-none transition-all"
                rows="3"
                placeholder="Where should we send your food?"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            <button type="button" className="btn-gradient w-full py-4 text-lg mt-6" onClick={placeOrder}>
              Place order
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function OrdersPage({ orders, refreshTracking }) {
  return (
    <section className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-kk-dark">Live tracking</h2>
          <p className="text-kk-dark/60">Keep an eye on your delicious meal.</p>
        </div>
        <button type="button" className="btn-gradient bg-kk-green" onClick={refreshTracking}>
          Update status
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card premium-shadow rounded-3xl p-12 text-center text-kk-dark/40 font-medium">
          No active orders found. Start ordering now!
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order) => (
            <article key={order._id} className="glass-card premium-shadow rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-kk-red to-kk-red-dark p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="m-0 text-xl font-bold uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="m-0 text-sm opacity-80">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="m-0 text-xs uppercase opacity-70">Status</p>
                    <p className="m-0 text-lg font-bold">{order.status}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-white transition-all duration-1000 ease-out"
                    style={{ 
                      width: order.status === "Order Placed" ? "25%" : 
                             order.status === "Preparing" ? "50%" : 
                             order.status === "Out for Delivery" ? "75%" : "100%" 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold opacity-60 tracking-widest">
                  <span>Placed</span>
                  <span>Kitchen</span>
                  <span>En Route</span>
                  <span>Delivered</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-kk-red/10 flex items-center justify-center text-kk-red">⏱️</div>
                      <div>
                        <p className="m-0 text-xs font-bold text-kk-dark/50 uppercase tracking-widest">Estimated Time</p>
                        <p className="m-0 text-kk-dark font-bold">{order.etaMinutes} minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-kk-red/10 flex items-center justify-center text-kk-red">👨‍🍳</div>
                      <div>
                        <p className="m-0 text-xs font-bold text-kk-dark/50 uppercase tracking-widest">Kitchen Status</p>
                        <p className="m-0 text-kk-dark/80">{order.kitchenMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-kk-green/10 flex items-center justify-center text-kk-green">🛵</div>
                      <div>
                        <p className="m-0 text-xs font-bold text-kk-dark/50 uppercase tracking-widest">Delivery Partner</p>
                        <p className="m-0 text-kk-dark/80">{order.deliveryBoyName} — <span className="text-kk-green font-bold">{order.deliveryBoyLocation}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl bg-kk-dark/5 p-4 border border-kk-dark/5">
                    <p className="m-0 text-xs font-bold text-kk-dark/50 uppercase mb-2 tracking-widest">Order Items</p>
                    <div className="text-sm text-kk-dark/70 font-medium">
                      {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </div>
                    <p className="mt-4 m-0 text-sm font-bold text-kk-dark">Total Paid: Rs {order.totalAmount}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
