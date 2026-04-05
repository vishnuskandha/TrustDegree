import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Verify from '@/pages/Verify';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/services/api', () => ({
  verifyAPI: {
    getDegree: vi.fn(async () => ({
      data: {
        valid: true,
        revoked: false,
        student: { name: 'Jane Doe', address: '0x123' },
        degree: { university: 'Test University', type: 'Bachelor', graduationYear: '2024' },
        issuedAt: new Date().toISOString(),
        chain: { txHash: '0xabc' },
      },
    })),
  },
}));

describe('Verify page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders verify page header content', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    expect(screen.getByText('verify.title')).toBeInTheDocument();
    expect(screen.getByText('verify.subtitle')).toBeInTheDocument();
  });

  it('renders mode toggle controls', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'verify.mode.manual' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'verify.mode.qr' })).toBeInTheDocument();
  });

  it('renders manual verification form fields', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('verify.form.contractPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('verify.form.tokenPlaceholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify\.form\.submit/i })).toBeInTheDocument();
  });

  it('switches to qr mode and shows scanner start action', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'verify.mode.qr' }));

    expect(screen.getByText('verify.qr.prompt')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'verify.qr.start' })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty manual form', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /verify\.form\.submit/i }));

    expect(screen.getByText('verify.error.missingFields')).toBeInTheDocument();
  });
});
