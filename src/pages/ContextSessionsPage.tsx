
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Play, Pause, Square, Download, Users, MessageCircle, Clock, DollarSign, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContextSession {
  id: number;
  session_id: string;
  business_id: number;
  primary_agent_id: number;
  session_type: string;
  context_data: any;
  conversation_history: any[];
  participant_agents: number[];
  status: string;
  total_messages: number;
  total_cost: number;
  started_at: string;
  ended_at: string;
  last_activity_at: string;
}

interface Agent {
  id: number;
  name: string;
  display_name: string;
  status: string;
}

interface SessionMetrics {
  totalSessions: number;
  activeSessions: number;
  totalCost: number;
  avgDuration: number;
  totalMessages: number;
}

const ContextSessionsPage: React.FC = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ContextSession[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<ContextSession | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    activeSessions: 0,
    totalCost: 0,
    avgDuration: 0,
    totalMessages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadSessions();
    loadAgents();
    calculateMetrics();
  }, [currentPage, searchQuery, statusFilter, typeFilter]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const filters = [];

      if (searchQuery) {
        filters.push({
          name: 'session_id',
          op: 'StringContains',
          value: searchQuery
        });
      }

      if (statusFilter !== 'all') {
        filters.push({
          name: 'status',
          op: 'Equal',
          value: statusFilter
        });
      }

      if (typeFilter !== 'all') {
        filters.push({
          name: 'session_type',
          op: 'Equal',
          value: typeFilter
        });
      }

      const { data, error } = await window.ezsite.apis.tablePage(37251, {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: 'last_activity_at',
        IsAsc: false,
        Filters: filters
      });

      if (error) throw new Error(error);
      setSessions(data.List || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to load sessions: ${error}`,
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

  const calculateMetrics = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(37251, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'id',
        IsAsc: false
      });

      if (error) throw new Error(error);

      const allSessions = data.List || [];
      const activeSessions = allSessions.filter((s) => s.status === 'active').length;
      const totalCost = allSessions.reduce((sum, s) => sum + (s.total_cost || 0), 0);
      const totalMessages = allSessions.reduce((sum, s) => sum + (s.total_messages || 0), 0);

      const completedSessions = allSessions.filter((s) => s.started_at && s.ended_at);
      const avgDuration = completedSessions.length > 0 ?
      completedSessions.reduce((sum, s) => {
        const duration = new Date(s.ended_at).getTime() - new Date(s.started_at).getTime();
        return sum + duration;
      }, 0) / completedSessions.length / 1000 / 60 // Average in minutes
      : 0;

      setMetrics({
        totalSessions: allSessions.length,
        activeSessions,
        totalCost: totalCost / 100, // Convert from cents to dollars
        avgDuration,
        totalMessages
      });
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
    }
  };

  const handleSessionControl = async (session: ContextSession, action: 'pause' | 'resume' | 'terminate') => {
    try {
      let newStatus = session.status;
      let updatedData: any = { id: session.id };

      switch (action) {
        case 'pause':
          newStatus = 'paused';
          break;
        case 'resume':
          newStatus = 'active';
          updatedData.last_activity_at = new Date().toISOString();
          break;
        case 'terminate':
          newStatus = 'terminated';
          updatedData.ended_at = new Date().toISOString();
          break;
      }

      updatedData.status = newStatus;

      const { error } = await window.ezsite.apis.tableUpdate(37251, updatedData);
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: `Session ${action}d successfully`
      });

      loadSessions();
      calculateMetrics();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} session: ${error}`,
        variant: 'destructive'
      });
    }
  };

  const handleExportSession = async (session: ContextSession) => {
    try {
      const exportData = {
        session_id: session.session_id,
        session_type: session.session_type,
        status: session.status,
        started_at: session.started_at,
        ended_at: session.ended_at,
        total_messages: session.total_messages,
        total_cost: session.total_cost,
        context_data: session.context_data,
        conversation_history: session.conversation_history,
        participant_agents: session.participant_agents.map((id) => getAgentName(id))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `session_${session.session_id}_export.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: 'Success',
        description: 'Session exported successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to export session: ${error}`,
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      terminated: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      conversation: 'bg-blue-100 text-blue-800',
      task: 'bg-purple-100 text-purple-800',
      analysis: 'bg-green-100 text-green-800',
      planning: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    if (!startDate) return 'N/A';

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const duration = end.getTime() - start.getTime();

    const minutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getAgentName = (agentId: number) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? agent.display_name || agent.name : `Agent ${agentId}`;
  };

  const openSessionDetails = (session: ContextSession) => {
    setSelectedSession(session);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <nav className="flex items-center space-x-6">
                <Link to="/memory-management" className="text-sm text-gray-600 hover:text-gray-900">
                  Memory Management
                </Link>
                <span className="text-sm font-medium text-gray-900">
                  Context Sessions
                </span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Context Sessions Management</h1>
          <p className="text-gray-600">Monitor and manage agent conversation sessions and context continuity</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{metrics.totalSessions}</p>
                  <p className="text-xs text-gray-600">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Play className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{metrics.activeSessions}</p>
                  <p className="text-xs text-gray-600">Active Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{metrics.totalMessages.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{Math.round(metrics.avgDuration)}m</p>
                  <p className="text-xs text-gray-600">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Total Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search Session ID</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10" />

                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Session Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="conversation">Conversation</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ?
            <div className="space-y-4">
                {[...Array(5)].map((_, i) =>
              <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
              )}
              </div> :
            sessions.length === 0 ?
            <div className="text-center py-8">
                <p className="text-gray-500">No sessions found matching your criteria.</p>
              </div> :

            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Primary Agent</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) =>
                  <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          <button
                        onClick={() => openSessionDetails(session)}
                        className="text-blue-600 hover:text-blue-800 hover:underline">

                            {session.session_id}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(session.session_type)}>
                            {session.session_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{getAgentName(session.primary_agent_id)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {session.participant_agents?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell>{session.total_messages}</TableCell>
                        <TableCell>{formatDuration(session.started_at, session.ended_at)}</TableCell>
                        <TableCell>${(session.total_cost / 100).toFixed(2)}</TableCell>
                        <TableCell>{formatDate(session.last_activity_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {session.status === 'active' &&
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSessionControl(session, 'pause')}>

                                <Pause className="w-4 h-4" />
                              </Button>
                        }
                            {session.status === 'paused' &&
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSessionControl(session, 'resume')}>

                                <Play className="w-4 h-4" />
                              </Button>
                        }
                            {(session.status === 'active' || session.status === 'paused') &&
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSessionControl(session, 'terminate')}>

                                <Square className="w-4 h-4" />
                              </Button>
                        }
                            <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportSession(session)}>

                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  )}
                  </TableBody>
                </Table>
              </div>
            }
          </CardContent>
        </Card>

        {/* Session Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Session Details: {selectedSession?.session_id}</DialogTitle>
            </DialogHeader>
            {selectedSession &&
            <div className="space-y-6">
                {/* Session Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Type:</span> {selectedSession.session_type}</div>
                      <div><span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedSession.status)}`}>
                          {selectedSession.status}
                        </Badge>
                      </div>
                      <div><span className="font-medium">Primary Agent:</span> {getAgentName(selectedSession.primary_agent_id)}</div>
                      <div><span className="font-medium">Started:</span> {formatDate(selectedSession.started_at)}</div>
                      <div><span className="font-medium">Last Activity:</span> {formatDate(selectedSession.last_activity_at)}</div>
                      {selectedSession.ended_at &&
                    <div><span className="font-medium">Ended:</span> {formatDate(selectedSession.ended_at)}</div>
                    }
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Messages:</span> {selectedSession.total_messages}</div>
                      <div><span className="font-medium">Cost:</span> ${(selectedSession.total_cost / 100).toFixed(2)}</div>
                      <div><span className="font-medium">Duration:</span> {formatDuration(selectedSession.started_at, selectedSession.ended_at)}</div>
                      <div><span className="font-medium">Participants:</span> {selectedSession.participant_agents?.length || 0}</div>
                    </div>
                  </div>
                </div>

                {/* Participant Agents */}
                <div>
                  <h3 className="font-semibold mb-2">Participant Agents</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.participant_agents?.map((agentId) =>
                  <Badge key={agentId} variant="secondary">
                        {getAgentName(agentId)}
                      </Badge>
                  ) || <span className="text-gray-500">No participants</span>}
                  </div>
                </div>

                {/* Context Data */}
                <div>
                  <h3 className="font-semibold mb-2">Context Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedSession.context_data, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Conversation History */}
                <div>
                  <h3 className="font-semibold mb-2">Conversation History</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    {selectedSession.conversation_history && selectedSession.conversation_history.length > 0 ?
                  <div className="space-y-2">
                        {selectedSession.conversation_history.map((message, index) =>
                    <div key={index} className="text-sm">
                            <div className="font-medium text-gray-700">
                              {message.timestamp ? formatDate(message.timestamp) : `Message ${index + 1}`}
                            </div>
                            <div className="text-gray-600">
                              {JSON.stringify(message, null, 2)}
                            </div>
                          </div>
                    )}
                      </div> :

                  <div className="text-gray-500">No conversation history available</div>
                  }
                  </div>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </main>
    </div>);

};

export default ContextSessionsPage;