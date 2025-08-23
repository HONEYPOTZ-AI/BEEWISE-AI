
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Bot, 
  Activity, 
  Clock, 
  Target, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BusinessMetric {
  id: number;
  business_name: string;
  current_stage: string;
  stage_progress: number;
  active_agents: number;
  completed_tasks: number;
  pending_tasks: number;
  monthly_revenue: number;
  growth_rate: number;
}

interface AgentStatus {
  id: number;
  agent_name: string;
  agent_type: string;
  status: string;
  current_task: string;
  completion_rate: number;
  uptime_hours: number;
}

interface TaskSummary {
  total_tasks: number;
  completed_today: number;
  in_progress: number;
  overdue: number;
  average_completion_time: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load business metrics
      const businessResponse = await window.ezsite.apis.tablePage(37247, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: "ID",
        IsAsc: false
      });

      if (businessResponse.error) throw businessResponse.error;
      setBusinessMetrics(businessResponse.data?.List || []);

      // Load agent statuses
      const agentsResponse = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 8,
        OrderByField: "ID",
        IsAsc: false
      });

      if (agentsResponse.error) throw agentsResponse.error;
      setAgentStatuses(agentsResponse.data?.List || []);

      // Load task summary
      const tasksResponse = await window.ezsite.apis.tablePage(37243, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "created_at",
        IsAsc: false
      });

      if (tasksResponse.error) throw tasksResponse.error;
      
      const tasks = tasksResponse.data?.List || [];
      const today = new Date().toDateString();
      const completedToday = tasks.filter(t => 
        t.status === 'completed' && 
        new Date(t.updated_at).toDateString() === today
      ).length;
      
      const inProgress = tasks.filter(t => t.status === 'in_progress').length;
      const overdue = tasks.filter(t => 
        t.status !== 'completed' && 
        new Date(t.due_date) < new Date()
      ).length;

      setTaskSummary({
        total_tasks: tasks.length,
        completed_today: completedToday,
        in_progress: inProgress,
        overdue: overdue,
        average_completion_time: 2.5
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const businessStages = [
    { name: 'Ideation', icon: '💡', color: 'bg-blue-500' },
    { name: 'Formation', icon: '🏗️', color: 'bg-yellow-500' },
    { name: 'Launch', icon: '🚀', color: 'bg-green-500' },
    { name: 'Growth', icon: '📈', color: 'bg-purple-500' },
    { name: 'Optimization', icon: '⚡', color: 'bg-red-500' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading BeeWise-AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BeeWise-AI Dashboard
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Multi-Agent Business Automation Platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/agent-marketplace')} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Bot className="mr-2 h-4 w-4" />
            Agent Marketplace
          </Button>
          <Button onClick={() => navigate('/orchestration')} variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Orchestration
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStatuses.length}</div>
            <p className="text-xs text-muted-foreground">
              {agentStatuses.filter(a => a.status === 'active').length} online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskSummary?.completed_today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {taskSummary?.in_progress || 0} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24.5%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Lifecycle Stages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Business Lifecycle Stages
                </CardTitle>
                <CardDescription>
                  Visual progression through business development phases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessStages.map((stage, index) => (
                    <div key={stage.name} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{stage.icon}</span>
                          <span className="font-medium">{stage.name}</span>
                        </div>
                        <Progress value={(index + 1) * 20} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => navigate('/business-lifecycle')} 
                  className="w-full mt-6"
                  variant="outline"
                >
                  View Detailed Lifecycle
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and navigation shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/task-management')} 
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Create New Task
                </Button>
                <Button 
                  onClick={() => navigate('/agent-marketplace')} 
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Deploy New Agent
                </Button>
                <Button 
                  onClick={() => navigate('/analytics')} 
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button 
                  onClick={() => navigate('/memory-context')} 
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Memory & Context
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businessMetrics.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{business.business_name || `Business ${business.id}`}</span>
                    <Badge variant="secondary">{business.current_stage || 'Formation'}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Stage Progress: {business.stage_progress || 45}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={business.stage_progress || 45} className="mb-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Active Agents:</span>
                      <span className="ml-2 font-medium">{business.active_agents || 3}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tasks:</span>
                      <span className="ml-2 font-medium">{business.completed_tasks || 12}/{business.pending_tasks || 5}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="ml-2 font-medium">${business.monthly_revenue || 15420}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth:</span>
                      <span className="ml-2 font-medium text-green-600">+{business.growth_rate || 8.2}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentStatuses.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm">{agent.agent_name || `Agent ${agent.id}`}</span>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status === 'active' ? (
                        <><Play className="w-3 h-3 mr-1" /> Active</>
                      ) : (
                        <><Pause className="w-3 h-3 mr-1" /> Idle</>
                      )}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{agent.agent_type || 'General Purpose'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{agent.completion_rate || 89}%</span>
                    </div>
                    <Progress value={agent.completion_rate || 89} />
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current Task:</span>
                    <p className="mt-1">{agent.current_task || 'Analyzing market trends'}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="ml-2 font-medium">{agent.uptime_hours || 24.5}h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {taskSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskSummary.total_tasks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Completed Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{taskSummary.completed_today}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{taskSummary.in_progress}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Overdue
                    {taskSummary.overdue > 0 && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{taskSummary.overdue}</div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Task Performance</CardTitle>
              <CardDescription>
                Average completion time and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {taskSummary?.average_completion_time || 2.5}h
                </div>
                <p className="text-muted-foreground">Average Completion Time</p>
                <Button 
                  onClick={() => navigate('/task-management')} 
                  className="mt-4"
                  variant="outline"
                >
                  View Task Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
