import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Target, 
  Workflow, 
  Plus, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  GitBranch,
  Zap
} from 'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Goal, Task } from '@/utils/orchestrationEngine';
import { useToast } from '@/hooks/use-toast';

export interface SupervisorAgentProps {
  className?: string;
  agentId?: string;
}

const SupervisorAgent: React.FC<SupervisorAgentProps> = ({ className, agentId = 'supervisor-main' }) => {
  const {
    goals,
    tasks,
    agents,
    registerAgent,
    createGoal,
    decomposeGoal,
    createTask
  } = useAgentOrchestration();
  
  const { toast } = useToast();
  const [supervisorStatus, setSupervisorStatus] = useState<'initializing' | 'active' | 'planning' | 'monitoring'>('initializing');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  
  // Form states
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    priority: 'medium' as const,
    tasks: [] as string[],
    deadline: ''
  });

  const [newTask, setNewTask] = useState({
    type: '',
    priority: 'medium' as const,
    requiredCapabilities: [] as string[],
    dependencies: [] as string[],
    payload: {},
    maxRetries: 3,
    estimatedDuration: 0
  });

  // Initialize supervisor agent
  useEffect(() => {
    const initializeSupervisor = async () => {
      try {
        await registerAgent({
          id: agentId,
          type: 'supervisor',
          name: 'Goal Supervisor',
          status: 'active',
          capabilities: ['goal-decomposition', 'task-assignment', 'progress-monitoring', 'resource-allocation'],
          currentTasks: [],
          metadata: {
            role: 'goal-supervisor',
            priority: 'high',
            features: ['intelligent-decomposition', 'dynamic-reassignment', 'progress-tracking']
          }
        });
        setSupervisorStatus('active');
      } catch (error) {
        console.error('Failed to initialize supervisor:', error);
      }
    };

    initializeSupervisor();
  }, [agentId, registerAgent]);

  // Goal decomposition logic
  const handleGoalDecomposition = async (goalId: string) => {
    setSupervisorStatus('planning');
    
    try {
      const taskIds = await decomposeGoal(goalId);
      toast({
        title: 'Goal Decomposed',
        description: `Successfully broke down goal into ${taskIds.length} tasks.`
      });
    } catch (error) {
      toast({
        title: 'Decomposition Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setSupervisorStatus('monitoring');
    }
  };

  // Create new goal
  const handleCreateGoal = async () => {
    try {
      const goalData = {
        name: newGoal.name,
        description: newGoal.description,
        priority: newGoal.priority,
        status: 'planning' as const,
        tasks: newGoal.tasks,
        dependencies: [],
        deadline: newGoal.deadline ? new Date(newGoal.deadline).getTime() : undefined
      };

      await createGoal(goalData);
      
      // Reset form
      setNewGoal({
        name: '',
        description: '',
        priority: 'medium',
        tasks: [],
        deadline: ''
      });
      
      setShowCreateGoal(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    try {
      const taskData = {
        type: newTask.type,
        priority: newTask.priority,
        status: 'pending' as const,
        dependencies: newTask.dependencies,
        requiredCapabilities: newTask.requiredCapabilities,
        payload: newTask.payload,
        maxRetries: newTask.maxRetries,
        estimatedDuration: newTask.estimatedDuration
      };

      await createTask(taskData);
      
      // Reset form
      setNewTask({
        type: '',
        priority: 'medium',
        requiredCapabilities: [],
        dependencies: [],
        payload: {},
        maxRetries: 3,
        estimatedDuration: 0
      });
      
      setShowCreateTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Calculate goal progress
  const getGoalProgress = (goal: Goal) => {
    const goalTasks = tasks.filter(t => goal.tasks.includes(t.id));
    if (goalTasks.length === 0) return 0;
    
    const completedTasks = goalTasks.filter(t => t.status === 'completed').length;
    return (completedTasks / goalTasks.length) * 100;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'executing': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'assigned': return 'text-purple-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-purple-500" />
              <div>
                <CardTitle>Supervisor Agent</CardTitle>
                <CardDescription>
                  Goal decomposition and task assignment
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={supervisorStatus === 'active' ? 'default' : 'secondary'}>
                {supervisorStatus.toUpperCase()}
              </Badge>
              <div className="flex space-x-2">
                <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal-name">Goal Name</Label>
                        <Input
                          id="goal-name"
                          value={newGoal.name}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter goal name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea
                          id="goal-description"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the goal"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-priority">Priority</Label>
                        <Select 
                          value={newGoal.priority} 
                          onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="goal-deadline">Deadline (Optional)</Label>
                        <Input
                          id="goal-deadline"
                          type="datetime-local"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleCreateGoal} className="w-full">
                        Create Goal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task-type">Task Type</Label>
                        <Input
                          id="task-type"
                          value={newTask.type}
                          onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="e.g., data-analysis, content-generation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select 
                          value={newTask.priority} 
                          onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="task-retries">Max Retries</Label>
                        <Input
                          id="task-retries"
                          type="number"
                          value={newTask.maxRetries}
                          onChange={(e) => setNewTask(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
                          min="0"
                          max="10"
                        />
                      </div>
                      <Button onClick={handleCreateTask} className="w-full">
                        Create Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Goals Overview */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <Target className="w-5 h-5 mr-2" />
              Goals Overview
            </h3>
            
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg border bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{goal.name}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGoalDecomposition(goal.id)}
                        disabled={goal.status === 'executing' || goal.status === 'completed'}
                      >
                        <Workflow className="w-4 h-4 mr-2" />
                        Decompose
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getGoalProgress(goal).toFixed(1)}%</span>
                      </div>
                      <Progress value={getGoalProgress(goal)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{goal.tasks.length} tasks</span>
                        <span>Priority: {goal.priority}</span>
                      </div>
                      {goal.deadline && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {goals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No goals created yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Task Assignment Status */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <GitBranch className="w-5 h-5 mr-2" />
              Task Assignment Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Pending Tasks</h4>
                <ScrollArea className="h-32">
                  {tasks
                    .filter(t => t.status === 'pending')
                    .map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 rounded border mb-2">
                        <div>
                          <div className="font-medium text-sm">{task.type}</div>
                          <div className="text-xs text-gray-600">
                            Requires: {task.requiredCapabilities.join(', ')}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-yellow-600">
                          Pending
                        </Badge>
                      </div>
                    ))
                  }
                </ScrollArea>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Active Tasks</h4>
                <ScrollArea className="h-32">
                  {tasks
                    .filter(t => t.status === 'assigned' || t.status === 'running')
                    .map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 rounded border mb-2">
                        <div>
                          <div className="font-medium text-sm">{task.type}</div>
                          <div className="text-xs text-gray-600">
                            Agent: {task.assignedAgent || 'Unassigned'}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getTaskStatusColor(task.status)}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    ))
                  }
                </ScrollArea>
              </div>
            </div>
          </div>

          <Separator />

          {/* Supervisor Performance */}
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h4 className="flex items-center font-semibold text-purple-900 mb-3">
              <Zap className="w-5 h-5 mr-2" />
              Supervisor Performance
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-purple-700">Goals Created:</span>
                <span className="ml-2 font-medium">{goals.length}</span>
              </div>
              <div>
                <span className="text-purple-700">Tasks Supervised:</span>
                <span className="ml-2 font-medium">{tasks.length}</span>
              </div>
              <div>
                <span className="text-purple-700">Success Rate:</span>
                <span className="ml-2 font-medium">
                  {tasks.length > 0 ? 
                    ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1) : 
                    '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorAgent;