import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de Espera y Turnos — Mi Vaquita",
  description: "Consulta el estado de tu pedido en tiempo real. En Mi Vaquita valoramos tu tiempo tanto como el sabor de nuestras creaciones.",
};

export default function TurnosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
