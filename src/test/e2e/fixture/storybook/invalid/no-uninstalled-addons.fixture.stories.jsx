import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Misspelled or non-existent addon
    myAddonThatDoesntExist: {
      someParameter: true,
    },
    backgrounds: {
      default: 'light',
    },
  },
};