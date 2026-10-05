import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tooba Engineering | IT & Security Solutions (CCTV, Data Centers, Networking)',
  description: 'Tooba Engineering - 17+ Years of Excellence in Enterprise CCTV, Networking, Data Centers, and Security Solutions. Serving B2B Institutions & Residential Clients.',
  openGraph: {
    title: 'Tooba Engineering | IT & Security Solutions',
    description: '17+ Years of Enterprise CCTV, Networking, Biometrics, and Security Engineering Excellence in Pakistan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tooba Engineering | IT & Security Solutions',
    description: '17+ Years of Enterprise CCTV, Networking, Biometrics, and Security Engineering Excellence in Pakistan.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
