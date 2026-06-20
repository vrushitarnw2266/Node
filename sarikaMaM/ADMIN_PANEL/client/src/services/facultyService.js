import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_faculty';

const initialMockFaculty = [
  { id: 'fac-1', facultyId: 'FAC-CS-001', name: 'Prof. Sarah Jenkins', email: 'sarah.j@campus.com', phone: '+1 (555) 011-3920', department: 'Computer Science & Engineering', designation: 'Professor & Dean', joiningDate: '2015-08-12', status: 'active' },
  { id: 'fac-2', facultyId: 'FAC-IT-004', name: 'Dr. Robert Hayes', email: 'robert.h@campus.com', phone: '+1 (555) 012-4411', department: 'Information Technology', designation: 'Associate Professor & HOD', joiningDate: '2018-01-20', status: 'active' },
  { id: 'fac-3', facultyId: 'FAC-EC-021', name: 'Prof. Clara Oswald', email: 'clara.o@campus.com', phone: '+1 (555) 015-6677', department: 'Electronics & Communication', designation: 'Assistant Professor', joiningDate: '2021-07-01', status: 'active' },
  { id: 'fac-4', facultyId: 'FAC-ME-012', name: 'Dr. Bruce Banner', email: 'bruce.b@campus.com', phone: '+1 (555) 016-9021', department: 'Mechanical Engineering', designation: 'Senior Lecturer', joiningDate: '2020-03-15', status: 'active' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockFaculty));
    return initialMockFaculty;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const facultyService = {
  getAllFaculty: async () => {
    try {
      const response = await axiosInstance.get('/faculty');
      return response.data;
    } catch (error) {
      console.warn("Backend faculty fetch failed. Using mock data.");
      return getMockData();
    }
  },

  getFacultyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/faculty/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend faculty get failed. Using mock data.");
      const faculty = getMockData();
      return faculty.find(f => f.id === id) || null;
    }
  },

  createFaculty: async (facultyData) => {
    try {
      const response = await axiosInstance.post('/faculty', facultyData);
      return response.data;
    } catch (error) {
      console.warn("Backend faculty create failed. Mocking create.");
      const faculty = getMockData();
      const newFaculty = {
        id: `fac-${Date.now()}`,
        facultyId: facultyData.facultyId || `FAC-CS-${Math.floor(100 + Math.random() * 900)}`,
        status: 'active',
        ...facultyData
      };
      faculty.push(newFaculty);
      saveMockData(faculty);
      return newFaculty;
    }
  },

  updateFaculty: async (id, facultyData) => {
    try {
      const response = await axiosInstance.put(`/faculty/${id}`, facultyData);
      return response.data;
    } catch (error) {
      console.warn("Backend faculty update failed. Mocking update.");
      const faculty = getMockData();
      const index = faculty.findIndex(f => f.id === id);
      if (index !== -1) {
        faculty[index] = { ...faculty[index], ...facultyData };
        saveMockData(faculty);
        return faculty[index];
      }
      throw new Error("Faculty not found");
    }
  },

  deleteFaculty: async (id) => {
    try {
      const response = await axiosInstance.delete(`/faculty/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend faculty delete failed. Mocking delete.");
      const faculty = getMockData();
      const filtered = faculty.filter(f => f.id !== id);
      saveMockData(filtered);
      return { success: true, message: 'Faculty deleted successfully' };
    }
  }
};

export default facultyService;
