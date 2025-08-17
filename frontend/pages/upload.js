import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]); // Aquí guardamos las URLs

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.url) {
      // Guardamos la URL en el array de imágenes
      setUploadedImages((prev) => [...prev, data.url]);
    }
  };

  return (
    <div>
      <h1>Subir Foto</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Subir</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Imágenes subidas</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {uploadedImages.map((url, index) => (
          <img key={index} src={url} alt={`Subida ${index}`} width={150} />
        ))}
      </div>
    </div>
  );
}
