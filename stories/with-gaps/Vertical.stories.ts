import type { Meta, StoryObj } from '@storybook/react';

import { VerticalPane } from './VerticalPane';

const meta = {
  title: 'With Gaps/Vertical',
  component: VerticalPane,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    topPaneHeight: { control: 'text' },
    topPanelMinHeight: { control: 'text' },
    topPanelMaxHeight: { control: 'text' },
    borderWidth: { control: 'number' },
    splitterHeight: { control: 'number' },
    gap: { control: 'number' }
  }
} satisfies Meta<typeof VerticalPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '300px',
    topPaneHeight: '30%',
    borderWidth: 0,
    gap: 20,
    splitterHeight: 20
  }
};
