import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Brain,
  Shield,
  Crown,
  Workflow,
  GitBranch,
  Layers,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Settings,
  RefreshCw } from
'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import OrchestratorAgent from './OrchestratorAgent';
import SupervisorAgent from './SupervisorAgent';
import ValidatorAgent from './ValidatorAgent';
import TaskFlowVisualization from './TaskFlowVisualization';
import TaskWorkflowManager from './TaskWorkflowManager';
import TaskDependencyResolver from './TaskDependencyResolver';

export interface OrchestrationDashboardProps {
  className?: string;
}

const OrchestrationDashboard: React.FC<OrchestrationDashboardProps> = ({ className }) => {
  const {
    agents,
    tasks,
    goals,
    systemMetrics,
    isConnected,
    refreshData
  } = useAgentOrchestration();

  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Calculate system health based on metrics
  useEffect(() => {
    const errorRate = systemMetrics.systemErrorRate;
    const activeAgents = systemMetrics.activeAgents;
    const totalAgents = systemMetrics.totalAgents;

    if (errorRate > 0.3 || activeAgents < totalAgents * 0.5) {
      setSystemHealth('critical');
    } else if (errorRate > 0.1 || activeAgents < totalAgents * 0.8) {
      setSystemHealth('warning');
    } else {
      setSystemHealth('healthy');
    }
  }, [systemMetrics]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      setLastRefresh(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleRefresh = () => {
    refreshData();
    setLastRefresh(Date.now());
  };

  // Get status colors and indicators
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':return 'text-green-600 bg-green-100';
      case 'warning':return 'text-yellow-600 bg-yellow-100';
      case 'critical':return 'text-red-600 bg-red-100';
      default:return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':return <CheckCircle className="w-5 h-5" />;
      case 'warning':return <AlertTriangle className="w-5 h-5" />;
      case 'critical':return <AlertTriangle className="w-5 h-5" />;
      default:return <Clock className="w-5 h-5" />;
    }
  };

  // Calculate task distribution
  const taskDistribution = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    assigned: tasks.filter((t) => t.status === 'assigned').length,
    running: tasks.filter((t) => t.status === 'running').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    failed: tasks.filter((t) => t.status === 'failed').length
  };

  // Calculate agent distribution
  const agentDistribution = {
    orchestrator: agents.filter((a) => a.type === 'orchestrator').length,
    supervisor: agents.filter((a) => a.type === 'supervisor').length,
    validator: agents.filter((a) => a.type === 'validator').length,
    worker: agents.filter((a) => a.type === 'worker').length
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Orchestration Dashboard</h1>
            <p className="text-gray-600">Manage and monitor your agent ecosystem</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getHealthColor(systemHealth)}`}>
              {getHealthIcon(systemHealth)}
              <span className="text-sm font-medium capitalize">{systemHealth}</span>
            </div>
            
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Connection Alert */}
        {!isConnected &&
        <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Connection to orchestration network is lost. Some features may not work properly.
            </AlertDescription>
          </Alert>
        }

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.activeAgents}</div>
              <p className="text-xs text-gray-600">
                {systemMetrics.totalAgents} total agents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running Tasks</CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskDistribution.running + taskDistribution.assigned}</div>
              <p className="text-xs text-gray-600">
                {systemMetrics.totalTasks} total tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemMetrics.totalTasks > 0 ?
                Math.round(systemMetrics.completedTasks / systemMetrics.totalTasks * 100) :
                0
                }%
              </div>
              <p className="text-xs text-gray-600">
                {systemMetrics.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.filter((g) => g.status === 'executing').length}</div>
              <p className="text-xs text-gray-600">
                {goals.length} total goals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Task Completion Rate</span>
                  <span>{systemMetrics.totalTasks > 0 ?
                    Math.round(systemMetrics.completedTasks / systemMetrics.totalTasks * 100) : 0}%</span>
                </div>
                <Progress value={systemMetrics.totalTasks > 0 ?
                systemMetrics.completedTasks / systemMetrics.totalTasks * 100 : 0} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Agent Utilization</span>
                  <span>{systemMetrics.totalAgents > 0 ?
                    Math.round(systemMetrics.activeAgents / systemMetrics.totalAgents * 100) : 0}%</span>
                </div>
                <Progress value={systemMetrics.totalAgents > 0 ?
                systemMetrics.activeAgents / systemMetrics.totalAgents * 100 : 0} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>System Error Rate</span>
                  <span>{Math.round(systemMetrics.systemErrorRate * 100)}%</span>
                </div>
                <Progress value={systemMetrics.systemErrorRate * 100} className="[&>div]:bg-red-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg Task Duration</span>
                  <span>{Math.round(systemMetrics.averageTaskDuration / 1000)}s</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Last refresh: {new Date(lastRefresh).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Orchestration Control Center</CardTitle>
            <CardDescription>
              Manage agents, workflows, and system operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
                <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
                <TabsTrigger value="validator">Validator</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Agent Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Agent Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-blue-500" />
                            <span>Orchestrator</span>
                          </div>
                          <Badge>{agentDistribution.orchestrator}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-purple-500" />
                            <span>Supervisor</span>
                          </div>
                          <Badge>{agentDistribution.supervisor}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Validator</span>
                          </div>
                          <Badge>{agentDistribution.validator}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>Worker</span>
                          </div>
                          <Badge>{agentDistribution.worker}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Task Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-600">Pending</span>
                          <Badge variant="outline">{taskDistribution.pending}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600">Assigned</span>
                          <Badge variant="outline">{taskDistribution.assigned}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-600">Running</span>
                          <Badge variant="outline">{taskDistribution.running}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600">Completed</span>
                          <Badge variant="outline">{taskDistribution.completed}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-red-600">Failed</span>
                          <Badge variant="outline">{taskDistribution.failed}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Task Flow Visualization */}
                <TaskFlowVisualization />
              </TabsContent>

              <TabsContent value="orchestrator" className="mt-6">
                <OrchestratorAgent />
              </TabsContent>

              <TabsContent value="supervisor" className="mt-6">
                <SupervisorAgent />
              </TabsContent>

              <TabsContent value="validator" className="mt-6">
                <ValidatorAgent />
              </TabsContent>

              <TabsContent value="workflows" className="mt-6">
                <TaskWorkflowManager />
              </TabsContent>

              <TabsContent value="dependencies" className="mt-6">
                <TaskDependencyResolver />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default OrchestrationDashboard;