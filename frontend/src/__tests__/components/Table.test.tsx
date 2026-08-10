import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Magic UI Table component
const MockTable = ({
  columns = [],
  data = [],
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
}: any) => {
  const handleSelect = (id: string) => {
    if (onSelectionChange) {
      onSelectionChange([...selectedRows, id]);
    }
  };

  return (
    <div className="table-container" data-testid="table">
      <table>
        <thead>
          <tr>
            {selectable && <th>Select</th>}
            {columns.map((col: any) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              data-selected={selectedRows.includes(row.id)}
            >
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                  />
                </td>
              )}
              {columns.map((col: any) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

describe('Table component', () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ];

  const data = [
    { id: '1', name: 'Alice', status: 'Active' },
    { id: '2', name: 'Bob', status: 'Inactive' },
    { id: '3', name: 'Charlie', status: 'Active' },
  ];

  it('renders table with data', () => {
    render(<MockTable columns={columns} data={data} />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<MockTable columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn();
    render(<MockTable columns={columns} data={data} onRowClick={onRowClick} />);

    fireEvent.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders selectable checkboxes when selectable is true', () => {
    render(<MockTable columns={columns} data={data} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(data.length);
  });

  it('handles row selection', () => {
    const onSelectionChange = vi.fn();
    render(
      <MockTable
        columns={columns}
        data={data}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(onSelectionChange).toHaveBeenCalledWith([data[0].id]);
  });

  it('renders empty state when no data', () => {
    render(<MockTable columns={columns} data={[]} />);
    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();
  });

  it('supports custom row attributes', () => {
    render(<MockTable columns={columns} data={data} />);
    const row = screen.getByText('Alice').closest('tr');
    expect(row).toHaveAttribute('data-selected', 'false');
  });
});
