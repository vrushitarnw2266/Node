const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./seed');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');

    // Auto-seed only if the database is empty (first-time launch)
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Empty database detected. Running initial data seed...');
      await seedData();
      console.log('Seed complete. Database ready.');
    } else {
      console.log(`Database already has ${userCount} user(s). Skipping seed.`);
    }

    app.listen(PORT, () => {
      console.log(`Smart Campus API Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

start();
