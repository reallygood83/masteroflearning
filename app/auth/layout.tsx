/**
 * Auth Layout
 * - Wraps all /auth/* routes
 * - Provides consistent layout for authentication pages
 */

import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
