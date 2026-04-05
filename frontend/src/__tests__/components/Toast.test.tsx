import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/magic/Toast';

const TestActions = () => {
  const { addToast, dismissAll } = useToast();

  return (
    <div>
      <button
        onClick={() => addToast({ title: 'Success', description: 'Operation complete', variant: 'success' })}
      >
        Add Success
      </button>
      <button
        onClick={() => addToast({ title: 'Error', description: 'Something failed', variant: 'error' })}
      >
        Add Error
      </button>
      <button onClick={() => dismissAll()}>Dismiss All</button>
    </div>
  );
};

describe('Toast notifications', () => {
  it('renders toast with title and description', async () => {
    render(
      <ToastProvider>
        <TestActions />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add success/i }));

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation complete')).toBeInTheDocument();
    });
  });

  it('renders error variant toast', async () => {
    render(
      <ToastProvider>
        <TestActions />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add error/i }));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something failed')).toBeInTheDocument();
    });
  });

  it('dismisses all toasts', async () => {
    render(
      <ToastProvider>
        <TestActions />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add success/i }));
    fireEvent.click(screen.getByRole('button', { name: /add error/i }));

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /dismiss all/i }));

    await waitFor(() => {
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  it('has alert role for accessibility', async () => {
    render(
      <ToastProvider>
        <TestActions />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add success/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
