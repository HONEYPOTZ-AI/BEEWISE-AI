import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers,
  Play,
  Pause,
  Square,
  RotateCcw,
  FastForward,
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GitBranch,
  Zap,
  Activity } from
'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Task, Goal } from '@/utils/orchestrationEngine';
import { useToast } from '@/hooks/use-toast';

export interface TaskWorkflowManagerProps {
  className?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'retryCount'>[];
  metadata: {
    category: string;
    estimatedDuration: number;
    complexity: 'simple' | 'moderate' | 'complex';
    tags: string[];
  };
}

interface WorkflowExecution {
  id: string;
  templateId: string;
  name: string;
  status: 'preparing' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: number;
  endTime?: number;
  taskIds: string[];
  currentStep: number;
  totalSteps: number;
  error?: string;
}

const TaskWorkflowManager: React.FC<TaskWorkflowManagerProps> = ({ className }) => {
  const {
    tasks,
    goals,
    createTask,
    createGoal,
    updateTaskStatus
  } = useAgentOrchestration();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('executions');
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showExecuteWorkflow, setShowExecuteWorkflow] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Predefined workflow templates
  const [workflowTemplates] = useState<WorkflowTemplate[]>([
  {
    id: 'data-processing-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Complete data ingestion, processing, and analysis workflow',
    tasks: [
    {
      type: 'data-ingestion',
      priority: 'high',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['data-processing', 'api-integration'],
      payload: { source: 'external-api', format: 'json' },
      maxRetries: 3
    },
    {
      type: 'data-validation',
      priority: 'high',
      status: 'pending',
      dependencies: [], // Will be set to data-ingestion task ID
      requiredCapabilities: ['data-validation', 'quality-control'],
      payload: { validationRules: ['schema-check', 'data-integrity'] },
      maxRetries: 2
    },
    {
      type: 'data-transformation',
      priority: 'medium',
      status: 'pending',
      dependencies: [], // Will be set to data-validation task ID
      requiredCapabilities: ['data-transformation', 'analytics'],
      payload: { transformationType: 'normalization' },
      maxRetries: 3
    },
    {
      type: 'data-analysis',
      priority: 'medium',
      status: 'pending',
      dependencies: [], // Will be set to data-transformation task ID
      requiredCapabilities: ['analytics', 'machine-learning'],
      payload: { analysisType: 'statistical-analysis' },
      maxRetries: 2
    }],

    metadata: {
      category: 'data-science',
      estimatedDuration: 1800000, // 30 minutes
      complexity: 'moderate',
      tags: ['data', 'analytics', 'pipeline']
    }
  },
  {
    id: 'content-generation-workflow',
    name: 'Content Generation Workflow',
    description: 'AI-powered content creation and optimization workflow',
    tasks: [
    {
      type: 'research-keywords',
      priority: 'high',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['research', 'nlp'],
      payload: { topic: 'user-defined', depth: 'comprehensive' },
      maxRetries: 2
    },
    {
      type: 'generate-outline',
      priority: 'high',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['content-planning', 'nlp'],
      payload: { contentType: 'article', length: 'long-form' },
      maxRetries: 3
    },
    {
      type: 'create-content',
      priority: 'medium',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['content-generation', 'nlp'],
      payload: { style: 'professional', tone: 'informative' },
      maxRetries: 3
    },
    {
      type: 'optimize-seo',
      priority: 'low',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['seo-optimization', 'content-analysis'],
      payload: { targetKeywords: [], readabilityScore: 80 },
      maxRetries: 2
    }],

    metadata: {
      category: 'content-marketing',
      estimatedDuration: 2700000, // 45 minutes
      complexity: 'moderate',
      tags: ['content', 'seo', 'ai-generation']
    }
  },
  {
    id: 'system-health-check',
    name: 'System Health Check',
    description: 'Comprehensive system monitoring and health validation',
    tasks: [
    {
      type: 'check-system-resources',
      priority: 'high',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['system-monitoring', 'performance-analysis'],
      payload: { metrics: ['cpu', 'memory', 'disk', 'network'] },
      maxRetries: 1
    },
    {
      type: 'validate-services',
      priority: 'high',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['service-monitoring', 'health-checking'],
      payload: { services: ['api', 'database', 'cache'] },
      maxRetries: 2
    },
    {
      type: 'security-scan',
      priority: 'medium',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['security-scanning', 'vulnerability-assessment'],
      payload: { scanType: 'comprehensive' },
      maxRetries: 1
    },
    {
      type: 'generate-report',
      priority: 'low',
      status: 'pending',
      dependencies: [],
      requiredCapabilities: ['report-generation', 'data-analysis'],
      payload: { reportFormat: 'detailed', includeRecommendations: true },
      maxRetries: 2
    }],

    metadata: {
      category: 'system-administration',
      estimatedDuration: 900000, // 15 minutes
      complexity: 'simple',
      tags: ['monitoring', 'health-check', 'security']
    }
  }]
  );

  // Execute a workflow template
  const executeWorkflow = async (templateId: string, customName?: string) => {
    const template = workflowTemplates.find((t) => t.id === templateId);
    if (!template) {
      toast({
        title: 'Template Not Found',
        description: 'The selected workflow template could not be found.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const executionId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();

      // Create workflow execution record
      const execution: WorkflowExecution = {
        id: executionId,
        templateId,
        name: customName || template.name,
        status: 'preparing',
        progress: 0,
        startTime,
        taskIds: [],
        currentStep: 0,
        totalSteps: template.tasks.length
      };

      setWorkflowExecutions((prev) => [...prev, execution]);

      // Create tasks in sequence
      const createdTaskIds: string[] = [];
      let previousTaskId: string | null = null;

      for (let i = 0; i < template.tasks.length; i++) {
        const taskTemplate = template.tasks[i];

        const taskData = {
          ...taskTemplate,
          dependencies: previousTaskId ? [previousTaskId] : taskTemplate.dependencies,
          payload: {
            ...taskTemplate.payload,
            workflowId: executionId,
            stepNumber: i + 1
          }
        };

        const taskId = await createTask(taskData);
        createdTaskIds.push(taskId);
        previousTaskId = taskId;
      }

      // Update execution with created task IDs
      setWorkflowExecutions((prev) =>
      prev.map((exec) =>
      exec.id === executionId ?
      { ...exec, taskIds: createdTaskIds, status: 'running' } :
      exec
      )
      );

      toast({
        title: 'Workflow Started',
        description: `${template.name} workflow has been initiated with ${createdTaskIds.length} tasks.`
      });

    } catch (error) {
      toast({
        title: 'Workflow Execution Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Update workflow execution progress based on task status
  useEffect(() => {
    setWorkflowExecutions((prev) =>
    prev.map((execution) => {
      const executionTasks = tasks.filter((t) => execution.taskIds.includes(t.id));
      if (executionTasks.length === 0) return execution;

      const completedTasks = executionTasks.filter((t) => t.status === 'completed').length;
      const failedTasks = executionTasks.filter((t) => t.status === 'failed').length;
      const progress = completedTasks / executionTasks.length * 100;

      let newStatus = execution.status;
      if (failedTasks > 0 && execution.status === 'running') {
        newStatus = 'failed';
      } else if (completedTasks === executionTasks.length && execution.status === 'running') {
        newStatus = 'completed';
      }

      return {
        ...execution,
        progress,
        status: newStatus,
        currentStep: completedTasks,
        endTime: newStatus === 'completed' || newStatus === 'failed' ? Date.now() : execution.endTime
      };
    })
    );
  }, [tasks]);

  // Control workflow execution
  const pauseWorkflow = (executionId: string) => {
    setWorkflowExecutions((prev) =>
    prev.map((exec) =>
    exec.id === executionId ? { ...exec, status: 'paused' } : exec
    )
    );

    // In a real implementation, you would pause the actual tasks
    toast({
      title: 'Workflow Paused',
      description: 'Workflow execution has been paused.'
    });
  };

  const resumeWorkflow = (executionId: string) => {
    setWorkflowExecutions((prev) =>
    prev.map((exec) =>
    exec.id === executionId ? { ...exec, status: 'running' } : exec
    )
    );

    toast({
      title: 'Workflow Resumed',
      description: 'Workflow execution has been resumed.'
    });
  };

  const cancelWorkflow = (executionId: string) => {
    const execution = workflowExecutions.find((e) => e.id === executionId);
    if (execution) {
      // Cancel all pending/running tasks in the workflow
      execution.taskIds.forEach((taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && (task.status === 'pending' || task.status === 'assigned' || task.status === 'running')) {
          updateTaskStatus(taskId, 'cancelled', undefined, 'Workflow cancelled by user');
        }
      });
    }

    setWorkflowExecutions((prev) =>
    prev.map((exec) =>
    exec.id === executionId ?
    { ...exec, status: 'cancelled', endTime: Date.now() } :
    exec
    )
    );

    toast({
      title: 'Workflow Cancelled',
      description: 'Workflow execution has been cancelled.'
    });
  };

  // Get status color and icon
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':return 'text-blue-600 bg-blue-100';
      case 'completed':return 'text-green-600 bg-green-100';
      case 'failed':return 'text-red-600 bg-red-100';
      case 'paused':return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':return 'text-gray-600 bg-gray-100';
      default:return 'text-purple-600 bg-purple-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':return <Play className="w-4 h-4" />;
      case 'completed':return <CheckCircle className="w-4 h-4" />;
      case 'failed':return <XCircle className="w-4 h-4" />;
      case 'paused':return <Pause className="w-4 h-4" />;
      case 'cancelled':return <Square className="w-4 h-4" />;
      default:return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-indigo-500" />
              <div>
                <CardTitle>Workflow Manager</CardTitle>
                <CardDescription>
                  Create and manage automated task workflows
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Dialog open={showExecuteWorkflow} onOpenChange={setShowExecuteWorkflow}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Execute Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Execute Workflow</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Template</Label>
                      <Select value={selectedTemplate || ''} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a workflow template" />
                        </SelectTrigger>
                        <SelectContent>
                          {workflowTemplates.map((template) =>
                          <SelectItem key={template.id} value={template.id}>
                              {template.name} - {template.metadata.category}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedTemplate &&
                    <div className="space-y-2">
                        <Label>Custom Name (Optional)</Label>
                        <Input
                        placeholder="Enter custom workflow name"
                        id="custom-name" />

                      </div>
                    }
                    
                    <Button
                      onClick={() => {
                        if (selectedTemplate) {
                          const customName = (document.getElementById('custom-name') as HTMLInputElement)?.value;
                          executeWorkflow(selectedTemplate, customName || undefined);
                          setShowExecuteWorkflow(false);
                          setSelectedTemplate(null);
                        }
                      }}
                      disabled={!selectedTemplate}
                      className="w-full">

                      Start Workflow
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="executions">Active Executions</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="executions" className="space-y-4">
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {workflowExecutions.map((execution) =>
                  <div key={execution.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{execution.name}</h4>
                          <Badge className={getStatusColor(execution.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(execution.status)}
                              <span>{execution.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {execution.status === 'running' &&
                        <Button size="sm" variant="outline" onClick={() => pauseWorkflow(execution.id)}>
                              <Pause className="w-4 h-4" />
                            </Button>
                        }
                          {execution.status === 'paused' &&
                        <Button size="sm" variant="outline" onClick={() => resumeWorkflow(execution.id)}>
                              <Play className="w-4 h-4" />
                            </Button>
                        }
                          {(execution.status === 'running' || execution.status === 'paused') &&
                        <Button size="sm" variant="outline" onClick={() => cancelWorkflow(execution.id)}>
                              <Square className="w-4 h-4" />
                            </Button>
                        }
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{execution.currentStep}/{execution.totalSteps} steps ({Math.round(execution.progress)}%)</span>
                        </div>
                        <Progress value={execution.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                        <span>Started: {new Date(execution.startTime).toLocaleString()}</span>
                        {execution.endTime &&
                      <span>
                            Duration: {Math.round((execution.endTime - execution.startTime) / 1000)}s
                          </span>
                      }
                      </div>
                    </div>
                  )}
                  
                  {workflowExecutions.length === 0 &&
                  <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No active workflow executions</p>
                      <p className="text-sm">Start a workflow to see execution status</p>
                    </div>
                  }
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-3">
                {workflowTemplates.map((template) =>
                <div key={template.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{template.metadata.category}</Badge>
                        <Badge variant="secondary">{template.metadata.complexity}</Badge>
                        <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setShowExecuteWorkflow(true);
                        }}>

                          <Play className="w-4 h-4 mr-2" />
                          Execute
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span>{template.tasks.length} tasks</span>
                        <span>~{Math.round(template.metadata.estimatedDuration / 60000)} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {template.metadata.tags.map((tag) =>
                      <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                      )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{workflowExecutions.length}</div>
                  <div className="text-sm text-gray-600">Total Executions</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {workflowExecutions.filter((e) => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {workflowExecutions.filter((e) => e.status === 'running').length}
                  </div>
                  <div className="text-sm text-gray-600">Running</div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Success Rate</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Success Rate</span>
                    <span>
                      {workflowExecutions.length > 0 ?
                      Math.round(workflowExecutions.filter((e) => e.status === 'completed').length / workflowExecutions.length * 100) :
                      0
                      }%
                    </span>
                  </div>
                  <Progress
                    value={workflowExecutions.length > 0 ?
                    workflowExecutions.filter((e) => e.status === 'completed').length / workflowExecutions.length * 100 :
                    0
                    }
                    className="h-2" />

                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default TaskWorkflowManager;