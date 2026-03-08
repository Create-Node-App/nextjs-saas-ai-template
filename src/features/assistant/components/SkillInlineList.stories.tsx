import type { Meta, StoryObj } from '@storybook/react';
import { SkillInlineList } from './SkillInlineCard';

const meta: Meta<typeof SkillInlineList> = {
  title: 'Assistant/SkillInlineList',
  component: SkillInlineList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tenantSlug: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SkillInlineList>;

const skills = [
  { name: 'React', level: 4, raw: 'React (4)' },
  { name: 'TypeScript', level: 5, raw: 'TypeScript (5)' },
  { name: 'Node.js', level: 3, raw: 'Node.js (3)' },
];

export const Default: Story = {
  args: {
    skills,
  },
};

export const WithTenantLink: Story = {
  args: {
    skills,
    tenantSlug: 'demo',
  },
};
