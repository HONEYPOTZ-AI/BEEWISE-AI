
import { useState, useEffect, useCallback } from 'react';
import { Task, QueryParams } from '@/types/database';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const useTasks = (params?: QueryParams) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getTasks(params);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setTasks(response.data.List);
        setTotalCount(response.data.VirtualCount);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
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

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiService.createTask(taskData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Task created successfully'
      });

      fetchTasks();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchTasks, toast]);

  const updateTask = useCallback(async (taskData: Task) => {
    try {
      const response = await apiService.updateTask(taskData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Task updated successfully'
      });

      fetchTasks();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchTasks, toast]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      const response = await apiService.deleteTask(id);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      });

      fetchTasks();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [fetchTasks, toast]);

  const getTasksByStatus = useCallback((status: string) => {
    return tasks.filter((task) => task.status === status);
  }, [tasks]);

  const getTasksByPriority = useCallback((priority: string) => {
    return tasks.filter((task) => task.priority === priority);
  }, [tasks]);

  const getTasksByBusiness = useCallback((businessId: number) => {
    return tasks.filter((task) => task.business_id === businessId);
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    totalCount,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByBusiness,
    refresh: fetchTasks
  };
};