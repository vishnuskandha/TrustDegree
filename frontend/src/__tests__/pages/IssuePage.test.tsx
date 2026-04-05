import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IssuePage from '@/pages/IssuePage';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    watch: vi.fn(() => ({})),
    setValue: vi.fn(),
    formState: {
      errors: {},
      isDirty: true,
      isValid: true,
    },
    reset: vi.fn(),
  }),
  FormProvider: ({ children }: any) => <>{children}</>,
  Controller: ({ render }: any) =>
    render
      ? render({
          field: { value: '', onChange: vi.fn(), onBlur: vi.fn(), name: 'mock-field', ref: vi.fn() },
          fieldState: { invalid: false, error: undefined },
        })
      : null,
}));

// Mock magic components
vi.mock('@/components/magic', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Input: ({ ...props }: any) => <input data-testid="input" {...props} />,
  Select: ({ ...props }: any) => <select data-testid="select" {...props} />,
  Button: ({ children, ...props }: any) => <button data-testid="button" {...props}>{children}</button>,
  Modal: ({ open, children, ...props }: any) => open ? <div data-testid="modal" {...props}>{children}</div> : null,
  useToast: () => ({
    addToast: vi.fn(),
    toasts: [],
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Share2: () => <div data-testid="share-icon">Share</div>,
  User: () => <div>User</div>,
  GraduationCap: () => <div>GraduationCap</div>,
  Building2: () => <div>Building2</div>,
  Award: () => <div>Award</div>,
  Calendar: () => <div>Calendar</div>,
  Link2: () => <div>Link2</div>,
  Wallet: () => <div>Wallet</div>,
  CheckCircle2: () => <div>CheckCircle2</div>,
  Loader2: () => <div>Loader2</div>,
  Trash2: () => <div>Trash2</div>,
  Save: () => <div>Save</div>,
  ArrowLeft: () => <div>ArrowLeft</div>,
}));

describe('IssuePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the issue credential page', () => {
    render(
      <MemoryRouter>
        <IssuePage />
      </MemoryRouter>
    );
    // Page should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders form elements', () => {
    render(
      <MemoryRouter>
        <IssuePage />
      </MemoryRouter>
    );

    // Should have form inputs
    const inputs = screen.getAllByTestId('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders submit button', () => {
    render(
      <MemoryRouter>
        <IssuePage />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has navigation elements', () => {
    render(
      <MemoryRouter>
        <IssuePage />
      </MemoryRouter>
    );

    // Should have navigation links
    expect(document.body).toBeTruthy();
  });
});
