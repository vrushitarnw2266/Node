import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_feedback';

const initialMockFeedback = [
  { id: 'fdb-1', studentName: 'Marcus Sterling', courseName: 'Algorithms & Data Structures', facultyName: 'Prof. Sarah Jenkins', rating: 5, comment: 'Excellent lecturing, very interactive class. Covered sorting algorithms thoroughly with visual aids.', date: '2026-05-27' },
  { id: 'fdb-2', studentName: 'Alina Vance', courseName: 'Advanced Web Engineering', facultyName: 'Dr. Robert Hayes', rating: 4, comment: 'Hands-on coding labs were highly engaging. Wish we had slightly more time for the React Native section.', date: '2026-05-26' },
  { id: 'fdb-3', studentName: 'Tariq Malik', courseName: 'Digital Signal Processing', facultyName: 'Prof. Clara Oswald', rating: 4, comment: 'Matlab tutorials are detailed. Mathematical derivations are sometimes fast, but notes are helpful.', date: '2026-05-24' },
  { id: 'fdb-4', studentName: 'Chloe Chen', courseName: 'Thermodynamics', facultyName: 'Dr. Bruce Banner', rating: 5, comment: 'Fascinating real-world explanations of energy transformations and cycle efficiencies. Extremely structured!', date: '2026-05-22' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockFeedback));
    return initialMockFeedback;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const feedbackService = {
  getAllFeedback: async () => {
    try {
      const response = await axiosInstance.get('/feedback');
      return response.data;
    } catch (error) {
      console.warn("Backend feedback fetch failed. Using mock data.");
      return getMockData();
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await axiosInstance.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.warn("Backend feedback create failed. Mocking create.");
      const feedback = getMockData();
      const newFeedback = {
        id: `fdb-${Date.now()}`,
        studentName: feedbackData.studentName || 'Anonymous Student',
        date: new Date().toISOString().split('T')[0],
        ...feedbackData
      };
      feedback.unshift(newFeedback);
      saveMockData(feedback);
      return newFeedback;
    }
  }
};

export default feedbackService;
