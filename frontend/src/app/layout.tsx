import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-942575401"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-942575401');
          `}
        </Script>
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