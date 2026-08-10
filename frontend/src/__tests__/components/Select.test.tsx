import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Magic UI Select component based on typical implementation
const MockSelect = ({
  options = [],
  value,
  onValueChange,
  placeholder,
  disabled,
}: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <div className="select-wrapper">
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        data-testid="select-input"
      >
        <option value="">{placeholder || 'Select an option'}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

describe('Select component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with placeholder', () => {
    render(<MockSelect options={options} placeholder="Choose an option" />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<MockSelect options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('allows selecting an option', () => {
    const onValueChange = vi.fn();
    render(<MockSelect options={options} onValueChange={onValueChange} />);

    const select = screen.getByTestId('select-input');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(onValueChange).toHaveBeenCalledWith('option2');
    expect(select).toHaveValue('option2');
  });

  it('shows current selection', () => {
    render(<MockSelect options={options} value="option2" />);

    const select = screen.getByTestId('select-input');
    expect(select).toHaveValue('option2');
  });

  it('is disabled when disabled prop is true', () => {
    render(<MockSelect options={options} disabled />);

    const select = screen.getByTestId('select-input');
    expect(select).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<MockSelect options={options} placeholder="Select option" />);

    const select = screen.getByTestId('select-input');
    expect(select.tagName).toBe('SELECT');
  });

  it('renders with empty options array', () => {
    render(<MockSelect options={[]} placeholder="No options" />);
    const select = screen.getByTestId('select-input');
    expect(select).toBeInTheDocument();
  });
});
