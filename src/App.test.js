import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders login page title', () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={['/login']}
    >
      <App />
    </MemoryRouter>
  );
  const titleElement = screen.getByRole('heading', { name: /用户登录/i });
  expect(titleElement).toBeInTheDocument();
});
