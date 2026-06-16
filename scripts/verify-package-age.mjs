#!/usr/bin/env node
/**
 * verify-package-age.mjs
 *
 * Bloquea la instalación si alguna dependencia tiene menos de MIN_AGE_DAYS
 * desde su publicación en el registry.
 *
 * Previene ataques de supply chain: paquetes maliciosos se publican y se
 * instalan antes de que la comunidad pueda detectarlos.
 *
 * Solo verifica en fresh installs (sin node_modules/).
 * Extrae versiones exactas del pnpm-lock.yaml.
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOCKFILE = resolve(ROOT, 'pnpm-lock.yaml');
const NODE_MODULES = resolve(ROOT, 'node_modules');
const MIN_AGE_DAYS = 3;
const MIN_AGE_MS = MIN_AGE_DAYS * 24 * 60 * 60 * 1000;

// ── Solo verificar en fresh installs ────────────────────────────────────────
if (existsSync(NODE_MODULES)) {
  process.exit(0);
}

// ── Parsear versiones exactas del lockfile ──────────────────────────────────
function parseLockfileVersions() {
  const text = readFileSync(LOCKFILE, 'utf-8');
  const packages = [];
  const lines = text.split('\n');
  let currentPkg = null;
  let inDeps = false;
  let inDevDeps = false;

  for (const line of lines) {
    // Detectar sección de dependencias
    if (line === '    dependencies:') {
      inDeps = true;
      inDevDeps = false;
      continue;
    }
    if (line === '    devDependencies:') {
      inDeps = false;
      inDevDeps = true;
      continue;
    }
    // Salir cuando cambia la indentación (fin de sección)
    if ((inDeps || inDevDeps) && line.length > 0 && !line.startsWith('      ')) {
      inDeps = false;
      inDevDeps = false;
      continue;
    }

    if (!inDeps && !inDevDeps) continue;

    // Capturar nombre del paquete
    const pkgMatch = line.match(/^      ['"]?(@?[^@:]+)['"]?:$/);
    if (pkgMatch) {
      currentPkg = pkgMatch[1];
      continue;
    }

    // Capturar specifier
    const specMatch = line.match(/^\s+specifier:\s+(.+)$/);
    if (specMatch && currentPkg) {
      // Solo rastrear para el merge final
      continue;
    }

    // Capturar versión resuelta
    const verMatch = line.match(/^\s+version:\s+([\d.]+)/);
    if (verMatch && currentPkg) {
      packages.push({ name: currentPkg, version: verMatch[1] });
      currentPkg = null;
    }
  }
  return packages;
}

// ── Verificar edad de cada paquete ──────────────────────────────────────────
async function main() {
  if (!existsSync(LOCKFILE)) {
    console.error('[verify-package-age] No se encontró pnpm-lock.yaml, saltando.');
    process.exit(0);
  }

  const packages = parseLockfileVersions();
  if (packages.length === 0) {
    console.error('[verify-package-age] No se encontraron dependencias en el lockfile.');
    process.exit(0);
  }

  console.error(`[verify-package-age] Verificando ${packages.length} paquetes (mín ${MIN_AGE_DAYS} días)...`);

  const failures = [];

  for (const { name, version } of packages) {
    try {
      const info = JSON.parse(
        execSync(`npm view "${name}" time --json`, {
          encoding: 'utf-8',
          timeout: 10_000,
          stdio: ['ignore', 'pipe', 'ignore'],
        })
      );

      const publishTime = info[version];
      if (!publishTime) continue; // puede ser privado o no encontrado

      const age = Date.now() - new Date(publishTime).getTime();
      if (age < MIN_AGE_MS) {
        const days = (age / (24 * 60 * 60 * 1000)).toFixed(1);
        failures.push({ name, version, days });
      }
    } catch {
      // Sin red o error en npm view — permitir (no bloquear desarrollo)
    }
  }

  if (failures.length > 0) {
    console.error(`\n[SEGURIDAD] ${failures.length} paquete(s) con menos de ${MIN_AGE_DAYS} días:\n`);
    for (const f of failures) {
      console.error(`  - ${f.name}@${f.version}  (${f.days} días)`);
    }
    console.error(`\nInstalación bloqueada.`);
    console.error(`Espera ${MIN_AGE_DAYS} días o ejecuta: pnpm install --ignore-scripts\n`);
    process.exit(1);
  }

  console.error('[verify-package-age] Todos los paquetes pasan la verificación de antigüedad.');
}

main();
