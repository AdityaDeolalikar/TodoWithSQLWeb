import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './api';

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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', due_date: '' });

  useEffect(() => {
    getTasks().then((res) => setTasks(res.data));
  }, []);

  const handleAdd = (): void => {
    addTask(newTask).then((res) => setTasks([...tasks, res.data]));
  };

  const handleDelete = (id: number): void => {
    deleteTask(id).then(() => setTasks(tasks.filter(t => t.id !== id)));
  };

  const handleToggle = (task: Task): void => {
    updateTask(task.id, { ...task, status: !task.status }).then(() => {
      setTasks(tasks.map(t => (t.id === task.id ? { ...t, status: !t.status } : t)));
    });
  };

  const handleInputChange = (field: keyof NewTask, value: string): void => {
    setNewTask({ ...newTask, [field]: value });
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <input 
        placeholder="Title" 
        value={newTask.title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)} 
      />
      <input 
        placeholder="Description" 
        value={newTask.description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)} 
      />
      <input 
        type="date" 
        value={newTask.due_date}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('due_date', e.target.value)} 
      />
      <button onClick={handleAdd}>Add Task</button>

      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id}>
            <b>{task.title}</b> - {task.status ? "✅" : "❌"} - Due: {task.due_date}
            <button onClick={() => handleToggle(task)}>Toggle</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
