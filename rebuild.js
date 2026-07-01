const fs = require('fs');

// ─── 1. Read current HTML ───
const html = fs.readFileSync('C:/Users/user/dashboards-repo/game/index.html', 'utf-8');
const lines = html.split('\n');

// ─── 2. Extract JS line 244 (massive data line) ───
const dataLine = lines[243]; // L244

// ─── 3. Parse all data vars from this single line ───
// Pattern: const var1=[...],var2=[...],var3=[...],var4=[...];
// We need to split by "= " but careful about nested brackets

function extractAllVars(line) {
  // Remove "const " prefix
  let rest = line.trim();
  if (rest.startsWith('const ')) rest = rest.substring(6).trim();
  if (rest.endsWith(';')) rest = rest.substring(0, rest.length - 1);
  
  const vars = {};
  let i = 0;
  
  while (i < rest.length) {
    // Read variable name
    let nameStart = i;
    while (i < rest.length && rest[i] !== '=') i++;
    if (i >= rest.length) break;
    const name = rest.substring(nameStart, i).trim();
    i++; // skip '='
    
    // Skip whitespace
    while (i < rest.length && rest[i] === ' ') i++;
    
    // Now parse value (starts with [ or {)
    if (rest[i] === '[') {
      let depth = 0;
      let start = i;
      while (i < rest.length) {
        if (rest[i] === '[' || rest[i] === '{') depth++;
        else if (rest[i] === ']' || rest[i] === '}') depth--;
        if (depth === 0 && rest[i] === ']') {
          i++; // include closing bracket
          // Handle case where this is }] at end
          break;
        }
        i++;
      }
      const valueStr = rest.substring(start, i);
      try {
        vars[name] = JSON.parse(valueStr);
      } catch(e) {
        console.log(`Failed to parse ${name}: ${e.message.substring(0, 100)}`);
        vars[name] = null;
      }
    }
    
    // Skip comma
    while (i < rest.length && (rest[i] === ',' || rest[i] === ' ')) i++;
  }
  
  return vars;
}

console.log('Extracting variables...');
const vars = extractAllVars(dataLine);
console.log('Variables found:', Object.keys(vars));

// ─── 4. Get latest game data ───
// vars.games is actually revAllDS (time series)
const revAllDS = vars.games || [];
const latestSnapshot = revAllDS[revAllDS.length - 1];
let latestGames = latestSnapshot ? latestSnapshot.games : [];

console.log(`Latest date: ${latestSnapshot ? latestSnapshot.date : 'N/A'}`);
console.log(`Latest games count: ${latestGames.length}`);
console.log(`Available labels: ${(revAllDS.length)} dates`);
console.log(`Samples: ${latestGames.slice(0,3).map(g => g.name).join(', ')}`);

// ─── 5. Read publisher data ───
let publisherData = [];
try {
  publisherData = JSON.parse(fs.readFileSync('C:/Users/user/.openclaw/workspace/publisher_data.json', 'utf-8'));
  console.log(`Loaded ${publisherData.length} publisher records`);
} catch(e) {
  console.log('No publisher data found');
}

// Build publisher lookup
const pubLookup = {};
for (const p of publisherData) {
  pubLookup[p.name] = p.publisher;
}

// Add publisher to each game
for (const snap of revAllDS) {
  for (const g of snap.games) {
    g.publisher = pubLookup[g.name] || g.company || '-';
  }
}

// ─── 6. Extract revLabels ───
const revLabels = lines[244] ? JSON.parse(lines[244].substring(lines[244].indexOf('['), lines[244].lastIndexOf(']') + 1)) : [];
console.log(`Rev labels: ${revLabels.length} days`);

// ─── 7. Extract infData if exists ───
let infData = vars.infData || [];
console.log(`Influencers: ${infData.length}`);

// ─── 8. Extract sponData if exists ───
let sponData = vars.sponData || {};
const sponKeys = Object.keys(sponData);
console.log(`Sponsor entries: ${sponKeys.length}`);

// ─── 9. Read DC gallery data for expanded sentiment ───
// We'll hardcode additional DC galleries based on web fetch results
const dcGalleries = {
  '오딘: 발할라 라이징': { id: 'vhr', name: '오딘 발할라 라이징 마이너 갤러리', url: 'https://gall.dcinside.com/mgallery/board/lists/?id=vhr' },
  'Whiteout Survival': { id: 'whiteoutsv', name: '화이트아웃서바이벌 마이너 갤러리', url: 'https://gall.dcinside.com/mgallery/board/lists/?id=whiteoutsv' }
};

// ─── 10. Save data as JSON files ───
const dataDir = 'C:/Users/user/game-dashboard/data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Save revAllDS as revenue.json
fs.writeFileSync(`${dataDir}/revenue.json`, JSON.stringify(revAllDS), 'utf-8');
console.log(`Saved revenue.json (${revAllDS.length} snapshots)`);

// Save latest games as games.json with publisher
fs.writeFileSync(`${dataDir}/games.json`, JSON.stringify(latestGames), 'utf-8');
console.log(`Saved games.json (${latestGames.length} games)`);

// Save revLabels
fs.writeFileSync(`${dataDir}/revLabels.json`, JSON.stringify(revLabels), 'utf-8');

// Save influencers
fs.writeFileSync(`${dataDir}/influencers.json`, JSON.stringify(infData), 'utf-8');
console.log(`Saved influencers.json (${infData.length} influencers)`);

// Save sponsors
fs.writeFileSync(`${dataDir}/sponsors.json`, JSON.stringify(sponData), 'utf-8');
console.log(`Saved sponsors.json (${sponKeys.length} keys)`);

// Save DC galleries
fs.writeFileSync(`${dataDir}/dc_galleries.json`, JSON.stringify(dcGalleries), 'utf-8');

console.log('\n✅ All data files saved to data/ directory');
console.log('\nNext step: Create new index.html that loads from these JSON files');
