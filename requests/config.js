import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import { log } from 'electron-builder';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = app.isPackaged
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(__dirname, '../config.json');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (err) {
  log.info('[Config] Erro ao ler config.json:', err);
}

export default config;