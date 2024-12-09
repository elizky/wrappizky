import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Listening History',
  description: 'Track your music and podcast listening activity',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body className={jetbrainsMono.className}>
        {children}
        <footer className='py-8 flex items-center justify-center'>
          <p className='font-mono text-xs'>
            Created By{' '}
            <Link
              href='https://www.izky.dev/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline'
            >
              Izky
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
