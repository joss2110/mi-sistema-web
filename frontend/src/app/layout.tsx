import React from "react";
import Header from "../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="es">
      <head>
        <title>Mi Sistema</title>
      </head>
      <body>
        <Header />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
