
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Building, 
  Rocket, 
  TrendingUp, 
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  Users,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BusinessStage {
  id: number;
  stage_name: string;
  description: string;
  required_agents: string[];
  key_milestones: string[];
  estimated_duration: number;
  success_metrics: string[];
}

interface Business {
  id: number;
  business_name: string;
  current_stage_id: number;
  stage_progress: number;
  created_at: string;
  target_completion: string;
}

const BusinessLifecyclePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessStages, setBusinessStages] = useState<BusinessStage[]>([]);
  const [loading, setLoading] = useState(true);

  const stageIcons = [
    { name: 'Ideation', icon: Lightbulb, color: 'bg-blue-500', description: 'Idea generation and validation' },
    { name: 'Formation', icon: Building, color: 'bg-yellow-500', description: 'Legal structure and foundation' },
    { name: 'Launch', icon: Rocket, color: 'bg-green-500', description: 'Product launch and market entry' },
    { name: 'Growth', icon: TrendingUp, color: 'bg-purple-500', description: 'Scaling and expansion' },
    { name: 'Optimization', icon: Zap, color: 'bg-red-500', description: 'Efficiency and optimization' }
  ];

  useEffect(() => {
    loadLifecycleData();
  }, []);

  const loadLifecycleData = async () => {
    try {
      setLoading(true);
      
      // Load business stages
      const stagesResponse = await window.ezsite.apis.tablePage(37248, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: "ID",
        IsAsc: true
      });

      if (stagesResponse.error) throw stagesResponse.error;
      setBusinessStages(stagesResponse.data?.List || []);

      // Load businesses
      const businessResponse = await window.ezsite.apis.tablePage(37247, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: "ID",
        IsAsc: false
      });

      if (businessResponse.error) throw businessResponse.error;
      setBusinesses(businessResponse.data?.List || []);

    } catch (error) {
      console.error('Error loading lifecycle data:', error);
      toast({
        title: "Error",
        description: "Failed to load lifecycle data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewBusiness = async () => {
    try {
      const newBusiness = {
        business_name: `New Business ${Date.now()}`,
        current_stage_id: 1,
        stage_progress: 0,
        created_at: new Date().toISOString(),
        target_completion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months from now
      };

      const response = await window.ezsite.apis.tableCreate(37247, newBusiness);
      if (response.error) throw response.error;

      toast({
        title: "Business Created",
        description: "New business has been added to your lifecycle tracker.",
      });

      loadLifecycleData();
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create new business. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStageIcon = (stageId: number) => {
    const stage = stageIcons[Math.min(stageId - 1, stageIcons.length - 1)];
    return stage || stageIcons[0];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Business Lifecycle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Lifecycle Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Visual progression through business development phases with AI-powered guidance
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={createNewBusiness}>
            <Building className="mr-2 h-4 w-4" />
            New Business
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Lifecycle Stages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Business Development Stages</CardTitle>
          <CardDescription>
            Complete lifecycle from ideation to optimization with recommended agents and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {stageIcons.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div key={stage.name} className="flex flex-col items-center text-center max-w-xs">
                  <div className={`w-16 h-16 rounded-full ${stage.color} flex items-center justify-center text-white mb-3`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{stage.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                  <Badge variant="outline" className="text-xs">
                    Stage {index + 1}
                  </Badge>
                  {index < stageIcons.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-muted-foreground mt-4 lg:hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Businesses */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Businesses</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Stage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businesses.map((business) => {
              const currentStage = getStageIcon(business.current_stage_id || 1);
              const IconComponent = currentStage.icon;
              
              return (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${currentStage.color} bg-opacity-20`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{business.business_name || `Business ${business.id}`}</CardTitle>
                          <CardDescription>{currentStage.name} Stage</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(business.stage_progress || 0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Stage Progress</span>
                        <span>{business.stage_progress || 0}%</span>
                      </div>
                      <Progress value={business.stage_progress || 0} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">
                          {business.created_at ? new Date(business.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target:</span>
                        <p className="font-medium">
                          {business.target_completion ? new Date(business.target_completion).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Target className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Assign Agents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {businesses.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No businesses tracked yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first business to start tracking its lifecycle progression
                </p>
                <Button onClick={createNewBusiness}>
                  <Building className="mr-2 h-4 w-4" />
                  Create First Business
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Completed Businesses</h3>
              <p className="text-muted-foreground">
                Businesses that have successfully completed all lifecycle stages will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Average Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 months</div>
                <p className="text-xs text-muted-foreground mt-1">Across all stages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground mt-1">Businesses reaching optimization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Most Challenging Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">Growth</div>
                <p className="text-xs text-muted-foreground mt-1">Requires most agent support</p>
              </CardContent>
            </Card>
          </div>

          {/* Stage Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Performance Overview</CardTitle>
              <CardDescription>
                Time spent and success rates by business development stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stageIcons.map((stage, index) => (
                  <div key={stage.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <stage.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{(index + 1) * 0.8} months</div>
                        <div className="text-muted-foreground">Avg Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{95 - index * 3}%</div>
                        <div className="text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessLifecyclePage;
