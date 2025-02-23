const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10); // Hash automático al guardar
      this.setDataValue("contrasena", hash);
    },
  },
  rol: {
    type: DataTypes.ENUM("operario", "supervisor", "gerente"),
    defaultValue: "operario",
  },
});

module.exports = Usuario;