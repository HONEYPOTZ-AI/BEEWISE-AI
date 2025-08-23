import { logger } from './logger';
import { analytics } from './analytics';

export interface Agent {
  id: string;
  type: 'orchestrator' | 'supervisor' | 'validator' | 'worker';
  name: string;
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  capabilities: string[];
  currentTasks: string[];
  performance: {
    tasksCompleted: number;
    averageResponseTime: number;
    errorRate: number;
    lastHealthCheck: number;
  };
  metadata?: Record<string, any>;
}

export interface Task {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';
  assignedAgent?: string;
  dependencies: string[];
  requiredCapabilities: string[];
  payload: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  deadline?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  retryCount: number;
  maxRetries: number;
  result?: any;
  error?: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planning' | 'executing' | 'completed' | 'failed';
  tasks: string[];
  dependencies: string[];
  createdAt: number;
  deadline?: number;
  progress: number;
}

export class OrchestrationEngine {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private goals: Map<string, Goal> = new Map();
  private taskQueue: string[] = [];
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine() {
    logger.info('Initializing Orchestration Engine');
    
    // Start periodic health checks
    setInterval(() => this.performHealthChecks(), 30000);
    
    // Start task processing
    setInterval(() => this.processPendingTasks(), 5000);
    
    // Start performance monitoring
    setInterval(() => this.updatePerformanceMetrics(), 60000);
  }

  // Agent Management
  registerAgent(agent: Omit<Agent, 'performance'>): void {
    const fullAgent: Agent = {
      ...agent,
      performance: {
        tasksCompleted: 0,
        averageResponseTime: 0,
        errorRate: 0,
        lastHealthCheck: Date.now()
      }
    };
    
    this.agents.set(agent.id, fullAgent);
    this.emit('agent:registered', fullAgent);
    logger.info(`Agent registered: ${agent.id}`, { type: agent.type, capabilities: agent.capabilities });
  }

  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      // Reassign active tasks
      agent.currentTasks.forEach(taskId => {
        this.reassignTask(taskId);
      });
      
