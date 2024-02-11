import type { Meta, StoryObj } from '@storybook/react';

import { RightPane } from './RightPane';

const meta = {
  title: 'Two Columns/Right Pane',
  component: RightPane,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    rightPaneWidth: { control: 'text' },
    rightPaneMinWidth: { control: 'text' },
    rightPaneMaxWidth: { control: 'text' },
    splitterWidth: { control: 'number' },
    splitterColor: { control: 'color' }
  }
} satisfies Meta<typeof RightPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    rightPaneWidth: '30%'
  }
};
export const WithSplitter: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    rightPaneWidth: '30%',
    rightPaneMinWidth: '50px',
    rightPaneMaxWidth: '80%',
    splitterWidth: 4,
    splitterColor: '#fff'
  }
};
