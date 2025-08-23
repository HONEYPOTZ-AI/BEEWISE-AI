
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Settings,
  TrendingUp,
  Users,
  Briefcase,
  Shield,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  agent_name: string;
  agent_type: string;
  description: string;
  status: string;
  cost_per_hour: number;
  rating: number;
  total_tasks: number;
  success_rate: number;
  specializations: string[];
  available_tools: string[];
}

interface AgentType {
  id: number;
  type_name: string;
  description: string;
  icon: string;
  category: string;
  base_cost: number;
}

const AgentMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const agentCategories = [
    { id: 'all', name: 'All Agents', icon: Bot },
    { id: 'startup', name: 'Startup', icon: Lightbulb },
    { id: 'branding', name: 'Branding', icon: Building },
    { id: 'legal', name: 'Legal', icon: Shield },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'sales', name: 'Sales', icon: Users },
    { id: 'support', name: 'Support', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    filterAgents();
  }, [agents, searchQuery, selectedCategory, sortBy]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Load agents
      const agentsResponse = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "ID",
        IsAsc: false
      });

      if (agentsResponse.error) throw agentsResponse.error;
      setAgents(agentsResponse.data?.List || []);

      // Load agent types
      const typesResponse = await window.ezsite.apis.tablePage(37237, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: "ID",
        IsAsc: false
      });

      if (typesResponse.error) throw typesResponse.error;
      setAgentTypes(typesResponse.data?.List || []);

    } catch (error) {
      console.error('Error loading marketplace data:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAgents = () => {
    let filtered = [...agents];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(agent => 
        agent.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agent_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => 
        agent.agent_type?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'cost':
          return (a.cost_per_hour || 0) - (b.cost_per_hour || 0);
        case 'tasks':
          return (b.total_tasks || 0) - (a.total_tasks || 0);
        case 'name':
          return (a.agent_name || '').localeCompare(b.agent_name || '');
        default:
          return 0;
      }
    });

    setFilteredAgents(filtered);
  };

  const deployAgent = async (agentId: number) => {
    try {
      // Implementation would depend on your deployment logic
      toast({
        title: "Agent Deployed",
        description: "The agent has been successfully deployed to your workspace.",
      });
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy the agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAgentIcon = (type: string) => {
    const typeMap: { [key: string]: any } = {
      'startup': Lightbulb,
      'branding': Building,
      'legal': Shield,
      'finance': DollarSign,
      'marketing': TrendingUp,
      'sales': Users,
      'support': MessageSquare,
      'analytics': BarChart3
    };
    return typeMap[type.toLowerCase()] || Bot;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Agent Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover and deploy specialized AI agents for your business needs
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/agent-onboarding')}>
            <Bot className="mr-2 h-4 w-4" />
            Create Custom Agent
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents by name, type, or capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {agentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3">
        {agentCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">{category.name}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const IconComponent = getAgentIcon(agent.agent_type || '');
          return (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.agent_name || `Agent ${agent.id}`}</CardTitle>
                      <CardDescription>{agent.agent_type || 'General Purpose'}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status || 'Available'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {agent.description || 'Advanced AI agent specialized in business automation and optimization tasks.'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{agent.rating || 4.8}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>${agent.cost_per_hour || 12}/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>{agent.success_rate || 94}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">SPECIALIZATIONS</p>
                  <div className="flex flex-wrap gap-1">
                    {(agent.specializations || ['Business Analysis', 'Process Automation']).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => deployAgent(agent.id)}
                    className="flex-1"
                    size="sm"
                  >
                    Deploy Agent
                  </Button>
                  <Button 
                    onClick={() => navigate(`/agent-details/${agent.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentMarketplacePage;
