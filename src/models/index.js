import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import seq from '../db.js'
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

const db = {};

const files = fs.readdirSync(__dirname).filter(
  (file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
);

for (const file of files) {
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)).href);
  const ModelClass = modelModule.default;

  db[ModelClass.name] = ModelClass;
}

// chama associate se existir
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.seq = seq;
db.Sequelize = Sequelize;

export default db;
