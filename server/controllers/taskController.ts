import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define the Task interface
interface Task extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: number;
}

// Define the request body interface for adding/updating tasks
interface TaskRequestBody {
  title: string;
  description: string;
  due_date: string;
  status?: number;
}

// Define the request interface with params
interface TaskRequest extends Request {
  params: {
    id: string;
  };
  body: TaskRequestBody;
}

export const getTasks = (req: Request, res: Response): void => {
  db.query('SELECT * FROM tasks', (err: Error | null, result: Task[]) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

export const addTask = (req: Request<{}, {}, TaskRequestBody>, res: Response): void => {
  const { title, description, due_date } = req.body;
  db.query(
    'INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)',
    [title, description, due_date],
    (err: Error | null, result: ResultSetHeader) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, title, description, due_date, status: 0 });
    }
  );
};

export const updateTask = (req: TaskRequest, res: Response): void => {
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;
  db.query(
    'UPDATE tasks SET title=?, description=?, due_date=?, status=? WHERE id=?',
    [title, description, due_date, status, id],
    (err: Error | null) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
};

export const deleteTask = (req: TaskRequest, res: Response): void => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id=?', [id], (err: Error | null) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
};
