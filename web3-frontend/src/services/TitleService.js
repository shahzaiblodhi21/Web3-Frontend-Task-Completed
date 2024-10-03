import axios from 'axios';

export const getTitles = async () => {
  const res = await axios.get('/api/titles');
  return res.data;
};

export const addTitle = async (title) => {
  const res = await axios.post('/api/titles', title);
  return res.data;
};

export const deleteTitle = async (id) => {
  await axios.delete(`/api/titles/${id}`);
};
