
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task, TaskDependency, Business, BusinessStage } from '@/hooks/useEnhancedTasks';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  PlayCircle,
  Building2,
  Layers,
  GitBranch
} from 'lucide-react';

interface TaskWorkflowVisualizationProps {
  tasks: Task[];
  selectedBusiness?: Business;
  businessStages: BusinessStage[];
}

interface WorkflowNode {
  id: number;
  title: string;
  status: Task['status'];
  priority: Task['priority'];
  businessName: string;
  stageName: string;
  dependencies: number[];
  dependents: number[];
  level: number;
  x: number;
  y: number;
}

const TaskWorkflowVisualization: React.FC<TaskWorkflowVisualizationProps> = ({
  tasks,
  selectedBusiness,
  businessStages
}) => {
  // Create workflow nodes with dependency relationships
  const workflowData = useMemo(() => {
    const filteredTasks = selectedBusiness 
      ? tasks.filter(task => task.business_id === selectedBusiness.id)
      : tasks;

    if (filteredTasks.length === 0) return { nodes: [], connections: [] };

    // Create nodes
    const nodes: WorkflowNode[] = filteredTasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      businessName: task.businessName || 'Unknown',
      stageName: task.currentStageName || 'Unknown',
      dependencies: task.dependencies?.filter(dep => dep.parent_task_id !== task.id)
        .map(dep => dep.parent_task_id) || [],
      dependents: task.dependencies?.filter(dep => dep.dependent_task_id !== task.id)
        .map(dep => dep.dependent_task_id) || [],
      level: 0,
      x: 0,
      y: index * 120
    }));

    // Calculate dependency levels for layout
    const calculateLevels = () => {
      const visited = new Set<number>();
      const levels: { [key: number]: number } = {};

      const dfs = (nodeId: number, level: number) => {
        if (visited.has(nodeId)) return levels[nodeId] || 0;
        visited.add(nodeId);
        levels[nodeId] = level;

        const node = nodes.find(n => n.id === nodeId);
        if (node && node.dependents.length > 0) {
          for (const dependentId of node.dependents) {
            const dependentLevel = dfs(dependentId, level + 1);
            levels[dependentId] = Math.max(levels[dependentId] || 0, dependentLevel);
          }
        }
        return level;
      };

      // Start DFS from nodes with no dependencies
      nodes.forEach(node => {
        if (node.dependencies.length === 0) {
          dfs(node.id, 0);
        }
      });

      // Update node levels
      nodes.forEach(node => {
        node.level = levels[node.id] || 0;
        node.x = node.level * 300;
      });
    };

    calculateLevels();

    // Group nodes by business stage for better organization
    const stageGroups: { [key: string]: WorkflowNode[] } = {};
    nodes.forEach(node => {
      if (!stageGroups[node.stageName]) {
        stageGroups[node.stageName] = [];
      }
      stageGroups[node.stageName].push(node);
    });

    // Adjust Y positions within stage groups
    let currentY = 0;
    Object.values(stageGroups).forEach(stageNodes => {
      stageNodes.forEach((node, index) => {
        node.y = currentY + (index * 80);
      });
      currentY += stageNodes.length * 80 + 60; // Add spacing between stages
    });

    // Create connections
    const connections = nodes.flatMap(node =>
      node.dependents.map(dependentId => ({
        from: node.id,
        to: dependentId,
        fromNode: node,
        toNode: nodes.find(n => n.id === dependentId)!
      }))
    ).filter(conn => conn.toNode);

    return { nodes, connections, stageGroups };
  }, [tasks, selectedBusiness]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'in_progress': return 'border-blue-500 bg-blue-50';
      case 'assigned': return 'border-purple-500 bg-purple-50';
      case 'pending': return 'border-gray-500 bg-gray-50';
      case 'failed': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (workflowData.nodes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks available for workflow visualization</p>
            <p className="text-sm text-gray-500">Create some tasks to see the workflow</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate workflow statistics
  const totalTasks = workflowData.nodes.length;
  const completedTasks = workflowData.nodes.filter(n => n.status === 'completed').length;
  const inProgressTasks = workflowData.nodes.filter(n => n.status === 'in_progress').length;
  const blockedTasks = workflowData.nodes.filter(n => 
    n.status === 'pending' && n.dependencies.some(depId => 
      workflowData.nodes.find(node => node.id === depId)?.status !== 'completed'
    )
  ).length;

  return (
    <div className="space-y-6">
      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{blockedTasks}</p>
                <p className="text-sm text-gray-600">Blocked</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
            </div>
            <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stage-based Task Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Tasks by Business Stage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(workflowData.stageGroups).map(([stageName, stageNodes]) => (
              <div key={stageName} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-sm">
                    {stageName}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {stageNodes.filter(n => n.status === 'completed').length}/{stageNodes.length} completed
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stageNodes.map((node) => (
                    <Card key={node.id} className={`${getStatusColor(node.status)} border-l-4 hover:shadow-md transition-shadow`}>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">{node.title}</h4>
                            {getStatusIcon(node.status)}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getPriorityColor(node.priority)} text-white text-xs`}>
                              {node.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {node.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          {!selectedBusiness && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{node.businessName}</span>
                            </div>
                          )}

                          {(node.dependencies.length > 0 || node.dependents.length > 0) && (
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {node.dependencies.length > 0 && (
                                <span>⬅ {node.dependencies.length} deps</span>
                              )}
                              {node.dependents.length > 0 && (
                                <span>{node.dependents.length} deps ➡</span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependency Flow Visualization */}
      {workflowData.connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Task Dependencies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflowData.connections.map((connection, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{connection.fromNode.title}</span>
                      <Badge className={getStatusColor(connection.fromNode.status)} variant="secondary">
                        {connection.fromNode.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{connection.fromNode.businessName}</p>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{connection.toNode.title}</span>
                      <Badge className={getStatusColor(connection.toNode.status)} variant="secondary">
                        {connection.toNode.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{connection.toNode.businessName}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskWorkflowVisualization;
