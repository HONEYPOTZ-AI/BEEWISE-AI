
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ArrowRight,
  Calendar,
  User,
  Target,
  BarChart3,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  task_name: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  assigned_agent_id: number;
  business_id: number;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
}

interface TaskDependency {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: string;
}

interface Agent {
  id: number;
  agent_name: string;
  agent_type: string;
  status: string;
}

const TaskManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    task_name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    assigned_agent_id: 0,
    estimated_hours: 8
  });

  const taskStatuses = [
    { id: 'all', name: 'All Tasks', color: 'bg-gray-500' },
    { id: 'pending', name: 'Pending', color: 'bg-yellow-500' },
    { id: 'in_progress', name: 'In Progress', color: 'bg-blue-500' },
    { id: 'completed', name: 'Completed', color: 'bg-green-500' },
    { id: 'blocked', name: 'Blocked', color: 'bg-red-500' }
  ];

  const priorityLevels = [
    { id: 'all', name: 'All Priorities' },
    { id: 'low', name: 'Low', color: 'bg-blue-100 text-blue-800' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadTaskData();
  }, []);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      
      // Load tasks
      const tasksResponse = await window.ezsite.apis.tablePage(37243, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "created_at",
        IsAsc: false
      });

      if (tasksResponse.error) throw tasksResponse.error;
      setTasks(tasksResponse.data?.List || []);

      // Load agents
      const agentsResponse = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "agent_name",
        IsAsc: true
      });

      if (agentsResponse.error) throw agentsResponse.error;
      setAgents(agentsResponse.data?.List || []);

      // Load dependencies
      const dependenciesResponse = await window.ezsite.apis.tablePage(37246, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "ID",
        IsAsc: false
      });

      if (dependenciesResponse.error) throw dependenciesResponse.error;
      setDependencies(dependenciesResponse.data?.List || []);

    } catch (error) {
      console.error('Error loading task data:', error);
      toast({
        title: "Error",
        description: "Failed to load task data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    try {
      if (!newTask.task_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Task name is required.",
          variant: "destructive",
        });
        return;
      }

      const taskData = {
        task_name: newTask.task_name,
        description: newTask.description,
        status: 'pending',
        priority: newTask.priority,
        due_date: newTask.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        assigned_agent_id: newTask.assigned_agent_id || null,
        estimated_hours: newTask.estimated_hours,
        actual_hours: 0,
        completion_percentage: 0
      };

      const response = await window.ezsite.apis.tableCreate(37243, taskData);
      if (response.error) throw response.error;

      toast({
        title: "Task Created",
        description: "New task has been created successfully.",
      });

      setIsCreateDialogOpen(false);
      setNewTask({
        task_name: '',
        description: '',
        priority: 'medium',
        due_date: '',
        assigned_agent_id: 0,
        estimated_hours: 8
      });
      
      loadTaskData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        status: newStatus,
        completion_percentage: newStatus === 'completed' ? 100 : task.completion_percentage
      };

      const response = await window.ezsite.apis.tableUpdate(37243, updatedTask);
      if (response.error) throw response.error;

      toast({
        title: "Task Updated",
        description: `Task status updated to ${newStatus}.`,
      });

      loadTaskData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorityLevels.find(p => p.id === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Task Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task Management Center</h1>
          <p className="text-muted-foreground mt-2">
            Create, assign, and monitor task execution across your AI agents
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Define a new task and assign it to an AI agent
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task_name">Task Name</Label>
                  <Input
                    id="task_name"
                    value={newTask.task_name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, task_name: e.target.value }))}
                    placeholder="Enter task name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the task requirements"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estimated_hours">Est. Hours</Label>
                    <Input
                      id="estimated_hours"
                      type="number"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assigned_agent">Assign Agent</Label>
                  <Select value={newTask.assigned_agent_id.toString()} onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_agent_id: parseInt(value) || 0 }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Agent</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.agent_name} ({agent.agent_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTask}>
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {taskStatuses.filter(s => s.id !== 'all').map((status) => {
          const count = tasks.filter(t => t.status === status.id).length;
          return (
            <Card key={status.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{status.name}</span>
                  {getStatusIcon(status.id)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {((count / tasks.length) * 100 || 0).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Task List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Task List</CardTitle>
              <CardDescription>
                Manage and monitor all tasks across your organization
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const assignedAgent = agents.find(a => a.id === task.assigned_agent_id);
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
              
              return (
                <Card key={task.id} className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <h3 className="font-semibold text-lg">{task.task_name}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {isOverdue && (
                            <Badge variant="destructive">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                          </div>
                          {assignedAgent && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{assignedAgent.agent_name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.actual_hours || 0}h / {task.estimated_hours}h</span>
                          </div>
                        </div>
                        {task.completion_percentage > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{task.completion_percentage}%</span>
                            </div>
                            <Progress value={task.completion_percentage} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Target className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {tasks.length === 0 
                  ? "Create your first task to get started with task management"
                  : "Try adjusting your filters or create a new task"
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagementPage;
