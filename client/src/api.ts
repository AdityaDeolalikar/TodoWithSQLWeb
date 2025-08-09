import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: boolean;
}

interface NewTask {
  title: string;
  description: string;
  due_date: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getTasks = (): Promise<ApiResponse<Task[]>> => API.get('/tasks');
export const addTask = (data: NewTask): Promise<ApiResponse<Task>> => API.post('/tasks', data);
export const updateTask = (id: number, data: Partial<Task>): Promise<ApiResponse<Task>> => API.put(`/tasks/${id}`, data);
export const deleteTask = (id: number): Promise<ApiResponse<void>> => API.delete(`/tasks/${id}`);

export type { Task, NewTask }; 