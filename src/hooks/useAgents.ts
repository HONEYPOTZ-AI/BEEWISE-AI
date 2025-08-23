
import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentType, QueryParams } from '@/types/database';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const useAgents = (params?: QueryParams) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [agentsResponse, agentTypesResponse] = await Promise.all([
      apiService.getAgents(params),
      apiService.getAgentTypes({ PageSize: 100 })]
      );

      if (agentsResponse.error) {
        throw new Error(agentsResponse.error);
      }

      if (agentTypesResponse.error) {
        throw new Error(agentTypesResponse.error);
      }

      if (agentsResponse.data) {
        setAgents(agentsResponse.data.List);
        setTotalCount(agentsResponse.data.VirtualCount);
      }

      if (agentTypesResponse.data) {
        setAgentTypes(agentTypesResponse.data.List);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  const createAgent = useCallback(async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiService.createAgent(agentData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Agent created successfully'
      });

      fetchAgents(); // Refresh the list
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create agent';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchAgents, toast]);

  const updateAgent = useCallback(async (agentData: Agent) => {
    try {
      const response = await apiService.updateAgent(agentData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Agent updated successfully'
      });

      fetchAgents(); // Refresh the list
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update agent';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchAgents, toast]);

  const deleteAgent = useCallback(async (id: number) => {
    try {
      const response = await apiService.deleteAgent(id);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Agent deleted successfully'
      });

      fetchAgents(); // Refresh the list
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete agent';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchAgents, toast]);

  const getAgentTypeName = useCallback((agentTypeId: number) => {
    const agentType = agentTypes.find((type) => type.id === agentTypeId);
    return agentType?.name || 'Unknown Type';
  }, [agentTypes]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    agentTypes,
    loading,
    error,
    totalCount,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgentTypeName,
    refresh: fetchAgents
  };
};