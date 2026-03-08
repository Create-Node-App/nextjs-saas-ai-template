import { Bot, Brain, Briefcase, GraduationCap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { AssistantCapability } from '../types';

interface CapabilitiesCardProps {
  capabilities: AssistantCapability[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  skills: Brain,
  career: Briefcase,
  learning: GraduationCap,
};

export function CapabilitiesCard({ capabilities }: CapabilitiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5" />
          ¿En qué puedo ayudarte?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {capabilities.map((capability) => {
          const Icon = iconMap[capability.id] || Brain;
          return (
            <div key={capability.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm">{capability.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground pl-6">{capability.description}</p>
              <div className="pl-6 flex flex-wrap gap-1">
                {capability.examples.slice(0, 2).map((example, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
