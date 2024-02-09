import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';

import { TwoColumns } from './TwoColumns';

const meta = {
  title: 'React Pane System/Two Columns',
  component: TwoColumns,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    leftPaneWidth: { control: 'text' },
    leftPaneMinWidth: { control: 'text' },
    leftPaneMaxWidth: { control: 'text' }
  }
} satisfies Meta<typeof TwoColumns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    leftPaneWidth: '30%'
  }
};
export const WithSplitters: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    leftPaneWidth: '30%',
    leftPaneMinWidth: '50px',
    leftPaneMaxWidth: '80%'
  }
};
