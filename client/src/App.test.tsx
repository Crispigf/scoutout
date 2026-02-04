import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quantum news dashboard', () => {
  render(<App />);
  const headerElement = screen.getByText(/Quantum News/i);
  expect(headerElement).toBeInTheDocument();
});
