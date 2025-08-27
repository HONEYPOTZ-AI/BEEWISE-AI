
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { TaskTemplateService } from '@/services/taskTemplateService';
import { Loader2, Database, CheckCircle, FileText } from 'lucide-react';

const DataInitializer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const initializeData = async () => {
    setLoading(true);
    try {
      await apiService.initializeAllData();
      setInitialized(true);
      toast({
        title: 'Success',
        description: 'Test data initialized successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize test data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeTaskTemplates = async () => {
    setTemplateLoading(true);
    try {
      const success = await TaskTemplateService.initializeDefaultTemplates();
      if (success) {
        toast({
          title: 'Success',
          description: 'Task templates initialized successfully'
        });
      } else {
        throw new Error('Failed to initialize templates');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize task templates',
        variant: 'destructive'
      });
    } finally {
      setTemplateLoading(false);
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
          Load sample data and templates to populate the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initialized ?
        <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Sample data loaded successfully
          </div> :

        <div className="space-y-2">
          <Button
            onClick={initializeData}
            disabled={loading}
            className="w-full">
            {loading ?
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </> :
            'Initialize Data'
            }
          </Button>

          <Button
            onClick={initializeTaskTemplates}
            disabled={templateLoading}
            variant="outline"
            className="w-full">
            {templateLoading ?
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Templates...
            </> :
            'Initialize Templates'
            }
          </Button>
        </div>
        }
      </CardContent>
    </Card>);

};

export default DataInitializer;