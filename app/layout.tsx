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
    template: "%s | Hassan Mail",
    default: "Hassan Mail – Instant Disposable Email",
  },
  description:
    "Instant disposable email addresses. Protect your privacy, avoid spam, stay anonymous online. Free, fast, no registration.",
  keywords: ["hassan mail", "temp mail", "temporary email", "disposable email", "anonymous email"],
  openGraph: {
    title: "Hassan Mail – Instant Disposable Email",
    description: "Instant disposable email addresses. No registration, no tracking.",
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
