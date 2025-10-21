import type { Metadata } from "next";
import "./globals.css";
import "@/styles/custom.css";
import { Providers } from "@/components/Providers";
import { ToastProvider } from '@/components/ToastProvider';
import { FontProvider } from '@/components/FontProvider';
// Importar polyfill para fetch durante el build
import '@/lib/fetchPolyfill';
import '@/lib/buildTimeFetch';

export const metadata: Metadata = {
  title: "LB Premium - Artículos Personalizados",
  description: "Especialistas en diseño y producción de artículos personalizados. Kits, textiles, marroquinería y servicios de impresión premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <FontProvider>
          <Providers>
            {children}
            <ToastProvider />
          </Providers>
        </FontProvider>
      </body>
    </html>
  );
}