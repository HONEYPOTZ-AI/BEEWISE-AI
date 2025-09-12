import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Circle, ArrowRight, Clock, Target, AlertCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessStage {
  id: number;
  name: string;
  description: string;
  stage_order: number;
  key_objectives: string[];
  success_criteria: string[];
}

interface LifecycleTransition {
  id: number;
  business_id: number;
  from_stage_id: number;
  to_stage_id: number;
  transition_reason: string;
  transition_type: string;
  success_score: number;
  objectives_met: number;
  total_objectives: number;
  notes: string;
  transitioned_at: string;
}

interface StageTransitionControlsProps {
  businessId: number;
  currentStage: BusinessStage;
  nextStage?: BusinessStage;
  currentProgress: number;
  objectives: Array<{id: string;name: string;completed: boolean;progress: number;}>;
  onTransition: (transitionData: {
    from_stage_id: number;
    to_stage_id: number;
    transition_reason: string;
    transition_type: string;
    success_score: number;
    objectives_met: number;
    total_objectives: number;
    notes: string;
  }) => Promise<void>;
  recentTransitions?: LifecycleTransition[];
  loading?: boolean;
}

const StageTransitionControls: React.FC<StageTransitionControlsProps> = ({
  businessId,
  currentStage,
  nextStage,
  currentProgress,
  objectives,
  onTransition,
  recentTransitions = [],
  loading = false
}) => {
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
  const [transitionReason, setTransitionReason] = useState('');
  const [transitionType, setTransitionType] = useState('manual');
  const [successScore, setSuccessScore] = useState(7);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const completedObjectives = objectives.filter((obj) => obj.completed).length;
  const totalObjectives = objectives.length;
  const objectiveProgress = totalObjectives > 0 ? completedObjectives / totalObjectives * 100 : 0;

  const canTransition = currentProgress >= 80 && objectiveProgress >= 70 && nextStage;
  const averageObjectiveProgress = totalObjectives > 0 ?
  objectives.reduce((sum, obj) => sum + obj.progress, 0) / totalObjectives :
  0;

  const handleTransition = async () => {
    if (!nextStage || !transitionReason.trim()) {
      toast({
        title: "Invalid Transition",
        description: "Please provide a reason for the transition.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransition({
        from_stage_id: currentStage.id,
        to_stage_id: nextStage.id,
        transition_reason: transitionReason,
        transition_type: transitionType,
        success_score: successScore,
        objectives_met: completedObjectives,
        total_objectives: totalObjectives,
        notes: notes
      });

      toast({
        title: "Stage Transition Complete",
        description: `Successfully advanced to ${nextStage.name}`,
        variant: "default"
      });

      // Reset form
      setTransitionReason('');
      setNotes('');
      setTransitionType('manual');
      setSuccessScore(7);
      setIsTransitionDialogOpen(false);
    } catch (error) {
      toast({
        title: "Transition Failed",
        description: "Unable to complete stage transition. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransitionTypeColor = (type: string) => {
    switch (type) {
      case 'automatic':return 'bg-green-100 text-green-800';
      case 'triggered':return 'bg-blue-100 text-blue-800';
      default:return 'bg-orange-100 text-orange-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Stage Progress */}
      <Card className="business-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Stage Progress Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Stage Progress</span>
              <span className="text-primary font-medium">{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>

          {/* Objectives Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Objectives Completion</span>
              <span className="font-medium">{completedObjectives}/{totalObjectives} ({Math.round(objectiveProgress)}%)</span>
            </div>
            <Progress value={objectiveProgress} className="h-2" />
          </div>

          {/* Objectives List */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Key Objectives Status</Label>
            {objectives.map((objective) =>
            <div key={objective.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  {objective.completed ?
                <CheckCircle2 className="w-4 h-4 text-green-500" /> :

                <Circle className="w-4 h-4 text-muted-foreground" />
                }
                  <span className={`text-sm ${objective.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {objective.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Progress value={objective.progress} className="h-1" />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {objective.progress}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Transition Readiness */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {canTransition ?
              <CheckCircle2 className="w-5 h-5 text-green-500" /> :

              <AlertCircle className="w-5 h-5 text-orange-500" />
              }
              <span className="font-medium">
                {canTransition ? 'Ready for Transition' : 'Transition Requirements Not Met'}
              </span>
            </div>
            {nextStage &&
            <Button
              onClick={() => setIsTransitionDialogOpen(true)}
              disabled={!canTransition || loading}
              className="beewise-gradient">

                <ArrowRight className="w-4 h-4 mr-2" />
                Advance to {nextStage.name}
              </Button>
            }
          </div>

          {!canTransition &&
          <div className="text-xs text-muted-foreground space-y-1">
              <p>Requirements for stage transition:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li className={currentProgress >= 80 ? 'text-green-600' : ''}>
                  Overall progress: {currentProgress}% (minimum 80% required)
                </li>
                <li className={objectiveProgress >= 70 ? 'text-green-600' : ''}>
                  Objectives completion: {Math.round(objectiveProgress)}% (minimum 70% required)
                </li>
              </ul>
            </div>
          }
        </CardContent>
      </Card>

      {/* Recent Transitions */}
      {recentTransitions.length > 0 &&
      <Card className="business-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Stage Transitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransitions.slice(0, 5).map((transition) =>
            <div key={transition.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${getTransitionTypeColor(transition.transition_type)}`}>
                        {transition.transition_type}
                      </Badge>
                      <span className="text-sm font-medium">
                        Stage {transition.from_stage_id} → {transition.to_stage_id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{transition.transition_reason}</p>
                    {transition.notes &&
                <p className="text-xs text-muted-foreground mt-1 italic">{transition.notes}</p>
                }
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Score: {transition.success_score}/10</div>
                    <div className="text-xs text-muted-foreground">
                      {transition.objectives_met}/{transition.total_objectives} objectives
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transition.transitioned_at)}
                    </div>
                  </div>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Transition Dialog */}
      <Dialog open={isTransitionDialogOpen} onOpenChange={setIsTransitionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Stage Transition
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center gap-4 mb-2">
                <Badge variant="outline">{currentStage.name}</Badge>
                <ArrowRight className="w-4 h-4 text-primary" />
                <Badge className="bg-primary/10 text-primary">{nextStage?.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Confirm transition to the next business stage
              </p>
            </div>

            <Separator />

            <div>
              <Label htmlFor="transition_reason">Transition Reason *</Label>
              <Textarea
                id="transition_reason"
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                placeholder="Explain why this transition is appropriate..."
                rows={3}
                className="mt-1" />

            </div>

            <div>
              <Label htmlFor="transition_type">Transition Type</Label>
              <Select value={transitionType} onValueChange={setTransitionType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="triggered">Triggered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="success_score">Success Score (1-10)</Label>
              <Select value={successScore.toString()} onValueChange={(value) => setSuccessScore(parseInt(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) =>
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i + 1 <= 3 ? '(Poor)' : i + 1 <= 6 ? '(Average)' : i + 1 <= 8 ? '(Good)' : '(Excellent)'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations or notes..."
                rows={2}
                className="mt-1" />

            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm space-y-1">
                <p><strong>Objectives Completed:</strong> {completedObjectives}/{totalObjectives}</p>
                <p><strong>Overall Progress:</strong> {currentProgress}%</p>
                <p><strong>Average Objective Progress:</strong> {Math.round(averageObjectiveProgress)}%</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransitionDialogOpen(false)}
              disabled={isSubmitting}>

              Cancel
            </Button>
            <Button
              onClick={handleTransition}
              disabled={isSubmitting || !transitionReason.trim()}
              className="beewise-gradient">

              {isSubmitting ?
              <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </> :

              <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Confirm Transition
                </>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

};

export default StageTransitionControls;