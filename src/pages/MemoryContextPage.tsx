
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain,
  Network,
  Clock,
  Database,
  Search,
  Trash2,
  Download,
  Upload,
  Eye,
  Link,
  Activity,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ContextSession {
  id: number;
  session_name: string;
  created_at: string;
  last_accessed: string;
  memory_size_mb: number;
  context_tokens: number;
  status: string;
  agent_id: number;
  business_id: number;
}

interface KnowledgeNode {
  id: number;
  node_type: string;
  content: string;
  created_at: string;
  relevance_score: number;
  connections: number;
  source_session: number;
}

interface AgentMemory {
  id: number;
  agent_id: number;
  memory_type: string;
  content: string;
  importance_score: number;
  last_accessed: string;
  retention_policy: string;
}

const MemoryContextPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contextSessions, setContextSessions] = useState<ContextSession[]>([]);
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      
      // Load context sessions
      const sessionsResponse = await window.ezsite.apis.tablePage(37251, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "last_accessed",
        IsAsc: false
      });

      if (sessionsResponse.error) throw sessionsResponse.error;
      setContextSessions(sessionsResponse.data?.List || []);

      // Load knowledge graph nodes
      const knowledgeResponse = await window.ezsite.apis.tablePage(37252, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "relevance_score",
        IsAsc: false
      });

      if (knowledgeResponse.error) throw knowledgeResponse.error;
      setKnowledgeNodes(knowledgeResponse.data?.List || []);

      // Load agent memories
      const memoriesResponse = await window.ezsite.apis.tablePage(37250, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "importance_score",
        IsAsc: false
      });

      if (memoriesResponse.error) throw memoriesResponse.error;
      setAgentMemories(memoriesResponse.data?.List || []);

    } catch (error) {
      console.error('Error loading memory data:', error);
      toast({
        title: "Error",
        description: "Failed to load memory and context data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = async (sessionId: number) => {
    try {
      const response = await window.ezsite.apis.tableDelete(37251, { ID: sessionId });
      if (response.error) throw response.error;

      toast({
        title: "Session Cleared",
        description: "Context session has been successfully cleared.",
      });

      loadMemoryData();
    } catch (error) {
      console.error('Error clearing session:', error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'episodic':
        return <Clock className="h-4 w-4" />;
      case 'semantic':
        return <Brain className="h-4 w-4" />;
      case 'procedural':
        return <Activity className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Memory & Context Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Memory & Context Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage agent memory, context sessions, and knowledge graph
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Knowledge
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contextSessions.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {contextSessions.length} total sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Knowledge Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeNodes.length}</div>
            <p className="text-xs text-muted-foreground">
              {knowledgeNodes.filter(n => n.relevance_score > 0.8).length} high relevance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contextSessions.reduce((sum, s) => sum + (s.memory_size_mb || 0), 0).toFixed(1)} MB
            </div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Context Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contextSessions.reduce((sum, s) => sum + (s.context_tokens || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total context capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sessions">Context Sessions</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="memories">Agent Memories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search context sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contextSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {session.session_name || `Session ${session.id}`}
                    </CardTitle>
                    <Badge className={getSessionStatusColor(session.status || 'active')}>
                      {session.status || 'active'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created: {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Memory Size:</span>
                      <p className="font-medium">{session.memory_size_mb || 0} MB</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Context Tokens:</span>
                      <p className="font-medium">{session.context_tokens || 0}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Accessed:</span>
                      <p className="font-medium">
                        {session.last_accessed ? new Date(session.last_accessed).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agent ID:</span>
                      <p className="font-medium">{session.agent_id || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{Math.min((session.memory_size_mb || 0) / 100 * 100, 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min((session.memory_size_mb || 0) / 100 * 100, 100)} />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => clearSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {contextSessions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No context sessions found</h3>
                <p className="text-muted-foreground">
                  Context sessions will appear here as agents begin processing tasks
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          {/* Knowledge Graph Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Knowledge Graph Overview
              </CardTitle>
              <CardDescription>
                Interactive visualization of knowledge connections and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Knowledge Graph Visualization</p>
                  <p className="text-sm text-muted-foreground mt-1">Interactive network will render here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {knowledgeNodes.map((node) => (
              <Card key={node.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{node.node_type || 'Knowledge Node'}</span>
                    <Badge variant="outline">
                      Score: {(node.relevance_score || 0).toFixed(2)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {node.connections || 0} connections • Created: {node.created_at ? new Date(node.created_at).toLocaleDateString() : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {node.content || 'Knowledge content and relationships stored here...'}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        {node.connections || 0} links
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {((node.relevance_score || 0) * 100).toFixed(0)}% relevance
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {knowledgeNodes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No knowledge nodes found</h3>
                <p className="text-muted-foreground">
                  Knowledge will be automatically extracted and organized as agents process information
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="memories" className="space-y-6">
          <div className="space-y-4">
            {agentMemories.map((memory) => (
              <Card key={memory.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getMemoryTypeIcon(memory.memory_type || 'semantic')}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            {memory.memory_type || 'semantic'}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            Agent {memory.agent_id}
                          </Badge>
                          <Badge variant="outline">
                            Score: {(memory.importance_score || 0).toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {memory.content || 'Memory content stored here...'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Last accessed: {memory.last_accessed ? new Date(memory.last_accessed).toLocaleDateString() : 'Never'}
                          </span>
                          <span>
                            Retention: {memory.retention_policy || 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {agentMemories.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No agent memories found</h3>
                <p className="text-muted-foreground">
                  Agent memories will accumulate as they learn and process information
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Memory Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Knowledge Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {knowledgeNodes.reduce((sum, n) => sum + (n.connections || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total relationships</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Memory Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">94.2%</div>
                <p className="text-xs text-muted-foreground">Utilization rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Memory Usage Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage Trends</CardTitle>
              <CardDescription>
                Memory allocation and usage patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Memory Usage Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Visualization will render here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemoryContextPage;
