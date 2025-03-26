import React from 'react';
import { Button } from './Button';
import { userEvent, within } from '@storybook/testing-library';
// Not importing expect from @storybook/test

export default {
  title: 'Components/Button',
  component: Button,
};

export const TestExpect = {
  args: {
    label: 'Button with test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    
    // Using Jest expect instead of Storybook expect
    expect(button.textContent).toBe('Button with test');
  }
};