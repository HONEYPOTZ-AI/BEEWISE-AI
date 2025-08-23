
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Bot,
  Plus,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles } from
'lucide-react';

interface AgentType {
  id: number;
  name: string;
  description: string;
}

interface Capability {
  id: number;
  name: string;
  description: string;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  version: string;
}

interface AgentFormData {
  name: string;
  description: string;
  agent_type_id: string;
  price_per_hour: number;
  capabilities: string[];
  tools: string[];
  custom_capabilities: Array<{name: string;description: string;proficiency: number;}>;
  custom_tools: Array<{name: string;description: string;version: string;}>;
  api_endpoint?: string;
  authentication_method?: string;
  configuration_json?: string;
}

const AgentOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([]);
  const [availableCapabilities, setAvailableCapabilities] = useState<Capability[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    agent_type_id: '',
    price_per_hour: 0,
    capabilities: [],
    tools: [],
    custom_capabilities: [],
    custom_tools: [],
    api_endpoint: '',
    authentication_method: 'none',
    configuration_json: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch agent types
      const { data: typesData } = await window.ezsite.apis.tablePage(37237, {
        PageNo: 1,
        PageSize: 50
      });
      setAgentTypes(typesData?.List || []);

      // Fetch capabilities
      const { data: capData } = await window.ezsite.apis.tablePage(37239, {
        PageNo: 1,
        PageSize: 100
      });
      setAvailableCapabilities(capData?.List || []);

      // Fetch tools
      const { data: toolData } = await window.ezsite.apis.tablePage(37240, {
        PageNo: 1,
        PageSize: 100
      });
      setAvailableTools(toolData?.List || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomCapability = () => {
    setFormData((prev) => ({
      ...prev,
      custom_capabilities: [
      ...prev.custom_capabilities,
      { name: '', description: '', proficiency: 50 }]

    }));
  };

  const updateCustomCapability = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      custom_capabilities: prev.custom_capabilities.map((cap, i) =>
      i === index ? { ...cap, [field]: value } : cap
      )
    }));
  };

  const removeCustomCapability = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      custom_capabilities: prev.custom_capabilities.filter((_, i) => i !== index)
    }));
  };

  const addCustomTool = () => {
    setFormData((prev) => ({
      ...prev,
      custom_tools: [
      ...prev.custom_tools,
      { name: '', description: '', version: '1.0' }]

    }));
  };

  const updateCustomTool = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      custom_tools: prev.custom_tools.map((tool, i) =>
      i === index ? { ...tool, [field]: value } : tool
      )
    }));
  };

  const removeCustomTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      custom_tools: prev.custom_tools.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create agent
      const agentData = {
        name: formData.name,
        description: formData.description,
        agent_type: agentTypes.find((t) => t.id.toString() === formData.agent_type_id)?.name || '',
        status: 'pending',
        price_per_hour: formData.price_per_hour,
        rating: 0,
        total_tasks: 0,
        success_rate: 0,
        api_endpoint: formData.api_endpoint,
        authentication_method: formData.authentication_method,
        configuration_json: formData.configuration_json
      };

      const { data: newAgent, error } = await window.ezsite.apis.tableCreate(37238, agentData);
      if (error) throw error;

      const agentId = newAgent || Date.now(); // Fallback for demo

      // Add capabilities
      for (const capId of formData.capabilities) {
        await window.ezsite.apis.tableCreate(37241, {
          agent_id: agentId,
          capability_id: parseInt(capId),
          capability_name: availableCapabilities.find((c) => c.id.toString() === capId)?.name || '',
          proficiency_level: 85
        });
      }

      // Add custom capabilities
      for (const customCap of formData.custom_capabilities) {
        if (customCap.name.trim()) {
          await window.ezsite.apis.tableCreate(37241, {
            agent_id: agentId,
            capability_name: customCap.name,
            proficiency_level: customCap.proficiency,
            description: customCap.description
          });
        }
      }

      // Add tools
      for (const toolId of formData.tools) {
        await window.ezsite.apis.tableCreate(37242, {
          agent_id: agentId,
          tool_id: parseInt(toolId),
          tool_name: availableTools.find((t) => t.id.toString() === toolId)?.name || ''
        });
      }

      // Add custom tools
      for (const customTool of formData.custom_tools) {
        if (customTool.name.trim()) {
          await window.ezsite.apis.tableCreate(37242, {
            agent_id: agentId,
            tool_name: customTool.name,
            description: customTool.description,
            version: customTool.version
          });
        }
      }

      toast({
        title: 'Success!',
        description: 'Your agent has been submitted for review and will be available in the marketplace shortly.'
      });

      navigate('/agent-marketplace');
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit agent. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.agent_type_id;
      case 2:
        return formData.capabilities.length > 0 || formData.custom_capabilities.some((c) => c.name);
      case 3:
        return formData.tools.length > 0 || formData.custom_tools.some((t) => t.name);
      case 4:
        return formData.price_per_hour > 0;
      default:
        return false;
    }
  };

  const renderStep1 = () =>
  <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name *</Label>
          <Input
          id="name"
          placeholder="Enter agent name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)} />

        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
          id="description"
          placeholder="Describe what your agent does and its key features"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4} />

        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Agent Type *</Label>
          <Select value={formData.agent_type_id} onValueChange={(value) => handleInputChange('agent_type_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select agent type" />
            </SelectTrigger>
            <SelectContent>
              {agentTypes.map((type) =>
            <SelectItem key={type.id} value={type.id.toString()}>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
            )}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Getting Started</p>
              <p>Choose a descriptive name and provide a clear description of your agent's capabilities. This information will help users understand what your agent can do.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;


  const renderStep2 = () =>
  <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Capabilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Select Existing Capabilities</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {availableCapabilities.map((capability) =>
          <div key={capability.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
              id={`capability-${capability.id}`}
              checked={formData.capabilities.includes(capability.id.toString())}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleInputChange('capabilities', [...formData.capabilities, capability.id.toString()]);
                } else {
                  handleInputChange('capabilities', formData.capabilities.filter((id) => id !== capability.id.toString()));
                }
              }} />

                <div className="flex-1">
                  <Label htmlFor={`capability-${capability.id}`} className="font-medium cursor-pointer">
                    {capability.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              </div>
          )}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">Custom Capabilities</Label>
            <Button type="button" variant="outline" size="sm" onClick={addCustomCapability}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom
            </Button>
          </div>

          <div className="space-y-4">
            {formData.custom_capabilities.map((capability, index) =>
          <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Custom Capability #{index + 1}</h4>
                  <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomCapability(index)}>

                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                  placeholder="Capability name"
                  value={capability.name}
                  onChange={(e) => updateCustomCapability(index, 'name', e.target.value)} />

                  </div>
                  <div>
                    <Label>Proficiency Level (%)</Label>
                    <Input
                  type="number"
                  min="0"
                  max="100"
                  value={capability.proficiency}
                  onChange={(e) => updateCustomCapability(index, 'proficiency', parseInt(e.target.value) || 0)} />

                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                placeholder="Describe this capability"
                value={capability.description}
                onChange={(e) => updateCustomCapability(index, 'description', e.target.value)}
                rows={2} />

                </div>
              </div>
          )}
          </div>
        </div>
      </CardContent>
    </Card>;


  const renderStep3 = () =>
  <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Tools & Integrations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Select Available Tools</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {availableTools.map((tool) =>
          <div key={tool.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
              id={`tool-${tool.id}`}
              checked={formData.tools.includes(tool.id.toString())}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleInputChange('tools', [...formData.tools, tool.id.toString()]);
                } else {
                  handleInputChange('tools', formData.tools.filter((id) => id !== tool.id.toString()));
                }
              }} />

                <div className="flex-1">
                  <Label htmlFor={`tool-${tool.id}`} className="font-medium cursor-pointer">
                    {tool.name}
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">v{tool.version}</Badge>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </div>
          )}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">Custom Tools</Label>
            <Button type="button" variant="outline" size="sm" onClick={addCustomTool}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom
            </Button>
          </div>

          <div className="space-y-4">
            {formData.custom_tools.map((tool, index) =>
          <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Custom Tool #{index + 1}</h4>
                  <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomTool(index)}>

                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Tool Name</Label>
                    <Input
                  placeholder="Tool name"
                  value={tool.name}
                  onChange={(e) => updateCustomTool(index, 'name', e.target.value)} />

                  </div>
                  <div>
                    <Label>Version</Label>
                    <Input
                  placeholder="1.0"
                  value={tool.version}
                  onChange={(e) => updateCustomTool(index, 'version', e.target.value)} />

                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                placeholder="Describe this tool and its integration"
                value={tool.description}
                onChange={(e) => updateCustomTool(index, 'description', e.target.value)}
                rows={2} />

                </div>
              </div>
          )}
          </div>
        </div>
      </CardContent>
    </Card>;


  const renderStep4 = () =>
  <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Configuration & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price per Hour (USD) *</Label>
          <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.price_per_hour}
          onChange={(e) => handleInputChange('price_per_hour', parseFloat(e.target.value) || 0)} />

          <p className="text-sm text-muted-foreground">
            Set a competitive price for your agent. This will be displayed in the marketplace.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Technical Configuration (Optional)</h3>
          
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input
            id="api-endpoint"
            placeholder="https://api.youragent.com/v1"
            value={formData.api_endpoint}
            onChange={(e) => handleInputChange('api_endpoint', e.target.value)} />

          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-method">Authentication Method</Label>
            <Select
            value={formData.authentication_method}
            onValueChange={(value) => handleInputChange('authentication_method', value)}>

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="api-key">API Key</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                <SelectItem value="bearer-token">Bearer Token</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="config-json">Configuration JSON</Label>
            <Textarea
            id="config-json"
            placeholder="Additional configuration in JSON format"
            value={formData.configuration_json}
            onChange={(e) => handleInputChange('configuration_json', e.target.value)}
            rows={4} />

          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-medium mb-1">Ready to Submit</p>
              <p>Your agent will be reviewed by our team and made available in the marketplace within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/agent-marketplace">
                <Button variant="ghost" size="sm" className="bg-black text-[#65758b]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Add New Agent</h1>
                <p className="text-muted-foreground">Submit your AI agent to the BEEWISE-AI marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) =>
              <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ?
                'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'}`
                }>
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 4 &&
                <div className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-muted'}`
                } />
                }
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </div>
          </div>
          <Progress value={currentStep / 4 * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}>

              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStep < 4 ?
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}>

                  Next Step
                </Button> :

              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(4) || loading}
                className="min-w-32">

                  {loading ?
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> :

                'Submit Agent'
                }
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default AgentOnboarding;