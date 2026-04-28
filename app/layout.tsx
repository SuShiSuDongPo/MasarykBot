import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat with T.G. Masaryk",
  description: "A calm, wise conversation with the first Czechoslovak president",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="min-h-screen bg-czech-cream antialiased">
        {children}
      </body>
    </html>
  );
}
