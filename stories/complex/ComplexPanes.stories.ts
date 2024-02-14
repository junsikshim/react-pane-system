import type { Meta, StoryObj } from '@storybook/react';

import { ComplexPanes } from './ComplexPanes';

const meta = {
  title: 'Complex/Complex Panes',
  component: ComplexPanes,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    leftPaneWidth: { control: 'text' },
    leftPaneMinWidth: { control: 'text' },
    leftPaneMaxWidth: { control: 'text' },
    rightPaneWidth: { control: 'text' },
    rightPaneMinWidth: { control: 'text' },
    rightPaneMaxWidth: { control: 'text' },
    splitterWidth: { control: 'number' },
    splitterColor: { control: 'color' }
  }
} satisfies Meta<typeof ComplexPanes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    systemWidth: '800px',
    systemHeight: '500px',
    leftPaneWidth: '30%',
    leftPaneMinWidth: '100px',
    leftPaneMaxWidth: '50%',
    rightPaneWidth: '30%',
    rightPaneMinWidth: '200px',
    rightPaneMaxWidth: '50%',
    splitterWidth: 4,
    splitterColor: '#00171F'
  }
};
