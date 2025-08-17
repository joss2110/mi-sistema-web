import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("photo", file);
    await axios.post("http://localhost:4000/upload", formData);
    alert("Foto subida con éxito 🚀");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>📸 Mi Sistema Web</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Subir Foto</button>
    </div>
  );
}
