import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight, Clock, Target, Users } from 'lucide-react';

interface BusinessStage {
  id: number;
  name: string;
  description: string;
  stage_order: number;
  typical_duration_days: number;
  key_objectives: string[];
  success_criteria: string[];
  recommended_agents: string[];
  is_active: boolean;
}

interface Business {
  id: number;
  name: string;
  current_stage_id: number;
  created_at: string;
}

interface BusinessStageVisualizerProps {
  business: Business;
  stages: BusinessStage[];
  currentProgress: number;
  onStageTransition: (fromStageId: number, toStageId: number) => void;
  loading?: boolean;
}

const BusinessStageVisualizer: React.FC<BusinessStageVisualizerProps> = ({
  business,
  stages,
  currentProgress,
  onStageTransition,
  loading = false
}) => {
  const sortedStages = [...stages].sort((a, b) => a.stage_order - b.stage_order);
  const currentStageIndex = sortedStages.findIndex(stage => stage.id === business.current_stage_id);
  
  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const currentStage = sortedStages[currentStageIndex];
  const nextStage = sortedStages[currentStageIndex + 1];

  const parseJsonField = (field: string | string[]): string[] => {
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Progress Overview */}
      <Card className="business-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Business Lifecycle Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Stage {currentStageIndex + 1} of {sortedStages.length}</span>
              <span>{Math.round(((currentStageIndex + currentProgress / 100) / sortedStages.length) * 100)}% Complete</span>
            </div>
            <Progress 
              value={((currentStageIndex + currentProgress / 100) / sortedStages.length) * 100} 
              className="h-3"
            />
            
            {/* Stage Timeline */}
            <div className="flex items-center justify-between mt-6 overflow-x-auto">
              {sortedStages.map((stage, index) => {
                const status = getStageStatus(index);
                return (
                  <div key={stage.id} className="flex items-center stage-indicator">
                    <div className="flex flex-col items-center min-w-0 flex-1">
                      <div className={`
                        p-2 rounded-full border-2 mb-2
                        ${status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                        ${status === 'current' ? 'bg-primary/10 border-primary beewise-glow' : ''}
                        ${status === 'upcoming' ? 'bg-muted border-muted-foreground/20' : ''}
                      `}>
                        {getStageIcon(status)}
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-medium ${
                          status === 'current' ? 'text-primary' : 
                          status === 'completed' ? 'text-green-600' : 
                          'text-muted-foreground'
                        }`}>
                          {stage.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stage.typical_duration_days} days
                        </div>
                      </div>
                    </div>
                    {index < sortedStages.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Stage Details */}
      {currentStage && (
        <Card className="business-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Current Stage: {currentStage.name}
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentStage.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Key Objectives */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Key Objectives
                </h4>
                <ul className="space-y-1">
                  {parseJsonField(currentStage.key_objectives).map((objective, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Circle className="w-3 h-3 mt-1 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success Criteria */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Success Criteria
                </h4>
                <ul className="space-y-1">
                  {parseJsonField(currentStage.success_criteria).map((criteria, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Circle className="w-3 h-3 mt-1 flex-shrink-0" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Agents */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recommended Agents
              </h4>
              <div className="flex flex-wrap gap-2">
                {parseJsonField(currentStage.recommended_agents).map((agent, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Stage Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Stage Progress</span>
                <span>{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            {/* Transition Button */}
            {nextStage && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => onStageTransition(currentStage.id, nextStage.id)}
                  disabled={loading || currentProgress < 80}
                  className="w-full beewise-gradient"
                >
                  {loading ? (
                    "Processing..."
                  ) : currentProgress < 80 ? (
                    `Complete ${80 - currentProgress}% more to advance`
                  ) : (
                    `Advance to ${nextStage.name}`
                  )}
                </Button>
                {currentProgress < 80 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Minimum 80% completion required for stage transition
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessStageVisualizer;
