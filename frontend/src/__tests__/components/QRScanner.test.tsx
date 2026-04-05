import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import QRScanner from '@/components/QRScanner';

const renderMock = vi.fn();
const clearMock = vi.fn(() => Promise.resolve());

vi.mock('html5-qrcode', () => {
  class MockHtml5QrcodeScanner {
    render = renderMock;
    clear = clearMock;

    constructor(_elementId: string, _config: unknown, _verbose: boolean) {
      // constructor intentionally empty for unit test mock
    }
  }

  return {
    Html5QrcodeScanner: MockHtml5QrcodeScanner,
  };
});

describe('QRScanner component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scanner container', () => {
    const { container } = render(<QRScanner onScan={() => {}} />);
    expect(container.querySelector('div[id^="qr-scanner-"]')).toBeInTheDocument();
  });

  it('registers scanner callbacks on mount', () => {
    render(<QRScanner onScan={() => {}} />);
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock.mock.calls[0]).toHaveLength(2);
  });

  it('calls onScan when scanner emits decoded text', () => {
    const onScan = vi.fn();
    render(<QRScanner onScan={onScan} />);

    const [onSuccess] = renderMock.mock.calls[0] as [(decodedText: string) => void, (error: string) => void];
    onSuccess('decoded-qr-value');

    expect(onScan).toHaveBeenCalledWith('decoded-qr-value');
  });

  it('calls onError when scanner emits decode error', () => {
    const onError = vi.fn();
    render(<QRScanner onScan={() => {}} onError={onError} />);

    const [, onDecodeError] = renderMock.mock.calls[0] as [(decodedText: string) => void, (error: string) => void];
    onDecodeError('camera unavailable');

    expect(onError).toHaveBeenCalledWith('camera unavailable');
  });

  it('renders with custom className', () => {
    const { container } = render(<QRScanner onScan={() => {}} className="custom-scanner" />);
    const scannerContainer = container.querySelector('.custom-scanner');
    expect(scannerContainer).toBeInTheDocument();
    expect(scannerContainer).toHaveStyle({ width: '100%' });
  });

  it('cleans up scanner resources on unmount', () => {
    const { unmount } = render(<QRScanner onScan={() => {}} />);

    unmount();

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it('supports removable prop for API compatibility', () => {
    const { container } = render(<QRScanner onScan={() => {}} removable={false} />);
    const scannerContainer = container.querySelector('div[id^="qr-scanner-"]');

    expect(scannerContainer).toBeInTheDocument();
  });

  it('renders without onError handler', () => {
    const { container } = render(<QRScanner onScan={() => {}} />);
    const scannerContainer = container.querySelector('div[id^="qr-scanner-"]');

    expect(container).toBeInTheDocument();
    expect(scannerContainer).toBeInTheDocument();
  });
});
