
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  AlertCircle,
  PlayCircle,
  Pause,
  CheckCircle2,
  Calendar,
  Filter,
  Search } from
'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_agent_id: number;
  assigned_agent_name?: string;
  business_id: number;
  business_name?: string;
  progress: number;
  created_at: string;
  due_date: string;
  task_type: string;
}

interface TaskFormData {
  title: string;
  description: string;
  task_type: string;
  priority: string;
  assigned_agent_id: string;
  business_id: string;
  due_date: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      task_type: '',
      priority: 'medium',
      assigned_agent_id: '',
      business_id: '',
      due_date: ''
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
      loadTasks(),
      loadAgents(),
      loadBusinesses()]
      );
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await window.ezsite.apis.tablePage(37243, {
      PageNo: 1,
      PageSize: 100,
      OrderByField: "id",
      IsAsc: false,
      Filters: []
    });

    if (error) throw error;

    const formattedTasks = data.List.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      assigned_agent_id: task.assigned_agent_id || 0,
      business_id: task.business_id || 0,
      progress: task.progress || 0,
      created_at: task.created_at,
      due_date: task.due_date || '',
      task_type: task.task_type || 'general'
    }));

    setTasks(formattedTasks);
  };

  const loadAgents = async () => {
    const { data, error } = await window.ezsite.apis.tablePage(37238, {
      PageNo: 1,
      PageSize: 100,
      OrderByField: "id",
      IsAsc: false,
      Filters: []
    });

    if (!error) {
      setAgents(data.List);
    }
  };

  const loadBusinesses = async () => {
    const { data, error } = await window.ezsite.apis.tablePage(37247, {
      PageNo: 1,
      PageSize: 100,
      OrderByField: "id",
      IsAsc: false,
      Filters: []
    });

    if (!error) {
      setBusinesses(data.List);
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const { error } = await window.ezsite.apis.tableCreate(37243, {
        title: data.title,
        description: data.description,
        task_type: data.task_type,
        priority: data.priority,
        assigned_agent_id: parseInt(data.assigned_agent_id),
        business_id: parseInt(data.business_id),
        status: 'pending',
        progress: 0,
        due_date: data.due_date
      });

      if (error) throw error;

      // Create task assignment
      await window.ezsite.apis.tableCreate(37244, {
        task_id: tasks.length + 1, // This will be the new task's ID
        agent_id: parseInt(data.assigned_agent_id),
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      });

      toast({
        title: "Success",
        description: "Task created successfully"
      });

      setIsCreateDialogOpen(false);
      form.reset();
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!selectedTask) return;

    try {
      const { error } = await window.ezsite.apis.tableUpdate(37243, {
        id: selectedTask.id,
        title: data.title,
        description: data.description,
        task_type: data.task_type,
        priority: data.priority,
        assigned_agent_id: parseInt(data.assigned_agent_id),
        business_id: parseInt(data.business_id),
        due_date: data.due_date
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task updated successfully"
      });

      setIsEditDialogOpen(false);
      setSelectedTask(null);
      form.reset();
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(37243, { id: taskId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task deleted successfully"
      });

      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const progress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0;

      const { error } = await window.ezsite.apis.tableUpdate(37243, {
        id: taskId,
        status: newStatus,
        progress: progress
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task ${newStatus.replace('_', ' ')} successfully`
      });

      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    form.setValue('title', task.title);
    form.setValue('description', task.description);
    form.setValue('task_type', task.task_type);
    form.setValue('priority', task.priority);
    form.setValue('assigned_agent_id', task.assigned_agent_id.toString());
    form.setValue('business_id', task.business_id.toString());
    form.setValue('due_date', task.due_date);
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':return 'text-green-600 bg-green-100';
      case 'in_progress':return 'text-blue-600 bg-blue-100';
      case 'pending':return 'text-yellow-600 bg-yellow-100';
      case 'failed':return 'text-red-600 bg-red-100';
      default:return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':return 'text-red-600 bg-red-100';
      case 'high':return 'text-orange-600 bg-orange-100';
      case 'medium':return 'text-yellow-600 bg-yellow-100';
      case 'low':return 'text-green-600 bg-green-100';
      default:return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress':return <PlayCircle className="h-4 w-4" />;
      case 'pending':return <Clock className="h-4 w-4" />;
      case 'failed':return <AlertCircle className="h-4 w-4" />;
      default:return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tasks...</div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">Orchestrate AI agent tasks and workflows</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Assign a new task to an AI agent
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateTask)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the task requirements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="task_type"
                    rules={{ required: 'Task type is required' }}
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Task Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">Startup Analysis</SelectItem>
                            <SelectItem value="branding">Branding</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    } />

                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assigned_agent_id"
                    rules={{ required: 'Agent is required' }}
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Assigned Agent</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {agents.map((agent) =>
                          <SelectItem key={agent.id} value={agent.id.toString()}>
                                {agent.name} ({agent.agent_type})
                              </SelectItem>
                          )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="business_id"
                    rules={{ required: 'Business is required' }}
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Business</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businesses.map((business) =>
                          <SelectItem key={business.id} value={business.id.toString()}>
                                {business.name}
                              </SelectItem>
                          )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    } />

                </div>
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8" />

            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === 'in_progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const agent = agents.find((a) => a.id === task.assigned_agent_id);
          const business = businesses.find((b) => b.id === task.business_id);

          return (
            <Card key={task.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{agent?.name || 'Unassigned'}</span>
                      </div>
                      {business &&
                      <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{business.name}</span>
                        </div>
                      }
                      {task.due_date &&
                      <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      }
                    </div>
                    
                    {task.progress > 0 &&
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="w-full" />
                      </div>
                    }
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {task.status === 'pending' &&
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(task.id, 'in_progress')}>

                        <PlayCircle className="h-3 w-3" />
                        Start
                      </Button>
                    }
                    
                    {task.status === 'in_progress' &&
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(task.id, 'completed')}>

                        <CheckCircle2 className="h-3 w-3" />
                        Complete
                      </Button>
                    }
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(task)}>

                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}>

                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>);

        })}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information</DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateTask)} className="space-y-4">
              {/* Same form fields as create */}
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />

              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Task</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {filteredTasks.length === 0 &&
      <Card>
          <CardContent className="p-8 text-center">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ?
            'Try adjusting your filters' :
            'Create your first task to get started.'}
            </p>
            {!searchQuery && filterStatus === 'all' && filterPriority === 'all' &&
          <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
          }
          </CardContent>
        </Card>
      }
    </div>);

};

export default TaskManager;