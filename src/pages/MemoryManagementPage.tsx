
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Search, Plus, Edit, Trash2, Shield, Clock, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgentMemory {
  id: number;
  agent_id: number;
  memory_type: string;
  memory_key: string;
  memory_content: any;
  context_tags: string;
  importance_score: number;
  access_count: number;
  last_accessed_at: string;
  expires_at: string;
  is_encrypted: boolean;
  created_at: string;
  updated_at: string;
}

interface Agent {
  id: number;
  name: string;
  display_name: string;
  status: string;
}

const MemoryManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [memories, setMemories] = useState<AgentMemory[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [memoryTypeFilter, setMemoryTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<AgentMemory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    agent_id: '',
    memory_type: 'episodic',
    memory_key: '',
    memory_content: '{}',
    context_tags: '',
    importance_score: 5,
    expires_at: ''
  });

  useEffect(() => {
    loadMemories();
    loadAgents();
  }, [currentPage, searchQuery, memoryTypeFilter, agentFilter]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const filters = [];

      if (searchQuery) {
        filters.push({
          name: 'memory_key',
          op: 'StringContains',
          value: searchQuery
        });
      }

      if (memoryTypeFilter !== 'all') {
        filters.push({
          name: 'memory_type',
          op: 'Equal',
          value: memoryTypeFilter
        });
      }

      if (agentFilter !== 'all') {
        filters.push({
          name: 'agent_id',
          op: 'Equal',
          value: parseInt(agentFilter)
        });
      }

      const { data, error } = await window.ezsite.apis.tablePage(37250, {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: 'created_at',
        IsAsc: false,
        Filters: filters
      });

      if (error) throw new Error(error);
      setMemories(data.List || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to load memories: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'display_name',
        IsAsc: true
      });

      if (error) throw new Error(error);
      setAgents(data.List || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleCreateMemory = async () => {
    try {
      const memoryData = {
        ...formData,
        agent_id: parseInt(formData.agent_id),
        importance_score: parseInt(formData.importance_score.toString()),
        memory_content: JSON.stringify(JSON.parse(formData.memory_content)),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await window.ezsite.apis.tableCreate(37250, memoryData);
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: 'Memory entry created successfully'
      });

      setIsCreateDialogOpen(false);
      resetForm();
      loadMemories();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create memory: ${error}`,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateMemory = async () => {
    if (!selectedMemory) return;

    try {
      const memoryData = {
        ...formData,
        id: selectedMemory.id,
        agent_id: parseInt(formData.agent_id),
        importance_score: parseInt(formData.importance_score.toString()),
        memory_content: JSON.stringify(JSON.parse(formData.memory_content)),
        updated_at: new Date().toISOString()
      };

      const { error } = await window.ezsite.apis.tableUpdate(37250, memoryData);
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: 'Memory entry updated successfully'
      });

      setIsEditDialogOpen(false);
      resetForm();
      loadMemories();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update memory: ${error}`,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMemory = async (memory: AgentMemory) => {
    if (!confirm('Are you sure you want to delete this memory entry?')) return;

    try {
      const { error } = await window.ezsite.apis.tableDelete(37250, { ID: memory.id });
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: 'Memory entry deleted successfully'
      });

      loadMemories();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete memory: ${error}`,
        variant: 'destructive'
      });
    }
  };

  const handleAccessMemory = async (memory: AgentMemory) => {
    try {
      const updatedData = {
        id: memory.id,
        access_count: memory.access_count + 1,
        last_accessed_at: new Date().toISOString()
      };

      await window.ezsite.apis.tableUpdate(37250, updatedData);
      loadMemories();
    } catch (error) {
      console.error('Failed to update access count:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      agent_id: '',
      memory_type: 'episodic',
      memory_key: '',
      memory_content: '{}',
      context_tags: '',
      importance_score: 5,
      expires_at: ''
    });
    setSelectedMemory(null);
  };

  const openEditDialog = (memory: AgentMemory) => {
    setSelectedMemory(memory);
    setFormData({
      agent_id: memory.agent_id.toString(),
      memory_type: memory.memory_type,
      memory_key: memory.memory_key,
      memory_content: JSON.stringify(memory.memory_content, null, 2),
      context_tags: memory.context_tags,
      importance_score: memory.importance_score,
      expires_at: memory.expires_at || ''
    });
    setIsEditDialogOpen(true);
  };

  const getMemoryTypeColor = (type: string) => {
    const colors = {
      episodic: 'bg-blue-100 text-blue-800',
      semantic: 'bg-green-100 text-green-800',
      procedural: 'bg-purple-100 text-purple-800',
      working: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getImportanceColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const getAgentName = (agentId: number) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? agent.display_name || agent.name : `Agent ${agentId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="bg-black text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <nav className="flex items-center space-x-6">
                <span className="text-sm font-medium text-gray-900">
                  Memory Management
                </span>
                <Link to="/context-sessions" className="text-sm text-gray-600 hover:text-gray-900">
                  Context Sessions
                </Link>
                <Link to="/orchestration" className="text-sm text-gray-600 hover:text-gray-900">
                  Orchestration
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory Management</h1>
          <p className="text-gray-600">Manage agent memory entries, context, and persistence</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Memory Keys</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10" />

                </div>
              </div>
              <div>
                <Label htmlFor="memory-type">Memory Type</Label>
                <Select value={memoryTypeFilter} onValueChange={setMemoryTypeFilter}>
                  <SelectTrigger className="bg-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="episodic">Episodic</SelectItem>
                    <SelectItem value="semantic">Semantic</SelectItem>
                    <SelectItem value="procedural">Procedural</SelectItem>
                    <SelectItem value="working">Working</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agent">Agent</Label>
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="bg-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map((agent) =>
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.display_name || agent.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Memory
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Memory Entry</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="agent">Agent</Label>
                          <Select value={formData.agent_id} onValueChange={(value) => setFormData({ ...formData, agent_id: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map((agent) =>
                              <SelectItem key={agent.id} value={agent.id.toString()}>
                                  {agent.display_name || agent.name}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="memory-type">Memory Type</Label>
                          <Select value={formData.memory_type} onValueChange={(value) => setFormData({ ...formData, memory_type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="episodic">Episodic</SelectItem>
                              <SelectItem value="semantic">Semantic</SelectItem>
                              <SelectItem value="procedural">Procedural</SelectItem>
                              <SelectItem value="working">Working</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="memory-key">Memory Key</Label>
                        <Input
                          id="memory-key"
                          value={formData.memory_key}
                          onChange={(e) => setFormData({ ...formData, memory_key: e.target.value })}
                          placeholder="Unique memory identifier" />

                      </div>
                      <div>
                        <Label htmlFor="memory-content">Memory Content (JSON)</Label>
                        <Textarea
                          id="memory-content"
                          value={formData.memory_content}
                          onChange={(e) => setFormData({ ...formData, memory_content: e.target.value })}
                          placeholder='{"key": "value"}'
                          rows={6} />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="context-tags">Context Tags</Label>
                          <Input
                            id="context-tags"
                            value={formData.context_tags}
                            onChange={(e) => setFormData({ ...formData, context_tags: e.target.value })}
                            placeholder="tag1, tag2, tag3" />

                        </div>
                        <div>
                          <Label htmlFor="importance">Importance Score (1-10)</Label>
                          <Input
                            id="importance"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.importance_score}
                            onChange={(e) => setFormData({ ...formData, importance_score: parseInt(e.target.value) || 5 })} />

                        </div>
                      </div>
                      <div>
                        <Label htmlFor="expires-at">Expiration Date (Optional)</Label>
                        <Input
                          id="expires-at"
                          type="datetime-local"
                          value={formData.expires_at}
                          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} />

                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateMemory}>
                        Create Memory
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Entries */}
        {loading ?
        <div className="grid gap-4">
            {[...Array(5)].map((_, i) =>
          <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
          )}
          </div> :
        memories.length === 0 ?
        <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500">No memory entries found matching your criteria.</p>
            </CardContent>
          </Card> :

        <div className="grid gap-4">
            {memories.map((memory) =>
          <Card key={memory.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{memory.memory_key}</h3>
                        <Badge className={getMemoryTypeColor(memory.memory_type)}>
                          {memory.memory_type}
                        </Badge>
                        <Badge className={getImportanceColor(memory.importance_score)}>
                          Priority: {memory.importance_score}
                        </Badge>
                        {memory.is_encrypted &&
                    <Badge variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            Encrypted
                          </Badge>
                    }
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Agent: {getAgentName(memory.agent_id)}
                      </p>
                      {memory.context_tags &&
                  <p className="text-sm text-gray-500 mb-2">
                          Tags: {memory.context_tags}
                        </p>
                  }
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAccessMemory(memory)}>

                        <Eye className="w-4 h-4 mr-1" />
                        Access ({memory.access_count})
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(memory)}>

                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMemory(memory)}>

                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p>{formatDate(memory.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Accessed</p>
                      <p>{formatDate(memory.last_accessed_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expires</p>
                      <p className={memory.expires_at && new Date(memory.expires_at) < new Date() ? 'text-red-600' : ''}>
                        {memory.expires_at ? formatDate(memory.expires_at) : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Memory Content:</p>
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {JSON.stringify(memory.memory_content, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
          )}
          </div>
        }

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Memory Entry</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-agent">Agent</Label>
                  <Select value={formData.agent_id} onValueChange={(value) => setFormData({ ...formData, agent_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) =>
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.display_name || agent.name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-memory-type">Memory Type</Label>
                  <Select value={formData.memory_type} onValueChange={(value) => setFormData({ ...formData, memory_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="episodic">Episodic</SelectItem>
                      <SelectItem value="semantic">Semantic</SelectItem>
                      <SelectItem value="procedural">Procedural</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-memory-key">Memory Key</Label>
                <Input
                  id="edit-memory-key"
                  value={formData.memory_key}
                  onChange={(e) => setFormData({ ...formData, memory_key: e.target.value })}
                  placeholder="Unique memory identifier" />

              </div>
              <div>
                <Label htmlFor="edit-memory-content">Memory Content (JSON)</Label>
                <Textarea
                  id="edit-memory-content"
                  value={formData.memory_content}
                  onChange={(e) => setFormData({ ...formData, memory_content: e.target.value })}
                  placeholder='{"key": "value"}'
                  rows={6} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-context-tags">Context Tags</Label>
                  <Input
                    id="edit-context-tags"
                    value={formData.context_tags}
                    onChange={(e) => setFormData({ ...formData, context_tags: e.target.value })}
                    placeholder="tag1, tag2, tag3" />

                </div>
                <div>
                  <Label htmlFor="edit-importance">Importance Score (1-10)</Label>
                  <Input
                    id="edit-importance"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.importance_score}
                    onChange={(e) => setFormData({ ...formData, importance_score: parseInt(e.target.value) || 5 })} />

                </div>
              </div>
              <div>
                <Label htmlFor="edit-expires-at">Expiration Date (Optional)</Label>
                <Input
                  id="edit-expires-at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} />

              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMemory}>
                Update Memory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>);

};

export default MemoryManagementPage;