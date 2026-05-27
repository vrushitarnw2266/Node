const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

const categories = [
  "Punjabi",
  "Kathiyavadi",
  "Gujarati Thali",
  "South Indian",
  "Pizza",
  "Burger",
  "Chinese",
  "Pastas",
  "Lasagna",
  "Tacos",
  "Sizzlers",
  "Snacks",
  "Biryani",
];

const vegFoods = [
  // Punjabi
  { name: "Paneer Butter Masala", category: "Punjabi", price: 289, type: "veg", prepMinutes: 25, description: "Rich and creamy tomato-based gravy with soft paneer cubes.", imageUrl: "https://images.unsplash.com/photo-1645495141857-e49b6b5f8dd5?auto=format&fit=crop&w=800&q=80" },
  { name: "Dal Makhani", category: "Punjabi", price: 249, type: "veg", prepMinutes: 30, description: "Slow-cooked black lentils with cream and butter.", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" },
  { name: "Kadhai Paneer", category: "Punjabi", price: 279, type: "veg", prepMinutes: 22, description: "Paneer cooked with bell peppers and freshly ground spices.", imageUrl: "https://images.unsplash.com/photo-1626082563009-c0a54f9d2f5f?auto=format&fit=crop&w=800&q=80" },
  { name: "Malai Kofta", category: "Punjabi", price: 299, type: "veg", prepMinutes: 28, description: "Deep fried paneer balls in a rich, creamy white gravy.", imageUrl: "https://images.unsplash.com/photo-1643353521429-c7b0e2d65cfa?auto=format&fit=crop&w=800&q=80" },

  // Kathiyavadi
  { name: "Vagharelo Rotlo", category: "Kathiyavadi", price: 189, type: "veg", prepMinutes: 15, description: "Spiced crumbled bajra rotla tempered with garlic and buttermilk.", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" },
  { name: "Sev Tameta", category: "Kathiyavadi", price: 169, type: "veg", prepMinutes: 15, description: "Tangy tomato curry topped with crispy besan sev.", imageUrl: "https://images.unsplash.com/photo-1633024477408-f8b7f94f53a5?auto=format&fit=crop&w=800&q=80" },
  { name: "Ringan No Oro", category: "Kathiyavadi", price: 219, type: "veg", prepMinutes: 25, description: "Roasted eggplant mash with green garlic and onions.", imageUrl: "https://images.unsplash.com/photo-1609617262327-8727fc5b5f2e?auto=format&fit=crop&w=800&q=80" },
  
  // Gujarati Thali
  { name: "Premium Gujarati Thali", category: "Gujarati Thali", price: 349, type: "veg", prepMinutes: 30, description: "Full Meal: 2 Seasonal Sabzi, Dal, Rice, 5 Roti, Farsan, Sweet, Chaas, Salad.", imageUrl: "https://images.unsplash.com/photo-1621996346565-431f63602f41?auto=format&fit=crop&w=800&q=80" },
  { name: "Executive Gujarati Thali", category: "Gujarati Thali", price: 399, type: "veg", prepMinutes: 35, description: "Includes: 3 Sabzi, Paneer, Kathol, Dal, Kadhi, 2 Sweets, Farsan, Chaas.", imageUrl: "https://images.unsplash.com/photo-1609617262327-8727fc5b5f2e?auto=format&fit=crop&w=800&q=80" },

  // South Indian
  { name: "Special Masala Dosa", category: "South Indian", price: 159, type: "veg", prepMinutes: 15, description: "Crispy rice crepe filled with spicy potato mash.", imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80" },
  { name: "Paneer Cheese Dosa", category: "South Indian", price: 199, type: "veg", prepMinutes: 16, description: "Crispy dosa loaded with paneer and melted cheese.", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80" },
  { name: "Medu Vada (2 Pcs)", category: "South Indian", price: 129, type: "veg", prepMinutes: 12, description: "Deep fried savory donuts served with sambar and chutney.", imageUrl: "https://images.unsplash.com/photo-1645182294866-76d1637dc80f?auto=format&fit=crop&w=800&q=80" },

  // Chinese
  { name: "Veg Hakka Noodles", category: "Chinese", price: 199, type: "veg", prepMinutes: 18, description: "Street-style spicy noodles with fresh crisp veggies.", imageUrl: "https://images.unsplash.com/photo-1609329374519-6c7c09b54d71?auto=format&fit=crop&w=800&q=80" },
  { name: "Paneer Chilli Dry", category: "Chinese", price: 239, type: "veg", prepMinutes: 20, description: "Hot and tangy paneer cubes tossed with peppers.", imageUrl: "https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&w=800&q=80" },
  { name: "Veg Manchurian Gravy", category: "Chinese", price: 219, type: "veg", prepMinutes: 22, description: "Golden fried veg balls in a thick, spicy soy gravy.", imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f017a4b5?auto=format&fit=crop&w=800&q=80" },

  // Pastas
  { name: "Creamy White Pasta", category: "Pastas", price: 249, type: "veg", prepMinutes: 20, description: "Penne tossed in a rich, velvety Alfredo cream sauce.", imageUrl: "https://images.unsplash.com/photo-1645112481338-30115ed71597?auto=format&fit=crop&w=800&q=80" },
  { name: "Arrabbiata Red Pasta", category: "Pastas", price: 229, type: "veg", prepMinutes: 20, description: "Spicy tomato sauce with garlic, chili and olives.", imageUrl: "https://images.unsplash.com/photo-1621996346565-431f63602f41?auto=format&fit=crop&w=800&q=80" },
  { name: "Pink Sauce Fusion Pasta", category: "Pastas", price: 269, type: "veg", prepMinutes: 22, description: "The perfect blend of creamy white and tangy red sauces.", imageUrl: "https://images.unsplash.com/photo-1621996346565-431f63602f41?auto=format&fit=crop&w=800&q=80" },

  // Lasagna
  { name: "Spinach Corn Lasagna", category: "Lasagna", price: 299, type: "veg", prepMinutes: 30, description: "Baked layers of pasta, fresh spinach, corn and mozzarella.", imageUrl: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80" },
  { name: "Classic Veg Lasagna", category: "Lasagna", price: 329, type: "veg", prepMinutes: 32, description: "Rich layers of pasta with marinara, veggies and béchamel.", imageUrl: "https://images.unsplash.com/photo-1609329374519-6c7c09b54d71?auto=format&fit=crop&w=800&q=80" },

  // Tacos
  { name: "Bean & Corn Tacos", category: "Tacos", price: 209, type: "veg", prepMinutes: 17, description: "Mexican style crunchy tacos with refried beans and salsa.", imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80" },
  { name: "Tandoori Paneer Tacos", category: "Tacos", price: 239, type: "veg", prepMinutes: 18, description: "Fusion tacos with smoky paneer and mint chutney.", imageUrl: "https://images.unsplash.com/photo-1599974590225-217ec63a5bb4?auto=format&fit=crop&w=800&q=80" },

  // Sizzlers
  { name: "Veg Exotic Sizzler", category: "Sizzlers", price: 399, type: "veg", prepMinutes: 25, description: "Grilled veggies, cutlets, and herb rice in a smoky sizzle.", imageUrl: "https://images.unsplash.com/photo-1626082563009-c0a54f9d2f5f?auto=format&fit=crop&w=800&q=80" },
  { name: "Paneer Shashlik Sizzler", category: "Sizzlers", price: 449, type: "veg", prepMinutes: 28, description: "Grilled paneer steaks with spicy sauce and fries.", imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80" },

  // Biryani
  { name: "Veg Dum Biryani", category: "Biryani", price: 249, type: "veg", prepMinutes: 25, description: "Fragrant basmati rice layered with spiced vegetables.", imageUrl: "https://images.unsplash.com/photo-1633024477408-f8b7f94f53a5?auto=format&fit=crop&w=800&q=80" },
  { name: "Paneer Special Biryani", category: "Biryani", price: 279, type: "veg", prepMinutes: 26, description: "Royal biryani with chunky marinated paneer cubes.", imageUrl: "https://images.unsplash.com/photo-1626082563009-c0a54f9d2f5f?auto=format&fit=crop&w=800&q=80" },

  // Snacks
  { name: "Crispy Cheese Balls", category: "Snacks", price: 149, type: "veg", prepMinutes: 12, description: "Golden fried bites with a melting cheese center.", imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80" },
  { name: "Masala French Fries", category: "Snacks", price: 129, type: "veg", prepMinutes: 10, description: "Peri-peri seasoned crispy golden fries.", imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20c35e6b5b?auto=format&fit=crop&w=800&q=80" },
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["veg"], default: "veg" },
    prepMinutes: { type: Number, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["Order Placed", "Preparing", "Out for Delivery", "Delivered"],
      default: "Order Placed",
    },
    etaMinutes: { type: Number, default: 30 },
    kitchenMessage: { type: String, default: "Order received by restaurant." },
    deliveryBoyName: { type: String, default: "Rohit" },
    deliveryBoyLocation: { type: String, default: "Restaurant Hub" },
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    note: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Food = mongoose.model("Food", foodSchema);
const Order = mongoose.model("Order", orderSchema);
const Booking = mongoose.model("Booking", bookingSchema);

function createToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
}

function cookieOptions() {
  const prod = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  return { httpOnly: true, sameSite: "lax", secure: prod };
}

async function auth(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function adminAuth(req, res, next) {
  await auth(req, res, () => {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin access required" });
    next();
  });
}

async function authAdmin(req, res, next) {
  await auth(req, res, () => {
    if (req.userRole !== "admin") return res.status(403).json({ message: "Admin access required" });
    next();
  });
}

app.get("/", (_req, res) => {
  res.json({ message: "my_vaggie_ API running" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    // First user becomes admin for demo purposes
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";
    const user = await User.create({ name, email, passwordHash, role });
    const token = createToken(user._id.toString(), user.role);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Register failed:", error);
    res.status(500).json({ message: error.message || "Register failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) return res.status(401).json({ message: "Invalid credentials" });
    const token = createToken(user._id.toString(), user.role);
    res.cookie("token", token, cookieOptions());
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json({ user });
});

app.get("/api/foods/categories", (_req, res) => {
  res.json({ categories });
});

app.get("/api/foods", async (req, res) => {
  const { category } = req.query;
  const query = { type: "veg" };
  if (category) query.category = category;
  const foods = await Food.find(query).sort({ createdAt: -1 });
  res.json({ foods });
});

// Get featured foods (limit to 12 for display)
app.get("/api/foods/featured", async (_req, res) => {
  try {
    const foods = await Food.find({ type: "veg" }).sort({ createdAt: 1 }).limit(12);
    res.json({ foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/foods/upload-image", authAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file required" });
  res.json({
    message: "Image uploaded in memory (demo endpoint)",
    fileName: req.file.originalname,
    size: req.file.size,
  });
});

app.post("/api/orders", auth, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const foodIds = items.map((i) => i.foodId);
    const foods = await Food.find({ _id: { $in: foodIds }, type: "veg" });
    const foodMap = new Map(foods.map((f) => [f._id.toString(), f]));
    let totalAmount = 0;
    const normalizedItems = [];
    let maxPrep = 10;

    for (const item of items) {
      const food = foodMap.get(item.foodId);
      if (!food) continue;
      const qty = Number(item.qty || 1);
      totalAmount += food.price * qty;
      maxPrep = Math.max(maxPrep, food.prepMinutes);
      normalizedItems.push({
        foodId: food._id,
        name: food.name,
        qty,
        price: food.price,
      });
    }

    if (!normalizedItems.length) {
      return res.status(400).json({ message: "Only vegetarian food items are allowed" });
    }

    const order = await Order.create({
      user: user._id,
      userName: user.name,
      items: normalizedItems,
      totalAmount,
      deliveryAddress,
      etaMinutes: maxPrep + 15,
      kitchenMessage: `Chef will take around ${maxPrep} min to prepare.`,
      status: "Preparing",
      deliveryBoyName: "Aman",
      deliveryBoyLocation: "Kitchen Zone",
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Order creation failed" });
  }
});

app.get("/api/orders/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ orders });
});

app.get("/api/orders/all", authAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
});

app.patch("/api/orders/:id/status", authAdmin, async (req, res) => {
  const { status, etaMinutes, deliveryBoyLocation, kitchenMessage } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (status) order.status = status;
  if (typeof etaMinutes === "number") order.etaMinutes = etaMinutes;
  if (deliveryBoyLocation) order.deliveryBoyLocation = deliveryBoyLocation;
  if (kitchenMessage) order.kitchenMessage = kitchenMessage;
  await order.save();
  res.json({ order });
});

// Book Table
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, phone, date, time, guests, note } = req.body;
    const token = req.cookies.token;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
        userId = decoded.userId;
      } catch (err) {}
    }

    const booking = new Booking({ userId, name, phone, date, time, guests, note });
    await booking.save();
    res.json({ message: "Booking request sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Get My Bookings
app.get("/api/bookings/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Get Bookings
app.get("/api/admin/bookings", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Update Booking Status
app.patch("/api/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Booking.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Booking updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: list users
app.get("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: get user details (orders + bookings)
app.get("/api/admin/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ user, orders, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function seedVegFoods() {
  const count = await Food.countDocuments({ imageUrl: { $ne: "" } });
  if (count === 0) {
    await Food.deleteMany({});
    await Food.insertMany(vegFoods);
  }
}

async function ensureAdminUser() {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) return;

    // Default admin credentials (created only if no admin exists)
    const defaultAdminEmail = "vrushita23@gmail.com";
    const defaultAdminPass = "12321";

    const passwordHash = await bcrypt.hash(defaultAdminPass, 10);
    const adminUser = new User({ name: "Admin", email: defaultAdminEmail, passwordHash, role: "admin" });
    await adminUser.save();
    console.log(`Default admin created: ${defaultAdminEmail}`);
  } catch (err) {
    console.error("Failed to ensure admin user:", err.message || err);
  }
}

// Eagerly connect to MongoDB at module load time.
// Mongoose buffers all queries until the connection is ready, so routes work correctly.
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my_vaggie_")
  .then(async () => {
    await seedVegFoods();
    await ensureAdminUser();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    if (!process.env.VERCEL) process.exit(1);
  });

// Only start the HTTP server when running locally (not on Vercel serverless)
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

// Export app for Vercel serverless function (api/index.js)
module.exports = app;
