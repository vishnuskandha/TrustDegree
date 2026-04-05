import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/components/layout/PageHeader';

describe('PageHeader component', () => {
  it('renders title correctly', () => {
    render(<PageHeader title="Test Page" />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<PageHeader title="Title" description="This is a description" />);
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<PageHeader title="Title Only" />);
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(
      <PageHeader
        title="Dashboard"
        action={<button>Create New</button>}
      />
    );
    expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<PageHeader title="No Action" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });



  it('renders title and description with proper hierarchy', () => {
    render(<PageHeader title="Main Title" description="Subtitle text" />);

    const title = screen.getByText('Main Title');
    const description = screen.getByText('Subtitle text');

    expect(title.tagName).toBe('H1');
    expect(description.tagName).toBe('P');
  });

  it('applies custom className', () => {
    const { container } = render(<PageHeader title="Title" className="custom-header" />);
    const header = container.firstElementChild;
    expect(header).toHaveClass('custom-header');
  });



  it('composes title, description, action, and breadcrumbs', () => {
    render(
      <PageHeader
        title="Complete Page"
        description="Page with all features"
        action={<button>Action</button>}
      />
    );

    expect(screen.getByText('Complete Page')).toBeInTheDocument();
    expect(screen.getByText('Page with all features')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    render(<PageHeader title="Minimal" />);
    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });
});
