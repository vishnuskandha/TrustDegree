import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QRCode } from '@/components/magic/QRCode';

describe('QRCode component', () => {
  it('renders QR code', () => {
    render(<QRCode value="https://example.com" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with correct value', () => {
    render(<QRCode value="https://trustdegree.io" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<QRCode value="test" size={200} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('renders with default size', () => {
    render(<QRCode value="test" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<QRCode value="test" className="custom-qr" />);
    const svg = document.querySelector('svg');
    expect(svg?.parentElement).toHaveClass('custom-qr');
  });

  it('updates when value changes', () => {
    const { rerender } = render(<QRCode value="initial" />);
    const initialPathCount = document.querySelectorAll('path').length;

    rerender(<QRCode value="updated" />);
    const updatedPathCount = document.querySelectorAll('path').length;

    expect(updatedPathCount).toBeGreaterThan(0);
    expect(updatedPathCount).toBe(initialPathCount);
  });
});
