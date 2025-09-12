import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Edit,
  Trash2,
  Activity } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BusinessStageVisualizer from '@/components/BusinessStageVisualizer';
import BusinessForm from '@/components/BusinessForm';
import StageTransitionControls from '@/components/StageTransitionControls';
import AgentAssignmentInterface from '@/components/AgentAssignmentInterface';
import TaskManager from '@/components/TaskManager';

interface Business {
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BusinessStage {
  id: number;
  name: string;
  description: string;
  stage_order: number;
  typical_duration_days: number;
  key_objectives: string[];
  success_criteria: string[];
  recommended_agents: string[];
  is_active: boolean;
}

interface Agent {
  id: number;
  name: string;
  display_name: string;
  description: string;
  status: string;
  memory_capacity: number;
  cost_per_request: number;
  cost_per_minute: number;
  max_concurrent_tasks: number;
  priority_level: number;
  configuration: string;
}

interface Task {
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
  due_date: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

interface LifecycleTransition {
  id: number;
  business_id: number;
  from_stage_id: number;
  to_stage_id: number;
  transition_reason: string;
  transition_type: string;
  success_score: number;
  objectives_met: number;
  total_objectives: number;
  notes: string;
  transitioned_at: string;
}

const BusinessDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stages, setStages] = useState<BusinessStage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transitions, setTransitions] = useState<LifecycleTransition[]>([]);

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
      loadBusinesses(),
      loadStages(),
      loadAgents(),
      loadTransitions()]
      );
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Data Loading Error",
        description: "Unable to load dashboard data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBusinesses = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37247, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "created_at",
        IsAsc: false,
        Filters: []
      });
      if (error) throw error;
      setBusinesses(data?.List || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  const loadStages = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37248, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "stage_order",
        IsAsc: true,
        Filters: []
      });
      if (error) throw error;
      setStages(data?.List || []);
    } catch (error) {
      console.error('Error loading stages:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "created_at",
        IsAsc: false,
        Filters: []
      });
      if (error) throw error;
      setAgents(data?.List || []);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const loadTransitions = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37249, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "transitioned_at",
        IsAsc: false,
        Filters: []
      });
      if (error) throw error;
      setTransitions(data?.List || []);
    } catch (error) {
      console.error('Error loading transitions:', error);
    }
  };

  const loadBusinessTasks = async (businessId: number) => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37243, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "created_at",
        IsAsc: false,
        Filters: [
        { name: "business_id", op: "Equal", value: businessId }]

      });
      if (error) throw error;
      setTasks(data?.List || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateBusiness = async (businessData: any) => {
    setActionLoading(true);
    try {
      const { error } = await window.ezsite.apis.tableCreate(37247, {
        ...businessData,
        current_stage_id: stages.length > 0 ? stages[0].id : 1,
        owner_user_id: "current_user", // This should be actual user ID
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Business Created",
        description: `${businessData.name} has been created successfully.`,
        variant: "default"
      });

      await loadBusinesses();
      setIsBusinessFormOpen(false);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Unable to create business. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateBusiness = async (businessData: any) => {
    if (!editingBusiness) return;

    setActionLoading(true);
    try {
      const { error } = await window.ezsite.apis.tableUpdate(37247, {
        ID: editingBusiness.id,
        ...businessData,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Business Updated",
        description: `${businessData.name} has been updated successfully.`,
        variant: "default"
      });

      await loadBusinesses();
      setEditingBusiness(null);
      setIsBusinessFormOpen(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to update business. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStageTransition = async (transitionData: any) => {
    if (!selectedBusiness) return;

    setActionLoading(true);
    try {
      // Create transition record
      const { error: transitionError } = await window.ezsite.apis.tableCreate(37249, {
        business_id: selectedBusiness.id,
        ...transitionData,
        transitioned_by: "current_user", // This should be actual user ID
        transitioned_at: new Date().toISOString()
      });

      if (transitionError) throw transitionError;

      // Update business current stage
      const { error: updateError } = await window.ezsite.apis.tableUpdate(37247, {
        ID: selectedBusiness.id,
        current_stage_id: transitionData.to_stage_id,
        updated_at: new Date().toISOString()
      });

      if (updateError) throw updateError;

      await Promise.all([loadBusinesses(), loadTransitions()]);

      // Update selected business
      const updatedBusiness = businesses.find((b) => b.id === selectedBusiness.id);
      if (updatedBusiness) {
        setSelectedBusiness({ ...updatedBusiness, current_stage_id: transitionData.to_stage_id });
      }

    } catch (error) {
      throw error; // Let the component handle the error
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignAgent = async (stageId: number, agentId: number) => {
    // In a real implementation, you would have an agent_assignments table
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUnassignAgent = async (stageId: number, agentId: number) => {
    // In a real implementation, you would remove from agent_assignments table
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
    statusFilter === 'active' && business.is_active ||
    statusFilter === 'inactive' && !business.is_active;
    return matchesSearch && matchesStatus;
  });

  const getBusinessProgress = (business: Business): number => {
    // Calculate progress based on current stage and tasks completion
    const stageIndex = stages.findIndex((s) => s.id === business.current_stage_id);
    const baseProgress = stageIndex >= 0 ? stageIndex / Math.max(stages.length - 1, 1) * 100 : 0;

    // Add task completion bonus
    const businessTasks = tasks.filter((t) => t.business_id === business.id);
    const completedTasks = businessTasks.filter((t) => t.status === 'completed').length;
    const taskBonus = businessTasks.length > 0 ? completedTasks / businessTasks.length * 20 : 0;

    return Math.min(baseProgress + taskBonus, 100);
  };

  const getCurrentStageObjectives = (business: Business) => {
    const currentStage = stages.find((s) => s.id === business.current_stage_id);
    if (!currentStage) return [];

    const objectives = Array.isArray(currentStage.key_objectives) ?
    currentStage.key_objectives :
    JSON.parse(currentStage.key_objectives || '[]');

    return objectives.map((obj: string, index: number) => ({
      id: `${business.id}-${index}`,
      name: obj,
      completed: Math.random() > 0.5, // Mock completion status
      progress: Math.floor(Math.random() * 100)
    }));
  };

  const getStageAssignments = () => {
    return stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      assignedAgents: agents.slice(0, Math.floor(Math.random() * 3)), // Mock assignments
      recommendedAgentTypes: Array.isArray(stage.recommended_agents) ?
      stage.recommended_agents :
      JSON.parse(stage.recommended_agents || '[]')
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>);

  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg beewise-gradient">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            BeeWise-AI Business Lifecycle Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage business lifecycles with intelligent agent assignments and workflow automation
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="business-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold text-primary">{businesses.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="business-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Stages</p>
                <p className="text-2xl font-bold text-primary">{stages.filter((s) => s.is_active).length}</p>
              </div>
              <Target className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="business-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Agents</p>
                <p className="text-2xl font-bold text-primary">{agents.filter((a) => a.status === 'active').length}</p>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="business-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transitions Today</p>
                <p className="text-2xl font-bold text-primary">
                  {transitions.filter((t) =>
                  new Date(t.transitioned_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business List */}
        <Card className="business-card lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Businesses
              </CardTitle>
              <Button
                onClick={() => setIsBusinessFormOpen(true)}
                size="sm"
                className="beewise-gradient">

                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Filters */}
            <div className="p-4 space-y-3 border-b">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" />

              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business List */}
            <ScrollArea className="h-96">
              <div className="p-4 space-y-3">
                {filteredBusinesses.map((business) => {
                  const progress = getBusinessProgress(business);
                  const currentStage = stages.find((s) => s.id === business.current_stage_id);

                  return (
                    <div
                      key={business.id}
                      className={`
                        p-4 rounded-lg border cursor-pointer workflow-transition
                        ${selectedBusiness?.id === business.id ? 'border-primary bg-primary/5 beewise-glow' : 'hover:border-primary/50'}
                      `}
                      onClick={() => {
                        setSelectedBusiness(business);
                        loadBusinessTasks(business.id);
                      }}>

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{business.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {business.industry} • {business.business_type}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBusiness(business);
                              setIsBusinessFormOpen(true);
                            }}>

                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Stage:</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentStage?.name || 'Unknown'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full stage-progress-bar transition-all duration-300"
                              style={{ width: `${progress}%` }} />

                          </div>
                        </div>
                      </div>
                    </div>);

                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedBusiness ?
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stages">Stages</TabsTrigger>
                <TabsTrigger value="transitions">Transitions</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <BusinessStageVisualizer
                business={selectedBusiness}
                stages={stages}
                currentProgress={getBusinessProgress(selectedBusiness)}
                onStageTransition={handleStageTransition}
                loading={actionLoading} />

              </TabsContent>

              <TabsContent value="stages" className="space-y-4">
                <BusinessStageVisualizer
                business={selectedBusiness}
                stages={stages}
                currentProgress={getBusinessProgress(selectedBusiness)}
                onStageTransition={handleStageTransition}
                loading={actionLoading} />

              </TabsContent>

              <TabsContent value="transitions" className="space-y-4">
                <StageTransitionControls
                businessId={selectedBusiness.id}
                currentStage={stages.find((s) => s.id === selectedBusiness.current_stage_id)!}
                nextStage={stages.find((s) => s.stage_order === (stages.find((s) => s.id === selectedBusiness.current_stage_id)?.stage_order || 0) + 1)}
                currentProgress={getBusinessProgress(selectedBusiness)}
                objectives={getCurrentStageObjectives(selectedBusiness)}
                onTransition={handleStageTransition}
                recentTransitions={transitions.filter((t) => t.business_id === selectedBusiness.id)}
                loading={actionLoading} />

              </TabsContent>

              <TabsContent value="agents" className="space-y-4">
                <AgentAssignmentInterface
                businessId={selectedBusiness.id}
                stages={stages}
                availableAgents={agents}
                currentAssignments={getStageAssignments()}
                onAssignAgent={handleAssignAgent}
                onUnassignAgent={handleUnassignAgent}
                loading={actionLoading} />

              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <TaskManager />
              </TabsContent>
            </Tabs> :

          <Card className="business-card h-96">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Business</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a business from the list to view its lifecycle management details
                  </p>
                  <Button
                  onClick={() => setIsBusinessFormOpen(true)}
                  className="beewise-gradient">

                    <Plus className="w-4 h-4 mr-2" />
                    Create New Business
                  </Button>
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </div>

      {/* Business Form Dialog */}
      <BusinessForm
        isOpen={isBusinessFormOpen}
        onClose={() => {
          setIsBusinessFormOpen(false);
          setEditingBusiness(null);
        }}
        onSubmit={editingBusiness ? handleUpdateBusiness : handleCreateBusiness}
        initialData={editingBusiness || undefined}
        isEditing={!!editingBusiness}
        loading={actionLoading} />

    </div>);

};

export default BusinessDashboard;