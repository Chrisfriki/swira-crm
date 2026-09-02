import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swira CRM",
  description: "Gestión de tareas y clientes del equipo Swira",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
