
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = app.isPackaged
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(__dirname, '../config.json');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (err) {
  console.error('[Config] Erro ao ler config.json:', err);
}

export default async function getConfigData() {

    let response = await fetch(config.API_URL, {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': config.PARSE_APPLICATION_ID,
            'X-Parse-REST-API-Key': config.PARSE_API_KEY,
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`Error fetching config data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results[0];
}
