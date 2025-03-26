import React from 'react';
import { Button } from './Button';

// Using deprecated hierarchy separator in title ('/' should be used instead of '|')
export default {
  title: 'Components|Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// Using non-PascalCase story name
export const primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

// Using redundant name property
export const Secondary = {
  name: 'Secondary',
  args: {
    label: 'Button',
  },
};

// Missing play function context
export const WithInteraction = {
  args: {
    label: 'Click me',
  },
  play: () => {
    // Missing await and using external testing library instead of storybook's
    const button = document.querySelector('button');
    button.click();
    expect(button.textContent).toBe('Clicked');
  },
};