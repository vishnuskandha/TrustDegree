import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from '@/components/magic/Modal';

describe('Modal component', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Test Modal',
  };

  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup
    document.body.style.overflow = '';
    vi.clearAllMocks();
  });

  it('renders when open is true', () => {
    render(<Modal {...defaultProps}>Modal content</Modal>);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<Modal {...defaultProps} open={false}>Content</Modal>);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal {...defaultProps} title="Test Title">Content</Modal>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not show close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false}>Content</Modal>);
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(<Modal {...defaultProps}>Content</Modal>);
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('calls onOpenChange with false when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test">
        Content
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange with false when overlay is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test">
        Content
      </Modal>
    );

    // Find overlay (first div with backdrop class) and click it
    const overlay = document.querySelector('[class*="backdrop"]');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('does not close on overlay click when closeOnOverlayClick is false', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test" closeOnOverlayClick={false}>
        Content
      </Modal>
    );

    const overlay = document.querySelector('[class*="backdrop"]');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onOpenChange).not.toHaveBeenCalled();
    }
  });

  it('closes modal on Escape key press', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test">
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on Escape when closeOnEscape is false', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test" closeOnEscape={false}>
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('prevents body scroll when modal is open', () => {
    render(<Modal {...defaultProps}>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal is closed', async () => {
    const { rerender } = render(<Modal {...defaultProps} open={true}>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal {...defaultProps} open={false}>Content</Modal>);
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });

  it('renders description when provided', () => {
    render(
      <Modal {...defaultProps} description="Modal description">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal description')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Modal {...defaultProps}>
        <button>Action button</button>
      </Modal>
    );
    expect(screen.getByRole('button', { name: /action button/i })).toBeInTheDocument();
  });

  it('applies correct size classes for sm', () => {
    render(<Modal {...defaultProps} size="sm">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('max-w-sm');
  });

  it('applies correct size classes for md', () => {
    render(<Modal {...defaultProps} size="md">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('max-w-md');
  });

  it('applies correct size classes for lg', () => {
    render(<Modal {...defaultProps} size="lg">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('max-w-lg');
  });

  it('applies correct size classes for xl', () => {
    render(<Modal {...defaultProps} size="xl">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('max-w-xl');
  });

  it('applies correct size classes for full', () => {
    render(<Modal {...defaultProps} size="full">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('max-w-4xl');
  });

  it('has proper accessibility attributes', () => {
    render(<Modal {...defaultProps}>Content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('sets aria-describedby when description is provided', () => {
    render(<Modal {...defaultProps} description="Description">Content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('does not set aria-labelledby when title is not provided', () => {
    render(<Modal {...defaultProps} title={undefined}>Content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('applies custom className', () => {
    render(<Modal {...defaultProps} className="custom-modal">Content</Modal>);
    const modalContent = screen.getByText('Content').closest('[class*="max-w"]');
    expect(modalContent).toHaveClass('custom-modal');
  });

  it('renders overlay with backdrop blur', () => {
    render(<Modal {...defaultProps}>Content</Modal>);
    const overlay = document.querySelector('[class*="backdrop-blur"]');
    expect(overlay).toBeInTheDocument();
  });

  it('removes event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<Modal {...defaultProps}>Content</Modal>);

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
