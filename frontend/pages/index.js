export default function Home() {
  return (
    <div>
      <h1>Bienvenido a mi Sistema Web</h1>
      <ul>
        <li><a href="/upload">Subir Foto</a></li>
        <li><a href="/add-data">Agregar Producto</a></li>
        <li><a href="/checkout">Pagar con Stripe</a></li>
      </ul>
    </div>
  );
}

