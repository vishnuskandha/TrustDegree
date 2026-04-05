import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes with truthy values', () => {
    const result = cn('base', true && 'conditional', false && 'excluded');
    expect(result).toBe('base conditional');
  });

  it('should handle falsy conditional classes', () => {
    const result = cn('base', false && 'conditional');
    expect(result).toBe('base');
  });

  it('should merge arrays of class names', () => {
    const result = cn(['class1', 'class2'], ['class3']);
    expect(result).toBe('class1 class2 class3');
  });

  it('should deduplicate class names with tailwind-merge', () => {
    const result = cn('p-4 p-4', 'm-2 m-2');
    expect(result).toBe('p-4 m-2');
  });

  it('should handle conflicting utility classes with tailwind precedence', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('should handle object syntax', () => {
    const result = cn('base', { 'text-red-500': true, 'text-blue-500': false });
    expect(result).toBe('base text-red-500');
  });

  it('should handle complex real-world scenario', () => {
    const isActive = true;
    const size = 'md';
    const result = cn(
      'flex items-center',
      isActive && 'text-primary',
      `h-${size}`,
      'px-4 py-2'
    );
    expect(result).toContain('flex items-center');
    expect(result).toContain('text-primary');
    expect(result).toContain('h-md');
    expect(result).toContain('px-4 py-2');
  });
});
