import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rocket Telhados | Reformas e trocas de telhados em Joinville',
  description: 'Trocas e reformas de telhados em Joinville e região. Conheça o trabalho da Rocket Telhados e peça seu orçamento pelo WhatsApp.',
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Rocket Telhados | Reformas e trocas de telhados em Joinville',
    description: 'Trocas e reformas de telhados em Joinville e região. Converse com a equipe pelo WhatsApp.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning><body>{children}</body></html>;
}
