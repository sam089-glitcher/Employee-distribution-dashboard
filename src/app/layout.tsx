import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employee Performance Dashboard",
  description: "Comprehensive HR analytics and performance tracking dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  const root = document.documentElement;
                  
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.classList.remove('light');
                  } else if (theme === 'light') {
                    root.classList.add('light');
                    root.classList.remove('dark');
                  } else if (theme === 'system') {
                    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (systemDark) {
                      root.classList.add('dark');
                      root.classList.remove('light');
                    } else {
                      root.classList.add('light');
                      root.classList.remove('dark');
                    }
                  }
                } catch (e) {
                  // Fallback to light theme
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
