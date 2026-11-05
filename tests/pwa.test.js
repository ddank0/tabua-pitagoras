import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

test('manifest.webmanifest contains valid standalone PWA configuration and icons', () => {
  const manifestPath = path.join(ROOT_DIR, 'manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.ok(Array.isArray(manifest.icons));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
});

test('all PRECACHE_ASSETS in sw.js exist on disk and sw.js is valid classic SW script', () => {
  const swPath = path.join(ROOT_DIR, 'sw.js');
  const swSource = fs.readFileSync(swPath, 'utf-8');

  const sandbox = {
    self: {
      addEventListener() {},
      skipWaiting() {},
      clients: { claim() {} }
    }
  };

  vm.runInNewContext(`${swSource}\nself.__PRECACHE_ASSETS = PRECACHE_ASSETS;`, sandbox);
  const precacheAssets = sandbox.self.__PRECACHE_ASSETS;

  assert.ok(Array.isArray(precacheAssets) && precacheAssets.length > 0);

  for (const assetUrl of precacheAssets) {
    if (assetUrl === './') continue;
    const relativePath = assetUrl.replace(/^\.\//, '');
    const fullPath = path.join(ROOT_DIR, relativePath);
    assert.ok(fs.existsSync(fullPath), `Missing precache asset: ${relativePath}`);
  }
});
