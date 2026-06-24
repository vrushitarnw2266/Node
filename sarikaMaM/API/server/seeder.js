const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing collections
    await Task.deleteMany();
    await User.deleteMany();

    console.log('Database cleared.');

    // Create default users (passwords will be hashed via Mongoose pre-save hook)
    const users = await User.create([
      {
        name: 'Professor Smith (Admin)',
        email: 'admin@tasksphere.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@tasksphere.com',
        password: 'user1234',
        role: 'user',
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@tasksphere.com',
        password: 'user1234',
        role: 'user',
      },
    ]);

    console.log(`${users.length} users created.`);

    const adminId = users[0]._id;
    const johnId = users[1]._id;
    const sarahId = users[2]._id;

    // Create sample tasks
    const tasks = [
      {
        title: 'Setup MongoDB database schemas',
        description: 'Design User and Task model structure with proper validations.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        category: 'Database',
        assignedTo: adminId,
        createdBy: adminId,
      },
      {
        title: 'Implement JWT authentication backend routes',
        description: 'Develop register, login, and profile check endpoints with token hashing.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        category: 'Backend',
        assignedTo: sarahId,
        createdBy: adminId,
      },
      {
        title: 'Design glassmorphic CSS dark dashboard interface',
        description: 'Write custom variables and card classes using HSL tones and blurs.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        category: 'Frontend',
        assignedTo: johnId,
        createdBy: adminId,
      },
      {
        title: 'Integrate Lucide Icons in React layout navigation',
        description: 'Bind modern icons into Sidebar lists and dashboard cards.',
        status: 'in-progress',
        priority: 'low',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        category: 'Frontend',
        assignedTo: johnId,
        createdBy: adminId,
      },
      {
        title: 'Write project capstone thesis report',
        description: 'Complete documentation for the university final review panel.',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        category: 'Documentation',
        assignedTo: sarahId,
        createdBy: adminId,
      },
      {
        title: 'Conduct API load and authorization stress tests',
        description: 'Verify route protection and handle error boundary behaviors.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
        category: 'Testing',
        assignedTo: johnId,
        createdBy: adminId,
      },
    ];

    await Task.insertMany(tasks);
    console.log(`${tasks.length} tasks imported.`);

    console.log('Data Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
