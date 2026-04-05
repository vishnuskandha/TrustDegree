import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/magic/Card';

describe('Card component', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default bordered style', () => {
    render(<Card bordered={true}>Bordered card</Card>);
    const card = screen.getByText('Bordered card').closest('div');
    expect(card). toHaveClass('border-border');
  });

  it('removes border when bordered is false', () => {
    render(<Card bordered={false}>No border card</Card>);
    const card = screen.getByText('No border card').closest('div');
    expect(card).not.toHaveClass('border-border');
  });

  it('applies hoverable styles when hoverable is true', () => {
    render(<Card hoverable={true}>Hoverable card</Card>);
    const card = screen.getByText('Hoverable card').closest('div');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('hover:-translate-y-0.5');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom</Card>);
    const card = screen.getByText('Custom').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('renders with correct base classes', () => {
    render(<Card>Base test</Card>);
    const card = screen.getByText('Base test').closest('div');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow-sm');
  });
});

describe('CardHeader component', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies default spacing classes', () => {
    render(<CardHeader>Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle component', () => {
  it('renders children correctly', () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders as heading element', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('H3');
  });

  it('applies typography classes', () => {
    render(<CardTitle>Typography title</CardTitle>);
    const title = screen.getByText('Typography title');
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('font-display');
  });
});

describe('CardDescription component', () => {
  it('renders children correctly', () => {
    render(<CardDescription>Card description text</CardDescription>);
    expect(screen.getByText('Card description text')).toBeInTheDocument();
  });

  it('renders as paragraph element', () => {
    render(<CardDescription>Description</CardDescription>);
    const desc = screen.getByText('Description');
    expect(desc.tagName).toBe('P');
  });

  it('applies muted foreground text color', () => {
    render(<CardDescription>Muted text</CardDescription>);
    expect(screen.getByText('Muted text')).toHaveClass('text-muted-foreground');
  });
});

describe('CardContent component', () => {
  it('renders children correctly', () => {
    render(<CardContent>Main content</CardContent>);
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('applies padding classes', () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText('Content').closest('div');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });
});

describe('CardFooter component', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer actions</CardFooter>);
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('applies flex layout', () => {
    render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText('Footer').closest('div');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
  });
});

describe('Card composition', () => {
  it('renders complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test description</CardDescription>
        </CardHeader>
        <CardContent>Content area</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Content area')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('supports hoverable with full composition', () => {
    const { container } = render(
      <Card hoverable>
        <CardHeader>
          <CardTitle>Hoverable Card</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = container.firstElementChild;
    expect(card).toHaveClass('hover:shadow-md');
  });
});
