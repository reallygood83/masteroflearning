/**
 * Admin Layout
 * - Wraps all /admin/* routes
 * - Provides consistent layout for admin pages
 */

import { ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
