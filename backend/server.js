const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Stripe = require("stripe");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const db = admin.firestore(); // Firestore
const bucket = admin.storage().bucket(); // Storage

// 🔹 Stripe
const stripe = Stripe(process.env.STRIPE_SECRET);

// 🔹 Multer (subida temporal)
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Ruta para subir fotos localmente y a Firebase Storage
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const blob = bucket.file(`fotos/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on("error", (err) => res.status(500).json({ error: err.message }));
    blobStream.on("finish", () => res.json({ message: "Foto subida a Firebase ✅" }));

    blobStream.end(req.file.buffer); // usar buffer en lugar de file.path
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Ruta para guardar datos en Firestore
app.post("/add-data", async (req, res) => {
  try {
    await db.collection("productos").add(req.body);
    res.json({ message: "Datos guardados en Firestore ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Ruta de checkout con Stripe
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
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
