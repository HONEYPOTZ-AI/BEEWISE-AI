
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Search,
  Filter,
  TrendingUp,
  Users,
  Activity,
  Star,
  Clock,
  DollarSign,
  Plus,
  Eye,
  Settings } from
'lucide-react';
import AgentStatusMonitor from '@/components/AgentStatusMonitor';

interface Agent {
  id: number;
  name: string;
  description: string;
  agent_type: string;
  status: string;
  price_per_hour: number;
  rating: number;
  total_tasks: number;
  success_rate: number;
  created_at: string;
  capabilities: string[];
  tools: string[];
}

interface AgentType {
  id: number;
  name: string;
  description: string;
  color: string;
}

const AgentMarketplace = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
    fetchAgentTypes();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'rating',
        IsAsc: false
      });

      if (error) throw error;

      // Fetch additional data for each agent
      const enrichedAgents = await Promise.all(
        data.List.map(async (agent: any) => {
          const capabilitiesData = await window.ezsite.apis.tablePage(37241, {
            PageNo: 1,
            PageSize: 10,
            Filters: [{ name: 'agent_id', op: 'Equal', value: agent.id }]
          });

          const toolsData = await window.ezsite.apis.tablePage(37242, {
            PageNo: 1,
            PageSize: 10,
            Filters: [{ name: 'agent_id', op: 'Equal', value: agent.id }]
          });

          return {
            ...agent,
            capabilities: capabilitiesData.data?.List.map((c: any) => c.capability_name) || [],
            tools: toolsData.data?.List.map((t: any) => t.tool_name) || []
          };
        })
      );

      setAgents(enrichedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agents',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentTypes = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37237, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: 'name',
        IsAsc: true
      });

      if (error) throw error;
      setAgentTypes(data.List);
    } catch (error) {
      console.error('Error fetching agent types:', error);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || agent.agent_type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price_per_hour - b.price_per_hour;
      case 'tasks':
        return b.total_tasks - a.total_tasks;
      default:
        return 0;
    }
  });

  const AgentCard = ({ agent }: {agent: Agent;}) =>
  <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {agent.name}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                {agent.agent_type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{agent.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agent.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability, index) =>
          <Badge key={index} variant="outline" className="text-xs">
                {capability}
              </Badge>
          )}
            {agent.capabilities.length > 3 &&
          <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
          }
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>{agent.success_rate}% success</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{agent.total_tasks} tasks</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>${agent.price_per_hour}/hour</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
            agent.status === 'active' ? 'bg-green-500' :
            agent.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'}`
            } />
              <span className="text-xs capitalize">{agent.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/agent-marketplace/agent/${agent.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </Link>
          <Button size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-1" />
            Deploy
          </Button>
        </div>
      </CardContent>
    </Card>;


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Agent Marketplace</h1>
              <p className="text-muted-foreground mt-1">
                Discover and deploy AI agents for your business needs
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/agent-marketplace/onboarding">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </Link>
              <Link to="/agent-marketplace/analytics">
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="registry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registry">Agent Registry</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="registry" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg border">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10" />

                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48 bg-black text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {agentTypes.map((type) =>
                  <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-black text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="tasks">Total Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agent Grid */}
            {loading ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) =>
              <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-3 bg-muted rounded w-16" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="flex space-x-2">
                        <div className="h-8 bg-muted rounded flex-1" />
                        <div className="h-8 bg-muted rounded flex-1" />
                      </div>
                    </CardContent>
                  </Card>
              )}
              </div> :

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map((agent) =>
              <AgentCard key={agent.id} agent={agent} />
              )}
                {filteredAgents.length === 0 &&
              <div className="col-span-full text-center py-12">
                    <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No agents found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
              }
              </div>
            }
          </TabsContent>

          <TabsContent value="catalog">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Catalog View</h3>
              <p className="text-muted-foreground">
                Advanced catalog with category filtering coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <AgentStatusMonitor />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive analytics dashboard coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default AgentMarketplace;