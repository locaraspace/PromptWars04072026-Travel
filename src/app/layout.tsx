import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TravelAI — Discover authentic destinations',
  description:
    'An AI-powered travel companion that helps you discover authentic destinations, hidden gems, heritage stories and local culture beyond typical tourism.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
