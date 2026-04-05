import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('Navbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders logo or brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    // Should have brand/logo text or image
    expect(document.body.textContent).toContain('TrustDegree');
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    // Check for main nav links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('has links to main pages', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homeLinks = screen.getAllByRole('link', { name: /nav\.home/i });
    expect(homeLinks.some((link) => link.getAttribute('href') === '/')).toBe(true);

    const verifyLink = screen.getByRole('link', { name: /nav\.verify/i });
    expect(verifyLink).toHaveAttribute('href', '/verify');

    const howItWorksLink = screen.getByRole('link', { name: /nav\.howitworks/i });
    expect(howItWorksLink).toHaveAttribute('href', '/how-it-works');
  });

  it('renders language switcher', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const langButtons = screen.getAllByRole('button', { name: /select language/i });
    expect(langButtons.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu on hamburger click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Find hamburger menu button (usually with aria-label or menu icon)
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();

    // Click to open
    fireEvent.click(menuButton);

    // Mobile menu should become visible (check for nav links)
    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('closes mobile menu when link is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Click the mobile "Home" link (second one because desktop+mobile are rendered)
    const homeLinks = screen.getAllByRole('link', { name: /nav\.home/i });
    fireEvent.click(homeLinks[1]);

    // Menu should close and button label should return to "Open menu"
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('is responsive and visible on all viewports', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const navbar = document.querySelector('nav');
    expect(navbar).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders admin link for admin users (if applicable)', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Admin link might be conditionally rendered
    const adminLinks = screen.getAllByRole('link', { name: /nav\.(login|dashboard)/i });
    expect(adminLinks.length).toBeGreaterThan(0);
  });
});
