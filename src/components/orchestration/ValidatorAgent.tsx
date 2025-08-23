import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileCheck,
  Scale,
  Eye,
  TrendingUp,
  AlertCircle } from
'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Task, Agent } from '@/utils/orchestrationEngine';
import { useToast } from '@/hooks/use-toast';

export interface ValidatorAgentProps {
  className?: string;
  agentId?: string;
}

interface ValidationRule {
  id: string;
  name: string;
  type: 'quality' | 'compliance' | 'security' | 'performance';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
}

interface ValidationResult {
  taskId: string;
  ruleId: string;
  ruleName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: number;
  details?: Record<string, any>;
}

const ValidatorAgent: React.FC<ValidatorAgentProps> = ({ className, agentId = 'validator-main' }) => {
  const {
    tasks,
    agents,
    registerAgent,
    updateTaskStatus
  } = useAgentOrchestration();

  const { toast } = useToast();
  const [validatorStatus, setValidatorStatus] = useState<'initializing' | 'active' | 'validating' | 'monitoring'>('initializing');
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationMetrics, setValidationMetrics] = useState({
    totalValidations: 0,
    passedValidations: 0,
    failedValidations: 0,
    warningValidations: 0,
    averageValidationTime: 0
  });

  // Default validation rules
  const [validationRules] = useState<ValidationRule[]>([
  {
    id: 'quality-001',
    name: 'Output Quality Check',
    type: 'quality',
    description: 'Validates task output meets quality standards',
    priority: 'high',
    active: true
  },
  {
    id: 'compliance-001',
    name: 'Regulatory Compliance',
    type: 'compliance',
    description: 'Ensures output complies with regulations',
    priority: 'critical',
    active: true
  },
  {
    id: 'security-001',
    name: 'Security Validation',
    type: 'security',
    description: 'Checks for security vulnerabilities',
    priority: 'critical',
    active: true
  },
  {
    id: 'performance-001',
    name: 'Performance Threshold',
    type: 'performance',
    description: 'Validates task execution performance',
    priority: 'medium',
    active: true
  },
  {
    id: 'quality-002',
    name: 'Data Integrity Check',
    type: 'quality',
    description: 'Verifies data consistency and accuracy',
    priority: 'high',
    active: true
  },
  {
    id: 'compliance-002',
    name: 'Privacy Compliance',
    type: 'compliance',
    description: 'Ensures privacy requirements are met',
    priority: 'critical',
    active: true
  }]
  );

  // Initialize validator agent
  useEffect(() => {
    const initializeValidator = async () => {
      try {
        await registerAgent({
          id: agentId,
          type: 'validator',
          name: 'Quality Validator',
          status: 'active',
          capabilities: ['quality-control', 'compliance-checking', 'security-validation', 'performance-monitoring'],
          currentTasks: [],
          metadata: {
            role: 'quality-validator',
            priority: 'critical',
            features: ['multi-rule-validation', 'real-time-monitoring', 'compliance-reporting']
          }
        });
        setValidatorStatus('active');
      } catch (error) {
        console.error('Failed to initialize validator:', error);
      }
    };

    initializeValidator();
  }, [agentId, registerAgent]);

  // Monitor completed tasks for validation
  useEffect(() => {
    const completedTasks = tasks.filter((t) => t.status === 'completed' && t.result);

    completedTasks.forEach((task) => {
      // Check if task has been validated
      const existingValidation = validationResults.find((v) => v.taskId === task.id);
      if (!existingValidation) {
        validateTask(task);
      }
    });
  }, [tasks, validationResults]);

  // Update metrics
  useEffect(() => {
    const passed = validationResults.filter((r) => r.status === 'pass').length;
    const failed = validationResults.filter((r) => r.status === 'fail').length;
    const warnings = validationResults.filter((r) => r.status === 'warning').length;

    setValidationMetrics({
      totalValidations: validationResults.length,
      passedValidations: passed,
      failedValidations: failed,
      warningValidations: warnings,
      averageValidationTime: 250 // Simulated average validation time in ms
    });
  }, [validationResults]);

  // Validate a task against all active rules
  const validateTask = async (task: Task) => {
    setValidatorStatus('validating');

    const activeRules = validationRules.filter((rule) => rule.active);
    const taskValidationResults: ValidationResult[] = [];

    for (const rule of activeRules) {
      const result = await performValidation(task, rule);
      taskValidationResults.push(result);
    }

    setValidationResults((prev) => [...prev, ...taskValidationResults]);

    // Check if any critical validations failed
    const criticalFailures = taskValidationResults.filter(
      (r) => r.status === 'fail' && validationRules.find((rule) => rule.id === r.ruleId)?.priority === 'critical'
    );

    if (criticalFailures.length > 0) {
      // Mark task as failed due to validation
      updateTaskStatus(task.id, 'failed', undefined, 'Failed critical validation checks');

      toast({
        title: 'Critical Validation Failure',
        description: `Task ${task.id} failed critical validation checks`,
        variant: 'destructive'
      });
    } else {
      const warnings = taskValidationResults.filter((r) => r.status === 'warning');
      if (warnings.length > 0) {
        toast({
          title: 'Validation Warnings',
          description: `Task ${task.id} has ${warnings.length} validation warnings`
        });
      }
    }

    setValidatorStatus('monitoring');
  };

  // Perform individual validation
  const performValidation = async (task: Task, rule: ValidationRule): Promise<ValidationResult> => {
    // Simulate validation logic based on rule type
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 300));

    let status: 'pass' | 'fail' | 'warning' = 'pass';
    let message = 'Validation passed';
    const details: Record<string, any> = {};

    switch (rule.type) {
      case 'quality':
        // Simulate quality validation
        const qualityScore = Math.random();
        if (qualityScore < 0.1) {
          status = 'fail';
          message = 'Output quality below acceptable threshold';
          details.qualityScore = qualityScore;
        } else if (qualityScore < 0.3) {
          status = 'warning';
          message = 'Output quality could be improved';
          details.qualityScore = qualityScore;
        } else {
          details.qualityScore = qualityScore;
        }
        break;

      case 'compliance':
        // Simulate compliance validation  
        const complianceCheck = Math.random();
        if (complianceCheck < 0.05) {
          status = 'fail';
          message = 'Compliance requirements not met';
          details.complianceIssues = ['Missing required metadata', 'Unauthorized data access'];
        } else if (complianceCheck < 0.15) {
          status = 'warning';
          message = 'Minor compliance concerns detected';
          details.complianceIssues = ['Incomplete audit trail'];
        }
        break;

      case 'security':
        // Simulate security validation
        const securityCheck = Math.random();
        if (securityCheck < 0.03) {
          status = 'fail';
          message = 'Security vulnerabilities detected';
          details.securityIssues = ['Potential data exposure', 'Insufficient encryption'];
        } else if (securityCheck < 0.1) {
          status = 'warning';
          message = 'Minor security recommendations';
          details.securityIssues = ['Weak password policy'];
        }
        break;

      case 'performance':
        // Simulate performance validation
        const executionTime = task.actualDuration || 0;
        const threshold = task.estimatedDuration ? task.estimatedDuration * 1.5 : 30000;

        if (executionTime > threshold * 2) {
          status = 'fail';
          message = 'Performance significantly below expectations';
          details.executionTime = executionTime;
          details.threshold = threshold;
        } else if (executionTime > threshold) {
          status = 'warning';
          message = 'Performance slightly below expectations';
          details.executionTime = executionTime;
          details.threshold = threshold;
        } else {
          details.executionTime = executionTime;
        }
        break;
    }

    return {
      taskId: task.id,
      ruleId: rule.id,
      ruleName: rule.name,
      status,
      message,
      timestamp: Date.now(),
      details
    };
  };

  // Get validation status color
  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case 'pass':return 'text-green-600';
      case 'fail':return 'text-red-600';
      case 'warning':return 'text-yellow-600';
      default:return 'text-gray-600';
    }
  };

  const getValidationStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':return <CheckCircle2 className="w-4 h-4" />;
      case 'fail':return <XCircle className="w-4 h-4" />;
      case 'warning':return <AlertTriangle className="w-4 h-4" />;
      default:return <Clock className="w-4 h-4" />;
    }
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'quality':return <FileCheck className="w-4 h-4" />;
      case 'compliance':return <Scale className="w-4 h-4" />;
      case 'security':return <Shield className="w-4 h-4" />;
      case 'performance':return <TrendingUp className="w-4 h-4" />;
      default:return <Eye className="w-4 h-4" />;
    }
  };

  // Group validation results by task
  const validationsByTask = validationResults.reduce((acc, result) => {
    if (!acc[result.taskId]) {
      acc[result.taskId] = [];
    }
    acc[result.taskId].push(result);
    return acc;
  }, {} as Record<string, ValidationResult[]>);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-500" />
              <div>
                <CardTitle>Validator Agent</CardTitle>
                <CardDescription>
                  Quality control and compliance checking
                </CardDescription>
              </div>
            </div>
            <Badge variant={validatorStatus === 'active' ? 'default' : 'secondary'}>
              {validatorStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Validation Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-100">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{validationMetrics.totalValidations}</div>
              <div className="text-sm text-gray-600">Total Validations</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{validationMetrics.passedValidations}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{validationMetrics.warningValidations}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold">{validationMetrics.failedValidations}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="results" className="w-full">
            <TabsList>
              <TabsTrigger value="results">Validation Results</TabsTrigger>
              <TabsTrigger value="rules">Validation Rules</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="space-y-4">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {Object.entries(validationsByTask).map(([taskId, results]) => {
                    const task = tasks.find((t) => t.id === taskId);
                    const overallStatus = results.some((r) => r.status === 'fail') ? 'fail' :
                    results.some((r) => r.status === 'warning') ? 'warning' : 'pass';

                    return (
                      <div key={taskId} className="p-4 rounded-lg border bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Task: {task?.type || taskId}</h4>
                            <div className={`flex items-center space-x-1 ${getValidationStatusColor(overallStatus)}`}>
                              {getValidationStatusIcon(overallStatus)}
                              <span className="text-sm font-medium capitalize">{overallStatus}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {results.length} validations
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {results.map((result) => {
                            const rule = validationRules.find((r) => r.id === result.ruleId);
                            return (
                              <div key={`${result.taskId}-${result.ruleId}`}
                              className="flex items-center justify-between p-2 rounded bg-gray-50">
                                <div className="flex items-center space-x-2">
                                  {rule && getRuleTypeIcon(rule.type)}
                                  <span className="text-sm">{result.ruleName}</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${getValidationStatusColor(result.status)}`}>
                                  {getValidationStatusIcon(result.status)}
                                  <span className="text-xs">{result.message}</span>
                                </div>
                              </div>);

                          })}
                        </div>
                      </div>);

                  })}
                  
                  {Object.keys(validationsByTask).length === 0 &&
                  <div className="text-center py-8 text-gray-500">
                      No validation results yet
                    </div>
                  }
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-3">
                {validationRules.map((rule) =>
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${
                    rule.type === 'quality' ? 'bg-blue-100' :
                    rule.type === 'compliance' ? 'bg-purple-100' :
                    rule.type === 'security' ? 'bg-red-100' : 'bg-green-100'}`
                    }>
                        {getRuleTypeIcon(rule.type)}
                      </div>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-gray-600">{rule.description}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.priority === 'critical' ? 'destructive' : 'outline'}>
                        {rule.priority}
                      </Badge>
                      <Badge variant={rule.active ? 'default' : 'secondary'}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Validation Success Rate */}
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Success Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Passed</span>
                      <span>{validationMetrics.totalValidations > 0 ?
                        (validationMetrics.passedValidations / validationMetrics.totalValidations * 100).toFixed(1) : 0}%</span>
                    </div>
                    <Progress
                      value={validationMetrics.totalValidations > 0 ?
                      validationMetrics.passedValidations / validationMetrics.totalValidations * 100 : 0}
                      className="h-2" />

                  </div>
                </div>

                {/* Rule Type Distribution */}
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Rule Type Distribution</h4>
                  <div className="space-y-2">
                    {['quality', 'compliance', 'security', 'performance'].map((type) => {
                      const typeRules = validationRules.filter((r) => r.type === type);
                      const percentage = typeRules.length / validationRules.length * 100;

                      return (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{type}</span>
                          <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                        </div>);

                    })}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="flex items-center font-semibold text-green-900 mb-3">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Avg Validation Time:</span>
                    <span className="ml-2 font-medium">{validationMetrics.averageValidationTime}ms</span>
                  </div>
                  <div>
                    <span className="text-green-700">Active Rules:</span>
                    <span className="ml-2 font-medium">{validationRules.filter((r) => r.active).length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default ValidatorAgent;