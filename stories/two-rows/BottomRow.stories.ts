import type { Meta, StoryObj } from '@storybook/react';

import { BottomRow } from './BottomRow';

const meta = {
  title: 'Two Rows/Bottom Row',
  component: BottomRow,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    bottomRowHeight: { control: 'text' },
    bottomRowMinHeight: { control: 'text' },
    bottomRowMaxHeight: { control: 'text' },
    splitterHeight: { control: 'number' },
    splitterColor: { control: 'color' }
  }
} satisfies Meta<typeof BottomRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '400px',
    bottomRowHeight: '30%'
  }
};
export const WithSplitters: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '400px',
    bottomRowHeight: '30%',
    bottomRowMinHeight: '50px',
    bottomRowMaxHeight: '80%',
    splitterHeight: 4,
    splitterColor: '#fff'
  }
};
