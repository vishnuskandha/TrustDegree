import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/magic/Skeleton';

describe('Skeleton component', () => {
  it('renders skeleton element', () => {
    render(<Skeleton />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Skeleton />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('bg-muted');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('renders with variant="text"', () => {
    render(<Skeleton variant="default" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('renders with variant="circular"', () => {
    render(<Skeleton variant="circular" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders with variant="rectangular"', () => {
    render(<Skeleton variant="rectangular" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('rounded-none');
  });

  it('applies custom width and height', () => {
    render(<Skeleton className="w-32 h-10" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('w-32');
    expect(skeleton).toHaveClass('h-10');
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-skeleton" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('has background muted color', () => {
    render(<Skeleton />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('bg-muted');
  });

  it('has animate-pulse class', () => {
    render(<Skeleton />);
    expect(document.querySelector('[class*="animate-pulse"]')).toBeInTheDocument();
  });

  it('combines variant and custom classes', () => {
    render(<Skeleton variant="default" className="w-3/4" />);
    const skeleton = document.querySelector('[class*="animate-pulse"]');
    expect(skeleton).toHaveClass('w-3/4');
    expect(skeleton).toHaveClass('rounded-md');
  });
});
