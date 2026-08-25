import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('root app uses real Supabase application module', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /src="\/src\/app\.js"/);
  assert.doesNotMatch(html, /rxorbit_demo_session/);
  assert.doesNotMatch(html, /alert\(/);
});

test('real app module contains protected auth and live data wiring', async () => {
  const source = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(source, /signInWithPassword/);
  assert.match(source, /signInWithOAuth/);
  assert.match(source, /resetPasswordForEmail/);
  assert.match(source, /from\('opportunities'\)/);
  assert.match(source, /functions\.invoke\('rxorbit-workflow'/);
  assert.match(source, /from\('staff'\)/);
});
