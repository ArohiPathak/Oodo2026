import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import { PageWrapper } from '@/components/layout/PageWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Dayflow HRMS - Employees Dashboard',
  description: 'Manage and view your team attendance, leave and profile metrics in Dayflow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-gray-800 bg-lavender min-h-screen">
        <AppProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
