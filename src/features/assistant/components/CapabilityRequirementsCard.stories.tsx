import type { Meta, StoryObj } from '@storybook/react';
import { CapabilityRequirementsCard } from './CapabilityRequirementsCard';

const meta: Meta<typeof CapabilityRequirementsCard> = {
  title: 'Assistant/CapabilityRequirementsCard',
  component: CapabilityRequirementsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    capabilityId: { control: 'text' },
    tenantSlug: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CapabilityRequirementsCard>;

const capability = {
  name: 'Frontend Lead',
  requirements: [
    { skill: 'React', level: 4 },
    { skill: 'TypeScript', level: 4 },
    { skill: 'Leadership', level: 3 },
  ],
  raw: '',
};

export const Default: Story = {
  args: {
    capability,
  },
};

export const WithLinks: Story = {
  args: {
    capability,
    capabilityId: 'cap-123',
    tenantSlug: 'demo',
  },
};

export const NoRequirements: Story = {
  args: {
    capability: { name: 'General Role', raw: '' },
    tenantSlug: 'demo',
  },
};
