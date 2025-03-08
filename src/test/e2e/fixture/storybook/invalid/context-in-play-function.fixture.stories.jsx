import React from 'react';
import { Button } from './Button';
import { userEvent, within } from '@storybook/testing-library';

export default {
  title: 'Components/Button',
  component: Button,
};

export const PrimaryButton = {
  args: {
    label: 'Primary Button',
    primary: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  }
};

export const ReusePrimaryButtonPlay = {
  args: {
    label: 'Reused Play',
    primary: true,
  },
  // Missing context when invoking another story's play function
  play: () => {
    // This should pass the context to PrimaryButton.play
    PrimaryButton.play();
  }
};