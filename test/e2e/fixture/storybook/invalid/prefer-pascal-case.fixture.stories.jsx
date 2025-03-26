import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

// Using non-PascalCase story name
export const primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

// This is also not PascalCase
export const secondaryButton = {
  args: {
    label: 'Button',
  },
};

// This is acceptable (PascalCase)
export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};