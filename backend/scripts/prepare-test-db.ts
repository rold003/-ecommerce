import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Sincroniza el esquema de Prisma contra la base de datos de pruebas (la crea
// si no existe). Se corre una vez antes de la suite de tests, no en cada test.
const testEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.test')));

execSync('npx prisma db push --skip-generate --accept-data-loss', {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: { ...process.env, ...testEnv },
});
