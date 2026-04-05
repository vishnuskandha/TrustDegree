import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('AnimatedCard component', () => {
  it('renders children correctly', () => {
    render(<AnimatedCard>Animated content</AnimatedCard>);
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('renders with Card component', () => {
    render(<AnimatedCard>Content</AnimatedCard>);
    const card = screen.getByText('Content').closest('div');
    // Should have card styles
    expect(card).toHaveClass('bg-card');
  });



  it('does not apply hoverable class by default', () => {
    render(<AnimatedCard>No hover</AnimatedCard>);
    const card = screen.getByText('No hover').closest('div');
    expect(card).not.toHaveClass('hover:shadow-lg');
  });

  it('applies custom className', () => {
    render(<AnimatedCard className="custom-animated-card">Content</AnimatedCard>);
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('custom-animated-card');
  });



  it('renders children correctly', () => {
    render(
      <AnimatedCard>
        <button>Action</button>
        <p>Text content</p>
      </AnimatedCard>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Text content')).toBeInTheDocument();
  });

  it('wraps content in Card components', () => {
    render(<AnimatedCard>Content</AnimatedCard>);
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
  });
});
