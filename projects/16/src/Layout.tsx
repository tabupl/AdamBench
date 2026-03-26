import type { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => (
  <main className="page-shell">
    <section className="card">{children}</section>
  </main>
);
