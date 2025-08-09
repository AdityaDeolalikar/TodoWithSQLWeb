import  { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { getTasks, addTask, updateTask, deleteTask, type Task, type NewTask } from './api.ts';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';
import { Plus, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', due_date: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    getTasks().then((res) => setTasks(res.data));
  }, []);

  const handleAdd = (): void => {
    if (!newTask.title.trim()) return;
    
    addTask(newTask).then((res) => {
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '', due_date: '' });
      setIsAddingTask(false);
    });
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const completedTasks = tasks.filter(task => task.status);
  const pendingTasks = tasks.filter(task => !task.status);

  return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white dark">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Task Master
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Organize your life, one task at a time. Stay productive with our intuitive task management system.
          </p>
        </div>

        {/* Add Task Section */}
        <div className="max-w-4xl mx-auto mb-12">
          {!isAddingTask ? (
            <Button 
              onClick={() => setIsAddingTask(true)}
              className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Create New Task</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill in the details below to create your new task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-white">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('due_date', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter task description (optional)"
                    value={newTask.description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button 
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingTask(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{tasks.length}</div>
              <div className="text-gray-300">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">{pendingTasks.length}</div>
              <div className="text-gray-300">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{completedTasks.length}</div>
              <div className="text-gray-300">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="max-w-4xl mx-auto">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Circle className="w-6 h-6 mr-2 text-yellow-400" />
                Pending Tasks ({pendingTasks.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingTasks.map((task: Task) => (
                  <Card key={task.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={task.status}
                            onCheckedChange={() => handleToggle(task)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-white line-clamp-2">{task.title}</CardTitle>
                            {task.description && (
                              <CardDescription className="text-gray-300 mt-1 line-clamp-2">
                                {task.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-0 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className={isOverdue(task.due_date) ? 'text-red-400 font-medium' : ''}>
                          {isOverdue(task.due_date) ? 'Overdue: ' : 'Due: '}
                          {formatDate(task.due_date)}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-green-400" />
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedTasks.map((task: Task) => (
                  <Card key={task.id} className="bg-gray-800/30 border-gray-600 opacity-75 hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={task.status}
                            onCheckedChange={() => handleToggle(task)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-gray-300 line-clamp-2 line-through">{task.title}</CardTitle>
                            {task.description && (
                              <CardDescription className="text-gray-400 mt-1 line-clamp-2 line-through">
                                {task.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-0 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Completed on {formatDate(task.due_date)}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <Card className="bg-gray-800/30 border-gray-700 text-center py-12">
              <CardContent>
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                <p className="text-gray-400 mb-6">Get started by creating your first task above!</p>
                <Button 
                  onClick={() => setIsAddingTask(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
