import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_students';

const initialMockStudents = [
  { id: 'std-1', rollNo: 'CS-2023-042', name: 'Marcus Sterling', email: 'marcus.s@campus.com', phone: '+1 (555) 019-2834', course: 'B.Tech', department: 'Computer Science & Engineering', year: '3rd Year', semester: '6th', status: 'active', presentDays: 45, totalDays: 50 },
  { id: 'std-2', rollNo: 'IT-2024-015', name: 'Alina Vance', email: 'alina.v@campus.com', phone: '+1 (555) 014-9821', course: 'BCA', department: 'Information Technology', year: '2nd Year', semester: '4th', status: 'active', presentDays: 48, totalDays: 50 },
  { id: 'std-3', rollNo: 'EC-2022-089', name: 'Tariq Malik', email: 'tariq.m@campus.com', phone: '+1 (555) 017-4389', course: 'B.Tech', department: 'Electronics & Communication', year: '4th Year', semester: '8th', status: 'active', presentDays: 38, totalDays: 50 },
  { id: 'std-4', rollNo: 'ME-2025-003', name: 'Chloe Chen', email: 'chloe.c@campus.com', phone: '+1 (555) 012-7649', course: 'B.Tech', department: 'Mechanical Engineering', year: '1st Year', semester: '2nd', status: 'active', presentDays: 42, totalDays: 50 },
  { id: 'std-5', rollNo: 'CS-2023-011', name: 'Julian Cross', email: 'julian.c@campus.com', phone: '+1 (555) 019-3388', course: 'B.Tech', department: 'Computer Science & Engineering', year: '3rd Year', semester: '6th', status: 'inactive', presentDays: 12, totalDays: 50 }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockStudents));
    return initialMockStudents;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const studentService = {
  getAllStudents: async () => {
    try {
      const response = await axiosInstance.get('/students');
      return response.data;
    } catch (error) {
      console.warn("Backend students fetch failed. Using mock data.");
      return getMockData();
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend student fetch failed. Using mock data.");
      const students = getMockData();
      return students.find(s => s.id === id) || null;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await axiosInstance.post('/students', studentData);
      return response.data;
    } catch (error) {
      console.warn("Backend student create failed. Mocking create.");
      const students = getMockData();
      const newStudent = {
        id: `std-${Date.now()}`,
        rollNo: studentData.rollNo || `CS-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: 'active',
        presentDays: 0,
        totalDays: 0,
        ...studentData
      };
      students.push(newStudent);
      saveMockData(students);
      return newStudent;
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await axiosInstance.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.warn("Backend student update failed. Mocking update.");
      const students = getMockData();
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...studentData };
        saveMockData(students);
        return students[index];
      }
      throw new Error("Student not found");
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend student delete failed. Mocking delete.");
      const students = getMockData();
      const filtered = students.filter(s => s.id !== id);
      saveMockData(filtered);
      return { success: true, message: 'Student deleted successfully' };
    }
  }
};

export default studentService;
