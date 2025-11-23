/**
 * Korean (ko) Layout
 * - Wraps all /ko/* routes
 * - Provides consistent layout for Korean language pages
 */

import { ReactNode } from 'react';

export default function KoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
