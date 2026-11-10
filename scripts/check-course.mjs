import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const excluded = new Set(['.git', 'base', 'node_modules', 'dist']);

async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(location));
    else if (entry.name.endsWith('.md')) result.push(location);
  }
  return result;
}

function proseOnly(markdown) {
  let fence = null;
  return markdown.split('\n').map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return '';
    }
    return fence ? '' : line;
  }).join('\n');
}

function headingIds(markdown) {
  const used = new Map();
  return new Set([...proseOnly(markdown).matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => {
    const slug = match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/ /g, '-');
    const count = used.get(slug) ?? 0;
    used.set(slug, count + 1);
    return count ? `${slug}-${count}` : slug;
  }));
}

const files = await markdownFiles(root);
const failures = [];
let linkCount = 0;
let deckCount = 0;
for (const file of files) {
  const markdown = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  for (const match of proseOnly(markdown).matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//')) continue;
    linkCount += 1;
    const [location, fragment] = target.split('#');
    const destination = location ? path.resolve(path.dirname(file), decodeURIComponent(location)) : file;
    try {
      const info = await stat(destination);
      if (fragment && info.isFile() && destination.endsWith('.md')) {
        const content = await readFile(destination, 'utf8');
        if (!headingIds(content).has(decodeURIComponent(fragment))) {
          failures.push(`${relative}: onbekend kopanker in ${target}`);
        }
      }
    } catch {
      failures.push(`${relative}: ontbrekend lokaal doel ${target}`);
    }
  }
  if (path.basename(file) === 'slides.md') {
    deckCount += 1;
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    for (const field of ['marp: true', 'theme: the-cloud', 'size: 16:9', 'paginate: true']) {
      if (!frontmatter?.[1].split(/\r?\n/).includes(field)) {
        failures.push(`${relative}: ontbrekende Marp-instelling ${field}`);
      }
    }
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log(`${files.length} Markdown-bestanden gecontroleerd, ${linkCount} lokale links en ${deckCount} Marp-presentatie(s) in orde.`);
  console.log('Deze controle voert geen commando’s in VM’s uit en beoordeelt geen slide-layout.');
}
