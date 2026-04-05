import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnimatedRoutes from '@/components/AnimatedRoutes';

describe('AnimatedRoutes component', () => {
  it('renders children routes', () => {
    const routes = [
      { path: "/", element: <div>Home</div> },
      { path: "/about", element: <div>About</div> }
    ];

    render(
      <MemoryRouter>
        <AnimatedRoutes routes={routes} />
      </MemoryRouter>
    );

    // Initial route in MemoryRouter is /
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders nested routes', () => {
    const NestedComponent = () => <div>Nested content</div>;
    const routes = [
      { 
        path: "/parent", 
        element: <div>Parent</div>,
        children: [{ path: "child", element: <NestedComponent /> }]
      }
    ];

    render(
      <MemoryRouter initialEntries={['/parent']}>
        <AnimatedRoutes routes={routes} />
      </MemoryRouter>
    );

    expect(screen.getByText('Parent')).toBeInTheDocument();
  });
});
