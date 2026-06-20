import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_leaves';

const initialMockLeaves = [
  { id: 'lv-1', applicantName: 'Marcus Sterling', role: 'student', type: 'Sick Leave', reason: 'Suffering from high seasonal flu and viral fever.', startDate: '2026-05-30', endDate: '2026-06-02', status: 'pending' },
  { id: 'lv-2', applicantName: 'Alina Vance', role: 'student', type: 'Casual Leave', reason: 'Attending elder sister\'s marriage ceremony.', startDate: '2026-06-04', endDate: '2026-06-07', status: 'approved' },
  { id: 'lv-3', applicantName: 'Prof. Clara Oswald', role: 'faculty', type: 'Medical Leave', reason: 'Scheduled dental checkup and root canal treatment.', startDate: '2026-06-01', endDate: '2026-06-02', status: 'approved' },
  { id: 'lv-4', applicantName: 'Tariq Malik', role: 'student', type: 'Duty Leave', reason: 'Representing university at national basketball tournament.', startDate: '2026-05-18', endDate: '2026-05-22', status: 'rejected' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockLeaves));
    return initialMockLeaves;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const leaveService = {
  getAllLeaves: async () => {
    try {
      const response = await axiosInstance.get('/leaves');
      return response.data;
    } catch (error) {
      console.warn("Backend leaves fetch failed. Using mock data.");
      return getMockData();
    }
  },

  applyLeave: async (leaveData) => {
    try {
      const response = await axiosInstance.post('/leaves', leaveData);
      return response.data;
    } catch (error) {
      console.warn("Backend leave apply failed. Mocking apply.");
      const leaves = getMockData();
      const newLeave = {
        id: `lv-${Date.now()}`,
        status: 'pending',
        ...leaveData
      };
      leaves.unshift(newLeave);
      saveMockData(leaves);
      return newLeave;
    }
  },

  updateLeaveStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/leaves/${id}`, { status });
      return response.data;
    } catch (error) {
      console.warn("Backend leave status update failed. Mocking status change.");
      const leaves = getMockData();
      const index = leaves.findIndex(l => l.id === id);
      if (index !== -1) {
        leaves[index].status = status.toLowerCase();
        saveMockData(leaves);
        return leaves[index];
      }
      throw new Error("Leave record not found");
    }
  }
};

export default leaveService;
