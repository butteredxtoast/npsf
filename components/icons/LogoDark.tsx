import Image from 'next/image';
import * as React from 'react';

export function LogoDark(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      src="/icons/svgs/white-text-on-black.svg"
      alt="Logo (dark mode)"
      width={120}
      height={116}
      {...props}
    />
  );
} 