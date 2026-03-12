import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colección Completa — Mi Vaquita",
  description: "Explora nuestra selección artesanal de cupcakes, tortas y galletas en Popayán. Piezas de repostería diseñadas con pasión y ingredientes locales.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
