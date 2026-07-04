'use client';

import * as React from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';

/**
 * Adapter so MUI components (Link, Button, etc.) route through `next/link` while
 * call sites pass only `href`. Wired as the default link component in the theme,
 * which avoids passing a component function across the RSC boundary.
 */
export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<NextLinkProps, 'href'> & { href: NextLinkProps['href'] }
>(function LinkBehavior(props, ref) {
  const { href, ...other } = props;
  return <NextLink ref={ref} href={href} {...other} />;
});
