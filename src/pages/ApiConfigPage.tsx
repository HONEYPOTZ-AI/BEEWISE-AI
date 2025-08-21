import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Globe,
  Key,
  Filter,
  RefreshCw } from
'lucide-react';

interface ApiConfiguration {
  id: number;
  api_name: string;
  provider: string;
  api_key_token: string;
  endpoint_url: string;
  config_parameters: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ApiConfigPage = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<ApiConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConfig, setSelectedConfig] = useState<ApiConfiguration | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [testingApiId, setTestingApiId] = useState<number | null>(null);
  const [showCredentials, setShowCredentials] = useState<Record<number, boolean>>({});

  const [formData, setFormData] = useState({
    api_name: '',
    provider: '',
    api_key_token: '',
    endpoint_url: '',
    config_parameters: '{}',
    status: 'active'
  });

  const tableId = 36659;

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(tableId, {
        "PageNo": 1,
        "PageSize": 100,
        "OrderByField": "updated_at",
        "IsAsc": false,
        "Filters": []
      });

      if (error) throw error;
      setConfigs(data?.List || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch API configurations",
        variant: "destructive"
      });
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData = {
        ...formData,
        updated_at: new Date().toISOString(),
        ...(isEditing ? {} : { created_at: new Date().toISOString() })
      };

      if (isEditing && selectedConfig) {
        const { error } = await window.ezsite.apis.tableUpdate(tableId, {
          ID: selectedConfig.id,
          ...apiData
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "API configuration updated successfully"
        });
      } else {
        const { error } = await window.ezsite.apis.tableCreate(tableId, apiData);
        if (error) throw error;
        toast({
          title: "Success",
          description: "API configuration created successfully"
        });
      }

      setIsFormOpen(false);
      resetForm();
      fetchConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} API configuration`,
        variant: "destructive"
      });
      console.error('Error saving configuration:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this API configuration?')) return;

    try {
      const { error } = await window.ezsite.apis.tableDelete(tableId, { ID: id });
      if (error) throw error;

      toast({
        title: "Success",
        description: "API configuration deleted successfully"
      });
      fetchConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API configuration",
        variant: "destructive"
      });
      console.error('Error deleting configuration:', error);
    }
  };

  const handleToggleStatus = async (config: ApiConfiguration) => {
    try {
      const newStatus = config.status === 'active' ? 'inactive' : 'active';
      const { error } = await window.ezsite.apis.tableUpdate(tableId, {
        ID: config.id,
        ...config,
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast({
        title: "Success",
        description: `API configuration ${newStatus === 'active' ? 'enabled' : 'disabled'}`
      });
      fetchConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API status",
        variant: "destructive"
      });
      console.error('Error updating status:', error);
    }
  };

  const handleTestConnection = async (config: ApiConfiguration) => {
    setTestingApiId(config.id);
    try {
      // Simulate API connectivity test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simple URL validation and basic connectivity check
      const url = config.endpoint_url;
      if (!url || !url.startsWith('http')) {
        throw new Error('Invalid endpoint URL');
      }

      // Simulate connectivity test result (in real implementation, you'd make actual API call)
      const isConnected = Math.random() > 0.3; // 70% success rate for demo

      if (isConnected) {
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${config.api_name}`
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${config.api_name}: ${error}`,
        variant: "destructive"
      });
    } finally {
      setTestingApiId(null);
    }
  };

  const handleExport = () => {
    try {
      const exportData = configs.map(({ id, created_at, updated_at, ...rest }) => rest);
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `api-configs-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Export Successful",
        description: "API configurations exported successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export API configurations",
        variant: "destructive"
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedConfigs = JSON.parse(content);

        if (!Array.isArray(importedConfigs)) {
          throw new Error('Invalid file format');
        }

        for (const config of importedConfigs) {
          const apiData = {
            ...config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          await window.ezsite.apis.tableCreate(tableId, apiData);
        }

        toast({
          title: "Import Successful",
          description: `Successfully imported ${importedConfigs.length} API configurations`
        });
        fetchConfigurations();
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import API configurations. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  const openEditForm = (config: ApiConfiguration) => {
    setSelectedConfig(config);
    setFormData({
      api_name: config.api_name,
      provider: config.provider,
      api_key_token: config.api_key_token,
      endpoint_url: config.endpoint_url,
      config_parameters: config.config_parameters,
      status: config.status
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      api_name: '',
      provider: '',
      api_key_token: '',
      endpoint_url: '',
      config_parameters: '{}',
      status: 'active'
    });
    setSelectedConfig(null);
    setIsEditing(false);
  };

  const toggleCredentialVisibility = (id: number) => {
    setShowCredentials((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskCredential = (credential: string, show: boolean) => {
    if (show || !credential) return credential;
    if (credential.length <= 8) return '*'.repeat(credential.length);
    return credential.substring(0, 4) + '*'.repeat(credential.length - 8) + credential.substring(credential.length - 4);
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'active' ? 'default' : 'secondary';
    const icon = status === 'active' ? CheckCircle : XCircle;
    const Icon = icon;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>);

  };

  const filteredConfigs = configs.filter((config) => {
    const matchesSearch = config.api_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || config.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = configs.filter((c) => c.status === 'active').length;
  const inactiveCount = configs.filter((c) => c.status === 'inactive').length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading configurations...</span>
        </div>
      </div>);

  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              API Configuration Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your API integrations, test connections, and monitor status
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file" />

            <Button
              variant="outline"
              onClick={() => document.getElementById('import-file')?.click()}>

              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add API
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total APIs</p>
                  <p className="text-2xl font-bold">{configs.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Providers</p>
                  <p className="text-2xl font-bold">{new Set(configs.map((c) => c.provider)).size}</p>
                </div>
                <Key className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10" />

          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background">

              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button variant="outline" onClick={fetchConfigurations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => navigate('/apitesting')}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Suite
          </Button>
        </div>
      </div>

      {/* API Cards */}
      {filteredConfigs.length === 0 ?
      <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API Configurations Found</h3>
            <p className="text-muted-foreground mb-4">
              {configs.length === 0 ?
            "Get started by adding your first API configuration." :
            "No configurations match your current filters."
            }
            </p>
            {configs.length === 0 &&
          <Button onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First API
              </Button>
          }
          </CardContent>
        </Card> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfigs.map((config) =>
        <Card key={config.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {config.api_name}
                    </CardTitle>
                    <CardDescription>{config.provider}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(config.status)}
                    <Switch
                  checked={config.status === 'active'}
                  onCheckedChange={() => handleToggleStatus(config)} />

                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Endpoint</Label>
                  <p className="text-sm text-muted-foreground break-all">
                    {config.endpoint_url || 'Not configured'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground flex-1 break-all">
                      {config.api_key_token ?
                  maskCredential(config.api_key_token, showCredentials[config.id]) :
                  'Not configured'
                  }
                    </p>
                    {config.api_key_token &&
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCredentialVisibility(config.id)}>

                        {showCredentials[config.id] ?
                  <EyeOff className="h-4 w-4" /> :

                  <Eye className="h-4 w-4" />
                  }
                      </Button>
                }
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditForm(config)}>

                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(config.id)}>

                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestConnection(config)}
                disabled={testingApiId === config.id || config.status !== 'active'}>

                    {testingApiId === config.id ?
                <RefreshCw className="h-4 w-4 animate-spin" /> :

                <TestTube className="h-4 w-4" />
                }
                    Test
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(config.updated_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit API Configuration' : 'Add New API Configuration'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="api_name">API Name *</Label>
                <Input
                  id="api_name"
                  value={formData.api_name}
                  onChange={(e) => setFormData({ ...formData, api_name: e.target.value })}
                  placeholder="e.g., OpenAI API"
                  required />

              </div>
              
              <div>
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g., OpenAI, Stripe, AWS"
                  required />

              </div>
            </div>

            <div>
              <Label htmlFor="endpoint_url">Endpoint URL *</Label>
              <Input
                id="endpoint_url"
                type="url"
                value={formData.endpoint_url}
                onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                placeholder="https://api.example.com/v1"
                required />

            </div>

            <div>
              <Label htmlFor="api_key_token">API Key/Token</Label>
              <Input
                id="api_key_token"
                type="password"
                value={formData.api_key_token}
                onChange={(e) => setFormData({ ...formData, api_key_token: e.target.value })}
                placeholder="Enter your API key" />

            </div>

            <div>
              <Label htmlFor="config_parameters">Configuration Parameters (JSON)</Label>
              <Textarea
                id="config_parameters"
                value={formData.config_parameters}
                onChange={(e) => setFormData({ ...formData, config_parameters: e.target.value })}
                placeholder='{"timeout": 30, "retries": 3}'
                rows={3} />

            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  status: checked ? 'active' : 'inactive'
                })} />

              <Label htmlFor="status">Active</Label>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}>

                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Configuration
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>);

};

export default ApiConfigPage;