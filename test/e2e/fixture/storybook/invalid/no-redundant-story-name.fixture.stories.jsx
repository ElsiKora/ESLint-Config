import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

// Redundant story name that matches the export name
export const Primary = {
  name: 'Primary', // redundant, should be removed
  args: {
    primary: true,
    label: 'Button',
  },
};

// This is fine because the name is different
export const Secondary = {
  name: 'Secondary Button', // this is ok because it's different
  args: {
    label: 'Button',
  },
};