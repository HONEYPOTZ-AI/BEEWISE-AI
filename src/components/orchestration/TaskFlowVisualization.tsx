import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Workflow,
  ArrowRight,
  Circle,
  Square,
  Diamond,
  Triangle,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter } from
'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Task, Goal } from '@/utils/orchestrationEngine';

export interface TaskFlowVisualizationProps {
  className?: string;
}

interface FlowNode {
  id: string;
  type: 'task' | 'goal' | 'agent' | 'dependency';
  label: string;
  status: string;
  position: {x: number;y: number;};
  connections: string[];
  metadata: Record<string, any>;
}

interface FlowEdge {
  id: string;
  from: string;
  to: string;
  type: 'dependency' | 'assignment' | 'completion';
  label?: string;
}

const TaskFlowVisualization: React.FC<TaskFlowVisualizationProps> = ({ className }) => {
  const { tasks, goals, agents } = useAgentOrchestration();

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'task-flow' | 'agent-network' | 'dependency-graph'>('task-flow');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate flow nodes and edges based on current data
  const flowData = useMemo(() => {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    if (viewMode === 'task-flow') {
      // Create nodes for tasks
      tasks.forEach((task, index) => {
        if (filterStatus === 'all' || task.status === filterStatus) {
          nodes.push({
            id: task.id,
            type: 'task',
            label: task.type,
            status: task.status,
            position: {
              x: 100 + index % 5 * 200,
              y: 100 + Math.floor(index / 5) * 150
            },
            connections: task.dependencies,
            metadata: {
              priority: task.priority,
              assignedAgent: task.assignedAgent,
              createdAt: task.createdAt
            }
          });

          // Create dependency edges
          task.dependencies.forEach((depId) => {
            edges.push({
              id: `${depId}-${task.id}`,
              from: depId,
              to: task.id,
              type: 'dependency',
              label: 'depends on'
            });
          });
        }
      });

      // Create nodes for goals if selected
      if (selectedGoal) {
        const goal = goals.find((g) => g.id === selectedGoal);
        if (goal) {
          nodes.push({
            id: goal.id,
            type: 'goal',
            label: goal.name,
            status: goal.status,
            position: { x: 50, y: 50 },
            connections: goal.tasks,
            metadata: {
              priority: goal.priority,
              progress: goal.progress
            }
          });

          // Connect goal to its tasks
          goal.tasks.forEach((taskId) => {
            if (nodes.find((n) => n.id === taskId)) {
              edges.push({
                id: `${goal.id}-${taskId}`,
                from: goal.id,
                to: taskId,
                type: 'assignment',
                label: 'includes'
              });
            }
          });
        }
      }
    } else if (viewMode === 'agent-network') {
      // Create nodes for agents
      agents.forEach((agent, index) => {
        nodes.push({
          id: agent.id,
          type: 'agent',
          label: agent.name,
          status: agent.status,
          position: {
            x: 150 + index % 4 * 250,
            y: 150 + Math.floor(index / 4) * 200
          },
          connections: agent.currentTasks,
          metadata: {
            type: agent.type,
            capabilities: agent.capabilities,
            taskCount: agent.currentTasks.length
          }
        });

        // Connect agents to their assigned tasks
        agent.currentTasks.forEach((taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            if (!nodes.find((n) => n.id === taskId)) {
              nodes.push({
                id: taskId,
                type: 'task',
                label: task.type,
                status: task.status,
                position: {
                  x: 50 + Math.random() * 300,
                  y: 50 + Math.random() * 300
                },
                connections: [],
                metadata: { priority: task.priority }
              });
            }

            edges.push({
              id: `${agent.id}-${taskId}`,
              from: agent.id,
              to: taskId,
              type: 'assignment',
              label: 'executing'
            });
          }
        });
      });
    } else if (viewMode === 'dependency-graph') {
      // Create a pure dependency visualization
      const processedTasks = tasks.filter((t) => filterStatus === 'all' || t.status === filterStatus);

      // Use a simple layout algorithm for dependency visualization
      const levels: Record<string, number> = {};
      const calculateLevel = (taskId: string, visited: Set<string> = new Set()): number => {
        if (visited.has(taskId)) return 0; // Prevent infinite loops
        if (levels[taskId] !== undefined) return levels[taskId];

        visited.add(taskId);
        const task = processedTasks.find((t) => t.id === taskId);
        if (!task || task.dependencies.length === 0) {
          levels[taskId] = 0;
          return 0;
        }

        const maxDepLevel = Math.max(...task.dependencies.map((depId) => calculateLevel(depId, visited)));
        levels[taskId] = maxDepLevel + 1;
        return levels[taskId];
      };

      processedTasks.forEach((task) => calculateLevel(task.id));

      // Position nodes based on dependency levels
      const levelGroups: Record<number, string[]> = {};
      Object.entries(levels).forEach(([taskId, level]) => {
        if (!levelGroups[level]) levelGroups[level] = [];
        levelGroups[level].push(taskId);
      });

      processedTasks.forEach((task) => {
        const level = levels[task.id] || 0;
        const levelIndex = levelGroups[level].indexOf(task.id);
        const levelSize = levelGroups[level].length;

        nodes.push({
          id: task.id,
          type: 'task',
          label: task.type,
          status: task.status,
          position: {
            x: 100 + level * 200,
            y: 100 + (levelIndex - levelSize / 2) * 100 + levelSize * 25
          },
          connections: task.dependencies,
          metadata: {
            priority: task.priority,
            level: level
          }
        });

        // Add dependency edges
        task.dependencies.forEach((depId) => {
          edges.push({
            id: `${depId}-${task.id}`,
            from: depId,
            to: task.id,
            type: 'dependency'
          });
        });
      });
    }

    return { nodes, edges };
  }, [tasks, goals, agents, viewMode, filterStatus, selectedGoal]);

  // Get node color based on type and status
  const getNodeColor = (node: FlowNode) => {
    const statusColors = {
      pending: 'border-yellow-300 bg-yellow-50',
      assigned: 'border-blue-300 bg-blue-50',
      running: 'border-purple-300 bg-purple-50',
      completed: 'border-green-300 bg-green-50',
      failed: 'border-red-300 bg-red-50',
      active: 'border-green-300 bg-green-50',
      idle: 'border-gray-300 bg-gray-50',
      busy: 'border-blue-300 bg-blue-50',
      error: 'border-red-300 bg-red-50',
      offline: 'border-gray-400 bg-gray-100',
      planning: 'border-yellow-300 bg-yellow-50',
      executing: 'border-blue-300 bg-blue-50'
    };

    return statusColors[node.status as keyof typeof statusColors] || 'border-gray-300 bg-gray-50';
  };

  // Get node shape component based on type
  const getNodeShape = (node: FlowNode) => {
    switch (node.type) {
      case 'goal':return <Diamond className="w-4 h-4" />;
      case 'agent':return <Circle className="w-4 h-4" />;
      case 'task':return <Square className="w-4 h-4" />;
      default:return <Triangle className="w-4 h-4" />;
    }
  };

  // Render SVG connections
  const renderConnections = () => {
    return flowData.edges.map((edge) => {
      const fromNode = flowData.nodes.find((n) => n.id === edge.from);
      const toNode = flowData.nodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return null;

      const x1 = fromNode.position.x + 75; // Half node width
      const y1 = fromNode.position.y + 40; // Half node height
      const x2 = toNode.position.x + 75;
      const y2 = toNode.position.y + 40;

      const strokeColor = edge.type === 'dependency' ? '#e11d48' :
      edge.type === 'assignment' ? '#3b82f6' : '#10b981';

      return (
        <g key={edge.id}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            opacity={0.7} />

          {edge.label &&
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 - 5}
            fill="#6b7280"
            fontSize="10"
            textAnchor="middle">

              {edge.label}
            </text>
          }
        </g>);

    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Workflow className="w-6 h-6 text-indigo-500" />
              <div>
                <CardTitle>Task Flow Visualization</CardTitle>
                <CardDescription>
                  Interactive workflow and dependency visualization
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}>

                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomLevel(100)}>

                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task-flow">Task Flow</SelectItem>
                  <SelectItem value="agent-network">Agent Network</SelectItem>
                  <SelectItem value="dependency-graph">Dependency Graph</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {viewMode === 'task-flow' &&
              <Select value={selectedGoal || ''} onValueChange={(value) => setSelectedGoal(value || null)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select goal (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No goal selected</SelectItem>
                    {goals.map((goal) =>
                  <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>
                  )}
                  </SelectContent>
                </Select>
              }

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm">{zoomLevel}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="border rounded-lg overflow-hidden bg-gray-50" style={{ height: '600px' }}>
              <div
                className="relative w-full h-full overflow-auto"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>

                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  width="100%"
                  height="100%"
                  style={{ minWidth: '800px', minHeight: '600px' }}>

                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto">

                      <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                    </marker>
                  </defs>
                  {renderConnections()}
                </svg>

                {/* Nodes */}
                {flowData.nodes.map((node) =>
                <div
                  key={node.id}
                  className={`absolute border-2 rounded-lg p-3 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${getNodeColor(node)}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: '150px',
                    minHeight: '80px',
                    zIndex: 10
                  }}>

                    <div className="flex items-center space-x-2 mb-2">
                      {getNodeShape(node)}
                      <span className="font-medium text-sm truncate">{node.label}</span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs mb-2">
                      {node.status}
                    </Badge>
                    
                    <div className="text-xs text-gray-600">
                      {node.type === 'task' &&
                    <>
                          <div>Priority: {node.metadata.priority}</div>
                          {node.metadata.assignedAgent &&
                      <div>Agent: {node.metadata.assignedAgent.slice(-8)}</div>
                      }
                        </>
                    }
                      {node.type === 'agent' &&
                    <>
                          <div>Type: {node.metadata.type}</div>
                          <div>Tasks: {node.metadata.taskCount}</div>
                        </>
                    }
                      {node.type === 'goal' &&
                    <div>Progress: {Math.round(node.metadata.progress * 100)}%</div>
                    }
                    </div>
                  </div>
                )}

                {flowData.nodes.length === 0 &&
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No workflow data to visualize</p>
                      <p className="text-sm">Create some tasks or goals to see the flow</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-300 bg-yellow-50 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-300 bg-blue-50 rounded"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-red-300 bg-red-50 rounded"></div>
                <span>Failed/Error</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default TaskFlowVisualization;