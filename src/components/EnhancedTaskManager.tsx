
import React, { useState, useMemo } from 'react';
import { useEnhancedTasks, Task, TaskTemplate, Business, Agent } from '@/hooks/useEnhancedTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  Target,
  Workflow,
  FileText,
  Settings,
  TrendingUp,
  User,
  Building2,
  Layers,
  GitBranch,
  ArrowRight,
  Star } from
'lucide-react';

const EnhancedTaskManager: React.FC = () => {
  const { toast } = useToast();
  const {
    tasks,
    taskTemplates,
    businesses,
    businessStages,
    agents,
    loading,
    error,
    createTask,
    createTaskFromTemplate,
    assignTaskToAgent,
    updateTaskStatus,
    createTaskDependency,
    getTasksByBusiness,
    getTasksByBusinessAndStage,
    getAvailableAgentsForTaskType,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks
  } = useEnhancedTasks();

  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const createTaskForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      task_type: 'general',
      priority: 'medium',
      complexity_score: 5,
      estimated_duration: 60,
      business_id: 0,
      due_date: ''
    }
  });

  const templateForm = useForm({
    defaultValues: {
      template_id: 0,
      business_id: 0,
      title: '',
      description: '',
      due_date: ''
    }
  });

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    if (!selectedBusiness) return tasks;
    if (!selectedStage) return getTasksByBusiness(selectedBusiness);
    return getTasksByBusinessAndStage(selectedBusiness, selectedStage);
  }, [tasks, selectedBusiness, selectedStage, getTasksByBusiness, getTasksByBusinessAndStage]);

  // Memoized business analytics
  const businessAnalytics = useMemo(() => {
    return businesses.map((business) => {
      const businessTasks = getTasksByBusiness(business.id);
      const completedCount = businessTasks.filter((t) => t.status === 'completed').length;
      const inProgressCount = businessTasks.filter((t) => ['assigned', 'in_progress'].includes(t.status)).length;
      const pendingCount = businessTasks.filter((t) => t.status === 'pending').length;

      return {
        ...business,
        totalTasks: businessTasks.length,
        completedTasks: completedCount,
        inProgressTasks: inProgressCount,
        pendingTasks: pendingCount,
        progressPercentage: businessTasks.length > 0 ? Math.round(completedCount / businessTasks.length * 100) : 0
      };
    });
  }, [businesses, getTasksByBusiness]);

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':return 'bg-red-500';
      case 'high':return 'bg-orange-500';
      case 'medium':return 'bg-yellow-500';
      case 'low':return 'bg-green-500';
      default:return 'bg-gray-500';
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':return 'bg-green-100 text-green-800';
      case 'in_progress':return 'bg-blue-100 text-blue-800';
      case 'assigned':return 'bg-purple-100 text-purple-800';
      case 'pending':return 'bg-gray-100 text-gray-800';
      case 'failed':return 'bg-red-100 text-red-800';
      case 'cancelled':return 'bg-gray-100 text-gray-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle create task
  const handleCreateTask = async (data: any) => {
    const success = await createTask(data);
    if (success) {
      setIsCreateDialogOpen(false);
      createTaskForm.reset();
    }
  };

  // Handle create from template
  const handleCreateFromTemplate = async (data: any) => {
    const success = await createTaskFromTemplate(data.template_id, data.business_id, {
      title: data.title,
      description: data.description,
      due_date: data.due_date
    });
    if (success) {
      setIsTemplateDialogOpen(false);
      templateForm.reset();
    }
  };

  // Handle task status update
  const handleStatusUpdate = async (taskId: number, newStatus: Task['status']) => {
    await updateTaskStatus(taskId, newStatus);
  };

  // Handle agent assignment
  const handleAgentAssignment = async (taskId: number, agentId: number) => {
    await assignTaskToAgent(taskId, agentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);

  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading tasks: {error}</p>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingTasks}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business-view">Business View</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Select value={selectedBusiness?.toString() || ''} onValueChange={(value) => setSelectedBusiness(value ? parseInt(value) : null)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Businesses</SelectItem>
                  {businesses.map((business) =>
                  <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {selectedBusiness &&
              <Select value={selectedStage?.toString() || ''} onValueChange={(value) => setSelectedStage(value ? parseInt(value) : null)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Stages</SelectItem>
                    {businessStages.map((stage) =>
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              }
            </div>

            <div className="flex space-x-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Create a new task for your business</DialogDescription>
                  </DialogHeader>
                  <Form {...createTaskForm}>
                    <form onSubmit={createTaskForm.handleSubmit(handleCreateTask)} className="space-y-4">
                      <FormField
                        control={createTaskForm.control}
                        name="title"
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        } />

                      
                      <FormField
                        control={createTaskForm.control}
                        name="description"
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        } />


                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createTaskForm.control}
                          name="business_id"
                          render={({ field }) =>
                          <FormItem>
                              <FormLabel>Business</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
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


                        <FormField
                          control={createTaskForm.control}
                          name="priority"
                          render={({ field }) =>
                          <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          } />

                      </div>

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

              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    From Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Task from Template</DialogTitle>
                    <DialogDescription>Use a pre-defined template to create a task</DialogDescription>
                  </DialogHeader>
                  <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit(handleCreateFromTemplate)} className="space-y-4">
                      <FormField
                        control={templateForm.control}
                        name="template_id"
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Template</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {taskTemplates.map((template) =>
                              <SelectItem key={template.id} value={template.id.toString()}>
                                    {template.name} ({template.stageName})
                                  </SelectItem>
                              )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        } />


                      <FormField
                        control={templateForm.control}
                        name="business_id"
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Business</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
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


                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Task</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Task List */}
          <div className="grid gap-4">
            {filteredTasks.map((task) =>
            <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4" />
                          <span>{task.businessName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Layers className="h-4 w-4" />
                          <span>{task.currentStageName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimated_duration}m</span>
                        </div>
                        {task.assignedAgents && task.assignedAgents.length > 0 &&
                      <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{task.assignedAgents.length} assigned</span>
                          </div>
                      }
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === 'pending' &&
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(task.id, 'in_progress')}>

                          <PlayCircle className="h-4 w-4" />
                        </Button>
                    }
                      {task.status === 'in_progress' &&
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(task.id, 'completed')}
                      className="bg-green-600 hover:bg-green-700">

                          <CheckCircle className="h-4 w-4" />
                        </Button>
                    }
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTask(task)}>

                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {task.dependencies && task.dependencies.length > 0 &&
                <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-2 text-sm">
                        <GitBranch className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {task.dependencies.length} dependencies
                        </span>
                      </div>
                    </div>
                }
                </CardContent>
              </Card>
            )}

            {filteredTasks.length === 0 &&
            <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tasks found</p>
                  <p className="text-sm text-gray-500">Create a new task or adjust your filters</p>
                </CardContent>
              </Card>
            }
          </div>
        </TabsContent>

        {/* Business View Tab */}
        <TabsContent value="business-view" className="space-y-4">
          <div className="grid gap-4">
            {businessAnalytics.map((business) =>
            <Card key={business.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>{business.name}</span>
                      <Badge variant="outline">{business.currentStageName}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {business.completedTasks}/{business.totalTasks} tasks completed
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{business.progressPercentage}%</span>
                        </div>
                        <Progress value={business.progressPercentage} className="h-2" />
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">✓ {business.completedTasks}</span>
                        <span className="text-blue-600">↻ {business.inProgressTasks}</span>
                        <span className="text-gray-600">○ {business.pendingTasks}</span>
                      </div>
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="tasks">
                        <AccordionTrigger>View Tasks ({business.totalTasks})</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {getTasksByBusiness(business.id).slice(0, 5).map((task) =>
                          <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusColor(task.status)} variant="secondary">
                                    {task.status}
                                  </Badge>
                                  <span className="text-sm">{task.title}</span>
                                </div>
                                <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                                  {task.priority}
                                </Badge>
                              </div>
                          )}
                            {getTasksByBusiness(business.id).length > 5 &&
                          <p className="text-sm text-gray-500 text-center">
                                +{getTasksByBusiness(business.id).length - 5} more tasks...
                              </p>
                          }
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="h-5 w-5" />
                <span>Task Dependencies & Workflow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Workflow visualization coming soon</p>
                <p className="text-sm text-gray-500">This will show task dependencies and execution flow</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTemplates.map((template) =>
            <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{template.name}</span>
                    <Badge variant="outline">{template.stageName}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>⏱ {template.estimated_duration}m</span>
                      <Badge className={`${getPriorityColor(template.priority)} text-white text-xs`}>
                        {template.priority}
                      </Badge>
                    </div>
                    <Button
                    size="sm"
                    onClick={() => {
                      templateForm.setValue('template_id', template.id);
                      setIsTemplateDialogOpen(true);
                    }}>

                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Task Completion Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Agent Utilization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {agents.slice(0, 3).map((agent) =>
                  <div key={agent.id} className="flex items-center justify-between text-sm">
                      <span>{agent.display_name}</span>
                      <div className="flex items-center space-x-2">
                        <span>{agent.currentTaskCount || 0}/{agent.max_concurrent_tasks}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(agent.currentTaskCount || 0) / agent.max_concurrent_tasks * 100}%` }}>
                        </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Detail Dialog */}
      {selectedTask &&
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>Task details and management</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedTask.status)} variant="secondary">
                        {selectedTask.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={`${getPriorityColor(selectedTask.priority)} text-white text-xs`}>
                        {selectedTask.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business:</span>
                      <span>{selectedTask.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage:</span>
                      <span>{selectedTask.currentStageName}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated:</span>
                      <span>{selectedTask.estimated_duration}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(selectedTask.created_at).toLocaleDateString()}</span>
                    </div>
                    {selectedTask.completed_at &&
                  <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span>{new Date(selectedTask.completed_at).toLocaleDateString()}</span>
                      </div>
                  }
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>

              {selectedTask.assignedAgents && selectedTask.assignedAgents.length > 0 &&
            <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Assigned Agents</h4>
                    <div className="space-y-2">
                      {selectedTask.assignedAgents.map((assignment) =>
                  <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm">{assignment.agentDisplayName}</span>
                            <Badge variant="outline" className="text-xs">
                              {assignment.assignment_type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={assignment.progress_percentage} className="w-16 h-2" />
                            <span className="text-sm text-gray-500">{assignment.progress_percentage}%</span>
                          </div>
                        </div>
                  )}
                    </div>
                  </div>
                </>
            }

              {selectedTask.dependencies && selectedTask.dependencies.length > 0 &&
            <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Dependencies</h4>
                    <div className="space-y-2">
                      {selectedTask.dependencies.map((dependency) =>
                  <div key={dependency.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                          <GitBranch className="h-4 w-4 text-gray-400" />
                          <span>{dependency.dependency_type.replace('_', ' ')}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span>{dependency.parentTaskTitle || dependency.dependentTaskTitle}</span>
                        </div>
                  )}
                    </div>
                  </div>
                </>
            }
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>);

};

export default EnhancedTaskManager;