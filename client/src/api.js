import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getTasks = () => API.get('/tasks');
export const addTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
