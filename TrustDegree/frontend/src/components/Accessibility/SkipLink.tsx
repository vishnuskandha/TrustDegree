import { useEffect } from "react";

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

/**
 * SkipLink component provides keyboard-only users a way to bypass
 * navigation and jump directly to main content.
 *
 * Accessibility: WCAG 2.1 AA compliant - meets criterion 2.4.1 Bypass Blocks
 */
export function SkipLink({ targetId = "main-content", children = "Skip to main content" }: SkipLinkProps) {
  useEffect(() => {
    // Handle skip navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        // Allow normal tab behavior
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-primary-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      tabIndex={0}
    >
      {children}
    </a>
  );
}
