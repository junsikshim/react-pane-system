import type { Meta, StoryObj } from '@storybook/react';

import { TopRow } from './TopRow';

const meta = {
  title: 'Two Rows/Top Row',
  component: TopRow,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    systemWidth: { control: 'text' },
    systemHeight: { control: 'text' },
    topRowHeight: { control: 'text' },
    topRowMinHeight: { control: 'text' },
    topRowMaxHeight: { control: 'text' },
    splitterHeight: { control: 'number' },
    splitterColor: { control: 'color' }
  }
} satisfies Meta<typeof TopRow>;

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
    topRowMaxHeight: '80%',
    splitterHeight: 4,
    splitterColor: '#fff'
  }
};
