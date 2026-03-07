import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getRecords = async () => {
  const response = await api.get('/records');
  // Return only non-deleted records
  return response.data.filter(record => record.status !== false);
};

export const getRecordById = async (id) => {
  const response = await api.get(`/records/${id}`);
  return response.data;
};

export const createRecord = async (record) => {
  const response = await api.post('/records', { ...record, status: true });
  return response.data;
};

export const updateRecord = async (id, record) => {
  // Retain the status
  const response = await api.patch(`/records/${id}`, record);
  return response.data;
};

export const deleteRecord = async (id) => {
  // Soft delete
  const response = await api.patch(`/records/${id}`, { status: false });
  return response.data;
};
