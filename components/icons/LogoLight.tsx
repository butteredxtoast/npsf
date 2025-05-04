import Image from 'next/image';
import * as React from 'react';

export function LogoLight(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      src="/icons/svgs/black-text-on-white.svg"
      alt="Logo (light mode)"
      width={120}
      height={116}
      {...props}
    />
  );
} 