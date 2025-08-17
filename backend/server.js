const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Stripe
const stripe = Stripe(process.env.STRIPE_SECRET);

// Multer (para fotos locales de prueba)
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("photo"), (req, res) => {
  console.log(req.file);
  res.json({ message: "Foto recibida ✅" });
});

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
