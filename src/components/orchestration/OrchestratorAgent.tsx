import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Activity, 
  Users, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Agent, Task } from '@/utils/orchestrationEngine';

export interface OrchestratorAgentProps {
  className?: string;
  agentId?: string;
}

const OrchestratorAgent: React.FC<OrchestratorAgentProps> = ({ className, agentId = 'orchestrator-main' }) => {
  const {
    agents,
    tasks,
    goals,
    systemMetrics,
    registerAgent,
    updateAgentStatus,
    isConnected
  } = useAgentOrchestration();

  const [orchestratorStatus, setOrchestratorStatus] = useState<'initializing' | 'active' | 'busy' | 'error'>('initializing');
  const [routingMetrics, setRoutingMetrics] = useState({
    tasksRouted: 0,
    routingEfficiency: 0,
    averageRoutingTime: 0,
    routingErrors: 0
  });

  // Initialize orchestrator agent
  useEffect(() => {
    const initializeOrchestrator = async () => {
      try {
        await registerAgent({
          id: agentId,
          type: 'orchestrator',
          name: 'Main Orchestrator',
          status: 'active',
          capabilities: ['task-routing', 'lifecycle-management', 'agent-coordination', 'system-monitoring'],
          currentTasks: [],
          metadata: {
            role: 'primary-orchestrator',
            priority: 'critical',
            features: ['intelligent-routing', 'load-balancing', 'health-monitoring']
          }
        });
        setOrchestratorStatus('active');
      } catch (error) {
        setOrchestratorStatus('error');
        console.error('Failed to initialize orchestrator:', error);
      }
    };

    initializeOrchestrator();
  }, [agentId, registerAgent]);

  // Update routing metrics
  useEffect(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const failedTasks = tasks.filter(t => t.status === 'failed');
    const totalProcessedTasks = completedTasks.length + failedTasks.length;

    if (totalProcessedTasks > 0) {
      const efficiency = (completedTasks.length / totalProcessedTasks) * 100;
      const avgRoutingTime = completedTasks.reduce((sum, task) => {
        const routingTime = task.assignedAgent ? 
          (task.updatedAt - task.createdAt) : 0;
        return sum + routingTime;
      }, 0) / Math.max(completedTasks.length, 1);

      setRoutingMetrics({
        tasksRouted: totalProcessedTasks,
        routingEfficiency: efficiency,
        averageRoutingTime: avgRoutingTime,
        routingErrors: failedTasks.length
      });
    }
  }, [tasks]);

  // Task routing logic
  const routeTask = async (task: Task) => {
    setOrchestratorStatus('busy');
    
    try {
      // Simulate intelligent task routing
      const availableAgents = agents.filter(agent => 
        agent.status === 'active' || agent.status === 'idle'
      );

      // Find best agent for the task
      const suitableAgents = availableAgents.filter(agent =>
        task.requiredCapabilities.every(cap => 
          agent.capabilities.includes(cap)
        )
      );

      if (suitableAgents.length > 0) {
        // Route to least busy agent
        const bestAgent = suitableAgents.reduce((best, current) => 
          current.currentTasks.length < best.currentTasks.length ? current : best
        );

        updateAgentStatus(bestAgent.id, 'busy');
        console.log(`Task ${task.id} routed to agent ${bestAgent.id}`);
      }
    } catch (error) {
      console.error('Task routing failed:', error);
    } finally {
      setOrchestratorStatus('active');
    }
  };

  // Get current orchestrator agent data
  const orchestrator = agents.find(a => a.id === agentId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'busy': return 'secondary' as const;
      case 'error': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle>Orchestrator Agent</CardTitle>
                <CardDescription>
                  Task routing and agent lifecycle management
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(orchestratorStatus)}`} />
              <Badge variant={getStatusVariant(orchestratorStatus)}>
                {orchestratorStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <Alert className={isConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription>
                {isConnected ? 'Connected to orchestration network' : 'Disconnected from orchestration network'}
              </AlertDescription>
            </div>
          </Alert>

          {/* System Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{systemMetrics.activeAgents}</div>
              <div className="text-sm text-gray-600">Active Agents</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-green-100">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{routingMetrics.tasksRouted}</div>
              <div className="text-sm text-gray-600">Tasks Routed</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{routingMetrics.routingEfficiency.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{Math.round(routingMetrics.averageRoutingTime / 1000)}s</div>
              <div className="text-sm text-gray-600">Avg Routing Time</div>
            </div>
          </div>

          <Separator />

          {/* Agent Health Monitoring */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <Activity className="w-5 h-5 mr-2" />
              Agent Health Monitoring
            </h3>
            
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-600">{agent.type}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">{agent.currentTasks.length} tasks</div>
                      <div className="text-xs text-gray-600">
                        {agent.performance.errorRate.toFixed(2)}% error rate
                      </div>
                    </div>
                  </div>
                ))}
                
                {agents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No agents registered
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Task Routing Queue */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <ArrowRight className="w-5 h-5 mr-2" />
              Task Routing Status
            </h3>
            
            <div className="space-y-3">
              {/* Pending tasks */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Pending Tasks</span>
                  <span>{tasks.filter(t => t.status === 'pending').length}</span>
                </div>
                <Progress 
                  value={tasks.length > 0 ? (tasks.filter(t => t.status === 'pending').length / tasks.length) * 100 : 0}
                  className="h-2"
                />
              </div>

              {/* Assigned tasks */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Assigned Tasks</span>
                  <span>{tasks.filter(t => t.status === 'assigned' || t.status === 'running').length}</span>
                </div>
                <Progress 
                  value={tasks.length > 0 ? (tasks.filter(t => t.status === 'assigned' || t.status === 'running').length / tasks.length) * 100 : 0}
                  className="h-2"
                />
              </div>

              {/* Completed tasks */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completed Tasks</span>
                  <span>{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
                <Progress 
                  value={tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          {orchestrator && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Orchestrator Performance</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Tasks Completed:</span>
                  <span className="ml-2 font-medium">{orchestrator.performance.tasksCompleted}</span>
                </div>
                <div>
                  <span className="text-blue-700">Response Time:</span>
                  <span className="ml-2 font-medium">{Math.round(orchestrator.performance.averageResponseTime)}ms</span>
                </div>
                <div>
                  <span className="text-blue-700">Error Rate:</span>
                  <span className="ml-2 font-medium">{(orchestrator.performance.errorRate * 100).toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-blue-700">Last Health Check:</span>
                  <span className="ml-2 font-medium">
                    {new Date(orchestrator.performance.lastHealthCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorAgent;