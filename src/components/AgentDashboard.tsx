
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  Bot,
  Plus,
  Edit,
  Trash2,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Users,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  AlertCircle,
  CheckSquare,
  User } from
'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive' | 'busy' | 'error';
  capabilities: string[];
  tools: string[];
  performance_score: number;
  tasks_completed: number;
  created_at: string;
}

interface Business {
  id: number;
  name: string;
  description: string;
  stage_id: number;
  stage_name?: string;
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  business_id: number;
  business_name?: string;
  agent_id?: number;
  due_date?: string;
  created_at: string;
}

interface AgentPerformance {
  id: number;
  agent_id: number;
  business_id: number;
  business_name?: string;
  tasks_completed: number;
  success_rate: number;
  avg_completion_time: number;
  performance_score: number;
  last_activity: string;
}

interface BusinessStage {
  id: number;
  name: string;
  description: string;
  stage_order: number;
  recommended_agent_types: string[];
}

interface AgentFormData {
  name: string;
  description: string;
  agent_type: string;
  status: string;
  capabilities: string;
  tools: string;
}

interface AssignmentFormData {
  business_id: string;
  task_id: string;
}

const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [businessStages, setBusinessStages] = useState<BusinessStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const agentForm = useForm<AgentFormData>({
    defaultValues: {
      name: '',
      description: '',
      agent_type: '',
      status: 'active',
      capabilities: '',
      tools: ''
    }
  });

  const assignmentForm = useForm<AssignmentFormData>({
    defaultValues: {
      business_id: '',
      task_id: ''
    }
  });

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
      loadAgents(),
      loadBusinesses(),
      loadTasks(),
      loadAgentPerformance(),
      loadBusinessStages()]
      );
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      const formattedAgents = data.List.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description || '',
        type: agent.agent_type || 'General',
        status: agent.status || 'active',
        capabilities: agent.capabilities ? agent.capabilities.split(',') : [],
        tools: agent.tools ? agent.tools.split(',') : [],
        performance_score: agent.performance_score || 85,
        tasks_completed: agent.tasks_completed || 0,
        created_at: agent.created_at
      }));

      setAgents(formattedAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive"
      });
    }
  };

  const loadBusinesses = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37247, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      setBusinesses(data.List || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37243, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      setTasks(data.List || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadAgentPerformance = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37254, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      setAgentPerformance(data.List || []);
    } catch (error) {
      console.error('Error loading agent performance:', error);
    }
  };

  const loadBusinessStages = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37248, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'stage_order',
        IsAsc: true,
        Filters: []
      });

      if (error) throw error;

      const formattedStages = data.List.map((stage: any) => ({
        id: stage.id,
        name: stage.name,
        description: stage.description || '',
        stage_order: stage.stage_order || 0,
        recommended_agent_types: stage.recommended_agent_types ? stage.recommended_agent_types.split(',') : []
      }));

      setBusinessStages(formattedStages);
    } catch (error) {
      console.error('Error loading business stages:', error);
    }
  };

  const handleCreateAgent = async (data: AgentFormData) => {
    try {
      const { error } = await window.ezsite.apis.tableCreate(37238, {
        name: data.name,
        description: data.description,
        agent_type: data.agent_type,
        status: data.status,
        capabilities: data.capabilities,
        tools: data.tools,
        performance_score: 85,
        tasks_completed: 0
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent created successfully"
      });

      setIsCreateDialogOpen(false);
      agentForm.reset();
      loadAgents();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAgent = async (data: AgentFormData) => {
    if (!selectedAgent) return;

    try {
      const { error } = await window.ezsite.apis.tableUpdate(37238, {
        id: selectedAgent.id,
        name: data.name,
        description: data.description,
        agent_type: data.agent_type,
        status: data.status,
        capabilities: data.capabilities,
        tools: data.tools
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent updated successfully"
      });

      setIsEditDialogOpen(false);
      setSelectedAgent(null);
      agentForm.reset();
      loadAgents();
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAgent = async (agentId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(37238, { id: agentId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent deleted successfully"
      });

      loadAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (agentId: number, newStatus: string) => {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(37238, {
        id: agentId,
        status: newStatus
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Agent ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });

      loadAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive"
      });
    }
  };

  const handleAssignAgent = async (data: AssignmentFormData) => {
    if (!selectedAgent) return;

    try {
      // Create task assignment
      const { error } = await window.ezsite.apis.tableCreate(37244, {
        agent_id: selectedAgent.id,
        task_id: parseInt(data.task_id),
        business_id: parseInt(data.business_id),
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      });

      if (error) throw error;

      // Update task with agent assignment
      const { error: taskError } = await window.ezsite.apis.tableUpdate(37243, {
        id: parseInt(data.task_id),
        agent_id: selectedAgent.id,
        status: 'assigned'
      });

      if (taskError) throw taskError;

      toast({
        title: "Success",
        description: "Agent assigned successfully"
      });

      setIsAssignDialogOpen(false);
      assignmentForm.reset();
      loadTasks();
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    agentForm.setValue('name', agent.name);
    agentForm.setValue('description', agent.description);
    agentForm.setValue('agent_type', agent.type);
    agentForm.setValue('status', agent.status);
    agentForm.setValue('capabilities', agent.capabilities.join(','));
    agentForm.setValue('tools', agent.tools.join(','));
    setIsEditDialogOpen(true);
  };

  const openAssignDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAssignDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':return 'bg-green-500';
      case 'busy':return 'bg-yellow-500';
      case 'inactive':return 'bg-gray-500';
      case 'error':return 'bg-red-500';
      default:return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':return <CheckCircle className="h-4 w-4" />;
      case 'busy':return <Activity className="h-4 w-4" />;
      case 'inactive':return <Pause className="h-4 w-4" />;
      case 'error':return <XCircle className="h-4 w-4" />;
      default:return <Clock className="h-4 w-4" />;
    }
  };

  const getAgentWorkload = (agentId: number) => {
    const agentTasks = tasks.filter((task) => task.agent_id === agentId && task.status !== 'completed');
    return agentTasks.length;
  };

  const getAgentPerformanceByBusiness = (agentId: number) => {
    return agentPerformance.filter((perf) => perf.agent_id === agentId);
  };

  const getRecommendedAgentsForStage = (stageId: number) => {
    const stage = businessStages.find((s) => s.id === stageId);
    if (!stage || !stage.recommended_agent_types.length) return agents;

    return agents.filter((agent) =>
    stage.recommended_agent_types.some((type) =>
    agent.type.toLowerCase().includes(type.toLowerCase())
    )
    );
  };

  const matchAgentCapabilities = (agent: Agent, businessNeeds: string[]) => {
    const matches = businessNeeds.filter((need) =>
    agent.capabilities.some((cap) =>
    cap.toLowerCase().includes(need.toLowerCase())
    )
    );
    return matches.length / businessNeeds.length * 100;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading agent dashboard...</div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Orchestration</h2>
          <p className="text-muted-foreground">Manage and monitor your AI agents across business lifecycles</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Add a new AI agent to your system
              </DialogDescription>
            </DialogHeader>
            
            <Form {...agentForm}>
              <form onSubmit={agentForm.handleSubmit(handleCreateAgent)} className="space-y-4">
                <FormField
                  control={agentForm.control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agent name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />


                <FormField
                  control={agentForm.control}
                  name="description"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the agent's purpose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />


                <FormField
                  control={agentForm.control}
                  name="agent_type"
                  rules={{ required: 'Type is required' }}
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Agent Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select agent type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Startup">Startup Agent</SelectItem>
                          <SelectItem value="Branding">Branding Agent</SelectItem>
                          <SelectItem value="Legal">Legal Agent</SelectItem>
                          <SelectItem value="Finance">Finance Agent</SelectItem>
                          <SelectItem value="Marketing">Marketing Agent</SelectItem>
                          <SelectItem value="Sales">Sales Agent</SelectItem>
                          <SelectItem value="Support">Support Agent</SelectItem>
                          <SelectItem value="Analytics">Analytics Agent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  } />


                <FormField
                  control={agentForm.control}
                  name="capabilities"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Capabilities</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter capabilities (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />


                <FormField
                  control={agentForm.control}
                  name="tools"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Tools</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tools (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />


                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Agent</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{agents.filter((a) => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Busy</p>
                <p className="text-2xl font-bold">{agents.filter((a) => a.status === 'busy').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tasks Completed</p>
                <p className="text-2xl font-bold">{agents.reduce((sum, a) => sum + a.tasks_completed, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Performance</p>
                <p className="text-2xl font-bold">{Math.round(agents.reduce((sum, a) => sum + a.performance_score, 0) / agents.length || 0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) =>
            <Card key={agent.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {agent.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      {getStatusIcon(agent.status)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {agent.type}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{agent.performance_score}%</span>
                    </div>
                    <Progress value={agent.performance_score} className="w-full" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tasks Completed</span>
                    <span>{agent.tasks_completed}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Current Workload</span>
                    <span>{getAgentWorkload(agent.id)} tasks</span>
                  </div>
                  
                  {agent.capabilities.length > 0 &&
                <div>
                      <p className="text-sm font-medium mb-1">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.slice(0, 3).map((capability, index) =>
                    <Badge key={index} variant="outline" className="text-xs">
                            {capability.trim()}
                          </Badge>
                    )}
                        {agent.capabilities.length > 3 &&
                    <Badge variant="outline" className="text-xs">
                            +{agent.capabilities.length - 3}
                          </Badge>
                    }
                      </div>
                    </div>
                }
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-1">
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(agent.id, agent.status === 'active' ? 'inactive' : 'active')}>

                        {agent.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(agent)}>

                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openAssignDialog(agent)}>

                        <User className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAgent(agent.id)}>

                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Task Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {tasks.filter((task) => task.agent_id).map((task) => {
                    const agent = agents.find((a) => a.id === task.agent_id);
                    const business = businesses.find((b) => b.id === task.business_id);

                    return (
                      <div key={task.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Bot className="h-4 w-4" />
                              {agent?.name || 'Unassigned'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {business?.name || 'No Business'}
                            </span>
                          </div>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                      </div>);

                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const performanceData = getAgentPerformanceByBusiness(agent.id);

              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {agent.name} Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Overall Score</p>
                          <p className="text-2xl font-bold text-primary">{agent.performance_score}%</p>
                        </div>
                        <div>
                          <p className="font-medium">Tasks Completed</p>
                          <p className="text-2xl font-bold">{agent.tasks_completed}</p>
                        </div>
                      </div>
                      
                      {performanceData.length > 0 &&
                      <>
                          <Separator />
                          <div>
                            <p className="font-medium mb-2">Business Performance</p>
                            <div className="space-y-2">
                              {performanceData.map((perf, index) =>
                            <div key={index} className="flex justify-between text-sm">
                                  <span>{perf.business_name || `Business ${perf.business_id}`}</span>
                                  <span>{perf.success_rate}% success</span>
                                </div>
                            )}
                            </div>
                          </div>
                        </>
                      }
                    </div>
                  </CardContent>
                </Card>);

            })}
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const workload = getAgentWorkload(agent.id);
              const agentTasks = tasks.filter((task) => task.agent_id === agent.id);

              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {agent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Workload</span>
                        <Badge variant={workload > 5 ? 'destructive' : workload > 2 ? 'default' : 'secondary'}>
                          {workload} tasks
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Availability</span>
                        <Badge variant={agent.status === 'active' && workload < 3 ? 'default' : 'secondary'}>
                          {agent.status === 'active' && workload < 3 ? 'Available' : 'Busy'}
                        </Badge>
                      </div>
                      
                      {agentTasks.length > 0 &&
                      <>
                          <Separator />
                          <div>
                            <p className="font-medium mb-2">Current Tasks</p>
                            <ScrollArea className="h-32">
                              <div className="space-y-1">
                                {agentTasks.slice(0, 5).map((task) =>
                              <div key={task.id} className="text-xs p-2 bg-muted rounded">
                                    <div className="flex justify-between">
                                      <span>{task.title}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {task.status}
                                      </Badge>
                                    </div>
                                  </div>
                              )}
                              </div>
                            </ScrollArea>
                          </div>
                        </>
                      }
                    </div>
                  </CardContent>
                </Card>);

            })}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-6">
            {businessStages.map((stage) => {
              const recommendedAgents = getRecommendedAgentsForStage(stage.id);
              const stageBusinesses = businesses.filter((b) => b.stage_id === stage.id);

              return (
                <Card key={stage.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {stage.name} Stage Recommendations
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Businesses in this stage: {stageBusinesses.length}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {stageBusinesses.slice(0, 3).map((business) =>
                          <Badge key={business.id} variant="outline">
                              {business.name}
                            </Badge>
                          )}
                          {stageBusinesses.length > 3 &&
                          <Badge variant="outline">+{stageBusinesses.length - 3} more</Badge>
                          }
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="font-medium mb-2">Recommended Agents ({recommendedAgents.length})</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {recommendedAgents.map((agent) =>
                          <div key={agent.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{agent.name}</span>
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                                  <Badge variant="secondary" className="text-xs">{agent.type}</Badge>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Performance: {agent.performance_score}%</span>
                                <span>Workload: {getAgentWorkload(agent.id)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>);

            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...agentForm}>
            <form onSubmit={agentForm.handleSubmit(handleUpdateAgent)} className="space-y-4">
              <FormField
                control={agentForm.control}
                name="name"
                rules={{ required: 'Name is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter agent name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />


              <FormField
                control={agentForm.control}
                name="description"
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the agent's purpose" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />


              <FormField
                control={agentForm.control}
                name="agent_type"
                rules={{ required: 'Type is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Agent Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Startup">Startup Agent</SelectItem>
                        <SelectItem value="Branding">Branding Agent</SelectItem>
                        <SelectItem value="Legal">Legal Agent</SelectItem>
                        <SelectItem value="Finance">Finance Agent</SelectItem>
                        <SelectItem value="Marketing">Marketing Agent</SelectItem>
                        <SelectItem value="Sales">Sales Agent</SelectItem>
                        <SelectItem value="Support">Support Agent</SelectItem>
                        <SelectItem value="Analytics">Analytics Agent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                } />


              <FormField
                control={agentForm.control}
                name="capabilities"
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Capabilities</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter capabilities (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />


              <FormField
                control={agentForm.control}
                name="tools"
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Tools</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tools (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />


              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Agent</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Agent to Task</DialogTitle>
            <DialogDescription>
              Assign {selectedAgent?.name} to a business and task
            </DialogDescription>
          </DialogHeader>
          
          <Form {...assignmentForm}>
            <form onSubmit={assignmentForm.handleSubmit(handleAssignAgent)} className="space-y-4">
              <FormField
                control={assignmentForm.control}
                name="business_id"
                rules={{ required: 'Business is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Business</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                control={assignmentForm.control}
                name="task_id"
                rules={{ required: 'Task is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Task</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tasks.filter((task) => !task.agent_id).map((task) =>
                      <SelectItem key={task.id} value={task.id.toString()}>
                            {task.title} - {task.priority} priority
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                } />


              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Assign Agent</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {agents.length === 0 &&
      <Card>
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI agent to get started with automation.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Agent
            </Button>
          </CardContent>
        </Card>
      }
    </div>);

};

export default AgentDashboard;