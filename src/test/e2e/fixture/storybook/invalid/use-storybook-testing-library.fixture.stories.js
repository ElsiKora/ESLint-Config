import React from 'react';
import { Button } from './Button';
// Direct import from testing-library/react instead of storybook's testing library
import { render, fireEvent } from '@testing-library/react';

export default {
  title: 'Components/Button',
  component: Button,
};

export const TestLibrary = {
  args: {
    label: 'Click me',
  },
  play: async () => {
    // Using testing-library directly instead of @storybook/testing-library
    const { getByRole } = render(<Button label="Click me" />);
    const button = getByRole('button');
    fireEvent.click(button);
  }
};