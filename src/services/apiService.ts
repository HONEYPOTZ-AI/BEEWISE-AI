
import { 
  Agent, 
  AgentType, 
  AgentCapability,
  AgentTool,
  Task, 
  Business, 
  BusinessStage,
  AgentPerformance,
  KnowledgeGraph,
  SubscriptionPlan,
  TABLE_IDS,
  ApiResponse,
  PaginatedResponse,
  QueryParams 
} from '@/types/database';

declare global {
  interface Window {
    ezsite: {
      apis: {
        tablePage: (tableId: number, params?: QueryParams) => Promise<ApiResponse<PaginatedResponse<any>>>;
        tableCreate: (tableId: number, data: any) => Promise<ApiResponse<void>>;
        tableUpdate: (tableId: number, data: any) => Promise<ApiResponse<void>>;
        tableDelete: (tableId: number, params: { ID: number }) => Promise<ApiResponse<void>>;
        upload: (fileInfo: { filename: string; file: File }) => Promise<ApiResponse<number>>;
        getUploadUrl: (storeFileId: number) => Promise<ApiResponse<string>>;
      };
    };
  }
}

class ApiService {
  // Generic CRUD operations
  async getItems<T>(tableId: number, params?: QueryParams): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const response = await window.ezsite.apis.tablePage(tableId, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: 'id',
        IsAsc: false,
        ...params,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching items from table ${tableId}:`, error);
      return { error: error as string };
    }
  }

  async createItem<T>(tableId: number, data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<void>> {
    try {
      const now = new Date().toISOString();
      const itemData = {
        ...data,
        created_at: now,
        updated_at: now,
      };
      const response = await window.ezsite.apis.tableCreate(tableId, itemData);
      return response;
    } catch (error) {
      console.error(`Error creating item in table ${tableId}:`, error);
      return { error: error as string };
    }
  }

  async updateItem<T>(tableId: number, data: T): Promise<ApiResponse<void>> {
    try {
      const itemData = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      const response = await window.ezsite.apis.tableUpdate(tableId, itemData);
      return response;
    } catch (error) {
      console.error(`Error updating item in table ${tableId}:`, error);
      return { error: error as string };
    }
  }

  async deleteItem(tableId: number, id: number): Promise<ApiResponse<void>> {
    try {
      const response = await window.ezsite.apis.tableDelete(tableId, { ID: id });
      return response;
    } catch (error) {
      console.error(`Error deleting item from table ${tableId}:`, error);
      return { error: error as string };
    }
  }

  // Agent Types
  getAgentTypes = (params?: QueryParams) => this.getItems<AgentType>(TABLE_IDS.AGENT_TYPES, params);
  createAgentType = (data: Omit<AgentType, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<AgentType>(TABLE_IDS.AGENT_TYPES, data);
  updateAgentType = (data: AgentType) => this.updateItem<AgentType>(TABLE_IDS.AGENT_TYPES, data);
  deleteAgentType = (id: number) => this.deleteItem(TABLE_IDS.AGENT_TYPES, id);

  // Agents
  getAgents = (params?: QueryParams) => this.getItems<Agent>(TABLE_IDS.AGENTS, params);
  createAgent = (data: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<Agent>(TABLE_IDS.AGENTS, data);
  updateAgent = (data: Agent) => this.updateItem<Agent>(TABLE_IDS.AGENTS, data);
  deleteAgent = (id: number) => this.deleteItem(TABLE_IDS.AGENTS, id);

  // Agent Capabilities
  getAgentCapabilities = (params?: QueryParams) => this.getItems<AgentCapability>(TABLE_IDS.AGENT_CAPABILITIES, params);
  createAgentCapability = (data: Omit<AgentCapability, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<AgentCapability>(TABLE_IDS.AGENT_CAPABILITIES, data);
  updateAgentCapability = (data: AgentCapability) => this.updateItem<AgentCapability>(TABLE_IDS.AGENT_CAPABILITIES, data);
  deleteAgentCapability = (id: number) => this.deleteItem(TABLE_IDS.AGENT_CAPABILITIES, id);

  // Agent Tools
  getAgentTools = (params?: QueryParams) => this.getItems<AgentTool>(TABLE_IDS.AGENT_TOOLS, params);
  createAgentTool = (data: Omit<AgentTool, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<AgentTool>(TABLE_IDS.AGENT_TOOLS, data);
  updateAgentTool = (data: AgentTool) => this.updateItem<AgentTool>(TABLE_IDS.AGENT_TOOLS, data);
  deleteAgentTool = (id: number) => this.deleteItem(TABLE_IDS.AGENT_TOOLS, id);

  // Tasks
  getTasks = (params?: QueryParams) => this.getItems<Task>(TABLE_IDS.TASKS, params);
  createTask = (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<Task>(TABLE_IDS.TASKS, data);
  updateTask = (data: Task) => this.updateItem<Task>(TABLE_IDS.TASKS, data);
  deleteTask = (id: number) => this.deleteItem(TABLE_IDS.TASKS, id);

  // Businesses
  getBusinesses = (params?: QueryParams) => this.getItems<Business>(TABLE_IDS.BUSINESSES, params);
  createBusiness = (data: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<Business>(TABLE_IDS.BUSINESSES, data);
  updateBusiness = (data: Business) => this.updateItem<Business>(TABLE_IDS.BUSINESSES, data);
  deleteBusiness = (id: number) => this.deleteItem(TABLE_IDS.BUSINESSES, id);

  // Business Stages
  getBusinessStages = (params?: QueryParams) => this.getItems<BusinessStage>(TABLE_IDS.BUSINESS_STAGES, params);
  createBusinessStage = (data: Omit<BusinessStage, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<BusinessStage>(TABLE_IDS.BUSINESS_STAGES, data);
  updateBusinessStage = (data: BusinessStage) => this.updateItem<BusinessStage>(TABLE_IDS.BUSINESS_STAGES, data);
  deleteBusinessStage = (id: number) => this.deleteItem(TABLE_IDS.BUSINESS_STAGES, id);

  // Agent Performance
  getAgentPerformance = (params?: QueryParams) => this.getItems<AgentPerformance>(TABLE_IDS.AGENT_PERFORMANCE, params);
  createAgentPerformance = (data: Omit<AgentPerformance, 'id' | 'created_at'>) => 
    this.createItem<AgentPerformance>(TABLE_IDS.AGENT_PERFORMANCE, data);

  // Knowledge Graph
  getKnowledgeGraph = (params?: QueryParams) => this.getItems<KnowledgeGraph>(TABLE_IDS.KNOWLEDGE_GRAPH, params);
  createKnowledgeGraph = (data: Omit<KnowledgeGraph, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<KnowledgeGraph>(TABLE_IDS.KNOWLEDGE_GRAPH, data);
  updateKnowledgeGraph = (data: KnowledgeGraph) => this.updateItem<KnowledgeGraph>(TABLE_IDS.KNOWLEDGE_GRAPH, data);
  deleteKnowledgeGraph = (id: number) => this.deleteItem(TABLE_IDS.KNOWLEDGE_GRAPH, id);

  // Subscription Plans
  getSubscriptionPlans = (params?: QueryParams) => this.getItems<SubscriptionPlan>(TABLE_IDS.SUBSCRIPTION_PLANS, params);
  createSubscriptionPlan = (data: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem<SubscriptionPlan>(TABLE_IDS.SUBSCRIPTION_PLANS, data);
  updateSubscriptionPlan = (data: SubscriptionPlan) => this.updateItem<SubscriptionPlan>(TABLE_IDS.SUBSCRIPTION_PLANS, data);
  deleteSubscriptionPlan = (id: number) => this.deleteItem(TABLE_IDS.SUBSCRIPTION_PLANS, id);

  // File upload utilities
  async uploadFile(file: File, filename?: string): Promise<ApiResponse<string>> {
    try {
      const uploadResponse = await window.ezsite.apis.upload({
        filename: filename || file.name,
        file: file,
      });

      if (uploadResponse.error) {
        return { error: uploadResponse.error };
      }

      if (uploadResponse.data) {
        const urlResponse = await window.ezsite.apis.getUploadUrl(uploadResponse.data);
        return urlResponse;
      }

      return { error: 'Upload failed' };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { error: error as string };
    }
  }
}

export const apiService = new ApiService();
