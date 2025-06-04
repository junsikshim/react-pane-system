import type { Meta, StoryObj } from '@storybook/react';

import { HorizontalPane } from './HorizontalPane';

const meta = {
  title: 'With Gaps/Horizontal',
  component: HorizontalPane,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    leftPaneWidth: { control: 'text' },
    leftPaneMinWidth: { control: 'text' },
    leftPaneMaxWidth: { control: 'text' },
    borderWidth: { control: 'number' },
    splitterWidth: { control: 'number' },
    gap: { control: 'number' }
  }
} satisfies Meta<typeof HorizontalPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    leftPaneWidth: '30%',
    borderWidth: 0,
    gap: 20,
    splitterWidth: 20
  }
};
