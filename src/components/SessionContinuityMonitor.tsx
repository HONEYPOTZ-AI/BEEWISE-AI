
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, ArrowRight, Clock, Zap, AlertCircle } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SessionActivity {
  session_id: string;
  agent_id: number;
  activity_type: string;
  timestamp: string;
  data: any;
}

interface AgentHandoff {
  session_id: string;
  from_agent: number;
  to_agent: number;
  reason: string;
  timestamp: string;
  context_preserved: boolean;
}

interface SessionHealth {
  session_id: string;
  health_score: number;
  issues: string[];
  context_integrity: number;
  memory_usage: number;
}

const SessionContinuityMonitor: React.FC = () => {
  const [realtimeActivities, setRealtimeActivities] = useState<SessionActivity[]>([]);
  const [recentHandoffs, setRecentHandoffs] = useState<AgentHandoff[]>([]);
  const [sessionHealth, setSessionHealth] = useState<SessionHealth[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  
  // WebSocket connection for real-time updates
  const { isConnected, sendMessage } = useWebSocket('ws://localhost:8080/session-monitor');

  useEffect(() => {
    loadAgents();
    loadInitialData();
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(performHealthCheck, 30000);
    
    return () => clearInterval(healthCheckInterval);
  }, []);

  const loadAgents = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'display_name',
        IsAsc: true
      });
      if (!error) setAgents(data.List || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      // Load recent sessions for monitoring
      const { data, error } = await window.ezsite.apis.tablePage(37251, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: 'last_activity_at',
        IsAsc: false,
        Filters: [
          { name: 'status', op: 'Equal', value: 'active' }
        ]
      });

      if (!error && data.List) {
        // Generate mock real-time activities and health data
        generateMockRealtimeData(data.List);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const generateMockRealtimeData = (sessions: any[]) => {
    // Generate mock activities
    const mockActivities: SessionActivity[] = sessions.slice(0, 5).map((session, index) => ({
      session_id: session.session_id,
      agent_id: session.primary_agent_id,
      activity_type: ['message_processing', 'context_update', 'memory_access', 'task_execution'][index % 4],
      timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
      data: {
        duration: Math.floor(Math.random() * 5000) + 100,
        tokens: Math.floor(Math.random() * 1000) + 50
      }
    }));
    setRealtimeActivities(mockActivities);

    // Generate mock handoffs
    const mockHandoffs: AgentHandoff[] = sessions.slice(0, 3).map((session, index) => ({
      session_id: session.session_id,
      from_agent: session.primary_agent_id,
      to_agent: session.primary_agent_id + 1,
      reason: ['load_balancing', 'specialization', 'error_recovery'][index % 3],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      context_preserved: Math.random() > 0.2
    }));
    setRecentHandoffs(mockHandoffs);

    // Generate mock health data
    const mockHealth: SessionHealth[] = sessions.slice(0, 8).map(session => ({
      session_id: session.session_id,
      health_score: Math.floor(Math.random() * 40) + 60,
      issues: Math.random() > 0.7 ? ['high_latency', 'memory_pressure'] : [],
      context_integrity: Math.floor(Math.random() * 20) + 80,
      memory_usage: Math.floor(Math.random() * 60) + 20
    }));
    setSessionHealth(mockHealth);
  };

  const performHealthCheck = () => {
    // Update health scores with some variation
    setSessionHealth(prev => 
      prev.map(session => ({
        ...session,
        health_score: Math.max(20, Math.min(100, session.health_score + (Math.random() - 0.5) * 10)),
        memory_usage: Math.max(10, Math.min(90, session.memory_usage + (Math.random() - 0.5) * 10))
      }))
    );

    // Add new activity occasionally
    if (Math.random() > 0.7 && realtimeActivities.length > 0) {
      const randomSession = realtimeActivities[Math.floor(Math.random() * realtimeActivities.length)];
      const newActivity: SessionActivity = {
        ...randomSession,
        activity_type: ['message_processing', 'context_update', 'memory_access'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        data: {
          duration: Math.floor(Math.random() * 3000) + 100,
          tokens: Math.floor(Math.random() * 800) + 50
        }
      };
      
      setRealtimeActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }
  };

  const getAgentName = (agentId: number) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.display_name || agent.name : `Agent ${agentId}`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      message_processing: 'bg-blue-100 text-blue-800',
      context_update: 'bg-green-100 text-green-800',
      memory_access: 'bg-purple-100 text-purple-800',
      task_execution: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Session Continuity Monitor
            <div className="ml-auto flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Real-time Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realtimeActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{activity.session_id}</div>
                      <div className="text-xs text-gray-500">
                        {getAgentName(activity.agent_id)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getActivityColor(activity.activity_type)}>
                      {activity.activity_type.replace('_', ' ')}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {realtimeActivities.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No recent activities
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Handoffs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Agent Handoffs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentHandoffs.map((handoff, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{handoff.session_id}</div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(handoff.timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <span>{getAgentName(handoff.from_agent)}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span>{getAgentName(handoff.to_agent)}</span>
                    </div>
                    <Badge variant={handoff.context_preserved ? 'default' : 'destructive'}>
                      {handoff.context_preserved ? 'Context Preserved' : 'Context Lost'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reason: {handoff.reason.replace('_', ' ')}
                  </div>
                </div>
              ))}
              {recentHandoffs.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No recent handoffs
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Session Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sessionHealth.map((health, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm truncate">{health.session_id}</div>
                  <div className={`text-sm font-bold ${getHealthColor(health.health_score)}`}>
                    {health.health_score}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Health Score</span>
                      <span>{health.health_score}%</span>
                    </div>
                    <Progress value={health.health_score} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Context Integrity</span>
                      <span>{health.context_integrity}%</span>
                    </div>
                    <Progress value={health.context_integrity} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Memory Usage</span>
                      <span>{health.memory_usage}%</span>
                    </div>
                    <Progress 
                      value={health.memory_usage} 
                      className={`h-2 ${health.memory_usage > 80 ? 'bg-red-100' : ''}`} 
                    />
                  </div>
                  
                  {health.issues.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-red-600 font-medium">Issues:</div>
                      {health.issues.map((issue, i) => (
                        <Badge key={i} variant="destructive" className="text-xs mr-1 mb-1">
                          {issue.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {sessionHealth.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No active sessions to monitor
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {realtimeActivities.length}
              </div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {recentHandoffs.filter(h => h.context_preserved).length}
              </div>
              <div className="text-sm text-gray-600">Successful Handoffs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {sessionHealth.filter(s => s.health_score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Healthy Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(sessionHealth.reduce((sum, s) => sum + s.context_integrity, 0) / Math.max(sessionHealth.length, 1))}%
              </div>
              <div className="text-sm text-gray-600">Avg Context Integrity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionContinuityMonitor;
