const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Stripe = require("stripe");
const admin = require("firebase-admin");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Inicializar Firebase Admin (solo Firestore)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore(); // Firestore

// 🔹 Configurar Cloudinary (usa CLOUDINARY_URL)
cloudinary.config(); // Se configura automáticamente desde la variable de entorno

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fotos",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 🔹 Endpoint para subir fotos a Cloudinary
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    res.json({ message: "Foto subida a Cloudinary ✅", url: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Endpoint para guardar datos en Firestore
app.post("/add-data", async (req, res) => {
  try {
    await db.collection("productos").add(req.body);
    res.json({ message: "Datos guardados en Firestore ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Endpoint de checkout con Stripe
const stripe = Stripe(process.env.STRIPE_SECRET);
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Ejemplo de compra" },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000?success=true",
      cancel_url: "http://localhost:3000?canceled=true",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
