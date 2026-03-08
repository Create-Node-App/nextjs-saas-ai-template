'use client';

import { Target, Users } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';

interface SkillData {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  peopleCount: number;
  averageLevel: number;
  relatedCapabilities: { id: string; name: string }[];
}

interface SkillSheetProps {
  skill: SkillData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
}

export function SkillSheet({ skill, open, onOpenChange, tenantSlug }: SkillSheetProps) {
  if (!skill) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{skill.name}</SheetTitle>
          <SheetDescription>{skill.category && <Badge variant="secondary">{skill.category}</Badge>}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          {skill.description && (
            <section>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </section>
          )}

          {/* Stats */}
          <section>
            <h3 className="font-semibold mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold">{skill.peopleCount}</div>
                <div className="text-xs text-muted-foreground">People with this skill</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="h-5 w-5 mx-auto mb-2 flex items-center justify-center text-muted-foreground">📊</div>
                <div className="text-2xl font-bold">{skill.averageLevel.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Average level</div>
              </div>
            </div>
          </section>

          {/* Related Capabilities */}
          {skill.relatedCapabilities.length > 0 && (
            <section>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Required for Capabilities
              </h3>
              <div className="space-y-2">
                {skill.relatedCapabilities.map((cap) => (
                  <Link key={cap.id} href={`/t/${tenantSlug}/capabilities`} className="block">
                    <div className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      <span className="text-sm font-medium">{cap.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <Link href={`/t/${tenantSlug}/people?skill=${encodeURIComponent(skill.name)}`}>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Find People with this Skill
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
