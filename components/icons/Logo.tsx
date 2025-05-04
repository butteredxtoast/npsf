import * as React from "react";
import { LogoLight } from './LogoLight';
import { LogoDark } from './LogoDark';

// A theme-adaptive, responsive logo using currentColor for fill and transparent background
export function Logo(props: Omit<React.ComponentProps<typeof import('next/image').default>, 'src' | 'alt'>) {
  // Fallback: use matchMedia for color scheme detection
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(matcher.matches);
      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
      matcher.addEventListener('change', listener);
      return () => matcher.removeEventListener('change', listener);
    }
  }, []);

  return isDark ? <LogoDark {...props} /> : <LogoLight {...props} />;
} 