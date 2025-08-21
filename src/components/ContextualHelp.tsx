import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LearnMoreButton from '@/components/LearnMoreButton';
import { Info, Lightbulb, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';

interface ContextualHelpProps {
  title: string;
  description: string;
  tips?: string[];
  warnings?: string[];
  relatedSections?: {
    section: string;
    label: string;
    description: string;
  }[];
  examples?: {
    title: string;
    description: string;
    code?: string;
  }[];
  className?: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  description,
  tips = [],
  warnings = [],
  relatedSections = [],
  examples = [],
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tips Section */}
        {tips.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <h4 className="font-medium">Tips</h4>
            </div>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {warnings.map((warning, index) => (
                    <p key={index} className="text-sm">{warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Examples Section */}
        {examples.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Examples</h4>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h5 className="font-medium text-sm mb-1">{example.title}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{example.description}</p>
                  {example.code && (
                    <pre className="text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-x-auto">
                      {example.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Sections */}
        {relatedSections.length > 0 && (
          <div>
            <Separator />
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Related Documentation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedSections.map((related, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{related.label}</p>
                    <p className="text-xs text-muted-foreground">{related.description}</p>
                  </div>
                  <LearnMoreButton 
                    section={related.section}
                    mode="icon"
                    tooltip={`Learn more about ${related.label}`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContextualHelp;