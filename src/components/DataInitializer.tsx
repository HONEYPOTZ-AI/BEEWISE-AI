
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { Loader2, Database, CheckCircle } from 'lucide-react';

const DataInitializer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const initializeData = async () => {
    setLoading(true);
    
    try {
      // Create business stages
      const stages = [
        {
          name: 'Ideation',
          description: 'Business concept development and market research',
          stage_order: 1,
          typical_duration_days: 30,
          key_objectives: JSON.stringify(['Market research', 'Concept validation', 'Initial planning']),
          success_criteria: JSON.stringify(['Clear business concept', 'Market opportunity identified']),
          recommended_agents: JSON.stringify(['Startup Agent', 'Analytics Agent']),
          is_active: true
        },
        {
          name: 'Formation',
          description: 'Legal structure and financial setup',
          stage_order: 2,
          typical_duration_days: 45,
          key_objectives: JSON.stringify(['Legal incorporation', 'Financial planning', 'Initial branding']),
          success_criteria: JSON.stringify(['Business legally formed', 'Initial funding secured']),
          recommended_agents: JSON.stringify(['Legal Agent', 'Finance Agent', 'Branding Agent']),
          is_active: true
        },
        {
          name: 'Launch',
          description: 'Product development and market entry',
          stage_order: 3,
          typical_duration_days: 90,
          key_objectives: JSON.stringify(['Product development', 'Marketing campaigns', 'Initial sales']),
          success_criteria: JSON.stringify(['Product launched', 'First customers acquired']),
          recommended_agents: JSON.stringify(['Marketing Agent', 'Sales Agent']),
          is_active: true
        },
        {
          name: 'Growth',
          description: 'Scaling operations and expanding market reach',
          stage_order: 4,
          typical_duration_days: 180,
          key_objectives: JSON.stringify(['Scale operations', 'Expand market', 'Optimize processes']),
          success_criteria: JSON.stringify(['Revenue growth', 'Market expansion', 'Operational efficiency']),
          recommended_agents: JSON.stringify(['Sales Agent', 'Marketing Agent', 'Analytics Agent']),
          is_active: true
        },
        {
          name: 'Optimization',
          description: 'Process refinement and strategic planning',
          stage_order: 5,
          typical_duration_days: 365,
          key_objectives: JSON.stringify(['Process optimization', 'Strategic planning', 'Innovation']),
          success_criteria: JSON.stringify(['Optimized operations', 'Strategic roadmap', 'Sustainable growth']),
          recommended_agents: JSON.stringify(['Analytics Agent', 'Support Agent']),
          is_active: true
        }
      ];

      for (const stage of stages) {
        await apiService.createBusinessStage(stage);
      }

      // Create agent types
      const agentTypes = [
        {
          name: 'Startup Agent',
          description: 'Specialized in business model generation and niche analysis',
          category: 'core',
          is_active: true
        },
        {
          name: 'Branding Agent',
          description: 'Creates logos, names, taglines, and domain suggestions',
          category: 'specialized',
          is_active: true
        },
        {
          name: 'Legal Agent',
          description: 'Handles incorporation, contracts, and compliance',
          category: 'specialized',
          is_active: true
        },
        {
          name: 'Finance Agent',
          description: 'Manages pricing, budgeting, and revenue modeling',
          category: 'core',
          is_active: true
        },
        {
          name: 'Marketing Agent',
          description: 'Executes ads, SEO, social media, and email campaigns',
          category: 'specialized',
          is_active: true
        },
        {
          name: 'Sales Agent',
          description: 'Handles CRM, lead generation, and outreach',
          category: 'specialized',
          is_active: true
        },
        {
          name: 'Support Agent',
          description: 'Provides customer service, ticketing, and chatbot functionality',
          category: 'utility',
          is_active: true
        },
        {
          name: 'Analytics Agent',
          description: 'Tracks KPIs, creates dashboards, and provides insights',
          category: 'core',
          is_active: true
        }
      ];

      for (const agentType of agentTypes) {
        await apiService.createAgentType(agentType);
      }

      // Create some sample agents
      const agents = [
        {
          agent_type_id: 1, // Startup Agent
          name: 'startup_agent_v1',
          display_name: 'Startup Agent Pro',
          description: 'Advanced business model generation and market analysis',
          version: '1.2.0',
          status: 'active',
          memory_capacity: 2048,
          cost_per_request: 25,
          cost_per_minute: 5,
          max_concurrent_tasks: 3,
          priority_level: 8,
          metadata: JSON.stringify({ specialized_domains: ['SaaS', 'E-commerce', 'B2B'] }),
          configuration: JSON.stringify({ max_market_analysis_depth: 5 }),
          created_by: 'system'
        },
        {
          agent_type_id: 5, // Marketing Agent
          name: 'marketing_agent_v1',
          display_name: 'Marketing Automation Pro',
          description: 'Multi-channel marketing campaign management',
          version: '2.1.0',
          status: 'active',
          memory_capacity: 1536,
          cost_per_request: 20,
          cost_per_minute: 4,
          max_concurrent_tasks: 5,
          priority_level: 7,
          metadata: JSON.stringify({ channels: ['Google Ads', 'Facebook', 'LinkedIn', 'Email'] }),
          configuration: JSON.stringify({ auto_optimization: true }),
          created_by: 'system'
        },
        {
          agent_type_id: 8, // Analytics Agent
          name: 'analytics_agent_v1',
          display_name: 'Business Intelligence Engine',
          description: 'Real-time analytics and predictive insights',
          version: '1.0.5',
          status: 'active',
          memory_capacity: 4096,
          cost_per_request: 15,
          cost_per_minute: 3,
          max_concurrent_tasks: 10,
          priority_level: 9,
          metadata: JSON.stringify({ data_sources: ['GA4', 'Mixpanel', 'Custom APIs'] }),
          configuration: JSON.stringify({ real_time_processing: true }),
          created_by: 'system'
        }
      ];

      for (const agent of agents) {
        await apiService.createAgent(agent);
      }

      // Create sample subscription plans
      const subscriptionPlans = [
        {
          plan_name: 'Starter',
          plan_code: 'STARTER',
          description: 'Perfect for entrepreneurs and small startups',
          plan_type: 'basic',
          billing_frequency: 'monthly',
          price_cents: 4900,
          setup_fee_cents: 0,
          max_agents: 3,
          max_tasks_per_month: 500,
          max_businesses: 1,
          api_calls_included: 5000,
          storage_gb_included: 5,
          features: JSON.stringify(['Basic agents', 'Email support', 'Dashboard access']),
          limitations: JSON.stringify({ concurrent_tasks: 10 }),
          is_active: true,
          is_popular: false,
          trial_days: 14
        },
        {
          plan_name: 'Professional',
          plan_code: 'PROFESSIONAL',
          description: 'For growing businesses and agencies',
          plan_type: 'premium',
          billing_frequency: 'monthly',
          price_cents: 14900,
          setup_fee_cents: 0,
          max_agents: 10,
          max_tasks_per_month: 2000,
          max_businesses: 5,
          api_calls_included: 25000,
          storage_gb_included: 50,
          features: JSON.stringify(['All agents', 'Priority support', 'Advanced analytics', 'Custom integrations']),
          limitations: JSON.stringify({ concurrent_tasks: 50 }),
          is_active: true,
          is_popular: true,
          trial_days: 30
        },
        {
          plan_name: 'Enterprise',
          plan_code: 'ENTERPRISE',
          description: 'For large organizations and enterprises',
          plan_type: 'enterprise',
          billing_frequency: 'yearly',
          price_cents: 499900,
          setup_fee_cents: 999900,
          max_agents: -1, // Unlimited
          max_tasks_per_month: -1, // Unlimited
          max_businesses: -1, // Unlimited
          api_calls_included: -1, // Unlimited
          storage_gb_included: 1000,
          features: JSON.stringify(['Unlimited agents', '24/7 support', 'Custom development', 'SLA guarantee']),
          limitations: JSON.stringify({}),
          is_active: true,
          is_popular: false,
          trial_days: 60
        }
      ];

      for (const plan of subscriptionPlans) {
        await apiService.createSubscriptionPlan(plan);
      }

      setInitialized(true);
      toast({
        title: 'Success',
        description: 'Sample data initialized successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize sample data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Initialize Sample Data
        </CardTitle>
        <CardDescription>
          Load sample data to populate the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initialized ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Sample data loaded successfully
          </div>
        ) : (
          <Button 
            onClick={initializeData} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize Data'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DataInitializer;
