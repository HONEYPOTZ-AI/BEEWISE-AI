
import { useState, useEffect, useCallback } from 'react';
import { Business, BusinessStage, QueryParams } from '@/types/database';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const useBusinesses = (params?: QueryParams) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessStages, setBusinessStages] = useState<BusinessStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [businessesResponse, stagesResponse] = await Promise.all([
      apiService.getBusinesses(params),
      apiService.getBusinessStages({ PageSize: 100, OrderByField: 'stage_order', IsAsc: true })]
      );

      if (businessesResponse.error) {
        throw new Error(businessesResponse.error);
      }

      if (stagesResponse.error) {
        throw new Error(stagesResponse.error);
      }

      if (businessesResponse.data) {
        setBusinesses(businessesResponse.data.List);
        setTotalCount(businessesResponse.data.VirtualCount);
      }

      if (stagesResponse.data) {
        setBusinessStages(stagesResponse.data.List);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch businesses';
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

  const createBusiness = useCallback(async (businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiService.createBusiness(businessData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Business created successfully'
      });

      fetchBusinesses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create business';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchBusinesses, toast]);

  const updateBusiness = useCallback(async (businessData: Business) => {
    try {
      const response = await apiService.updateBusiness(businessData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Business updated successfully'
      });

      fetchBusinesses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update business';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchBusinesses, toast]);

  const deleteBusiness = useCallback(async (id: number) => {
    try {
      const response = await apiService.deleteBusiness(id);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Business deleted successfully'
      });

      fetchBusinesses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete business';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchBusinesses, toast]);

  const getBusinessStageName = useCallback((stageId: number) => {
    const stage = businessStages.find((s) => s.id === stageId);
    return stage?.name || 'Unknown Stage';
  }, [businessStages]);

  const getNextStage = useCallback((currentStageId: number) => {
    const currentStage = businessStages.find((s) => s.id === currentStageId);
    if (!currentStage) return null;

    return businessStages.find((s) => s.stage_order === currentStage.stage_order + 1);
  }, [businessStages]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return {
    businesses,
    businessStages,
    loading,
    error,
    totalCount,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessStageName,
    getNextStage,
    refresh: fetchBusinesses
  };
};