import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TempMail Pro",
    default: "TempMail Pro – Instant Disposable Email",
  },
  description:
    "Generate secure disposable email addresses instantly. Receive emails in real time without registration. Fast, private, and free.",
  keywords: ["temp mail", "temporary email", "disposable email", "anonymous email"],
  openGraph: {
    title: "TempMail Pro – Instant Disposable Email",
    description: "Generate secure disposable email addresses instantly. No registration required.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f7fb",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
