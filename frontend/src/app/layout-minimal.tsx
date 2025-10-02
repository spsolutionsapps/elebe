import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test App",
  description: "Test app",
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