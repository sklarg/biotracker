import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BioTracker",
  description: "Tu seguimiento físico y nutricional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased bg-gray-950`}>

        {/* Barra de navegación */}
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-xl">BioTracker</span>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Inicio
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/registro" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Registro
              </Link>
            </div>
          </div>
        </nav>

        {/* Contenido de cada página */}
        {children}

      </body>
    </html>
  );
}