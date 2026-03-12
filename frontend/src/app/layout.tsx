import type { Metadata } from "next";
import "@fontsource-variable/quicksand";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mi Vaquita | Repostería de Autor en Popayán",
  description: "Descubre Mi Vaquita, repostería de autor en Popayán donde el diseño se une con el sabor artesanal. Reserva tu pedido hoy y vive una experiencia única.",
  keywords: ["repostería artesanal Popayán", "tortas personalizadas", "diseño de repostería", "Mi Vaquita Popayán", "C.C. Campanario", "repostería de autor"],
  authors: [{ name: "Mi Vaquita Studio" }],
  metadataBase: new URL("https://mi-vaquita-popayan.vercel.app"),
  openGraph: {
    title: "Mi Vaquita",
    description: "Repostería de autor en Popayán. Arte en cada bocado.",
    url: "https://mi-vaquita-popayan.vercel.app",
    siteName: "Mi Vaquita",
    locale: "es_CO",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32" },
      { url: "/icons/favicon.ico" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
  },
  manifest: "/icons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
