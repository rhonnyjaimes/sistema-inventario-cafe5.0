const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Proveedor = sequelize.define("Proveedor", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  historial_compras: {
    type: DataTypes.TEXT,
  },
});

module.exports = Proveedor;