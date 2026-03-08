import type { Meta, StoryObj } from '@storybook/react';
import { SkillInlineCard } from './SkillInlineCard';

const meta: Meta<typeof SkillInlineCard> = {
  title: 'Assistant/SkillInlineCard',
  component: SkillInlineCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tenantSlug: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SkillInlineCard>;

const skill = {
  name: 'React',
  level: 4,
  raw: 'React (4)',
};

export const Default: Story = {
  args: {
    skill,
  },
};

export const WithTenantLink: Story = {
  args: {
    skill,
    tenantSlug: 'demo',
  },
};
