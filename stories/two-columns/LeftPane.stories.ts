import type { Meta, StoryObj } from '@storybook/react';

import { LeftPane } from './LeftPane';

const meta = {
  title: 'Two Columns/Left Pane',
  component: LeftPane,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    leftPaneWidth: { control: 'text' },
    leftPaneMinWidth: { control: 'text' },
    leftPaneMaxWidth: { control: 'text' },
    splitterWidth: { control: 'number' },
    splitterColor: { control: 'color' }
  }
} satisfies Meta<typeof LeftPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    leftPaneWidth: '30%'
  }
};
export const WithSplitter: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    leftPaneWidth: '30%',
    leftPaneMinWidth: '50px',
    leftPaneMaxWidth: '80%',
    splitterWidth: 4,
    splitterColor: '#fff'
  }
};
