import { readdir, stat, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const selector = args.find((arg) => /^\d{2}(?:-|$)/.test(arg));
const preview = args.includes('--preview');
const pdf = args.includes('--pdf');
const forwarded = args.filter((arg) => arg !== selector && arg !== '--preview' && arg !== '--pdf');
const wanted = selector ?? (preview ? '01' : '');
const directories = (await readdir('cursus')).filter((name) => name.startsWith(wanted)).sort();
const decks = [];
for (const directory of directories) {
  const file = path.join('cursus', directory, 'slides.md');
  try { if ((await stat(file)).isFile()) decks.push({ directory, file }); } catch { /* startgids heeft geen slides */ }
}
if (!decks.length) throw new Error(`Geen slides gevonden voor ${wanted || 'de cursus'}`);
await mkdir('dist/slides', { recursive: true });
for (const { directory, file } of decks) {
  const output = path.join('dist/slides', `${directory}.${pdf ? 'pdf' : 'html'}`);
  const command = [
    path.resolve('node_modules/@marp-team/marp-cli/marp-cli.js'), file,
    '--theme-set', 'thema/the-cloud.css', '--output', output,
    ...(pdf ? ['--pdf'] : []), ...(preview ? ['--preview'] : []), ...forwarded,
  ];
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, command, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', resolve);
  });
  if (exitCode !== 0) process.exit(typeof exitCode === 'number' ? exitCode : 1);
}
