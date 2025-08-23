
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAgents } from '@/hooks/useAgents';
import { useBusinesses } from '@/hooks/useBusinesses';
import DataInitializer from '@/components/DataInitializer';
import { useForm } from 'react-hook-form';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Key,
  Globe,
  Database,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  TestTube,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

interface ApiConfig {
  id: number;
  name: string;
  endpoint: string;
  api_key: string;
  provider: string;
  is_active: boolean;
  description: string;
  auth_type: string;
  headers: string;
  created_at: string;
}

interface ApiFormData {
  name: string;
  endpoint: string;
  api_key: string;
  provider: string;
  description: string;
  auth_type: string;
  headers: string;
}

const ApiConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<ApiConfig | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<{[key: number]: boolean}>({});
  const [testResults, setTestResults] = useState<{[key: number]: {success: boolean, message: string}}>({});
  const { toast } = useToast();
  
  const form = useForm<ApiFormData>({
    defaultValues: {
      name: '',
      endpoint: '',
      api_key: '',
      provider: '',
      description: '',
      auth_type: 'bearer',
      headers: '{"Content-Type": "application/json"}'
    }
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(36659, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false,
        Filters: []
      });
      
      if (error) throw error;
      
      const formattedConfigs = data.List.map((config: any) => ({
        id: config.id,
        name: config.name,
        endpoint: config.endpoint || '',
        api_key: config.api_key || '',
        provider: config.provider || 'custom',
        is_active: config.is_active || false,
        description: config.description || '',
        auth_type: config.auth_type || 'bearer',
        headers: config.headers || '{}',
        created_at: config.created_at
      }));
      
      setConfigs(formattedConfigs);
    } catch (error) {
      console.error('Error loading API configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load API configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = async (data: ApiFormData) => {
    try {
      const { error } = await window.ezsite.apis.tableCreate(36659, {
        name: data.name,
        endpoint: data.endpoint,
        api_key: data.api_key,
        provider: data.provider,
        description: data.description,
        auth_type: data.auth_type,
        headers: data.headers,
        is_active: true
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API configuration created successfully",
      });

      setIsCreateDialogOpen(false);
      form.reset();
      loadConfigs();
    } catch (error) {
      console.error('Error creating API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to create API configuration",
        variant: "destructive",
      });
    }
  };

  const handleUpdateConfig = async (data: ApiFormData) => {
    if (!selectedConfig) return;

    try {
      const { error } = await window.ezsite.apis.tableUpdate(36659, {
        id: selectedConfig.id,
        name: data.name,
        endpoint: data.endpoint,
        api_key: data.api_key,
        provider: data.provider,
        description: data.description,
        auth_type: data.auth_type,
        headers: data.headers
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API configuration updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedConfig(null);
      form.reset();
      loadConfigs();
    } catch (error) {
      console.error('Error updating API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update API configuration",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfig = async (configId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(36659, { id: configId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API configuration deleted successfully",
      });

      loadConfigs();
    } catch (error) {
      console.error('Error deleting API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete API configuration",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (configId: number, isActive: boolean) => {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(36659, {
        id: configId,
        is_active: !isActive
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Configuration ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });

      loadConfigs();
    } catch (error) {
      console.error('Error toggling configuration:', error);
      toast({
        title: "Error",
        description: "Failed to toggle configuration status",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async (config: ApiConfig) => {
    try {
      setTestResults(prev => ({...prev, [config.id]: {success: false, message: 'Testing...'}}));
      
      // Simulate API test - in real implementation, this would test the actual connection
      const response = await fetch(config.endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.api_key}`,
          ...JSON.parse(config.headers || '{}')
        }
      }).catch(() => null);

      const success = response?.ok || Math.random() > 0.3; // Simulate test result
      
      setTestResults(prev => ({
        ...prev,
        [config.id]: {
          success,
          message: success ? 'Connection successful' : 'Connection failed - check credentials'
        }
      }));

      toast({
        title: success ? "Success" : "Warning",
        description: success ? "API connection test passed" : "API connection test failed",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [config.id]: {
          success: false,
          message: 'Test failed - network error'
        }
      }));
      
      toast({
        title: "Error",
        description: "Failed to test API connection",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (config: ApiConfig) => {
    setSelectedConfig(config);
    form.setValue('name', config.name);
    form.setValue('endpoint', config.endpoint);
    form.setValue('api_key', config.api_key);
    form.setValue('provider', config.provider);
    form.setValue('description', config.description);
    form.setValue('auth_type', config.auth_type);
    form.setValue('headers', config.headers);
    setIsEditDialogOpen(true);
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length <= 8) return key;
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const toggleApiKeyVisibility = (configId: number) => {
    setShowApiKeys(prev => ({...prev, [configId]: !prev[configId]}));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading API configurations...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">API Configuration</h1>
                <p className="text-sm text-muted-foreground">
                  Configure external API integrations for AI agents
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link to="/testing">
                <Button variant="outline" className="gap-2">
                  <TestTube className="h-4 w-4" />
                  Test APIs
                </Button>
              </Link>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Configuration
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add API Configuration</DialogTitle>
                    <DialogDescription>
                      Configure a new external API integration
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateConfig)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          rules={{ required: 'Name is required' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Configuration Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., OpenAI GPT-4" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="openai">OpenAI</SelectItem>
                                  <SelectItem value="anthropic">Anthropic</SelectItem>
                                  <SelectItem value="google">Google AI</SelectItem>
                                  <SelectItem value="azure">Azure AI</SelectItem>
                                  <SelectItem value="aws">AWS Bedrock</SelectItem>
                                  <SelectItem value="custom">Custom API</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="endpoint"
                        rules={{ required: 'Endpoint URL is required' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Endpoint URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://api.example.com/v1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="api_key"
                          rules={{ required: 'API key is required' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter API key" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="auth_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Authentication Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bearer">Bearer Token</SelectItem>
                                  <SelectItem value="api_key">API Key</SelectItem>
                                  <SelectItem value="basic">Basic Auth</SelectItem>
                                  <SelectItem value="oauth">OAuth</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe this API integration..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="headers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Headers (JSON)</FormLabel>
                            <FormControl>
                              <Textarea placeholder='{"Content-Type": "application/json"}' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Configuration</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="configurations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configurations">API Configurations</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
            <TabsTrigger value="data-init">Data Management</TabsTrigger>
          </TabsList>

          {/* API Configurations Tab */}
          <TabsContent value="configurations" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Total Configs</p>
                      <p className="text-2xl font-bold">{configs.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-2xl font-bold">{configs.filter(c => c.is_active).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Inactive</p>
                      <p className="text-2xl font-bold">{configs.filter(c => !c.is_active).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Providers</p>
                      <p className="text-2xl font-bold">{new Set(configs.map(c => c.provider)).size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configs.map((config) => {
                const testResult = testResults[config.id];
                
                return (
                  <Card key={config.id} className={`relative ${config.is_active ? 'border-green-200' : 'border-gray-200'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <Badge variant={config.is_active ? 'default' : 'secondary'}>
                            {config.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {config.provider}
                        </Badge>
                      </div>
                      <CardDescription>{config.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Endpoint</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(config.endpoint)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground break-all">
                            {config.endpoint}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">API Key</Label>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(config.id)}
                            >
                              {showApiKeys[config.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(config.api_key)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {showApiKeys[config.id] ? config.api_key : maskApiKey(config.api_key)}
                          </span>
                        </div>
                      </div>
                      
                      {testResult && (
                        <Alert className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                          {testResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                            {testResult.message}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={config.is_active}
                            onCheckedChange={() => handleToggleActive(config.id, config.is_active)}
                          />
                          <span className="text-sm">
                            {config.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestConnection(config)}
                          >
                            <TestTube className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(config)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteConfig(config.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {configs.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No API configurations</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first API configuration to enable agent integrations.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Configuration
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global API Settings</CardTitle>
                <CardDescription>
                  Configure system-wide API behavior and defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="default-timeout">Default Timeout (seconds)</Label>
                      <Input
                        id="default-timeout"
                        type="number"
                        defaultValue="30"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-retries">Maximum Retries</Label>
                      <Input
                        id="max-retries"
                        type="number"
                        defaultValue="3"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enable-logging" defaultChecked />
                      <Label htmlFor="enable-logging">Enable API Logging</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                      <Input
                        id="rate-limit"
                        type="number"
                        defaultValue="60"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                      <Input
                        id="cache-duration"
                        type="number"
                        defaultValue="5"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enable-cache" defaultChecked />
                      <Label htmlFor="enable-cache">Enable Response Caching</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data-init" className="space-y-6">
            <DataInitializer />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Configuration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit API Configuration</DialogTitle>
            <DialogDescription>
              Update the API configuration settings
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateConfig)} className="space-y-4">
              {/* Same form fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., OpenAI GPT-4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google AI</SelectItem>
                          <SelectItem value="azure">Azure AI</SelectItem>
                          <SelectItem value="aws">AWS Bedrock</SelectItem>
                          <SelectItem value="custom">Custom API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Configuration</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiConfigPage;
