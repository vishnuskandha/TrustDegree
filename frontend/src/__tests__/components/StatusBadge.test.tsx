import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge';

describe('StatusBadge component', () => {
  it('renders valid status correctly', () => {
    render(<StatusBadge status="valid" />);
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('renders revoked status correctly', () => {
    render(<StatusBadge status="revoked" />);
    expect(screen.getByText('Revoked')).toBeInTheDocument();
  });

  it('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders expired status correctly', () => {
    render(<StatusBadge status="expired" />);
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('showIcon prop works', () => {
    const { rerender } = render(<StatusBadge status="valid" showIcon={true} />);
    expect(screen.getByText('Valid')).toBeInTheDocument();

    rerender(<StatusBadge status="valid" showIcon={false} />);
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender, unmount } = render(<StatusBadge status="valid" size="sm" />);
    const badge = screen.getByText('Valid').parentElement;
    expect(badge).toHaveClass('text-xs');

    rerender(<StatusBadge status="valid" size="md" />);
    expect(screen.getByText('Valid').parentElement).toHaveClass('text-sm');

    rerender(<StatusBadge status="valid" size="lg" />);
    expect(screen.getByText('Valid').parentElement).toHaveClass('text-base');

    unmount();
  });

  it('applies custom className', () => {
    render(<StatusBadge status="valid" className="custom-badge" />);
    const badge = screen.getByText('Valid').parentElement;
    expect(badge).toHaveClass('custom-badge');
  });

  it('renders all status variants', () => {
    const statuses = ['valid', 'revoked', 'pending', 'expired'] as const;
    statuses.forEach((status) => {
      const { unmount } = render(<StatusBadge status={status} />);
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });
});
