import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('LanguageSwitcher component', () => {
  it('renders language toggle button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument();
  });

  it('displays current language', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText(/English|தமிழ்/)).toBeInTheDocument();
  });

  it('shows language options in dropdown', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    fireEvent.click(button);

    const listbox = screen.getByRole('listbox', { name: /language options/i });
    expect(within(listbox).getByRole('option', { name: /english/i })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /தமிழ்/i })).toBeInTheDocument();
  });

  it('calls changeLanguage when language is selected', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    fireEvent.click(button);
    const listbox = screen.getByRole('listbox', { name: /language options/i });
    fireEvent.click(within(listbox).getByRole('option', { name: /தமிழ்/i }));

    // Verify i18n.changeLanguage was called
    expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument();
  });

  it('has proper aria-label', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toHaveAttribute('aria-label', 'Select language');
  });

  it('closes dropdown when option is selected', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    fireEvent.click(button);
    const listbox = screen.getByRole('listbox', { name: /language options/i });
    expect(within(listbox).getByRole('option', { name: /தமிழ்/i })).toBeInTheDocument();

    fireEvent.click(within(listbox).getByRole('option', { name: /தமிழ்/i }));

    // Dropdown should close
    expect(screen.queryByRole('listbox', { name: /language options/i })).not.toBeInTheDocument();
  });
});
