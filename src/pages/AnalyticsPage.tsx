
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetric {
  id: number;
  agent_id: number;
  metric_name: string;
  metric_value: number;
  measurement_date: string;
  target_value: number;
  category: string;
}

interface BusinessMetric {
  id: number;
  business_id: number;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  previous_value: number;
}

interface TaskMetric {
  id: number;
  task_id: number;
  completion_time: number;
  quality_score: number;
  efficiency_score: number;
  recorded_at: string;
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load agent performance metrics
      const performanceResponse = await window.ezsite.apis.tablePage(37254, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "measurement_date",
        IsAsc: false
      });

      if (performanceResponse.error) throw performanceResponse.error;
      setPerformanceMetrics(performanceResponse.data?.List || []);

      // Load business metrics
      const businessResponse = await window.ezsite.apis.tablePage(37256, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "metric_date",
        IsAsc: false
      });

      if (businessResponse.error) throw businessResponse.error;
      setBusinessMetrics(businessResponse.data?.List || []);

      // Load task metrics
      const taskResponse = await window.ezsite.apis.tablePage(37255, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "recorded_at",
        IsAsc: false
      });

      if (taskResponse.error) throw taskResponse.error;
      setTaskMetrics(taskResponse.data?.List || []);

    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getMetricTrend = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return { color: 'text-green-600', icon: TrendingUp, status: 'excellent' };
    if (percentage >= 70) return { color: 'text-blue-600', icon: TrendingUp, status: 'good' };
    if (percentage >= 50) return { color: 'text-yellow-600', icon: Activity, status: 'average' };
    return { color: 'text-red-600', icon: TrendingDown, status: 'needs-attention' };
  };

  // Calculate summary statistics
  const averageTaskCompletion = taskMetrics.length > 0 
    ? taskMetrics.reduce((sum, m) => sum + (m.completion_time || 0), 0) / taskMetrics.length 
    : 0;
  
  const averageQualityScore = taskMetrics.length > 0 
    ? taskMetrics.reduce((sum, m) => sum + (m.quality_score || 0), 0) / taskMetrics.length 
    : 0;

  const totalRevenue = businessMetrics
    .filter(m => m.metric_type === 'revenue')
    .reduce((sum, m) => sum + (m.metric_value || 0), 0);

  const totalCosts = businessMetrics
    .filter(m => m.metric_type === 'costs')
    .reduce((sum, m) => sum + (m.metric_value || 0), 0);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Performance Hub</h1>
          <p className="text-muted-foreground mt-2">
            KPI tracking, agent performance metrics, and business intelligence
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +3.1% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTaskCompletion.toFixed(1)}h</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              15% faster
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(averageQualityScore * 100).toFixed(1)}%</div>
            <div className="flex items-center text-xs text-orange-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.3% quality increase
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Agent Performance</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Overview</CardTitle>
              <CardDescription>
                Individual agent metrics and performance comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Performance Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Interactive performance visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceMetrics.slice(0, 6).map((metric) => {
              const trend = getMetricTrend(metric.metric_value || 0, metric.target_value || 100);
              const TrendIcon = trend.icon;
              
              return (
                <Card key={metric.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {metric.metric_name || `Metric ${metric.id}`}
                      </CardTitle>
                      <Badge className={trend.color === 'text-green-600' ? 'bg-green-100 text-green-800' : 
                                        trend.color === 'text-red-600' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'}>
                        {trend.status}
                      </Badge>
                    </div>
                    <CardDescription>Agent {metric.agent_id} • {metric.category || 'General'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{(metric.metric_value || 0).toFixed(1)}</div>
                      <div className={`flex items-center ${trend.color}`}>
                        <TrendIcon className="mr-1 h-4 w-4" />
                        <span className="text-sm font-medium">
                          {((metric.metric_value || 0) / (metric.target_value || 100) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target: {metric.target_value || 100}</span>
                        <span>{metric.measurement_date ? new Date(metric.measurement_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <Progress value={(metric.metric_value || 0) / (metric.target_value || 100) * 100} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {performanceMetrics.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No performance metrics found</h3>
                <p className="text-muted-foreground">
                  Performance metrics will appear as agents begin executing tasks
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          {/* Business Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +24.5% vs last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCosts.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -8.2% cost reduction
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue * 100).toFixed(1) : 0}%
                </div>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5.3% improvement
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue progression and forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Revenue Trend Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Time series visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Task Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageTaskCompletion.toFixed(1)}h</div>
                <Progress value={Math.min(averageTaskCompletion / 8 * 100, 100)} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(averageQualityScore * 100).toFixed(1)}%</div>
                <Progress value={averageQualityScore * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tasks Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskMetrics.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In selected time range
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Task Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Task Performance Distribution</CardTitle>
              <CardDescription>
                Quality and efficiency scores across all completed tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Task Distribution Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Performance categorization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          {/* Cost Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCosts.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -5.2% reduction
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost per Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${taskMetrics.length > 0 ? (totalCosts / taskMetrics.length).toFixed(2) : '0.00'}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -12% optimization
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts * 100).toFixed(1) : '0.0'}%
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Strong returns
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  High efficiency
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Analysis</CardTitle>
              <CardDescription>
                Detailed cost allocation across different business areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Cost Breakdown Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Detailed cost analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
