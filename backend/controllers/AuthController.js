const { db, admin } = require("../config/firebase");
const User = require("../models/User");

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      // Firebase Authentication: login con email y password
      const userRecord = await admin.auth().getUserByEmail(email);

      // Aquí solo simulamos verificación de password
      // Para producción, usa Firebase Authentication en frontend o con SDK Admin
      if (!userRecord) throw new Error("Usuario no encontrado");

      const user = new User({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || "",
      });

      res.json({ message: "Login exitoso ✅", user });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  async register(req, res) {
    const { email, password, displayName } = req.body;
    try {
      // Crear usuario en Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      // Guardar usuario en Firestore
      const user = new User({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || "",
      });

      await db.collection("users").doc(user.uid).set(user.toFirestore());

      res.json({ message: "Registro exitoso ✅", user });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
