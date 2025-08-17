import { useState } from "react";

export default function AddDataPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Agregar Producto</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button type="submit">Guardar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
