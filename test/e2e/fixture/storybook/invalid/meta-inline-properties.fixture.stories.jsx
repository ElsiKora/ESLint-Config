import React from 'react';
import { Button } from './Button';

// Meta with nested object properties
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f8f8' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
  // Should use a separate variable for complex nested properties
  argTypes: {
    backgroundColor: { 
      control: 'color',
      description: 'Background color of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'transparent' },
      },
    },
  },
};