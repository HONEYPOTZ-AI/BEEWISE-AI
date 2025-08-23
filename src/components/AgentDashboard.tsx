
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
import { useAgents } from '@/hooks/useAgents';
import { useTasks } from '@/hooks/useTasks';
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
  RotateCcw } from
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

interface AgentFormData {
  name: string;
  description: string;
  agent_type: string;
  status: string;
  capabilities: string;
  tools: string;
}

const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AgentFormData>({
    defaultValues: {
      name: '',
      description: '',
      agent_type: '',
      status: 'active',
      capabilities: '',
      tools: ''
    }
  });

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
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
    } finally {
      setLoading(false);
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
      form.reset();
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
      form.reset();
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

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    form.setValue('name', agent.name);
    form.setValue('description', agent.description);
    form.setValue('agent_type', agent.type);
    form.setValue('status', agent.status);
    form.setValue('capabilities', agent.capabilities.join(','));
    form.setValue('tools', agent.tools.join(','));
    setIsEditDialogOpen(true);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading agents...</div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Orchestration</h2>
          <p className="text-muted-foreground">Manage and monitor your AI agents</p>
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateAgent)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

      {/* Agents Grid */}
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

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateAgent)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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