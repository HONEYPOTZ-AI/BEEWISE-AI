
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Archive,
  Trash2,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface MemoryUsageData {
  agent_id: number;
  agent_name: string;
  total_memories: number;
  episodic_count: number;
  semantic_count: number;
  procedural_count: number;
  working_count: number;
  total_size: number;
  avg_importance: number;
  access_frequency: number;
  expired_count: number;
  encrypted_count: number;
}

interface MemoryTrend {
  date: string;
  created: number;
  accessed: number;
  expired: number;
  deleted: number;
}

interface OptimizationSuggestion {
  type: 'cleanup' | 'archival' | 'compression' | 'replication';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  affected_count: number;
}

const MemoryAnalytics: React.FC = () => {
  const [usageData, setUsageData] = useState<MemoryUsageData[]>([]);
  const [trends, setTrends] = useState<MemoryTrend[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('7d');

  useEffect(() => {
    loadMemoryAnalytics();
  }, [selectedAgent, timeRange]);

  const loadMemoryAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load agents first
      const { data: agentsData } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'display_name',
        IsAsc: true
      });
      
      // Load all memories
      const { data: memoriesData } = await window.ezsite.apis.tablePage(37250, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'created_at',
        IsAsc: false
      });

      if (agentsData?.List && memoriesData?.List) {
        generateUsageData(agentsData.List, memoriesData.List);
        generateTrends(memoriesData.List);
        generateSuggestions(memoriesData.List);
      }
    } catch (error) {
      console.error('Failed to load memory analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUsageData = (agents: any[], memories: any[]) => {
    const usage: MemoryUsageData[] = agents.map(agent => {
      const agentMemories = memories.filter(m => m.agent_id === agent.id);
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      return {
        agent_id: agent.id,
        agent_name: agent.display_name || agent.name,
        total_memories: agentMemories.length,
        episodic_count: agentMemories.filter(m => m.memory_type === 'episodic').length,
        semantic_count: agentMemories.filter(m => m.memory_type === 'semantic').length,
        procedural_count: agentMemories.filter(m => m.memory_type === 'procedural').length,
        working_count: agentMemories.filter(m => m.memory_type === 'working').length,
        total_size: agentMemories.reduce((sum, m) => sum + JSON.stringify(m.memory_content).length, 0),
        avg_importance: agentMemories.length > 0 
          ? agentMemories.reduce((sum, m) => sum + m.importance_score, 0) / agentMemories.length 
          : 0,
        access_frequency: agentMemories.filter(m => 
          m.last_accessed_at && new Date(m.last_accessed_at) > dayAgo
        ).length,
        expired_count: agentMemories.filter(m => 
          m.expires_at && new Date(m.expires_at) < now
        ).length,
        encrypted_count: agentMemories.filter(m => m.is_encrypted).length
      };
    }).filter(usage => usage.total_memories > 0);

    setUsageData(usage);
  };

  const generateTrends = (memories: any[]) => {
    const days = parseInt(timeRange.replace('d', ''));
    const trendData: MemoryTrend[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMemories = memories.filter(m => {
        const createdDate = new Date(m.created_at).toISOString().split('T')[0];
        return createdDate === dateStr;
      });
      
      trendData.push({
        date: dateStr,
        created: dayMemories.length,
        accessed: dayMemories.filter(m => 
          m.last_accessed_at && new Date(m.last_accessed_at).toISOString().split('T')[0] === dateStr
        ).length,
        expired: dayMemories.filter(m => 
          m.expires_at && new Date(m.expires_at).toISOString().split('T')[0] === dateStr
        ).length,
        deleted: Math.floor(Math.random() * 5) // Mock data
      });
    }
    
    setTrends(trendData);
  };

  const generateSuggestions = (memories: any[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const suggestions: OptimizationSuggestion[] = [];
    
    // Expired memories cleanup
    const expiredMemories = memories.filter(m => 
      m.expires_at && new Date(m.expires_at) < now
    );
    if (expiredMemories.length > 0) {
      suggestions.push({
        type: 'cleanup',
        severity: 'high',
        title: 'Clean up expired memories',
        description: 'Remove memories that have passed their expiration date',
        impact: 'Free up storage space and improve query performance',
        affected_count: expiredMemories.length
      });
    }

    // Low importance, rarely accessed memories
    const lowValueMemories = memories.filter(m => 
      m.importance_score <= 3 && 
      (!m.last_accessed_at || new Date(m.last_accessed_at) < oneMonthAgo)
    );
    if (lowValueMemories.length > 10) {
      suggestions.push({
        type: 'archival',
        severity: 'medium',
        title: 'Archive low-value memories',
        description: 'Move rarely accessed, low-importance memories to cold storage',
        impact: 'Improve active memory performance while preserving data',
        affected_count: lowValueMemories.length
      });
    }

    // Large memory entries
    const largeMemories = memories.filter(m => 
      JSON.stringify(m.memory_content).length > 10000
    );
    if (largeMemories.length > 5) {
      suggestions.push({
        type: 'compression',
        severity: 'medium',
        title: 'Compress large memory entries',
        description: 'Apply compression to large memory content to reduce storage usage',
        impact: 'Reduce storage costs and improve transfer speeds',
        affected_count: largeMemories.length
      });
    }

    // Unencrypted sensitive memories
    const sensitiveMemories = memories.filter(m => 
      !m.is_encrypted && (
        m.context_tags?.includes('sensitive') || 
        m.context_tags?.includes('personal') ||
        m.context_tags?.includes('private')
      )
    );
    if (sensitiveMemories.length > 0) {
      suggestions.push({
        type: 'replication',
        severity: 'high',
        title: 'Encrypt sensitive memories',
        description: 'Apply encryption to memories containing sensitive information',
        impact: 'Improve data security and compliance',
        affected_count: sensitiveMemories.length
      });
    }
    
    setSuggestions(suggestions);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return <Trash2 className="w-4 h-4" />;
      case 'archival': return <Archive className="w-4 h-4" />;
      case 'compression': return <Database className="w-4 h-4" />;
      case 'replication': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="14d">14 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {usageData.map(agent => (
              <SelectItem key={agent.agent_id} value={agent.agent_id.toString()}>
                {agent.agent_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={loadMemoryAnalytics} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {usageData.reduce((sum, agent) => sum + agent.total_memories, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Memories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {formatBytes(usageData.reduce((sum, agent) => sum + agent.total_size, 0))}
                </p>
                <p className="text-xs text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {usageData.length > 0 
                    ? (usageData.reduce((sum, agent) => sum + agent.avg_importance, 0) / usageData.length).toFixed(1)
                    : '0'
                  }
                </p>
                <p className="text-xs text-gray-600">Avg Importance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {usageData.reduce((sum, agent) => sum + agent.access_frequency, 0)}
                </p>
                <p className="text-xs text-gray-600">Daily Access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Agent Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.map(agent => {
              const maxMemories = Math.max(...usageData.map(a => a.total_memories));
              const memoryPercentage = (agent.total_memories / maxMemories) * 100;
              
              return (
                <div key={agent.agent_id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{agent.agent_name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{agent.total_memories} memories</Badge>
                      <Badge variant="outline">{formatBytes(agent.total_size)}</Badge>
                    </div>
                  </div>
                  
                  <Progress value={memoryPercentage} className="mb-3" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-blue-600 font-medium">{agent.episodic_count}</div>
                      <div className="text-gray-500">Episodic</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-medium">{agent.semantic_count}</div>
                      <div className="text-gray-500">Semantic</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-medium">{agent.procedural_count}</div>
                      <div className="text-gray-500">Procedural</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-medium">{agent.working_count}</div>
                      <div className="text-gray-500">Working</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                    <span>Avg Importance: {agent.avg_importance.toFixed(1)}</span>
                    <span>Daily Access: {agent.access_frequency}</span>
                    <span>Encrypted: {agent.encrypted_count}</span>
                    {agent.expired_count > 0 && (
                      <span className="text-red-600">Expired: {agent.expired_count}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Memory Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Memory Activity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="font-medium text-sm">
                  {new Date(trend.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-green-600">
                    +{trend.created} Created
                  </span>
                  <span className="text-blue-600">
                    {trend.accessed} Accessed
                  </span>
                  <span className="text-yellow-600">
                    {trend.expired} Expired
                  </span>
                  <span className="text-red-600">
                    {trend.deleted} Deleted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No optimization suggestions at this time</p>
              <p className="text-sm">Your memory system is running efficiently!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(suggestion.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(suggestion.type)}
                      <div>
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <p className="text-sm mt-1">{suggestion.description}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Impact:</strong> {suggestion.impact}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(suggestion.severity)}>
                        {suggestion.severity}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {suggestion.affected_count} items
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryAnalytics;
