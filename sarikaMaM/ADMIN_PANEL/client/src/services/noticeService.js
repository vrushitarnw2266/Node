import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_notices';

const initialMockNotices = [
  { id: 'not-1', title: 'Summer Semester Schedule Announced', content: 'The summer semester classes will commence on June 15th, 2026. The timetable has been uploaded on the university portal.', category: 'Academic', date: '2026-05-28', author: 'Vrushita' },
  { id: 'not-2', title: 'Final Year Project Submissions', content: 'All final year students must submit their project reports and code repositories before June 10th, 2026 to their respective guides.', category: 'Academic', date: '2026-05-25', author: 'Prof. Sarah Jenkins' },
  { id: 'not-3', title: 'Campus Placement Drive by Tech Giants', content: 'Top technology corporations will be visiting the campus for recruitment starting next Monday. Interested and eligible students must register on the placement portal.', category: 'Placement', date: '2026-05-24', author: 'Placement Officer' },
  { id: 'not-4', title: 'Annual Cultural Fest - Resonance 2026', content: 'The registrations for the annual cultural festival Resonance 2026 are now open. Auditions for music and dance clubs will begin this Friday.', category: 'Sports & Culture', date: '2026-05-20', author: 'Student Council' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockNotices));
    return initialMockNotices;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const noticeService = {
  getAllNotices: async () => {
    try {
      const response = await axiosInstance.get('/notices');
      return response.data;
    } catch (error) {
      console.warn("Backend notices fetch failed. Using mock data.");
      return getMockData();
    }
  },

  getNoticeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/notices/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend notice get failed. Using mock data.");
      const notices = getMockData();
      return notices.find(n => n.id === id) || null;
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await axiosInstance.post('/notices', noticeData);
      return response.data;
    } catch (error) {
      console.warn("Backend notice create failed. Mocking create.");
      const notices = getMockData();
      const newNotice = {
        id: `not-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...noticeData
      };
      notices.unshift(newNotice);
      saveMockData(notices);
      return newNotice;
    }
  },

  updateNotice: async (id, noticeData) => {
    try {
      const response = await axiosInstance.put(`/notices/${id}`, noticeData);
      return response.data;
    } catch (error) {
      console.warn("Backend notice update failed. Mocking update.");
      const notices = getMockData();
      const index = notices.findIndex(n => n.id === id);
      if (index !== -1) {
        notices[index] = { ...notices[index], ...noticeData };
        saveMockData(notices);
        return notices[index];
      }
      throw new Error("Notice not found");
    }
  },

  deleteNotice: async (id) => {
    try {
      const response = await axiosInstance.delete(`/notices/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend notice delete failed. Mocking delete.");
      const notices = getMockData();
      const filtered = notices.filter(n => n.id !== id);
      saveMockData(filtered);
      return { success: true, message: 'Notice deleted successfully' };
    }
  }
};

export default noticeService;
