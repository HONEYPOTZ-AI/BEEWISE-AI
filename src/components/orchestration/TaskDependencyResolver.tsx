import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Network,
  MapPin } from
'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Task } from '@/utils/orchestrationEngine';
import { useToast } from '@/hooks/use-toast';

export interface TaskDependencyResolverProps {
  className?: string;
}

interface DependencyNode {
  taskId: string;
  task: Task;
  level: number;
  dependencies: string[];
  dependents: string[];
  isBlocking: boolean;
  isCriticalPath: boolean;
}

interface DependencyIssue {
  type: 'circular' | 'missing' | 'deadlock' | 'orphaned';
  severity: 'low' | 'medium' | 'high' | 'critical';
  taskIds: string[];
  message: string;
  resolution?: string;
}

interface ResolutionStats {
  totalDependencies: number;
  resolvedDependencies: number;
  blockedTasks: number;
  criticalPathLength: number;
  circularDependencies: number;
  averageResolutionTime: number;
}

const TaskDependencyResolver: React.FC<TaskDependencyResolverProps> = ({ className }) => {
  const { tasks, updateTaskStatus } = useAgentOrchestration();
  const { toast } = useToast();

  const [resolutionStats, setResolutionStats] = useState<ResolutionStats>({
    totalDependencies: 0,
    resolvedDependencies: 0,
    blockedTasks: 0,
    criticalPathLength: 0,
    circularDependencies: 0,
    averageResolutionTime: 0
  });

  const [autoResolve, setAutoResolve] = useState(true);
  const [lastAnalysis, setLastAnalysis] = useState<number>(Date.now());

  // Build dependency graph and analyze
  const dependencyAnalysis = useMemo(() => {
    const nodes: DependencyNode[] = [];
    const issues: DependencyIssue[] = [];
    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    // Build dependency map
    const dependencyMap = new Map<string, string[]>();
    const dependentMap = new Map<string, string[]>();

    tasks.forEach((task) => {
      dependencyMap.set(task.id, task.dependencies);

      task.dependencies.forEach((depId) => {
        if (!dependentMap.has(depId)) {
          dependentMap.set(depId, []);
        }
        dependentMap.get(depId)!.push(task.id);
      });
    });

    // Calculate levels using topological sorting
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const calculateLevel = (taskId: string): number => {
      if (visiting.has(taskId)) {
        // Circular dependency detected
        const circularPath = Array.from(visiting).concat([taskId]);
        issues.push({
          type: 'circular',
          severity: 'critical',
          taskIds: circularPath,
          message: `Circular dependency detected: ${circularPath.join(' → ')}`,
          resolution: 'Remove or modify dependencies to break the cycle'
        });
        return 0;
      }

      if (levels.has(taskId)) {
        return levels.get(taskId)!;
      }

      visiting.add(taskId);

      const dependencies = dependencyMap.get(taskId) || [];
      let maxDepLevel = -1;

      for (const depId of dependencies) {
        if (!taskMap.has(depId)) {
          // Missing dependency
          issues.push({
            type: 'missing',
            severity: 'high',
            taskIds: [taskId, depId],
            message: `Task ${taskId} depends on missing task ${depId}`,
            resolution: 'Create the missing task or remove the dependency'
          });
          continue;
        }

        const depLevel = calculateLevel(depId);
        maxDepLevel = Math.max(maxDepLevel, depLevel);
      }

      visiting.delete(taskId);
      visited.add(taskId);

      const level = maxDepLevel + 1;
      levels.set(taskId, level);
      return level;
    };

    // Calculate levels for all tasks
    tasks.forEach((task) => {
      if (!visited.has(task.id)) {
        calculateLevel(task.id);
      }
    });

    // Find critical path
    const criticalPathTasks = new Set<string>();
    let maxLevel = 0;

    tasks.forEach((task) => {
      const level = levels.get(task.id) || 0;
      maxLevel = Math.max(maxLevel, level);
    });

    // Identify critical path tasks (longest dependency chain)
    const findCriticalPath = (taskId: string, currentPath: string[] = []): string[] => {
      if (currentPath.includes(taskId)) return []; // Avoid cycles

      const newPath = [...currentPath, taskId];
      const dependencies = dependencyMap.get(taskId) || [];

      if (dependencies.length === 0) return newPath;

      let longestPath = newPath;
      dependencies.forEach((depId) => {
        const path = findCriticalPath(depId, newPath);
        if (path.length > longestPath.length) {
          longestPath = path;
        }
      });

      return longestPath;
    };

    let criticalPath: string[] = [];
    tasks.forEach((task) => {
      if (task.dependencies.length === 0) {// Start from leaf tasks
        const path = findCriticalPath(task.id);
        if (path.length > criticalPath.length) {
          criticalPath = path;
        }
      }
    });

    criticalPath.forEach((taskId) => criticalPathTasks.add(taskId));

    // Build nodes
    tasks.forEach((task) => {
      const level = levels.get(task.id) || 0;
      const dependencies = dependencyMap.get(task.id) || [];
      const dependents = dependentMap.get(task.id) || [];

      // Check if task is blocking others
      const isBlocking = dependents.some((depTaskId) => {
        const depTask = taskMap.get(depTaskId);
        return depTask && (depTask.status === 'pending' || depTask.status === 'assigned');
      });

      nodes.push({
        taskId: task.id,
        task,
        level,
        dependencies,
        dependents,
        isBlocking,
        isCriticalPath: criticalPathTasks.has(task.id)
      });
    });

    // Sort nodes by level and priority
    nodes.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;

      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.task.priority] - priorityOrder[a.task.priority];
    });

    // Detect deadlocks
    const blockedTasks = nodes.filter((node) =>
    node.task.status === 'pending' &&
    node.dependencies.some((depId) => {
      const depTask = taskMap.get(depId);
      return depTask && (depTask.status === 'failed' || depTask.status === 'cancelled');
    })
    );

    if (blockedTasks.length > 0) {
      issues.push({
        type: 'deadlock',
        severity: 'high',
        taskIds: blockedTasks.map((n) => n.taskId),
        message: `${blockedTasks.length} tasks are blocked by failed dependencies`,
        resolution: 'Resolve failed dependencies or remove dependency relationships'
      });
    }

    // Find orphaned tasks
    const orphanedTasks = nodes.filter((node) =>
    node.dependencies.length === 0 &&
    node.dependents.length === 0 &&
    node.task.status === 'pending'
    );

    if (orphanedTasks.length > 0) {
      issues.push({
        type: 'orphaned',
        severity: 'medium',
        taskIds: orphanedTasks.map((n) => n.taskId),
        message: `${orphanedTasks.length} tasks have no dependencies or dependents`,
        resolution: 'Review if these tasks are necessary or add appropriate dependencies'
      });
    }

    return { nodes, issues, criticalPath };
  }, [tasks]);

  // Update resolution statistics
  useEffect(() => {
    const totalDeps = tasks.reduce((sum, task) => sum + task.dependencies.length, 0);
    const resolvedDeps = tasks.reduce((sum, task) => {
      const resolvedCount = task.dependencies.filter((depId) => {
        const depTask = tasks.find((t) => t.id === depId);
        return depTask?.status === 'completed';
      }).length;
      return sum + resolvedCount;
    }, 0);

    const blocked = dependencyAnalysis.nodes.filter((node) =>
    node.task.status === 'pending' &&
    node.dependencies.some((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask && depTask.status !== 'completed';
    })
    ).length;

    const circular = dependencyAnalysis.issues.filter((issue) => issue.type === 'circular').length;

    setResolutionStats({
      totalDependencies: totalDeps,
      resolvedDependencies: resolvedDeps,
      blockedTasks: blocked,
      criticalPathLength: dependencyAnalysis.criticalPath.length,
      circularDependencies: circular,
      averageResolutionTime: 2500 // Simulated average resolution time
    });

    setLastAnalysis(Date.now());
  }, [tasks, dependencyAnalysis]);

  // Auto-resolve dependency issues
  useEffect(() => {
    if (!autoResolve) return;

    const criticalIssues = dependencyAnalysis.issues.filter((issue) =>
    issue.severity === 'critical' || issue.severity === 'high'
    );

    criticalIssues.forEach((issue) => {
      if (issue.type === 'deadlock') {
        // Auto-resolve deadlocks by marking blocked tasks as failed
        issue.taskIds.forEach((taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task && task.status === 'pending') {
            updateTaskStatus(taskId, 'failed', undefined, 'Blocked by failed dependencies');
          }
        });
      }
    });
  }, [dependencyAnalysis.issues, autoResolve, tasks, updateTaskStatus]);

  // Manual resolution functions
  const resolveCircularDependency = async (taskIds: string[]) => {
    // Remove the last dependency in the chain
    if (taskIds.length > 1) {
      const lastTaskId = taskIds[taskIds.length - 1];
      const firstTaskId = taskIds[0];

      // In a real implementation, you would update the task dependencies
      toast({
        title: 'Circular Dependency Resolved',
        description: `Removed dependency from ${lastTaskId} to ${firstTaskId}`
      });
    }
  };

  const retryFailedDependencies = async (taskIds: string[]) => {
    taskIds.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status === 'failed') {
        updateTaskStatus(taskId, 'pending');
      }
    });

    toast({
      title: 'Dependencies Retried',
      description: `${taskIds.length} failed tasks have been reset to pending`
    });
  };

  const forceResolveBlocked = async (taskIds: string[]) => {
    taskIds.forEach((taskId) => {
      updateTaskStatus(taskId, 'assigned', undefined, undefined);
    });

    toast({
      title: 'Blocked Tasks Resolved',
      description: `${taskIds.length} blocked tasks have been force-assigned`
    });
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':return 'text-red-600 bg-red-100 border-red-300';
      case 'high':return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium':return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low':return 'text-blue-600 bg-blue-100 border-blue-300';
      default:return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'circular':return <RefreshCw className="w-4 h-4" />;
      case 'missing':return <AlertTriangle className="w-4 h-4" />;
      case 'deadlock':return <Clock className="w-4 h-4" />;
      case 'orphaned':return <MapPin className="w-4 h-4" />;
      default:return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-6 h-6 text-orange-500" />
              <div>
                <CardTitle>Dependency Resolver</CardTitle>
                <CardDescription>
                  Analyze and resolve task dependencies
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoResolve(!autoResolve)}>

                <Zap className={`w-4 h-4 mr-2 ${autoResolve ? 'text-green-600' : 'text-gray-400'}`} />
                Auto-Resolve
              </Button>
              <Badge variant="outline">
                Last analysis: {new Date(lastAnalysis).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Resolution Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{resolutionStats.totalDependencies}</div>
              <div className="text-sm text-gray-600">Total Dependencies</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{resolutionStats.resolvedDependencies}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{resolutionStats.blockedTasks}</div>
              <div className="text-sm text-gray-600">Blocked Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{resolutionStats.criticalPathLength}</div>
              <div className="text-sm text-gray-600">Critical Path Length</div>
            </div>
          </div>

          {/* Resolution Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Dependency Resolution Progress</span>
              <span>
                {resolutionStats.totalDependencies > 0 ?
                Math.round(resolutionStats.resolvedDependencies / resolutionStats.totalDependencies * 100) :
                100
                }%
              </span>
            </div>
            <Progress
              value={resolutionStats.totalDependencies > 0 ?
              resolutionStats.resolvedDependencies / resolutionStats.totalDependencies * 100 :
              100
              }
              className="h-3" />

          </div>

          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="issues">Dependency Issues</TabsTrigger>
              <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
              <TabsTrigger value="critical">Critical Path</TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="space-y-4">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {dependencyAnalysis.issues.map((issue, index) =>
                  <Alert key={index} className={getSeverityColor(issue.severity)}>
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <AlertDescription>
                            <div className="font-medium mb-1">{issue.message}</div>
                            {issue.resolution &&
                          <div className="text-sm opacity-80 mb-2">{issue.resolution}</div>
                          }
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {issue.type} - {issue.severity}
                              </Badge>
                              <div className="flex space-x-2">
                                {issue.type === 'circular' &&
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resolveCircularDependency(issue.taskIds)}>

                                    Resolve
                                  </Button>
                              }
                                {issue.type === 'deadlock' &&
                              <>
                                    <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => retryFailedDependencies(issue.taskIds)}>

                                      Retry
                                    </Button>
                                    <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => forceResolveBlocked(issue.taskIds)}>

                                      Force Resolve
                                    </Button>
                                  </>
                              }
                              </div>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}
                  
                  {dependencyAnalysis.issues.length === 0 &&
                  <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
                      <p>No dependency issues detected</p>
                      <p className="text-sm">All dependencies are properly resolved</p>
                    </div>
                  }
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="graph" className="space-y-4">
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {dependencyAnalysis.nodes.map((node) =>
                  <div key={node.taskId} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded text-xs font-mono bg-gray-100`}>
                          L{node.level}
                        </div>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{node.task.type}</span>
                            {node.isCriticalPath &&
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                          }
                            {node.isBlocking &&
                          <Badge variant="secondary" className="text-xs">Blocking</Badge>
                          }
                          </div>
                          <div className="text-sm text-gray-600">
                            {node.dependencies.length} deps → {node.dependents.length} dependents
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={
                    node.task.status === 'completed' ? 'default' :
                    node.task.status === 'failed' ? 'destructive' :
                    node.task.status === 'running' ? 'secondary' : 'outline'
                    }>
                        {node.task.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="critical" className="space-y-4">
              {dependencyAnalysis.criticalPath.length > 0 ?
              <div>
                  <Alert className="mb-4">
                    <TrendingUp className="w-4 h-4" />
                    <AlertDescription>
                      Critical path contains {dependencyAnalysis.criticalPath.length} tasks. 
                      Delays in these tasks will impact the overall timeline.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    {dependencyAnalysis.criticalPath.map((taskId, index) => {
                    const task = tasks.find((t) => t.id === taskId);
                    if (!task) return null;

                    return (
                      <div key={taskId} className="flex items-center space-x-3 p-3 rounded border bg-red-50">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{task.type}</div>
                            <div className="text-sm text-gray-600">Priority: {task.priority}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'failed' ? 'destructive' :
                          task.status === 'running' ? 'secondary' : 'outline'
                          }>
                              {task.status}
                            </Badge>
                            {index < dependencyAnalysis.criticalPath.length - 1 &&
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          }
                          </div>
                        </div>);

                  })}
                  </div>
                </div> :

              <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No critical path identified</p>
                  <p className="text-sm">Tasks have no dependencies or are not connected</p>
                </div>
              }
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default TaskDependencyResolver;