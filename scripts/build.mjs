// Builds the playable game into www/ from the source in game/.
//   www/engine.js  <- game/engine.js and everything it imports, bundled with esbuild
//   www/index.html <- a small page header + game/index_markup.html + game/app_script.html
// Pictures, icons, the manifest and the offline worker already live in www/.
//
// Usage: npm run build            (the website, with install-as-app support)
//        npm run build:artifact   (index.html without the header, for publishing as a Claude artifact)
import {build} from 'esbuild';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const game = f => join(root, 'game', f);
const www = f => join(root, 'www', f);
const forArtifact = process.argv.includes('--artifact');

await build({
  entryPoints: [game('engine.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'Engine',
  outfile: www('engine.js'),
  logLevel: 'warning',
});

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0f1218">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Neofield">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>html,body{margin:0;padding:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
`;

// Tyler's finished Mons, for the "Who's that Mon?" intro (it runs before the battle engine loads)
const {SPECIES} = await import('../game/regional.js');
const {MON_PICS} = await import('../game/art.js');
const introMons = SPECIES.filter(sp => MON_PICS[sp.id] && sp.id !== 'missingno')   // the secret Mon is never shown in the intro
  .map(sp => ({name: sp.name, num: sp.num, types: sp.types, pic: MON_PICS[sp.id]}));

const script = readFileSync(game('app_script.html'), 'utf8');
if (!script.includes('/*NEO_MONS*/[]')) throw new Error('app_script.html is missing the /*NEO_MONS*/[] marker');
const now = new Date();
const BUILD = process.env.BUILD_ID || now.toISOString().slice(0, 16).replace(/[-:T]/g, '');
writeFileSync(www('version.json'), JSON.stringify({build: BUILD, built: now.toISOString()}) + '\n');
const body = readFileSync(game('index_markup.html'), 'utf8') + script.replace('/*NEO_MONS*/[]', JSON.stringify(introMons)).replace("'/*BUILD*/'", JSON.stringify(BUILD));
writeFileSync(www('index.html'), forArtifact ? body : HEAD + body);
console.log(`Built www/engine.js and www/index.html${forArtifact ? ' (artifact version)' : ''} with ${introMons.length} Mons for the intro.`);
