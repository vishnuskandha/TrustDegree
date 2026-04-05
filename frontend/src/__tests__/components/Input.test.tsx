import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/magic/Input';

describe('Input component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('generates unique id when not provided', () => {
    render(<Input label="Test" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('id');
    expect(input.id).toMatch(/^input-/);
  });

  it('uses provided id', () => {
    render(<Input label="Test" id="custom-id" />);
    expect(screen.getByLabelText('Test')).toHaveAttribute('id', 'custom-id');
  });

  it('shows error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-destructive');
  });

  it('shows helper text', () => {
    render(<Input helperText="Optional helper text" />);
    expect(screen.getByText('Optional helper text')).toBeInTheDocument();
    expect(screen.getByText('Optional helper text')).toHaveClass('text-muted-foreground');
  });

  it('shows either error or helper text, not both', () => {
    const { rerender } = render(<Input helperText="Helper" />);
    expect(screen.getByText('Helper')).toHaveClass('text-muted-foreground');

    rerender(<Input error="Error" />);
    expect(screen.getByText('Error')).toHaveClass('text-destructive');
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('renders left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">icon</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">x</span>} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies left icon padding', () => {
    render(<Input leftIcon={<span>Icon</span>} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pl-10');
  });

  it('applies right icon padding', () => {
    render(<Input rightIcon={<span>Icon</span>} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pr-10');
  });

  it('shows error border when error prop is present', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
    expect(input).toHaveClass('focus-visible:ring-destructive');
  });

  it('handles user input', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input).toHaveValue('Hello World');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('meets minimum touch target size', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[44px]');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('supports all standard input attributes', () => {
    render(
      <Input
        type="email"
        name="email"
        required
        aria-describedby="help-text"
        autoComplete="email"
        data-testid="email-input"
      />
    );

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-describedby', 'help-text');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('handles focus styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:outline-none');
    expect(input).toHaveClass('focus-visible:ring-2');
    expect(input).toHaveClass('focus-visible:ring-ring');
  });

  it('renders without label label not provided', () => {
    render(<Input placeholder="No label" />);
    expect(screen.queryByText('No label')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('No label')).toBeInTheDocument();
  });
});
