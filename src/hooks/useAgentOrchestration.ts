import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { orchestrationEngine, Agent, Task, Goal } from '@/utils/orchestrationEngine';
import { logger } from '@/utils/logger';
import { useToast } from './use-toast';

export interface OrchestrationState {
  agents: Agent[];
  tasks: Task[];
  goals: Goal[];
  systemMetrics: {
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageTaskDuration: number;
    systemErrorRate: number;
  };
  queueSize: number;
  loading: boolean;
  error: string | null;
}

export const useAgentOrchestration = () => {
  const { toast } = useToast();
  const [state, setState] = useState<OrchestrationState>({
    agents: [],
    tasks: [],
    goals: [],
    systemMetrics: {
      totalAgents: 0,
      activeAgents: 0,
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTaskDuration: 0,
      systemErrorRate: 0
    },
    queueSize: 0,
    loading: false,
    error: null
  });

  // WebSocket connection for real-time updates
  const wsUrl = `ws://${window.location.host}/ws/orchestration`;
  const { sendMessage, onMessage, isConnected } = useWebSocket(wsUrl, {
    reconnectInterval: 3000,
    maxReconnectAttempts: 10
  });

  // Update state from orchestration engine
  const updateState = useCallback(() => {
    const systemStatus = orchestrationEngine.getSystemStatus();

    setState((prev) => ({
      ...prev,
      agents: systemStatus.agents,
      tasks: systemStatus.tasks,
      goals: systemStatus.goals,
      queueSize: systemStatus.queueSize,
      systemMetrics: {
        totalAgents: systemStatus.agents.length,
        activeAgents: systemStatus.agents.filter((a) => a.status === 'active').length,
        totalTasks: systemStatus.tasks.length,
        completedTasks: systemStatus.tasks.filter((t) => t.status === 'completed').length,
        failedTasks: systemStatus.tasks.filter((t) => t.status === 'failed').length,
        averageTaskDuration: systemStatus.tasks.
        filter((t) => t.actualDuration).
        reduce((sum, t) => sum + (t.actualDuration || 0), 0) /
        Math.max(systemStatus.tasks.filter((t) => t.actualDuration).length, 1),
        systemErrorRate: systemStatus.tasks.length > 0 ?
        systemStatus.tasks.filter((t) => t.status === 'failed').length / systemStatus.tasks.length : 0
      },
      loading: false,
      error: null
    }));
  }, []);

  // Agent Management
  const registerAgent = useCallback(async (agentData: Omit<Agent, 'performance'>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      orchestrationEngine.registerAgent(agentData);
      updateState();

      // Notify via WebSocket
      sendMessage({
        type: 'agent:register',
        payload: agentData
      });

      toast({
        title: 'Agent Registered',
        description: `Agent ${agentData.name} has been registered successfully.`
      });

      logger.info('Agent registered successfully', { agentId: agentData.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: message }));

      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });

      logger.error('Failed to register agent', error as Error);
    }
  }, [sendMessage, toast, updateState]);

  const unregisterAgent = useCallback(async (agentId: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      orchestrationEngine.unregisterAgent(agentId);
      updateState();

      sendMessage({
        type: 'agent:unregister',
        payload: { agentId }
      });

      toast({
        title: 'Agent Unregistered',
        description: `Agent has been unregistered successfully.`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: message }));

      toast({
        title: 'Unregistration Failed',
        description: message,
        variant: 'destructive'
      });
    }
  }, [sendMessage, toast, updateState]);

  const updateAgentStatus = useCallback((agentId: string, status: Agent['status']) => {
    orchestrationEngine.updateAgentStatus(agentId, status);
    updateState();

    sendMessage({
      type: 'agent:status-update',
      payload: { agentId, status },
      agentId
    });
  }, [sendMessage, updateState]);

  // Task Management
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'retryCount'>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const taskId = orchestrationEngine.createTask(taskData);
      updateState();

      sendMessage({
        type: 'task:create',
        payload: { taskId, taskData },
        taskId
      });

      toast({
        title: 'Task Created',
        description: `Task has been created and queued for execution.`
      });

      return taskId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: message }));

      toast({
        title: 'Task Creation Failed',
        description: message,
        variant: 'destructive'
      });

      throw error;
    }
  }, [sendMessage, toast, updateState]);

  const updateTaskStatus = useCallback((taskId: string, status: Task['status'], result?: any, error?: string) => {
    orchestrationEngine.updateTaskStatus(taskId, status, result, error);
    updateState();

    sendMessage({
      type: 'task:status-update',
      payload: { taskId, status, result, error },
      taskId
    });
  }, [sendMessage, updateState]);

  // Goal Management
  const createGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const goalId = orchestrationEngine.createGoal(goalData);
      updateState();

      sendMessage({
        type: 'goal:create',
        payload: { goalId, goalData }
      });

      toast({
        title: 'Goal Created',
        description: `Goal "${goalData.name}" has been created successfully.`
      });

      return goalId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: message }));

      toast({
        title: 'Goal Creation Failed',
        description: message,
        variant: 'destructive'
      });

      throw error;
    }
  }, [sendMessage, toast, updateState]);

  const decomposeGoal = useCallback(async (goalId: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const taskIds = orchestrationEngine.decomposeGoal(goalId);
      updateState();

      sendMessage({
        type: 'goal:decompose',
        payload: { goalId, taskIds }
      });

      toast({
        title: 'Goal Decomposed',
        description: `Goal has been broken down into ${taskIds.length} tasks.`
      });

      return taskIds;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: message }));

      toast({
        title: 'Goal Decomposition Failed',
        description: message,
        variant: 'destructive'
      });

      throw error;
    }
  }, [sendMessage, toast, updateState]);

  // Utility functions
  const getAgent = useCallback((agentId: string) => {
    return orchestrationEngine.getAgent(agentId);
  }, []);

  const getTask = useCallback((taskId: string) => {
    return orchestrationEngine.getTask(taskId);
  }, []);

  const getGoal = useCallback((goalId: string) => {
    return orchestrationEngine.getGoal(goalId);
  }, []);

  const refreshData = useCallback(() => {
    updateState();
  }, [updateState]);

  // WebSocket message handlers
  useEffect(() => {
    const unsubscribeHandlers = [
    onMessage('agent:registered', (message) => {
      updateState();
      toast({
        title: 'Agent Online',
        description: `Agent ${message.payload.name} has come online.`
      });
    }),

    onMessage('agent:unregistered', (message) => {
      updateState();
      toast({
        title: 'Agent Offline',
        description: `An agent has gone offline.`
      });
    }),

    onMessage('task:completed', (message) => {
      updateState();
      toast({
        title: 'Task Completed',
        description: `Task has been completed successfully.`
      });
    }),

    onMessage('task:failed', (message) => {
      updateState();
      toast({
        title: 'Task Failed',
        description: `Task has failed: ${message.payload.reason}`,
        variant: 'destructive'
      });
    }),

    onMessage('goal:completed', (message) => {
      updateState();
      toast({
        title: 'Goal Achieved',
        description: `Goal has been completed successfully!`
      });
    }),

    onMessage('system:performance-updated', (message) => {
      updateState();
    }),

    onMessage('agent:health-check-failed', (message) => {
      updateState();
      toast({
        title: 'Agent Health Check Failed',
        description: `Agent ${message.payload.agentId} is not responding.`,
        variant: 'destructive'
      });
    })];


    return () => {
      unsubscribeHandlers.forEach((unsub) => unsub());
    };
  }, [onMessage, toast, updateState]);

  // Set up orchestration engine event listeners
  useEffect(() => {
    const unsubscribeHandlers = [
    orchestrationEngine.on('agent:registered', updateState),
    orchestrationEngine.on('agent:unregistered', updateState),
    orchestrationEngine.on('agent:status-updated', updateState),
    orchestrationEngine.on('task:created', updateState),
    orchestrationEngine.on('task:assigned', updateState),
    orchestrationEngine.on('task:status-updated', updateState),
    orchestrationEngine.on('goal:created', updateState),
    orchestrationEngine.on('goal:decomposed', updateState),
    orchestrationEngine.on('goal:progress-updated', updateState),
    orchestrationEngine.on('system:performance-updated', updateState)];


    return () => {
      unsubscribeHandlers.forEach((unsub) => unsub());
    };
  }, [updateState]);

  // Initial data load
  useEffect(() => {
    updateState();
  }, [updateState]);

  return {
    // State
    ...state,
    isConnected,

    // Agent operations
    registerAgent,
    unregisterAgent,
    updateAgentStatus,
    getAgent,

    // Task operations
    createTask,
    updateTaskStatus,
    getTask,

    // Goal operations
    createGoal,
    decomposeGoal,
    getGoal,

    // Utility
    refreshData
  };
};