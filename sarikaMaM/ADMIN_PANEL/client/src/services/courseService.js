import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_courses';

const initialMockCourses = [
  { id: 'crs-1', code: 'CS-301', name: 'Algorithms & Data Structures', department: 'Computer Science & Engineering', credits: 4, duration: '6 Months', syllabus: 'Sorting, Searching, Trees, Graphs, Dynamic Programming' },
  { id: 'crs-2', code: 'IT-402', name: 'Advanced Web Engineering', department: 'Information Technology', credits: 3, duration: '6 Months', syllabus: 'React, Node, Express, MongoDB, RESTful APIs, Web Security' },
  { id: 'crs-3', code: 'EC-303', name: 'Digital Signal Processing', department: 'Electronics & Communication', credits: 4, duration: '6 Months', syllabus: 'Signals, Systems, Fourier Transform, Z-Transform, Filters' },
  { id: 'crs-4', code: 'ME-201', name: 'Thermodynamics', department: 'Mechanical Engineering', credits: 3, duration: '6 Months', syllabus: 'Laws of Thermodynamics, Entropy, Pure Substances, Cycles' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockCourses));
    return initialMockCourses;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/courses');
      return response.data;
    } catch (error) {
      console.warn("Backend courses fetch failed. Using mock data.");
      return getMockData();
    }
  },

  getCourseById: async (id) => {
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend course get failed. Using mock data.");
      const courses = getMockData();
      return courses.find(c => c.id === id) || null;
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await axiosInstance.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.warn("Backend course create failed. Mocking create.");
      const courses = getMockData();
      const newCourse = {
        id: `crs-${Date.now()}`,
        ...courseData
      };
      courses.push(newCourse);
      saveMockData(courses);
      return newCourse;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const response = await axiosInstance.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.warn("Backend course update failed. Mocking update.");
      const courses = getMockData();
      const index = courses.findIndex(c => c.id === id);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...courseData };
        saveMockData(courses);
        return courses[index];
      }
      throw new Error("Course not found");
    }
  },

  deleteCourse: async (id) => {
    try {
      const response = await axiosInstance.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend course delete failed. Mocking delete.");
      const courses = getMockData();
      const filtered = courses.filter(c => c.id !== id);
      saveMockData(filtered);
      return { success: true, message: 'Course deleted successfully' };
    }
  }
};

export default courseService;
