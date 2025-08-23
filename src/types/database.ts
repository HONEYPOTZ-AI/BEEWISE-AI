
export interface AgentType {
  id: number;
  name: string;
  description: string;
  category: string;
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
  status: string;
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
}

export interface AgentCapability {
  id: number;
  name: string;
  description: string;
  category: string;
  complexity_level: number;
  resource_cost: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentTool {
  id: number;
  name: string;
  description: string;
  tool_type: string;
  endpoint_url: string;
  authentication_type: string;
  cost_per_use: number;
  rate_limit: number;
  is_active: boolean;
  configuration: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  status: string;
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

export interface AgentPerformance {
  id: number;
  agent_id: number;
  metric_type: string;
  metric_value: number;
  metric_unit: string;
  measurement_period: string;
  period_start: string;
  period_end: string;
  total_tasks: number;
  successful_tasks: number;
  failed_tasks: number;
  average_response_time: number;
  total_cost: number;
  total_revenue: number;
  user_satisfaction_score: number;
  created_at: string;
}

export interface KnowledgeGraph {
  id: number;
  entity_id: string;
  entity_type: string;
  entity_name: string;
  entity_description: string;
  properties: string;
  confidence_score: number;
  source_type: string;
  source_reference: string;
  business_id: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: number;
  plan_name: string;
  plan_code: string;
  description: string;
  plan_type: string;
  billing_frequency: string;
  price_cents: number;
  setup_fee_cents: number;
  max_agents: number;
  max_tasks_per_month: number;
  max_businesses: number;
  api_calls_included: number;
  storage_gb_included: number;
  features: string;
  limitations: string;
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  created_at: string;
  updated_at: string;
}

// Table IDs for API calls
export const TABLE_IDS = {
  AGENT_TYPES: 37237,
  AGENTS: 37238,
  AGENT_CAPABILITIES: 37239,
  AGENT_TOOLS: 37240,
  TASKS: 37243,
  BUSINESSES: 37247,
  BUSINESS_STAGES: 37248,
  AGENT_PERFORMANCE: 37254,
  KNOWLEDGE_GRAPH: 37252,
  SUBSCRIPTION_PLANS: 37257,
} as const;

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  List: T[];
  VirtualCount: number;
}

export interface QueryParams {
  PageNo?: number;
  PageSize?: number;
  OrderByField?: string;
  IsAsc?: boolean;
  Filters?: Array<{
    name: string;
    op: string;
    value: any;
  }>;
}
