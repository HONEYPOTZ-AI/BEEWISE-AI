
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Table IDs
const TASKS_TABLE_ID = 37243;
const TASK_ASSIGNMENTS_TABLE_ID = 37244;
const TASK_EXECUTIONS_TABLE_ID = 37245;
const TASK_DEPENDENCIES_TABLE_ID = 37246;
const TASK_TEMPLATES_TABLE_ID = 37328;
const BUSINESSES_TABLE_ID = 37247;
const BUSINESS_STAGES_TABLE_ID = 37248;
const AGENTS_TABLE_ID = 37238;
const LIFECYCLE_TRANSITIONS_TABLE_ID = 37249;

export interface Task {
  id: number;
  title: string;
  description: string;
  task_type: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  complexity_score: number;
  estimated_duration: number;
  actual_duration: number;
  business_id: number;
  created_by: string;
  input_data: string;
  output_data: string;
  metadata: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  // Extended properties for UI
  businessName?: string;
  currentStageName?: string;
  assignedAgents?: TaskAssignment[];
  dependencies?: TaskDependency[];
  executions?: TaskExecution[];
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  agent_id: number;
  assignment_type: 'primary' | 'secondary' | 'reviewer';
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  progress_percentage: number;
  estimated_cost: number;
  actual_cost: number;
  assigned_at: string;
  started_at: string;
  completed_at: string;
  notes: string;
  agentName?: string;
  agentDisplayName?: string;
}

export interface TaskExecution {
  id: number;
  task_assignment_id: number;
  execution_step: number;
  step_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input_data: string;
  output_data: string;
  error_message: string;
  resource_usage: string;
  started_at: string;
  completed_at: string;
  duration_ms: number;
}

export interface TaskDependency {
  id: number;
  parent_task_id: number;
  dependent_task_id: number;
  dependency_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  is_hard_dependency: boolean;
  created_at: string;
  parentTaskTitle?: string;
  dependentTaskTitle?: string;
}

export interface TaskTemplate {
  id: number;
  name: string;
  description: string;
  business_stage_id: number;
  task_type: string;
  priority: string;
  complexity_score: number;
  estimated_duration: number;
  template_data: string;
  required_agent_types: string;
  success_criteria: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stageName?: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  industry: string;
  business_type: string;
  current_stage_id: number;
  owner_user_id: string;
  website_url: string;
  contact_email: string;
  phone_number: string;
  address: string;
  revenue_target: number;
  current_revenue: number;
  employee_count: number;
  metadata: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  currentStageName?: string;
  taskCount?: number;
  completedTaskCount?: number;
  progressPercentage?: number;
}

export interface BusinessStage {
  id: number;
  name: string;
  description: string;
  stage_order: number;
  typical_duration_days: number;
  key_objectives: string;
  success_criteria: string;
  recommended_agents: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  agent_type_id: number;
  name: string;
  display_name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  memory_capacity: number;
  cost_per_request: number;
  cost_per_minute: number;
  max_concurrent_tasks: number;
  priority_level: number;
  metadata: string;
  configuration: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_active_at: string;
  currentTaskCount?: number;
  isAvailable?: boolean;
}

