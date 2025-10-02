import type { Metadata } from "next";
import { Orbitron, Kanit } from "next/font/google";
import "./globals.css";
import "@/styles/custom.css";
import { Providers } from "@/components/Providers";
import { Toaster } from 'react-hot-toast';

const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading'
});

const kanit = Kanit({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: "Fashion Style - Ropa Elegante y Moderna",
  description: "Tienda de ropa con las últimas tendencias de moda. Vestidos, blazers, camisas y más. Envío rápido y asesoría de estilo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
