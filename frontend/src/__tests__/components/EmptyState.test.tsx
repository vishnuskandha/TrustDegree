import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState';

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');
  return {
    ...actual,
    Inbox: ({ className, ...props }: any) => (
      <div data-testid="inbox-icon" className={className} {...props}>
        InboxIcon
      </div>
    ),
    Search: ({ className, ...props }: any) => (
      <div data-testid="search-icon" className={className} {...props}>
        SearchIcon
      </div>
    ),
    AlertCircle: ({ className, ...props }: any) => (
      <div data-testid="alert-icon" className={className} {...props}>
        AlertIcon
      </div>
    ),
  };
});

describe('EmptyState component', () => {
  it('renders title correctly', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="There are no items to display." />);
    expect(screen.getByText('There are no items to display.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(
      <EmptyState
        title="No credentials"
        action={<button>Create Credential</button>}
      />
    );
    expect(screen.getByRole('button', { name: /create credential/i })).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render icon container when no icon is provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByTestId('inbox-icon')).not.toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;
    render(<EmptyState title="Empty" icon={<CustomIcon />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState title="Empty" className="custom-empty" />);
    const wrapper = container.querySelector('.custom-empty');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders icon with proper size class when icon provided', () => {
    render(
      <EmptyState
        title="Empty"
        icon={<div data-testid="inbox-icon" className="h-12 w-12">InboxIcon</div>}
      />
    );

    const icon = screen.getByTestId('inbox-icon');
    expect(icon).toHaveClass('h-12');
    expect(icon).toHaveClass('w-12');
  });

  it('renders with title only', () => {
    render(<EmptyState title="Minimal empty state" />);
    expect(screen.getByText('Minimal empty state')).toBeInTheDocument();
  });

  it('composes title, description, and action correctly', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your search filters"
        action={<button>Clear filters</button>}
      />
    );

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });
});