      this.agents.delete(agentId);
      this.emit('agent:unregistered', { agentId });
      logger.info(`Agent unregistered: ${agentId}`);
    }
  }

  updateAgentStatus(agentId: string, status: Agent['status']): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.performance.lastHealthCheck = Date.now();
      this.emit('agent:status-updated', { agentId, status });
    }
  }

  // Task Management
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'retryCount'>): string {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      retryCount: 0
    };

    this.tasks.set(task.id, task);
    this.buildDependencyGraph(task);
    this.addToQueue(task.id);
    
    this.emit('task:created', task);
    logger.info(`Task created: ${task.id}`, { type: task.type, priority: task.priority });
    
    return task.id;
  }

  updateTaskStatus(taskId: string, status: Task['status'], result?: any, error?: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const oldStatus = task.status;
    task.status = status;
    task.updatedAt = Date.now();

    if (result !== undefined) task.result = result;
    if (error !== undefined) task.error = error;

    if (status === 'completed') {
      task.actualDuration = Date.now() - task.createdAt;
      this.processTaskCompletion(task);
    } else if (status === 'failed') {
      this.processTaskFailure(task);
    }

    this.emit('task:status-updated', { taskId, oldStatus, newStatus: status, task });
    logger.info(`Task status updated: ${taskId}`, { oldStatus, newStatus: status });
  }

  // Goal Management
  createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'progress'>): string {
    const goal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...goalData,
      createdAt: Date.now(),
      progress: 0
    };

    this.goals.set(goal.id, goal);
    this.emit('goal:created', goal);
    logger.info(`Goal created: ${goal.id}`, { name: goal.name, priority: goal.priority });
    
    return goal.id;
  }

  decomposeGoal(goalId: string): string[] {
    const goal = this.goals.get(goalId);
    if (!goal) return [];

    // This is a simplified goal decomposition
    // In a real system, this would use AI/ML to break down complex goals
    const tasks = goal.tasks.map(taskType => {
      return this.createTask({
        type: taskType,
        priority: goal.priority,
        status: 'pending',
        dependencies: [],
        requiredCapabilities: this.getRequiredCapabilities(taskType),
        payload: { goalId },
        maxRetries: 3
      });
    });

    goal.status = 'executing';
    this.emit('goal:decomposed', { goalId, tasks });
    
    return tasks;
  }

  // Task Assignment and Routing
  private processPendingTasks(): void {
    const readyTasks = this.getReadyTasks();
    
    for (const taskId of readyTasks) {
      const task = this.tasks.get(taskId);
      if (!task || task.status !== 'pending') continue;

      const suitableAgent = this.findSuitableAgent(task);
      if (suitableAgent) {
        this.assignTaskToAgent(task.id, suitableAgent.id);
      }
    }
  }

  private getReadyTasks(): string[] {
    return Array.from(this.tasks.values())
      .filter(task => {
        if (task.status !== 'pending') return false;
        
        // Check if all dependencies are completed
        return task.dependencies.every(depId => {
          const depTask = this.tasks.get(depId);
          return depTask?.status === 'completed';
        });
      })
      .sort((a, b) => {
        // Sort by priority and creation time
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return a.createdAt - b.createdAt;
      })
      .map(task => task.id);
  }

  private findSuitableAgent(task: Task): Agent | null {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.status === 'active' || agent.status === 'idle'
      )
      .filter(agent => 
        task.requiredCapabilities.every(cap => 
          agent.capabilities.includes(cap)
        )
      );

    if (availableAgents.length === 0) return null;

    // Score agents based on performance and availability
    return availableAgents.reduce((best, current) => {
      const bestScore = this.calculateAgentScore(best, task);
      const currentScore = this.calculateAgentScore(current, task);
      
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateAgentScore(agent: Agent, task: Task): number {
    let score = 0;
    
    // Availability bonus
    if (agent.status === 'idle') score += 10;
    else if (agent.status === 'active' && agent.currentTasks.length === 0) score += 8;
    
    // Performance metrics
    score += (1 - agent.performance.errorRate) * 5;
    score += Math.max(0, 5 - agent.performance.averageResponseTime / 1000);
    
    // Task load penalty
    score -= agent.currentTasks.length * 2;
    
    // Capability match bonus
    const extraCapabilities = agent.capabilities.filter(cap => 
      !task.requiredCapabilities.includes(cap)
    ).length;
    score += Math.min(extraCapabilities, 3);
    
    return score;
  }

  private assignTaskToAgent(taskId: string, agentId: string): void {
    const task = this.tasks.get(taskId);
    const agent = this.agents.get(agentId);
    
    if (!task || !agent) return;

    task.assignedAgent = agentId;
    task.status = 'assigned';
    task.updatedAt = Date.now();
    
    agent.currentTasks.push(taskId);
    agent.status = 'busy';
    
    this.emit('task:assigned', { taskId, agentId, task });
    logger.info(`Task assigned: ${taskId} -> ${agentId}`);
  }

  private reassignTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // Remove from current agent
    if (task.assignedAgent) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent) {
        agent.currentTasks = agent.currentTasks.filter(id => id !== taskId);
        if (agent.currentTasks.length === 0) {
          agent.status = 'idle';
        }
      }
    }

    // Reset task for reassignment
    task.assignedAgent = undefined;
    task.status = 'pending';
    task.retryCount++;
    
    if (task.retryCount > task.maxRetries) {
      task.status = 'failed';
      task.error = 'Max retries exceeded';
      this.emit('task:failed', { taskId, reason: 'max-retries' });
    }
  }

  // Dependency Management
  private buildDependencyGraph(task: Task): void {
    if (!this.dependencyGraph.has(task.id)) {
      this.dependencyGraph.set(task.id, new Set());
    }
    
    for (const depId of task.dependencies) {
      if (!this.dependencyGraph.has(depId)) {
        this.dependencyGraph.set(depId, new Set());
      }
      this.dependencyGraph.get(depId)!.add(task.id);
    }
  }

  private addToQueue(taskId: string): void {
    if (!this.taskQueue.includes(taskId)) {
      this.taskQueue.push(taskId);
    }
  }

  private processTaskCompletion(task: Task): void {
    // Update agent performance
    if (task.assignedAgent) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent) {
        agent.performance.tasksCompleted++;
        agent.currentTasks = agent.currentTasks.filter(id => id !== task.id);
        
        if (agent.currentTasks.length === 0) {
          agent.status = 'idle';
        }

        // Update response time
        if (task.actualDuration) {
          const currentAvg = agent.performance.averageResponseTime;
          const count = agent.performance.tasksCompleted;
          agent.performance.averageResponseTime = 
            (currentAvg * (count - 1) + task.actualDuration) / count;
        }
      }
    }

    // Trigger dependent tasks
    const dependentTasks = this.dependencyGraph.get(task.id);
    if (dependentTasks) {
      dependentTasks.forEach(depTaskId => {
        const depTask = this.tasks.get(depTaskId);
        if (depTask && this.areAllDependenciesComplete(depTask)) {
          this.addToQueue(depTaskId);
        }
      });
    }

    // Update goal progress
    this.updateGoalProgress(task);
  }

  private processTaskFailure(task: Task): void {
    // Update agent error rate
    if (task.assignedAgent) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent) {
        const totalTasks = agent.performance.tasksCompleted + 1;
        const errors = Math.round(agent.performance.errorRate * agent.performance.tasksCompleted) + 1;
        agent.performance.errorRate = errors / totalTasks;
        
        agent.currentTasks = agent.currentTasks.filter(id => id !== task.id);
        if (agent.currentTasks.length === 0) {
          agent.status = 'idle';
        }
      }
    }

    // Handle task retry or failure propagation
    if (task.retryCount < task.maxRetries) {
      setTimeout(() => {
        this.reassignTask(task.id);
      }, 5000 * Math.pow(2, task.retryCount)); // Exponential backoff
    } else {
      this.propagateTaskFailure(task);
    }
  }

  private areAllDependenciesComplete(task: Task): boolean {
    return task.dependencies.every(depId => {
      const depTask = this.tasks.get(depId);
      return depTask?.status === 'completed';
    });
  }

  private propagateTaskFailure(task: Task): void {
    // Mark dependent tasks as cancelled
    const dependentTasks = this.dependencyGraph.get(task.id);
    if (dependentTasks) {
      dependentTasks.forEach(depTaskId => {
        const depTask = this.tasks.get(depTaskId);
        if (depTask && depTask.status === 'pending') {
          depTask.status = 'cancelled';
          depTask.error = `Dependency failed: ${task.id}`;
          this.emit('task:cancelled', { taskId: depTaskId, reason: 'dependency-failure' });
        }
      });
    }
  }

  private updateGoalProgress(task: Task): void {
    // Find goals that contain this task
    for (const goal of this.goals.values()) {
      if (goal.tasks.includes(task.id)) {
        const completedTasks = goal.tasks.filter(taskId => {
          const t = this.tasks.get(taskId);
          return t?.status === 'completed';
        }).length;
        
        goal.progress = completedTasks / goal.tasks.length;
        
        if (goal.progress === 1) {
          goal.status = 'completed';
          this.emit('goal:completed', { goalId: goal.id });
        }
        
        this.emit('goal:progress-updated', { goalId: goal.id, progress: goal.progress });
      }
    }
  }

  // Health Monitoring
  private performHealthChecks(): void {
    for (const agent of this.agents.values()) {
      const timeSinceLastCheck = Date.now() - agent.performance.lastHealthCheck;
      
      if (timeSinceLastCheck > 60000) { // 1 minute
        agent.status = 'offline';
        this.emit('agent:health-check-failed', { agentId: agent.id });
        
        // Reassign tasks from offline agents
        agent.currentTasks.forEach(taskId => {
          this.reassignTask(taskId);
        });
        agent.currentTasks = [];
      }
    }
  }

  private updatePerformanceMetrics(): void {
    const metrics = {
      totalAgents: this.agents.size,
      activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
      totalTasks: this.tasks.size,
      completedTasks: Array.from(this.tasks.values()).filter(t => t.status === 'completed').length,
      failedTasks: Array.from(this.tasks.values()).filter(t => t.status === 'failed').length,
      averageTaskDuration: this.calculateAverageTaskDuration(),
      systemErrorRate: this.calculateSystemErrorRate()
    };

    analytics.trackEvent('orchestration:performance-update', metrics);
    this.emit('system:performance-updated', metrics);
  }

  private calculateAverageTaskDuration(): number {
    const completedTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed' && t.actualDuration);
    
    if (completedTasks.length === 0) return 0;
    
    const totalDuration = completedTasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0);
    return totalDuration / completedTasks.length;
  }

  private calculateSystemErrorRate(): number {
    const totalTasks = Array.from(this.tasks.values()).filter(t => 
      t.status === 'completed' || t.status === 'failed'
    ).length;
    
    if (totalTasks === 0) return 0;
    
    const failedTasks = Array.from(this.tasks.values()).filter(t => t.status === 'failed').length;
    return failedTasks / totalTasks;
  }

  // Utility Methods
  private getRequiredCapabilities(taskType: string): string[] {
    const capabilityMap: Record<string, string[]> = {
      'data-analysis': ['analytics', 'data-processing'],
      'content-generation': ['nlp', 'content-creation'],
      'api-integration': ['api-client', 'data-transformation'],
      'monitoring': ['system-monitoring', 'alerting'],
      'validation': ['quality-control', 'compliance-checking'],
      'orchestration': ['task-routing', 'lifecycle-management']
    };
    
    return capabilityMap[taskType] || ['general'];
  }

  // Event System
  on(event: string, handler: (data: any) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event)!.add(handler);
    
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          logger.error(`Event handler error for ${event}`, error as Error);
        }
      });
    }
  }

  // Getters
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getGoal(goalId: string): Goal | undefined {
    return this.goals.get(goalId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getAllGoals(): Goal[] {
    return Array.from(this.goals.values());
  }

  getSystemStatus() {
    return {
      agents: this.getAllAgents(),
      tasks: this.getAllTasks(),
      goals: this.getAllGoals(),
      queueSize: this.taskQueue.length,
      timestamp: Date.now()
    };
  }
}

// Global orchestration engine instance
export const orchestrationEngine = new OrchestrationEngine();