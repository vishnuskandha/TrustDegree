declare module '@studio-freight/react-lenis' {
  export const Lenis: React.ComponentType<{
    root?: boolean;
    options?: Record<string, unknown>;
    children?: React.ReactNode;
  }>;
  export default Lenis;
}
