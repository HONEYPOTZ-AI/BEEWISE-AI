
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Bot,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  Zap,
  RefreshCw,
  Pause,
  Play,
  Settings
} from 'lucide-react';

interface AgentStatus {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
  last_activity: string;
  tasks_in_queue: number;
  uptime_hours: number;
  error_count: number;
}

const AgentStatusMonitor = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentStatuses();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAgentStatuses, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchAgentStatuses = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'name',
        IsAsc: true
      });

      if (error) throw error;

      // Simulate real-time data with some randomization
      const agentStatuses: AgentStatus[] = (data?.List || []).map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        type: agent.agent_type,
        status: getRandomStatus(),
        cpu_usage: Math.floor(Math.random() * 80) + 10,
        memory_usage: Math.floor(Math.random() * 70) + 20,
        response_time: Math.random() * 2 + 0.5,
        last_activity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        tasks_in_queue: Math.floor(Math.random() * 5),
        uptime_hours: Math.floor(Math.random() * 720) + 24,
        error_count: Math.floor(Math.random() * 3)
      }));

      setAgents(agentStatuses);
    } catch (error) {
      console.error('Error fetching agent statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch agent statuses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRandomStatus = (): AgentStatus['status'] => {
    const statuses: AgentStatus['status'][] = ['active', 'idle', 'busy', 'error', 'offline'];
    const weights = [0.5, 0.3, 0.15, 0.03, 0.02]; // Probability weights
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return statuses[i];
      }
    }
    return 'active';
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'busy':
        return <Activity className="h-4 w-4" />;
      case 'idle':
        return <Clock className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const handleAgentAction = (agentId: number, action: 'start' | 'stop' | 'restart') => {
    toast({
      title: `Agent ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `Agent ${agentId} ${action} command sent`,
    });
  };

  const getHealthScore = (agent: AgentStatus) => {
    const cpuScore = Math.max(0, 100 - agent.cpu_usage);
    const memoryScore = Math.max(0, 100 - agent.memory_usage);
    const responseScore = Math.max(0, 100 - (agent.response_time * 20));
    const errorScore = Math.max(0, 100 - (agent.error_count * 20));
    
    return Math.floor((cpuScore + memoryScore + responseScore + errorScore) / 4);
  };

  const overallStats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    busy: agents.filter(a => a.status === 'busy').length,
    error: agents.filter(a => a.status === 'error').length,
    avgResponseTime: agents.length > 0 ? agents.reduce((sum, a) => sum + a.response_time, 0) / agents.length : 0,
    avgCpuUsage: agents.length > 0 ? agents.reduce((sum, a) => sum + a.cpu_usage, 0) / agents.length : 0
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 animate-spin" />
            Loading Agent Status...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                  <div className="w-16 h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{overallStats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{overallStats.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{overallStats.busy}</div>
            <div className="text-xs text-muted-foreground">Busy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overallStats.error}</div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{overallStats.avgResponseTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{overallStats.avgCpuUsage.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Avg CPU</div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Real-time Agent Status
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchAgentStatuses}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.type}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="capitalize">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(agent.status)}`} />
                      {agent.status}
                    </Badge>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'stop' : 'start')}
                      >
                        {agent.status === 'active' ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />
                        }
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <Cpu className="h-3 w-3" />
                      <span>CPU</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={agent.cpu_usage} className="h-1 flex-1" />
                      <span className="w-10 text-xs">{agent.cpu_usage}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <MemoryStick className="h-3 w-3" />
                      <span>Memory</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={agent.memory_usage} className="h-1 flex-1" />
                      <span className="w-10 text-xs">{agent.memory_usage}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" />
                      <span>Response</span>
                    </div>
                    <div className="font-medium">{agent.response_time.toFixed(2)}s</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground mb-1">Queue</div>
                    <div className="font-medium">{agent.tasks_in_queue} tasks</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground mb-1">Health</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${
                        getHealthScore(agent) > 80 ? 'text-green-600' :
                        getHealthScore(agent) > 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getHealthScore(agent)}%
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    Last activity: {new Date(agent.last_activity).toLocaleTimeString()}
                  </div>
                  <div>
                    Uptime: {Math.floor(agent.uptime_hours / 24)}d {agent.uptime_hours % 24}h
                  </div>
                  {agent.error_count > 0 && (
                    <div className="text-red-600">
                      {agent.error_count} errors
                    </div>
                  )}
                </div>
              </div>
            ))}

            {agents.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Agents</h3>
                <p className="text-muted-foreground">
                  Deploy agents from the marketplace to see their status here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStatusMonitor;
