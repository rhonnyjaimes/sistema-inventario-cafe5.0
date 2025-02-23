const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");
const basename = path.basename(__filename);

const models = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    models[model.name] = model;
  });

// Establecer relaciones aquí (ej: Proveedor.hasMany(Grano))
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { ...models, sequelize };