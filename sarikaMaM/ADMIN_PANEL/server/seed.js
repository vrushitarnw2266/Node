const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Event = require('./models/Event');
const Notice = require('./models/Notice');
const Leave = require('./models/Leave');
const Feedback = require('./models/Feedback');

dotenv.config();

const seedData = async () => {
  try {
    // Clear all existing data
    await Promise.all([
      User.deleteMany(),
      Student.deleteMany(),
      Faculty.deleteMany(),
      Course.deleteMany(),
      Attendance.deleteMany(),
      Event.deleteMany(),
      Notice.deleteMany(),
      Leave.deleteMany(),
      Feedback.deleteMany()
    ]);

    console.log('Database cleared.');

    // 1. Seed Courses
    const courses = await Course.insertMany([
      { code: 'CS-301', name: 'Algorithms & Data Structures', department: 'Computer Science & Engineering', credits: 4, duration: '6 Months', syllabus: 'Sorting, Searching, Trees, Graphs, Dynamic Programming' },
      { code: 'IT-402', name: 'Advanced Web Engineering', department: 'Information Technology', credits: 3, duration: '6 Months', syllabus: 'React, Node, Express, MongoDB, RESTful APIs, Web Security' },
      { code: 'EC-303', name: 'Digital Signal Processing', department: 'Electronics & Communication', credits: 4, duration: '6 Months', syllabus: 'Signals, Systems, Fourier Transform, Z-Transform, Filters' },
      { code: 'ME-201', name: 'Thermodynamics', department: 'Mechanical Engineering', credits: 3, duration: '6 Months', syllabus: 'Laws of Thermodynamics, Entropy, Pure Substances, Cycles' }
    ]);
    console.log('Courses seeded.');

    // 2. Seed Users
    // Admin User
    const adminUser = new User({
      name: 'Vrushita',
      email: 'vrushi23@campus.com',
      password: 'vrushi23', // Will be hashed in pre-save hook
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    await adminUser.save();

    // Faculty Users
    const facultyData = [
      { name: 'Prof. Sarah Jenkins', email: 'sarah.j@campus.com', password: 'password123', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', facultyId: 'FAC-CS-001', phone: '+1 (555) 011-3920', department: 'Computer Science & Engineering', designation: 'Professor & Dean', joiningDate: '2015-08-12' },
      { name: 'Dr. Robert Hayes', email: 'robert.h@campus.com', password: 'password123', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', facultyId: 'FAC-IT-004', phone: '+1 (555) 012-4411', department: 'Information Technology', designation: 'Associate Professor & HOD', joiningDate: '2018-01-20' },
      { name: 'Prof. Clara Oswald', email: 'clara.o@campus.com', password: 'password123', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', facultyId: 'FAC-EC-021', phone: '+1 (555) 015-6677', department: 'Electronics & Communication', designation: 'Assistant Professor', joiningDate: '2021-07-01' },
      { name: 'Dr. Bruce Banner', email: 'bruce.b@campus.com', password: 'password123', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', facultyId: 'FAC-ME-012', phone: '+1 (555) 016-9021', department: 'Mechanical Engineering', designation: 'Senior Lecturer', joiningDate: '2020-03-15' }
    ];

    const seededFaculty = [];
    for (let f of facultyData) {
      const u = new User({
        name: f.name,
        email: f.email,
        password: f.password,
        role: f.role,
        avatar: f.avatar
      });
      await u.save();

      const profile = await Faculty.create({
        user: u._id,
        facultyId: f.facultyId,
        name: f.name,
        email: f.email,
        phone: f.phone,
        department: f.department,
        designation: f.designation,
        joiningDate: f.joiningDate,
        status: 'active'
      });
      seededFaculty.push(profile);
    }
    console.log('Faculty and users seeded.');

    // Student Users
    const studentData = [
      { idKey: 'std-1', name: 'Marcus Sterling', email: 'marcus.s@campus.com', password: 'password123', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rollNo: 'CS-2023-042', phone: '+1 (555) 019-2834', course: 'B.Tech', department: 'Computer Science & Engineering', year: '3rd Year', semester: '6th', presentDays: 45, totalDays: 50 },
      { idKey: 'std-2', name: 'Alina Vance', email: 'alina.v@campus.com', password: 'password123', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rollNo: 'IT-2024-015', phone: '+1 (555) 014-9821', course: 'BCA', department: 'Information Technology', year: '2nd Year', semester: '4th', presentDays: 48, totalDays: 50 },
      { idKey: 'std-3', name: 'Tariq Malik', email: 'tariq.m@campus.com', password: 'password123', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rollNo: 'EC-2022-089', phone: '+1 (555) 017-4389', course: 'B.Tech', department: 'Electronics & Communication', year: '4th Year', semester: '8th', presentDays: 38, totalDays: 50 },
      { idKey: 'std-4', name: 'Chloe Chen', email: 'chloe.c@campus.com', password: 'password123', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rollNo: 'ME-2025-003', phone: '+1 (555) 012-7649', course: 'B.Tech', department: 'Mechanical Engineering', year: '1st Year', semester: '2nd', presentDays: 42, totalDays: 50 },
      { idKey: 'std-5', name: 'Julian Cross', email: 'julian.c@campus.com', password: 'password123', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rollNo: 'CS-2023-011', phone: '+1 (555) 019-3388', course: 'B.Tech', department: 'Computer Science & Engineering', year: '3rd Year', semester: '6th', presentDays: 12, totalDays: 50 }
    ];

    const studentIdMap = {}; // Maps front-end 'std-1' to Mongo _id/rollNo
    for (let s of studentData) {
      const u = new User({
        name: s.name,
        email: s.email,
        password: s.password,
        role: s.role,
        avatar: s.avatar
      });
      await u.save();

      const profile = await Student.create({
        user: u._id,
        rollNo: s.rollNo,
        name: s.name,
        email: s.email,
        phone: s.phone,
        course: s.course,
        department: s.department,
        year: s.year,
        semester: s.semester,
        status: s.idKey === 'std-5' ? 'inactive' : 'active',
        presentDays: s.presentDays,
        totalDays: s.totalDays
      });
      
      // Store reference using rollNo, so frontend can search via standard studentId parameter
      studentIdMap[s.idKey] = profile;
    }
    console.log('Students and users seeded.');

    // 3. Seed Attendance
    // We map studentId to both rollNo and Mongo ID so either matches successfully
    await Attendance.insertMany([
      { studentId: studentIdMap['std-1']._id.toString(), studentName: 'Marcus Sterling', date: '2026-05-29', status: 'present', courseCode: 'CS-301' },
      { studentId: studentIdMap['std-2']._id.toString(), studentName: 'Alina Vance', date: '2026-05-29', status: 'present', courseCode: 'IT-402' },
      { studentId: studentIdMap['std-3']._id.toString(), studentName: 'Tariq Malik', date: '2026-05-29', status: 'absent', courseCode: 'EC-303' },
      { studentId: studentIdMap['std-4']._id.toString(), studentName: 'Chloe Chen', date: '2026-05-29', status: 'present', courseCode: 'ME-201' },
      { studentId: studentIdMap['std-5']._id.toString(), studentName: 'Julian Cross', date: '2026-05-29', status: 'absent', courseCode: 'CS-301' }
    ]);
    console.log('Attendance seeded.');

    // 4. Seed Events
    await Event.insertMany([
      { title: 'National Tech Symposium', description: 'Annual tech symposium featuring coding competitions, hackathons, and research paper presentations.', date: '2026-06-05', time: '09:00 AM', venue: 'Main Auditorium', organizer: 'Computer Science Department' },
      { title: 'Guest Lecture: Future of GenAI', description: 'A guest seminar by lead AI researchers on large models, prompt engineering, and agentic workflows.', date: '2026-06-08', time: '11:30 AM', venue: 'Seminar Hall 2', organizer: 'Information Technology Department' },
      { title: 'Annual Inter-College Sports Week', description: 'Five days of competitive sports events including cricket, football, basketball, and athletics.', date: '2026-06-12', time: '08:00 AM', venue: 'Sports Ground', organizer: 'Sports Committee' },
      { title: 'Graduation & Convocation Ceremony', description: 'Honoring and celebrating the graduands of the class of 2026.', date: '2026-06-25', time: '10:00 AM', venue: 'Main Auditorium', organizer: 'Administration' }
    ]);
    console.log('Events seeded.');

    // 5. Seed Notices
    await Notice.insertMany([
      { title: 'Summer Semester Schedule Announced', content: 'The summer semester classes will commence on June 15th, 2026. The timetable has been uploaded on the university portal.', category: 'Academic', date: '2026-05-28', author: 'Vrushita' },
      { title: 'Final Year Project Submissions', content: 'All final year students must submit their project reports and code repositories before June 10th, 2026 to their respective guides.', category: 'Academic', date: '2026-05-25', author: 'Prof. Sarah Jenkins' },
      { title: 'Campus Placement Drive by Tech Giants', content: 'Top technology corporations will be visiting the campus for recruitment starting next Monday. Interested and eligible students must register on the placement portal.', category: 'Placement', date: '2026-05-24', author: 'Placement Officer' },
      { title: 'Annual Cultural Fest - Resonance 2026', content: 'The registrations for the annual cultural festival Resonance 2026 are now open. Auditions for music and dance clubs will begin this Friday.', category: 'Sports & Culture', date: '2026-05-20', author: 'Student Council' }
    ]);
    console.log('Notices seeded.');

    // 6. Seed Leaves
    await Leave.insertMany([
      { applicantName: 'Marcus Sterling', role: 'student', type: 'Sick Leave', reason: 'Suffering from high seasonal flu and viral fever.', startDate: '2026-05-30', endDate: '2026-06-02', status: 'pending' },
      { applicantName: 'Alina Vance', role: 'student', type: 'Casual Leave', reason: 'Attending elder sister\'s marriage ceremony.', startDate: '2026-06-04', endDate: '2026-06-07', status: 'approved' },
      { applicantName: 'Prof. Clara Oswald', role: 'faculty', type: 'Medical Leave', reason: 'Scheduled dental checkup and root canal treatment.', startDate: '2026-06-01', endDate: '2026-06-02', status: 'approved' },
      { applicantName: 'Tariq Malik', role: 'student', type: 'Duty Leave', reason: 'Representing university at national basketball tournament.', startDate: '2026-05-18', endDate: '2026-05-22', status: 'rejected' }
    ]);
    console.log('Leaves seeded.');

    // 7. Seed Feedback
    await Feedback.insertMany([
      { studentName: 'Marcus Sterling', courseName: 'Algorithms & Data Structures', facultyName: 'Prof. Sarah Jenkins', rating: 5, comment: 'Excellent lecturing, very interactive class. Covered sorting algorithms thoroughly with visual aids.', date: '2026-05-27' },
      { studentName: 'Alina Vance', courseName: 'Advanced Web Engineering', facultyName: 'Dr. Robert Hayes', rating: 4, comment: 'Hands-on coding labs were highly engaging. Wish we had slightly more time for the React Native section.', date: '2026-05-26' },
      { studentName: 'Tariq Malik', courseName: 'Digital Signal Processing', facultyName: 'Prof. Clara Oswald', rating: 4, comment: 'Matlab tutorials are detailed. Mathematical derivations are sometimes fast, but notes are helpful.', date: '2026-05-24' },
      { studentName: 'Chloe Chen', courseName: 'Thermodynamics', facultyName: 'Dr. Bruce Banner', rating: 5, comment: 'Fascinating real-world explanations of energy transformations and cycle efficiencies. Extremely structured!', date: '2026-05-22' }
    ]);
    console.log('Feedback seeded.');

    console.log('Database Seeding Successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

// Check if run directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_campus')
    .then(async () => {
      await seedData();
      mongoose.connection.close();
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = seedData;
