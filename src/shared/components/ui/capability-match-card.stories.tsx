import type { Meta, StoryObj } from '@storybook/react';
import { Radar } from 'lucide-react';
import { Button } from './button';
import { CapabilityMatchCard } from './capability-match-card';

const meta: Meta<typeof CapabilityMatchCard> = {
  title: 'Molecules/CapabilityMatchCard',
  component: CapabilityMatchCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Top Capability Matches / capability match item: name, fit %, progress bar, "X of Y required skills". Used in ProfileClient Overview and Capabilities tab.',
      },
    },
  },
  argTypes: {
    matchCount: { control: { type: 'number', min: 0 } },
    totalRequired: { control: { type: 'number', min: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof CapabilityMatchCard>;

/** As in Top Capability Matches: Data Engineer, 100%, 5 of 5 required skills. */
export const FullMatch: Story = {
  args: {
    name: 'Data Engineer',
    matchCount: 5,
    totalRequired: 5,
    detailsText: '5 of 5 required skills',
    compact: true,
  },
};

/** High fit, not 100%. */
export const HighMatch: Story = {
  args: {
    name: 'Frontend Developer',
    matchCount: 4,
    totalRequired: 5,
    detailsText: '4 of 5 required skills',
    compact: true,
  },
};

/** Medium fit. */
export const MediumMatch: Story = {
  args: {
    name: 'Full Stack Engineer',
    matchCount: 3,
    totalRequired: 6,
    detailsText: '3 of 6 required skills',
    compact: true,
  },
};

/** Low fit. */
export const LowMatch: Story = {
  args: {
    name: 'DevOps Lead',
    matchCount: 1,
    totalRequired: 5,
    detailsText: '1 of 5 required skills',
    compact: true,
  },
};

/** With icon (as in Capabilities tab). */
export const WithIcon: Story = {
  args: {
    name: 'Data Engineer',
    matchCount: 5,
    totalRequired: 5,
    detailsText: '5 of 5 required skills',
    showIcon: true,
    badgeSuffix: ' match',
    compact: false,
  },
};

/** With action slot (e.g. Radar button as in Capabilities tab). */
export const WithAction: Story = {
  args: {
    name: 'Data Engineer',
    matchCount: 5,
    totalRequired: 5,
    detailsText: '5 of 5 required skills',
    showIcon: true,
    badgeSuffix: ' match',
    compact: false,
    action: (
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="View radar chart">
        <Radar className="h-4 w-4" />
      </Button>
    ),
  },
};

/** List of three (Top Capability Matches style). */
export const TopCapabilityMatchesList: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <CapabilityMatchCard
        name="Data Engineer"
        matchCount={5}
        totalRequired={5}
        detailsText="5 of 5 required skills"
        compact
      />
      <CapabilityMatchCard
        name="Frontend Developer"
        matchCount={4}
        totalRequired={5}
        detailsText="4 of 5 required skills"
        compact
      />
      <CapabilityMatchCard
        name="Backend Engineer"
        matchCount={3}
        totalRequired={6}
        detailsText="3 of 6 required skills"
        compact
      />
    </div>
  ),
};
