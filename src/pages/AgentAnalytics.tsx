
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw } from
'lucide-react';

interface AnalyticsData {
  totalAgents: number;
  activeAgents: number;
  totalRevenue: number;
  totalTasks: number;
  avgResponseTime: number;
  topPerformingAgents: Array<{
    id: number;
    name: string;
    type: string;
    tasks: number;
    revenue: number;
    success_rate: number;
    rating: number;
  }>;
  agentTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: Array<{
    date: string;
    tasks: number;
    revenue: number;
    success_rate: number;
  }>;
  recentActivity: Array<{
    id: number;
    agent_name: string;
    action: string;
    timestamp: string;
    status: string;
  }>;
}

const AgentAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('tasks');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch agents data
      const { data: agentsData } = await window.ezsite.apis.tablePage(37238, {
        PageNo: 1,
        PageSize: 100
      });

      // Fetch performance data
      const { data: performanceData } = await window.ezsite.apis.tablePage(37254, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'created_at',
        IsAsc: false
      });

      // Fetch business metrics
      const { data: businessMetricsData } = await window.ezsite.apis.tablePage(37256, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'created_at',
        IsAsc: false
      });

      // Process data for analytics
      const agents = agentsData?.List || [];
      const activeAgents = agents.filter((agent: any) => agent.status === 'active');

      // Calculate aggregated metrics
      const totalRevenue = agents.reduce((sum: number, agent: any) => sum + (agent.revenue || 0), 0);
      const totalTasks = agents.reduce((sum: number, agent: any) => sum + (agent.total_tasks || 0), 0);

      // Get top performing agents
      const topPerformingAgents = agents.
      sort((a: any, b: any) => (b.success_rate || 0) - (a.success_rate || 0)).
      slice(0, 10).
      map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        type: agent.agent_type,
        tasks: agent.total_tasks || 0,
        revenue: agent.revenue || 0,
        success_rate: agent.success_rate || 0,
        rating: agent.rating || 0
      }));

      // Calculate agent type distribution
      const typeDistribution: {[key: string]: number;} = {};
      agents.forEach((agent: any) => {
        const type = agent.agent_type || 'Unknown';
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      });

      const agentTypeDistribution = Object.entries(typeDistribution).map(([type, count]) => ({
        type,
        count,
        percentage: count / agents.length * 100
      }));

      // Generate mock performance metrics for the last 30 days
      const performanceMetrics = Array.from({ length: 30 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));
        return {
          date: date.toISOString().split('T')[0],
          tasks: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          success_rate: Math.floor(Math.random() * 20) + 80
        };
      });

      // Generate recent activity
      const recentActivity = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        agent_name: `Agent ${Math.floor(Math.random() * 20) + 1}`,
        action: ['Task Completed', 'Agent Deployed', 'Configuration Updated', 'Performance Alert'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        status: ['success', 'pending', 'warning', 'error'][Math.floor(Math.random() * 4)]
      }));

      setAnalyticsData({
        totalAgents: agents.length,
        activeAgents: activeAgents.length,
        totalRevenue,
        totalTasks,
        avgResponseTime: 1.4,
        topPerformingAgents,
        agentTypeDistribution,
        performanceMetrics,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) =>
  <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change &&
          <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {Math.abs(change)}% from last month
              </div>
          }
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>;


  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) =>
              <div key={index} className="h-32 bg-muted rounded" />
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-muted rounded" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/agent-marketplace">
                <Button variant="ghost" size="sm" className="bg-white text-[#030507]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Agent Analytics</h1>
                <p className="text-muted-foreground">Performance insights and marketplace metrics</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white text-[#030507]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchAnalyticsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Agents"
            value={analyticsData.totalAgents}
            change={12}
            icon={Users}
            color="bg-blue-500" />

          <MetricCard
            title="Active Agents"
            value={analyticsData.activeAgents}
            change={8}
            icon={Activity}
            color="bg-green-500" />

          <MetricCard
            title="Total Revenue"
            value={`$${analyticsData.totalRevenue.toLocaleString()}`}
            change={15}
            icon={DollarSign}
            color="bg-purple-500" />

          <MetricCard
            title="Avg Response Time"
            value={`${analyticsData.avgResponseTime}s`}
            change={-5}
            icon={Clock}
            color="bg-orange-500" />

        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="agents">Top Agents</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Agent Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.agentTypeDistribution.map((item, index) =>
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.type}</span>
                          <span>{item.count} agents ({item.percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <Badge variant="secondary">{analyticsData.totalTasks} total</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-end justify-center p-4">
                      <div className="text-sm text-muted-foreground">
                        Performance chart visualization would go here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </div>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasks">Tasks Completed</SelectItem>
                      <SelectItem value="revenue">Revenue Generated</SelectItem>
                      <SelectItem value="success_rate">Success Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Performance chart visualization</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMetric.replace('_', ' ')} over the last {timeRange}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.topPerformingAgents.map((agent, index) =>
                    <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{agent.type}</Badge>
                        </TableCell>
                        <TableCell>{agent.tasks}</TableCell>
                        <TableCell>${agent.revenue}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={agent.success_rate} className="h-2 w-16" />
                            <span className="text-sm">{agent.success_rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            ⭐ {agent.rating.toFixed(1)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity) =>
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`
                      } />
                        <div>
                          <div className="font-medium">{activity.agent_name}</div>
                          <div className="text-sm text-muted-foreground">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default AgentAnalytics;