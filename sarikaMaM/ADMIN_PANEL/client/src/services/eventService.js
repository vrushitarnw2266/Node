import axiosInstance from '../utils/axiosInstance';

const MOCK_KEY = 'campus_mock_events';

const initialMockEvents = [
  { id: 'evt-1', title: 'National Tech Symposium', description: 'Annual tech symposium featuring coding competitions, hackathons, and research paper presentations.', date: '2026-06-05', time: '09:00 AM', venue: 'Main Auditorium', organizer: 'Computer Science Department' },
  { id: 'evt-2', title: 'Guest Lecture: Future of GenAI', description: 'A guest seminar by lead AI researchers on large models, prompt engineering, and agentic workflows.', date: '2026-06-08', time: '11:30 AM', venue: 'Seminar Hall 2', organizer: 'Information Technology Department' },
  { id: 'evt-3', title: 'Annual Inter-College Sports Week', description: 'Five days of competitive sports events including cricket, football, basketball, and athletics.', date: '2026-06-12', time: '08:00 AM', venue: 'Sports Ground', organizer: 'Sports Committee' },
  { id: 'evt-4', title: 'Graduation & Convocation Ceremony', description: 'Honoring and celebrating the graduands of the class of 2026.', date: '2026-06-25', time: '10:00 AM', venue: 'Main Auditorium', organizer: 'Administration' }
];

const getMockData = () => {
  const data = localStorage.getItem(MOCK_KEY);
  if (!data) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(initialMockEvents));
    return initialMockEvents;
  }
  return JSON.parse(data);
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
};

export const eventService = {
  getAllEvents: async () => {
    try {
      const response = await axiosInstance.get('/events');
      return response.data;
    } catch (error) {
      console.warn("Backend events fetch failed. Using mock data.");
      return getMockData();
    }
  },

  getEventById: async (id) => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend event get failed. Using mock data.");
      const events = getMockData();
      return events.find(e => e.id === id) || null;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.warn("Backend event create failed. Mocking create.");
      const events = getMockData();
      const newEvent = {
        id: `evt-${Date.now()}`,
        ...eventData
      };
      events.push(newEvent);
      saveMockData(events);
      return newEvent;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await axiosInstance.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.warn("Backend event update failed. Mocking update.");
      const events = getMockData();
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = { ...events[index], ...eventData };
        saveMockData(events);
        return events[index];
      }
      throw new Error("Event not found");
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Backend event delete failed. Mocking delete.");
      const events = getMockData();
      const filtered = events.filter(e => e.id !== id);
      saveMockData(filtered);
      return { success: true, message: 'Event deleted successfully' };
    }
  }
};

export default eventService;
