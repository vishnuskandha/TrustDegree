import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/magic/Badge';

describe('Badge component', () => {
  it('renders children correctly', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-500');
  });

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-yellow-500');
  });

  it('applies error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-red-500');
  });

  it('renders dot when dot prop is true', () => {
    render(<Badge dot>With dot</Badge>);
    const badge = screen.getByText('With dot').closest('span');
    const dot = badge?.querySelector('[class*="h-1.5"]');
    expect(dot).toBeInTheDocument();
  });

  it('renders dismiss button when dismissible is true', () => {
    render(<Badge dismissible onDismiss={() => {}}>Dismissible</Badge>);
    const badge = screen.getByText('Dismissible').closest('span');
    const dismissBtn = badge?.querySelector('button');
    expect(dismissBtn).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Badge dismissible onDismiss={onDismiss}>Dismissible</Badge>);
    const badge = screen.getByText('Dismissible').closest('span');
    const dismissBtn = badge?.querySelector('button');

    fireEvent.click(dismissBtn!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText('Custom').closest('span');
    expect(badge).toHaveClass('custom-badge');
  });

  it('renders with base classes', () => {
    render(<Badge>Base test</Badge>);
    const badge = screen.getByText('Base test').closest('span');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-medium');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement>;
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('supports additional HTML attributes', () => {
    render(<Badge data-testid="badge-test" aria-label="Status badge">Test</Badge>);
    const badge = screen.getByTestId('badge-test');
    expect(badge).toHaveAttribute('aria-label', 'Status badge');
  });

  it('renders both dot and dismissible together', () => {
    render(<Badge dot dismissible onDismiss={() => {}}>Both</Badge>);
    const badge = screen.getByText('Both').closest('span');
    expect(badge?.querySelector('[class*="h-1.5"]')).toBeInTheDocument();
    expect(badge?.querySelector('button')).toBeInTheDocument();
  });
});
