const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/dashboards-repo/game/index.html', 'utf-8');

// Helper: extract JSON value starting at position idx
function extractJSON(text, startPos) {
  const ch = text[startPos];
  if (ch !== '[' && ch !== '{') return null;
  
  let pos = startPos;
  let depth = 0;
  let inStr = false;
  let strChar = null;
  
  while (pos < text.length) {
    const c = text[pos];
    if (inStr) {
      if (c === '\\') { pos += 2; continue; }
      if (c === strChar) inStr = false;
    } else {
      if (c === '"' || c === "'") { inStr = true; strChar = c; }
      else if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') {
        depth--;
        if (depth === 0) return { value: text.substring(startPos, pos + 1), end: pos + 1 };
      }
      else if (c === ';' && depth === 0) return { value: text.substring(startPos, pos), end: pos };
    }
    pos++;
  }
  return null;
}

// Find and extract all variables
const vars = {};
const patterns = [
  { name: 'games', marker: 'const games=' },
  { name: 'infData', marker: 'infData=' },
  { name: 'sponData', marker: 'sponData=' },
  { name: 'rhData', marker: 'rhData=' },
  { name: 'revLabels', marker: 'const revLabels=' },
  { name: 'revAllDS', marker: 'revAllDS=' },
];

for (const { name, marker } of patterns) {
  const idx = content.indexOf(marker);
  if (idx < 0) { console.log(`❌ ${name}: NOT FOUND`); continue; }
  
  const valueStart = idx + marker.length;
  const result = extractJSON(content, valueStart);
  
  if (result) {
    try {
      vars[name] = JSON.parse(result.value);
      console.log(`✅ ${name}: ${Array.isArray(vars[name]) ? 'Array[' + vars[name].length + ']' : typeof vars[name] + '(' + Object.keys(vars[name]).length + ')'}`);
    } catch(e) {
      console.log(`❌ ${name}: Parse error - ${e.message.substring(0, 60)}`);
    }
  } else {
    console.log(`❌ ${name}: Could not extract JSON value`);
  }
}

// Show stats
console.log('\n=== Stats ===');
console.log(`games: ${vars.games ? vars.games.length + ' games' : 'N/A'}`);
if (vars.games && vars.games.length > 0) {
  console.log(`  - Fields: ${Object.keys(vars.games[0]).join(', ')}`);
  console.log(`  - Sample: ${vars.games[0].rank}. ${vars.games[0].name}`);
}

console.log(`infData: ${vars.infData ? vars.infData.length + ' influencers' : 'N/A'}`);
console.log(`sponData: ${vars.sponData ? Object.keys(vars.sponData).length + ' games' : 'N/A'}`);
console.log(`rhData: ${vars.rhData ? vars.rhData.length + ' snapshots' : 'N/A'}`);
if (vars.rhData && vars.rhData.length > 0) {
  console.log(`  - First date: ${vars.rhData[0].date}`);
  console.log(`  - Last date: ${vars.rhData[vars.rhData.length-1].date}`);
  console.log(`  - Games per snapshot: ${vars.rhData[0].games.length}`);
}

console.log(`revLabels: ${vars.revLabels ? vars.revLabels.length + ' labels' : 'N/A'}`);
console.log(`revAllDS: ${vars.revAllDS ? vars.revAllDS.length + ' series' : 'N/A'}`);

// Save all data files
const dataDir = 'C:/Users/user/game-dashboard/data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

for (const [name, data] of Object.entries(vars)) {
  fs.writeFileSync(`${dataDir}/${name}.json`, JSON.stringify(data), 'utf-8');
  console.log(`Saved: ${name}.json (${JSON.stringify(data).length} bytes)`);
}

// Merge publisher data into games
try {
  const pubData = JSON.parse(fs.readFileSync('C:/Users/user/.openclaw/workspace/publisher_data.json', 'utf-8'));
  const pubLookup = {};
  for (const p of pubData) pubLookup[p.name] = p.publisher;
  
  // Add publisher to latest games
  for (const g of vars.games) {
    g.publisher = pubLookup[g.name] || g.company || '-';
  }
  fs.writeFileSync(`${dataDir}/games_with_publisher.json`, JSON.stringify(vars.games), 'utf-8');
  console.log('Saved: games_with_publisher.json');
  
  // Also add publisher to all rhData snapshots
  for (const snap of vars.rhData) {
    for (const g of snap.games) {
      g.publisher = pubLookup[g.name] || g.company || '-';
    }
  }
  fs.writeFileSync(`${dataDir}/rhData_with_publisher.json`, JSON.stringify(vars.rhData), 'utf-8');
  console.log('Saved: rhData_with_publisher.json');
  
  // Add publisher to game names in sponData  
  console.log('Publisher data merged successfully');
} catch(e) {
  console.log('Publisher merge error:', e.message);
}

console.log('\n✅ All data extraction complete!');
