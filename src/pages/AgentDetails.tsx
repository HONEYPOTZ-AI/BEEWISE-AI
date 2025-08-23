
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  ArrowLeft,
  Star,
  Activity,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Wrench,
  Brain,
  BarChart3,
  Calendar,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface AgentDetail {
  id: number;
  name: string;
  description: string;
  agent_type: string;
  status: string;
  price_per_hour: number;
  rating: number;
  total_tasks: number;
  success_rate: number;
  created_at: string;
  capabilities: Array<{
    name: string;
    proficiency_level: number;
    description: string;
  }>;
  tools: Array<{
    name: string;
    version: string;
    description: string;
  }>;
  performance_metrics: {
    avg_response_time: number;
    uptime_percentage: number;
    tasks_completed_today: number;
    revenue_generated: number;
  };
  recent_tasks: Array<{
    id: number;
    name: string;
    status: string;
    completion_time: string;
    success: boolean;
  }>;
}

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchAgentDetails(parseInt(id));
    }
  }, [id]);

  const fetchAgentDetails = async (agentId: number) => {
    try {
      // Fetch agent basic info
      const { data: agentData, error: agentError } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: 'id', op: 'Equal', value: agentId }]
      });

      if (agentError) throw agentError;
      if (!agentData.List.length) throw new Error('Agent not found');

      const agentInfo = agentData.List[0];

      // Fetch capabilities
      const { data: capData } = await window.ezsite.apis.tablePage(37241, {
        PageNo: 1,
        PageSize: 50,
        Filters: [{ name: 'agent_id', op: 'Equal', value: agentId }]
      });

      // Fetch tools
      const { data: toolData } = await window.ezsite.apis.tablePage(37242, {
        PageNo: 1,
        PageSize: 50,
        Filters: [{ name: 'agent_id', op: 'Equal', value: agentId }]
      });

      // Fetch performance metrics
      const { data: perfData } = await window.ezsite.apis.tablePage(37254, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'created_at',
        IsAsc: false,
        Filters: [{ name: 'agent_id', op: 'Equal', value: agentId }]
      });

      // Fetch recent tasks
      const { data: taskData } = await window.ezsite.apis.tablePage(37245, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'created_at',
        IsAsc: false,
        Filters: [{ name: 'agent_id', op: 'Equal', value: agentId }]
      });

      const agentDetail: AgentDetail = {
        ...agentInfo,
        capabilities: capData?.List.map((cap: any) => ({
          name: cap.capability_name,
          proficiency_level: cap.proficiency_level || 85,
          description: cap.description || ''
        })) || [],
        tools: toolData?.List.map((tool: any) => ({
          name: tool.tool_name,
          version: tool.version || '1.0',
          description: tool.description || ''
        })) || [],
        performance_metrics: {
          avg_response_time: perfData?.List[0]?.avg_response_time || 1.2,
          uptime_percentage: perfData?.List[0]?.uptime_percentage || 99.5,
          tasks_completed_today: perfData?.List[0]?.tasks_completed_today || 15,
          revenue_generated: perfData?.List[0]?.revenue_generated || 1250
        },
        recent_tasks: taskData?.List.map((task: any) => ({
          id: task.id,
          name: task.task_name || `Task ${task.id}`,
          status: task.status,
          completion_time: task.completion_time,
          success: task.success_rate > 80
        })) || []
      };

      setAgent(agentDetail);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agent details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeployAgent = () => {
    toast({
      title: 'Agent Deployment Initiated',
      description: `${agent?.name} is being deployed to your workspace`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-muted rounded" />
                <div className="h-96 bg-muted rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested agent could not be found.
          </p>
          <Link to="/agent-marketplace">
            <Button>Return to Marketplace</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/agent-marketplace">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{agent.name}</h1>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{agent.agent_type}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{agent.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' : 
                        agent.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm capitalize">{agent.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button size="lg" onClick={handleDeployAgent}>
                <Play className="h-4 w-4 mr-2" />
                Deploy Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {agent.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{agent.total_tasks}</div>
                        <div className="text-sm text-muted-foreground">Total Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{agent.success_rate}%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {agent.performance_metrics.uptime_percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {agent.performance_metrics.avg_response_time}s
                        </div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {agent.recent_tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {task.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <div className="font-medium">{task.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Completed {new Date(task.completion_time).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant={task.success ? 'default' : 'destructive'}>
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="capabilities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Agent Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {agent.capabilities.map((capability, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{capability.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {capability.proficiency_level}%
                            </span>
                          </div>
                          <Progress value={capability.proficiency_level} className="h-2" />
                          {capability.description && (
                            <p className="text-sm text-muted-foreground">
                              {capability.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      Integration Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agent.tools.map((tool, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{tool.name}</h4>
                            <Badge variant="outline">v{tool.version}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tool.description || 'Integration tool for enhanced functionality'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {agent.performance_metrics.tasks_completed_today}
                      </div>
                      <div className="text-sm text-muted-foreground">Tasks Completed</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${agent.performance_metrics.revenue_generated}
                      </div>
                      <div className="text-sm text-muted-foreground">This Month</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Response Time</span>
                          <span className="text-sm font-medium">
                            {agent.performance_metrics.avg_response_time}s avg
                          </span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Uptime</span>
                          <span className="text-sm font-medium">
                            {agent.performance_metrics.uptime_percentage}%
                          </span>
                        </div>
                        <Progress value={agent.performance_metrics.uptime_percentage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Success Rate</span>
                          <span className="text-sm font-medium">{agent.success_rate}%</span>
                        </div>
                        <Progress value={agent.success_rate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${agent.price_per_hour}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">per hour</div>
                  <Button className="w-full" size="lg" onClick={handleDeployAgent}>
                    <Play className="h-4 w-4 mr-2" />
                    Deploy Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary">{agent.agent_type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capabilities</span>
                  <span className="text-sm font-medium">{agent.capabilities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tools</span>
                  <span className="text-sm font-medium">{agent.tools.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Tasks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
