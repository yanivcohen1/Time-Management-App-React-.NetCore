import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './pages/Home/Home';
import { AppProvider } from './context/AppContext';

// Mock axios to avoid external calls
jest.mock('axios');

// Mock react-router-dom hooks and components for testing without real Router context
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => () => {},
  Outlet: () => null,
}));

test('renders Home Set AppContext button', () => {
  render(
    <AppProvider>
      <Home />
    </AppProvider>
  );
  const linkElement = screen.getByText(/Set AppContext/i);
  expect(linkElement).toBeInTheDocument();
});
