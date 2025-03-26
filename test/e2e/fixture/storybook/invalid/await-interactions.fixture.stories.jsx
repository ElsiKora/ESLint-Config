import React from 'react';
import { Button } from './Button';
import { userEvent, within } from '@storybook/testing-library';

export default {
  title: 'Components/Button',
  component: Button,
};

export const ClickButton = {
  args: {
    label: 'Click me',
  },
  // Missing await for interactions
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // This should be awaited
    userEvent.click(button);
  },
};