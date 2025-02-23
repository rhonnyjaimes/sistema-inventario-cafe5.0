const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class Usuario {
  static async crear(nombre, email, contrasena, rol) {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)";
    const [result] = await pool.execute(query, [nombre, email, hashedPassword, rol]);
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    const [result] = await pool.execute(query, [email]);
    return result[0];
  }
}

module.exports = Usuario;
