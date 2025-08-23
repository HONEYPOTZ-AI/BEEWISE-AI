
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Lightbulb,
  Rocket,
  Target,
  BarChart3,
  CheckCircle2 } from
'lucide-react';

interface Business {
  id: number;
  name: string;
  description: string;
  industry: string;
  stage: string;
  status: string;
  progress: number;
  revenue: number;
  employees: number;
  created_at: string;
  target_market: string;
  business_model: string;
}

interface BusinessFormData {
  name: string;
  description: string;
  industry: string;
  target_market: string;
  business_model: string;
}

const BusinessDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLifecycleDialogOpen, setIsLifecycleDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<BusinessFormData>({
    defaultValues: {
      name: '',
      description: '',
      industry: '',
      target_market: '',
      business_model: ''
    }
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(37247, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      const formattedBusinesses = data.List.map((business: any) => ({
        id: business.id,
        name: business.name,
        description: business.description || '',
        industry: business.industry || '',
        stage: business.current_stage || 'ideation',
        status: business.status || 'active',
        progress: business.progress || 25,
        revenue: business.revenue || 0,
        employees: business.employees || 1,
        created_at: business.created_at,
        target_market: business.target_market || '',
        business_model: business.business_model || ''
      }));

      setBusinesses(formattedBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
      toast({
        title: "Error",
        description: "Failed to load businesses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (data: BusinessFormData) => {
    try {
      const { error } = await window.ezsite.apis.tableCreate(37247, {
        name: data.name,
        description: data.description,
        industry: data.industry,
        target_market: data.target_market,
        business_model: data.business_model,
        current_stage: 'ideation',
        status: 'active',
        progress: 10,
        revenue: 0,
        employees: 1
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business created successfully"
      });

      setIsCreateDialogOpen(false);
      form.reset();
      loadBusinesses();
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        title: "Error",
        description: "Failed to create business",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBusiness = async (data: BusinessFormData) => {
    if (!selectedBusiness) return;

    try {
      const { error } = await window.ezsite.apis.tableUpdate(37247, {
        id: selectedBusiness.id,
        name: data.name,
        description: data.description,
        industry: data.industry,
        target_market: data.target_market,
        business_model: data.business_model
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business updated successfully"
      });

      setIsEditDialogOpen(false);
      setSelectedBusiness(null);
      form.reset();
      loadBusinesses();
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBusiness = async (businessId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(37247, { id: businessId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business deleted successfully"
      });

      loadBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive"
      });
    }
  };

  const handleStageTransition = async (businessId: number, newStage: string, newProgress: number) => {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(37247, {
        id: businessId,
        current_stage: newStage,
        progress: newProgress
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Business moved to ${newStage} stage`
      });

      loadBusinesses();
      setIsLifecycleDialogOpen(false);
    } catch (error) {
      console.error('Error updating business stage:', error);
      toast({
        title: "Error",
        description: "Failed to update business stage",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (business: Business) => {
    setSelectedBusiness(business);
    form.setValue('name', business.name);
    form.setValue('description', business.description);
    form.setValue('industry', business.industry);
    form.setValue('target_market', business.target_market);
    form.setValue('business_model', business.business_model);
    setIsEditDialogOpen(true);
  };

  const openLifecycleDialog = (business: Business) => {
    setSelectedBusiness(business);
    setIsLifecycleDialogOpen(true);
  };

  const getStageInfo = (stage: string) => {
    const stages = {
      ideation: { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-500', name: 'Ideation', progress: 20 },
      formation: { icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500', name: 'Formation', progress: 40 },
      launch: { icon: Rocket, color: 'text-orange-500', bg: 'bg-orange-500', name: 'Launch', progress: 60 },
      growth: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500', name: 'Growth', progress: 80 },
      optimization: { icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500', name: 'Optimization', progress: 100 }
    };
    return stages[stage as keyof typeof stages] || stages.ideation;
  };

  const getNextStage = (currentStage: string) => {
    const stageOrder = ['ideation', 'formation', 'launch', 'growth', 'optimization'];
    const currentIndex = stageOrder.indexOf(currentStage);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading businesses...</div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Lifecycle</h2>
          <p className="text-muted-foreground">Manage autonomous business operations</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Business
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Business</DialogTitle>
              <DialogDescription>
                Start a new autonomous business venture
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateBusiness)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Business name is required' }}
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the business concept" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <FormField
                  control={form.control}
                  name="industry"
                  rules={{ required: 'Industry is required' }}
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <FormField
                  control={form.control}
                  name="target_market"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Target Market</FormLabel>
                      <FormControl>
                        <Input placeholder="Define your target audience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <FormField
                  control={form.control}
                  name="business_model"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel>Business Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SaaS">Software as a Service</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="Subscription">Subscription</SelectItem>
                          <SelectItem value="Freemium">Freemium</SelectItem>
                          <SelectItem value="B2B">Business to Business</SelectItem>
                          <SelectItem value="B2C">Business to Consumer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  } />

                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Business</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Businesses</p>
                <p className="text-2xl font-bold">{businesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Businesses</p>
                <p className="text-2xl font-bold">{businesses.filter((b) => b.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">${businesses.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Employees</p>
                <p className="text-2xl font-bold">{businesses.reduce((sum, b) => sum + b.employees, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((business) => {
          const stageInfo = getStageInfo(business.stage);
          const StageIcon = stageInfo.icon;
          const nextStage = getNextStage(business.stage);

          return (
            <Card key={business.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {business.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <StageIcon className={`h-3 w-3 ${stageInfo.color}`} />
                    {stageInfo.name}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {business.industry}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{business.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{business.progress}%</span>
                  </div>
                  <Progress value={business.progress} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Revenue</p>
                    <p className="text-muted-foreground">${business.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Employees</p>
                    <p className="text-muted-foreground">{business.employees}</p>
                  </div>
                </div>
                
                {business.business_model &&
                <div>
                    <p className="text-sm font-medium">Business Model</p>
                    <Badge variant="outline" className="text-xs">
                      {business.business_model}
                    </Badge>
                  </div>
                }
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(business)}>

                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openLifecycleDialog(business)}>

                      <Target className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {nextStage &&
                  <Button
                    size="sm"
                    onClick={() => handleStageTransition(business.id, nextStage, getStageInfo(nextStage).progress)}
                    className="gap-1">

                      Next Stage
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  }
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteBusiness(business.id)}>

                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>);

        })}
      </div>

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
            <DialogDescription>Update business information</DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateBusiness)} className="space-y-4">
              {/* Same form fields as create */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Business name is required' }}
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />

              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) =>
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the business concept" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                } />

              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Business</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Business Lifecycle Dialog */}
      <Dialog open={isLifecycleDialogOpen} onOpenChange={setIsLifecycleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Lifecycle Management</DialogTitle>
            <DialogDescription>
              {selectedBusiness?.name} - Current Stage: {selectedBusiness ? getStageInfo(selectedBusiness.stage).name : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Lifecycle Stages */}
            <div className="space-y-4">
              {[
              { stage: 'ideation', name: 'Ideation', description: 'Business concept and market validation' },
              { stage: 'formation', name: 'Formation', description: 'Legal setup and initial structure' },
              { stage: 'launch', name: 'Launch', description: 'Product development and market entry' },
              { stage: 'growth', name: 'Growth', description: 'Scaling operations and expanding market' },
              { stage: 'optimization', name: 'Optimization', description: 'Efficiency improvements and innovation' }].
              map(({ stage, name, description }) => {
                const stageInfo = getStageInfo(stage);
                const StageIcon = stageInfo.icon;
                const isCurrentStage = selectedBusiness?.stage === stage;
                const isCompleted = selectedBusiness && getStageInfo(selectedBusiness.stage).progress > stageInfo.progress;

                return (
                  <div key={stage} className={`flex items-center space-x-3 p-3 rounded-lg border ${isCurrentStage ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500' : isCurrentStage ? stageInfo.bg : 'bg-gray-200'}`}>
                      {isCompleted ?
                      <CheckCircle2 className="h-4 w-4 text-white" /> :

                      <StageIcon className={`h-4 w-4 ${isCurrentStage ? 'text-white' : 'text-gray-500'}`} />
                      }
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    
                    {!isCompleted && !isCurrentStage &&
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectedBusiness && handleStageTransition(selectedBusiness.id, stage, stageInfo.progress)}>

                        Move Here
                      </Button>
                    }
                    
                    {isCurrentStage &&
                    <Badge>Current</Badge>
                    }
                    
                    {isCompleted &&
                    <Badge variant="secondary">Completed</Badge>
                    }
                  </div>);

              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {businesses.length === 0 &&
      <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first autonomous business to begin your journey.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Business
            </Button>
          </CardContent>
        </Card>
      }
    </div>);

};

export default BusinessDashboard;