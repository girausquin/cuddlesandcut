// src/app/layout.tsx

import './globals.css';
import { LocaleProvider } from '@/context/LocaleProvider';

export const metadata = {
  title: 'Cuddles & Cuts – Premium In-Home Grooming',
  description:
    'Everything your pup needs in a single, all-inclusive service. Personalized care tailored to temperament and coat needs, with professional tools and techniques.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
