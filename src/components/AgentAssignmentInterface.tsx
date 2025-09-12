import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  Plus,
  Search,
  Filter,
  UserPlus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bot,
  Zap,
  Star } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface BusinessStage {
  id: number;
  name: string;
  recommended_agents: string[];
}

interface StageAgentAssignment {
  stageId: number;
  stageName: string;
  assignedAgents: Agent[];
  recommendedAgentTypes: string[];
}

interface AgentAssignmentInterfaceProps {
  businessId: number;
  stages: BusinessStage[];
  availableAgents: Agent[];
  currentAssignments: StageAgentAssignment[];
  onAssignAgent: (stageId: number, agentId: number) => Promise<void>;
  onUnassignAgent: (stageId: number, agentId: number) => Promise<void>;
  loading?: boolean;
}

const AgentAssignmentInterface: React.FC<AgentAssignmentInterfaceProps> = ({
  businessId,
  stages,
  availableAgents,
  currentAssignments,
  onAssignAgent,
  onUnassignAgent,
  loading = false
}) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAssigning, setIsAssigning] = useState<{[key: string]: boolean;}>({});
  const { toast } = useToast();

  const parseRecommendedAgents = (agents: string | string[]): string[] => {
    if (Array.isArray(agents)) return agents;
    try {
      const parsed = JSON.parse(agents);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const filteredAgents = availableAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active':return 'bg-green-100 text-green-800';
      case 'inactive':return 'bg-gray-100 text-gray-800';
      case 'maintenance':return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':return 'bg-red-100 text-red-800';
      default:return 'bg-blue-100 text-blue-800';
    }
  };

  const isAgentRecommended = (agent: Agent, stage: BusinessStage): boolean => {
    const recommended = parseRecommendedAgents(stage.recommended_agents);
    return recommended.some((rec) =>
    agent.name.toLowerCase().includes(rec.toLowerCase()) ||
    agent.display_name.toLowerCase().includes(rec.toLowerCase())
    );
  };

  const isAgentAssigned = (stageId: number, agentId: number): boolean => {
    const assignment = currentAssignments.find((a) => a.stageId === stageId);
    return assignment?.assignedAgents.some((agent) => agent.id === agentId) || false;
  };

  const handleAssignAgent = async (stageId: number, agentId: number) => {
    const key = `${stageId}-${agentId}`;
    setIsAssigning((prev) => ({ ...prev, [key]: true }));

    try {
      await onAssignAgent(stageId, agentId);
      const agent = availableAgents.find((a) => a.id === agentId);
      const stage = stages.find((s) => s.id === stageId);

      toast({
        title: "Agent Assigned",
        description: `${agent?.display_name} assigned to ${stage?.name}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Unable to assign agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleUnassignAgent = async (stageId: number, agentId: number) => {
    const key = `${stageId}-${agentId}`;
    setIsAssigning((prev) => ({ ...prev, [key]: true }));

    try {
      await onUnassignAgent(stageId, agentId);
      const agent = availableAgents.find((a) => a.id === agentId);
      const stage = stages.find((s) => s.id === stageId);

      toast({
        title: "Agent Unassigned",
        description: `${agent?.display_name} removed from ${stage?.name}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Unassignment Failed",
        description: "Unable to unassign agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning((prev) => ({ ...prev, [key]: false }));
    }
  };

  const formatCost = (cost: number): string => {
    return `$${(cost / 100).toFixed(4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Stage Agent Assignments */}
      <Card className="business-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Agent Assignments by Stage
            </div>
            <Button
              onClick={() => setIsAssignDialogOpen(true)}
              className="beewise-gradient"
              size="sm">

              <Plus className="w-4 h-4 mr-2" />
              Assign Agents
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stages.map((stage) => {
              const assignment = currentAssignments.find((a) => a.stageId === stage.id);
              const assignedAgents = assignment?.assignedAgents || [];
              const recommended = parseRecommendedAgents(stage.recommended_agents);

              return (
                <div key={stage.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{stage.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assignedAgents.length} agents assigned
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStage(stage.id);
                        setIsAssignDialogOpen(true);
                      }}>

                      <UserPlus className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>

                  {/* Recommended Agent Types */}
                  {recommended.length > 0 &&
                  <div className="mb-3">
                      <p className="text-xs font-medium mb-2">Recommended Agent Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommended.map((type, index) =>
                      <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                      )}
                      </div>
                    </div>
                  }

                  {/* Assigned Agents */}
                  <div className="space-y-2">
                    {assignedAgents.length === 0 ?
                    <div className="text-center py-6 text-muted-foreground">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No agents assigned to this stage</p>
                      </div> :

                    assignedAgents.map((agent) =>
                    <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border agent-assigned">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {agent.display_name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{agent.display_name}</p>
                                <Badge className={`text-xs ${getAgentStatusColor(agent.status)}`}>
                                  {agent.status}
                                </Badge>
                                {isAgentRecommended(agent, stage) &&
                            <Badge variant="secondary" className="text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Recommended
                                  </Badge>
                            }
                              </div>
                              <p className="text-xs text-muted-foreground">{agent.description}</p>
                            </div>
                          </div>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignAgent(stage.id, agent.id)}
                        disabled={isAssigning[`${stage.id}-${agent.id}`]}>

                            {isAssigning[`${stage.id}-${agent.id}`] ?
                        <Clock className="w-4 h-4 animate-spin" /> :

                        'Remove'
                        }
                          </Button>
                        </div>
                    )
                    }
                  </div>
                </div>);

            })}
          </div>
        </CardContent>
      </Card>

      {/* Agent Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Assign Agents to Stages
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10" />

                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Available Agents */}
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredAgents.map((agent) =>
                <div key={agent.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {agent.display_name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{agent.display_name}</h4>
                            <Badge className={`text-xs ${getAgentStatusColor(agent.status)}`}>
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Priority: {agent.priority_level}
                            </div>
                            <div>Max Tasks: {agent.max_concurrent_tasks}</div>
                            <div>{formatCost(agent.cost_per_request)}/request</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stage Assignment Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {stages.map((stage) => {
                      const isAssigned = isAgentAssigned(stage.id, agent.id);
                      const isRecommended = isAgentRecommended(agent, stage);
                      const key = `${stage.id}-${agent.id}`;

                      return (
                        <div
                          key={stage.id}
                          className={`
                              p-2 rounded border text-sm flex items-center justify-between
                              ${isAssigned ? 'border-green-200 bg-green-50' : 'border-gray-200'}
                              ${isRecommended ? 'border-primary/30 bg-primary/5' : ''}
                            `}>

                            <div className="flex items-center gap-2">
                              <span className="font-medium">{stage.name}</span>
                              {isRecommended &&
                            <Star className="w-3 h-3 text-primary" />
                            }
                            </div>
                            {isAssigned ?
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnassignAgent(stage.id, agent.id)}
                            disabled={isAssigning[key]}
                            className="text-xs h-6">

                                {isAssigning[key] ?
                            <Clock className="w-3 h-3 animate-spin" /> :

                            'Remove'
                            }
                              </Button> :

                          <Button
                            size="sm"
                            onClick={() => handleAssignAgent(stage.id, agent.id)}
                            disabled={agent.status !== 'active' || isAssigning[key]}
                            className="text-xs h-6 beewise-gradient">

                                {isAssigning[key] ?
                            <Clock className="w-3 h-3 animate-spin" /> :

                            'Assign'
                            }
                              </Button>
                          }
                          </div>);

                    })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}>

              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

};

export default AgentAssignmentInterface;