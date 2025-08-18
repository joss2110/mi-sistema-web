import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mi Sistema</h1>
      <nav>
        <Link href="/" className="mr-4">Inicio</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
