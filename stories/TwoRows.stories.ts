import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';

import { TwoRows } from './TwoRows';

const meta = {
  title: 'React Pane System/Two Rows',
  component: TwoRows,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    topRowHeight: { control: 'text' },
    topRowMinHeight: { control: 'text' },
    topRowMaxHeight: { control: 'text' }
  }
} satisfies Meta<typeof TwoRows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '400px',
    topRowHeight: '30%'
  }
};
export const WithSplitters: Story = {
  args: {
    systemWidth: '600px',
    systemHeight: '400px',
    topRowHeight: '30%',
    topRowMinHeight: '50px',
    topRowMaxHeight: '80%'
  }
};