export const useEnhancedTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [taskDependencies, setTaskDependencies] = useState<TaskDependency[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessStages, setBusinessStages] = useState<BusinessStage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all related data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [
      tasksResult,
      assignmentsResult,
      dependenciesResult,
      templatesResult,
      businessesResult,
      stagesResult,
      agentsResult] =
      await Promise.all([
      window.ezsite.apis.tablePage(TASKS_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "created_at", IsAsc: false }),
      window.ezsite.apis.tablePage(TASK_ASSIGNMENTS_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "assigned_at", IsAsc: false }),
      window.ezsite.apis.tablePage(TASK_DEPENDENCIES_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "created_at", IsAsc: false }),
      window.ezsite.apis.tablePage(TASK_TEMPLATES_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "name", IsAsc: true }),
      window.ezsite.apis.tablePage(BUSINESSES_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "name", IsAsc: true }),
      window.ezsite.apis.tablePage(BUSINESS_STAGES_TABLE_ID, { PageNo: 1, PageSize: 100, OrderByField: "stage_order", IsAsc: true }),
      window.ezsite.apis.tablePage(AGENTS_TABLE_ID, { PageNo: 1, PageSize: 1000, OrderByField: "name", IsAsc: true })]
      );

      if (tasksResult.error) throw new Error(tasksResult.error);
      if (assignmentsResult.error) throw new Error(assignmentsResult.error);
      if (dependenciesResult.error) throw new Error(dependenciesResult.error);
      if (templatesResult.error) throw new Error(templatesResult.error);
      if (businessesResult.error) throw new Error(businessesResult.error);
      if (stagesResult.error) throw new Error(stagesResult.error);
      if (agentsResult.error) throw new Error(agentsResult.error);

      const fetchedTasks = tasksResult.data?.List || [];
      const fetchedAssignments = assignmentsResult.data?.List || [];
      const fetchedDependencies = dependenciesResult.data?.List || [];
      const fetchedTemplates = templatesResult.data?.List || [];
      const fetchedBusinesses = businessesResult.data?.List || [];
      const fetchedStages = stagesResult.data?.List || [];
      const fetchedAgents = agentsResult.data?.List || [];

      // Enhance data with relationships
      const enhancedTasks = fetchedTasks.map((task: any) => {
        const business = fetchedBusinesses.find((b: any) => b.id === task.business_id);
        const stage = business ? fetchedStages.find((s: any) => s.id === business.current_stage_id) : null;
        const assignments = fetchedAssignments.filter((a: any) => a.task_id === task.id);
        const dependencies = fetchedDependencies.filter((d: any) =>
        d.parent_task_id === task.id || d.dependent_task_id === task.id
        );

        return {
          ...task,
          businessName: business?.name || 'Unknown Business',
          currentStageName: stage?.name || 'Unknown Stage',
          assignedAgents: assignments.map((assignment: any) => {
            const agent = fetchedAgents.find((a: any) => a.id === assignment.agent_id);
            return {
              ...assignment,
              agentName: agent?.name || 'Unknown Agent',
              agentDisplayName: agent?.display_name || agent?.name || 'Unknown Agent'
            };
          }),
          dependencies: dependencies.map((dep: any) => {
            const parentTask = fetchedTasks.find((t: any) => t.id === dep.parent_task_id);
            const dependentTask = fetchedTasks.find((t: any) => t.id === dep.dependent_task_id);
            return {
              ...dep,
              parentTaskTitle: parentTask?.title || 'Unknown Task',
              dependentTaskTitle: dependentTask?.title || 'Unknown Task'
            };
          })
        };
      });

      const enhancedBusinesses = fetchedBusinesses.map((business: any) => {
        const stage = fetchedStages.find((s: any) => s.id === business.current_stage_id);
        const businessTasks = fetchedTasks.filter((t: any) => t.business_id === business.id);
        const completedTasks = businessTasks.filter((t: any) => t.status === 'completed');

        return {
          ...business,
          currentStageName: stage?.name || 'Unknown Stage',
          taskCount: businessTasks.length,
          completedTaskCount: completedTasks.length,
          progressPercentage: businessTasks.length > 0 ? Math.round(completedTasks.length / businessTasks.length * 100) : 0
        };
      });

      const enhancedTemplates = fetchedTemplates.map((template: any) => {
        const stage = fetchedStages.find((s: any) => s.id === template.business_stage_id);
        return {
          ...template,
          stageName: stage?.name || 'Unknown Stage'
        };
      });

      const enhancedAgents = fetchedAgents.map((agent: any) => {
        const currentTasks = fetchedAssignments.filter((a: any) =>
        a.agent_id === agent.id && ['assigned', 'accepted', 'in_progress'].includes(a.status)
        );
        return {
          ...agent,
          currentTaskCount: currentTasks.length,
          isAvailable: currentTasks.length < agent.max_concurrent_tasks
        };
      });

      setTasks(enhancedTasks);
      setTaskAssignments(fetchedAssignments);
      setTaskDependencies(fetchedDependencies);
      setTaskTemplates(enhancedTemplates);
      setBusinesses(enhancedBusinesses);
      setBusinessStages(fetchedStages);
      setAgents(enhancedAgents);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create task from template
  const createTaskFromTemplate = async (templateId: number, businessId: number, customData?: Partial<Task>) => {
    try {
      const template = taskTemplates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const templateData = JSON.parse(template.template_data || '{}');
      const taskData = {
        title: customData?.title || template.name,
        description: customData?.description || template.description,
        task_type: template.task_type,
        priority: template.priority,
        complexity_score: template.complexity_score,
        estimated_duration: template.estimated_duration,
        business_id: businessId,
        created_by: 'current_user', // This should be the actual user ID
        input_data: JSON.stringify({ ...templateData, ...customData }),
        metadata: JSON.stringify({
          template_id: templateId,
          template_name: template.name,
          success_criteria: JSON.parse(template.success_criteria || '[]')
        }),
        status: 'pending',
        due_date: customData?.due_date || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...customData
      };

      const { error } = await window.ezsite.apis.tableCreate(TASKS_TABLE_ID, taskData);
      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Task created from template successfully"
      });

      await fetchAllData(); // Refresh data
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task from template';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Create task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = {
        title: taskData.title || '',
        description: taskData.description || '',
        task_type: taskData.task_type || 'general',
        priority: taskData.priority || 'medium',
        complexity_score: taskData.complexity_score || 5,
        estimated_duration: taskData.estimated_duration || 60,
        business_id: taskData.business_id || 0,
        created_by: 'current_user',
        input_data: taskData.input_data || '{}',
        output_data: '{}',
        metadata: taskData.metadata || '{}',
        status: 'pending',
        due_date: taskData.due_date || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...taskData
      };

      const { error } = await window.ezsite.apis.tableCreate(TASKS_TABLE_ID, newTask);
      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Task created successfully"
      });

      await fetchAllData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Assign task to agent
  const assignTaskToAgent = async (taskId: number, agentId: number, assignmentType: 'primary' | 'secondary' | 'reviewer' = 'primary') => {
    try {
      const assignmentData = {
        task_id: taskId,
        agent_id: agentId,
        assignment_type: assignmentType,
        status: 'assigned',
        progress_percentage: 0,
        estimated_cost: 0,
        actual_cost: 0,
        assigned_at: new Date().toISOString(),
        notes: ''
      };

      const { error } = await window.ezsite.apis.tableCreate(TASK_ASSIGNMENTS_TABLE_ID, assignmentData);
      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Task assigned to agent successfully"
      });

      await fetchAllData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign task';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: number, status: Task['status'], completionData?: any) => {
    try {
      const updateData: any = {
        ID: taskId,
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        if (completionData) {
          updateData.output_data = JSON.stringify(completionData);
        }
      }

      const { error } = await window.ezsite.apis.tableUpdate(TASKS_TABLE_ID, updateData);
      if (error) throw new Error(error);

      // Check if task completion should trigger stage progression
      if (status === 'completed') {
        await checkStageProgression(taskId);
      }

      toast({
        title: "Success",
        description: "Task status updated successfully"
      });

      await fetchAllData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Check stage progression based on task completion
  const checkStageProgression = async (completedTaskId: number) => {
    try {
      const completedTask = tasks.find((t) => t.id === completedTaskId);
      if (!completedTask) return;

      const business = businesses.find((b) => b.id === completedTask.business_id);
      if (!business) return;

      const businessTasks = tasks.filter((t) => t.business_id === business.id);
      const completedTasks = businessTasks.filter((t) => t.status === 'completed');
      const stageTasks = businessTasks.filter((t) => {
        try {
          const metadata = JSON.parse(t.metadata || '{}');
          return metadata.stage_id === business.current_stage_id;
        } catch {
          return false;
        }
      });

      const completedStageTasks = stageTasks.filter((t) => t.status === 'completed');
      const stageCompletionRate = stageTasks.length > 0 ? completedStageTasks.length / stageTasks.length : 0;

      // If stage is 80% complete, suggest stage progression
      if (stageCompletionRate >= 0.8) {
        const currentStage = businessStages.find((s) => s.id === business.current_stage_id);
        const nextStage = businessStages.find((s) => s.stage_order === (currentStage?.stage_order || 0) + 1);

        if (nextStage) {
          toast({
            title: "Stage Progression Available",
            description: `Business "${business.name}" is ready to progress from "${currentStage?.name}" to "${nextStage.name}"`
          });
        }
      }
    } catch (err) {
      console.error('Error checking stage progression:', err);
    }
  };

  // Create task dependency
  const createTaskDependency = async (parentTaskId: number, dependentTaskId: number, dependencyType: TaskDependency['dependency_type'] = 'finish_to_start', isHardDependency: boolean = true) => {
    try {
      const dependencyData = {
        parent_task_id: parentTaskId,
        dependent_task_id: dependentTaskId,
        dependency_type: dependencyType,
        is_hard_dependency: isHardDependency,
        created_at: new Date().toISOString()
      };

      const { error } = await window.ezsite.apis.tableCreate(TASK_DEPENDENCIES_TABLE_ID, dependencyData);
      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Task dependency created successfully"
      });

      await fetchAllData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task dependency';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Get tasks by business
  const getTasksByBusiness = (businessId: number) => {
    return tasks.filter((task) => task.business_id === businessId);
  };

  // Get tasks by business and stage
  const getTasksByBusinessAndStage = (businessId: number, stageId: number) => {
    return tasks.filter((task) => {
      if (task.business_id !== businessId) return false;
      try {
        const metadata = JSON.parse(task.metadata || '{}');
        return metadata.stage_id === stageId;
      } catch {
        return false;
      }
    });
  };

  // Get available agents for task type
  const getAvailableAgentsForTaskType = (taskType: string) => {
    return agents.filter((agent) => {
      if (agent.status !== 'active') return false;
      if (!agent.isAvailable) return false;

      try {
        const config = JSON.parse(agent.configuration || '{}');
        const supportedTypes = config.supported_task_types || [];
        return supportedTypes.length === 0 || supportedTypes.includes(taskType);
      } catch {
        return true; // If no configuration, assume agent can handle any task type
      }
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    // Data
    tasks,
    taskAssignments,
    taskDependencies,
    taskTemplates,
    businesses,
    businessStages,
    agents,
    loading,
    error,

    // Actions
    fetchAllData,
    createTask,
    createTaskFromTemplate,
    assignTaskToAgent,
    updateTaskStatus,
    createTaskDependency,

    // Getters
    getTasksByBusiness,
    getTasksByBusinessAndStage,
    getAvailableAgentsForTaskType,

    // Computed values
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
    pendingTasks: tasks.filter((t) => t.status === 'pending').length,
    inProgressTasks: tasks.filter((t) => ['assigned', 'in_progress'].includes(t.status)).length
  };
};