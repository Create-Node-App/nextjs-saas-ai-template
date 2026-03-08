import type { Meta, StoryObj } from '@storybook/react';
import { ComparedLevelBadge } from './compared-level-badge';

const meta: Meta<typeof ComparedLevelBadge> = {
  title: 'Atoms/ComparedLevelBadge',
  component: ComparedLevelBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Badge showing skill/interest level vs required (target): achieved, exceeded, or not met. Used in LevelIndicator and self-assessment (AssessmentStep, SkillSelector).',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 4, step: 1 } },
    target: { control: { type: 'number', min: 0, max: 4, step: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof ComparedLevelBadge>;

export const LevelAchieved: Story = {
  args: {
    value: 3,
    target: 3,
    achievedLabel: 'Achieved',
    exceededLabel: 'Exceeded',
  },
};

export const LevelExceeded: Story = {
  args: {
    value: 4,
    target: 3,
    achievedLabel: 'Achieved',
    exceededLabel: 'Exceeded',
  },
};

export const LevelNotMet: Story = {
  args: {
    value: 2,
    target: 3,
    notMetLabel: '{value} of {target} required',
  },
};

export const SelfAssessmentRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ComparedLevelBadge value={4} target={3} />
      <ComparedLevelBadge value={3} target={3} />
      <ComparedLevelBadge value={2} target={3} />
    </div>
  ),
};
