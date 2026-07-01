const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/dashboards-repo/game/index.html', 'utf-8');
const lines = content.split('\n');

// Lines 244-245 contain all the JS data
const L244 = lines[243];
const L245 = lines[244];
const dataText = L244 + L245;

console.log(`L244 length: ${L244.length}`);
console.log(`L245 length: ${L245.length}`);

// Parse multiple JavaScript variables from text
// Format: const var1=[...],var2=[...],var3={...},var4=[...],var5=[...];
// Note: infData, sponData, revLabels, revAllDS are NOT prefixed with "const", they come after comma

function parseJSLikeVars(text) {
  const result = {};
  let pos = 0;
  
  // Skip leading "const "
  const m = text.match(/^(const|var|let)\s+/);
  if (m) pos = m[0].length;
  
  while (pos < text.length) {
    // Skip whitespace and commas
    while (pos < text.length && (text[pos] === ' ' || text[pos] === ',' || text[pos] === '\n' || text[pos] === '\r')) pos++;
    if (pos >= text.length) break;
    
    // Read variable name
    let nameStart = pos;
    while (pos < text.length && /[a-zA-Z_$0-9]/.test(text[pos])) pos++;
    if (pos >= text.length || nameStart === pos) break;
    const name = text.substring(nameStart, pos);
    
    // Skip whitespace and "="
    while (pos < text.length && text[pos] === ' ') pos++;
    if (text[pos] !== '=') break;
    pos++; // skip =
    while (pos < text.length && text[pos] === ' ') pos++;
    
    // Now parse the value until we hit ", nextVarName=" or ";"
    // We need balanced bracket tracking
    let depth = 0;
    let inString = false;
    let stringChar = null;
    let valueStart = pos;
    
    while (pos < text.length) {
      const ch = text[pos];
      
      if (inString) {
        if (ch === '\\') { pos += 2; continue; }
        if (ch === stringChar) inString = false;
      } else {
        if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
        } else if (ch === '{' || ch === '[') {
          depth++;
        } else if (ch === '}' || ch === ']') {
          depth--;
        } else if ((ch === ',' || ch === ';') && depth === 0) {
          // End of this variable
          const valStr = text.substring(valueStart, pos);
          try {
            result[name] = JSON.parse(valStr);
            console.log(`✅ ${name}: ${Array.isArray(result[name]) ? 'Array[' + result[name].length + ']' : 'Object(' + Object.keys(result[name]).length + ' keys)'}`);
          } catch(e) {
            console.log(`❌ ${name}: Parse error - ${valStr.substring(0, 50)}...`);
            console.log(`   Error: ${e.message.substring(0, 80)}`);
          }
          
          if (ch === ';') pos++;
          break;
        }
      }
      pos++;
    }
    
    if (pos >= text.length) {
      // End of text, try parsing partial value
      const valStr = text.substring(valueStart);
      try {
        result[name] = JSON.parse(valStr);
        console.log(`✅ ${name} (end): ${Array.isArray(result[name]) ? 'Array[' + result[name].length + ']' : typeof result[name]}`);
      } catch(e) {
        console.log(`❌ ${name} (end): ${e.message.substring(0, 80)}`);
      }
    }
  }
  
  return result;
}

const vars = parseJSLikeVars(dataText);
console.log('\n=== Summary ===');
console.log('Variables found:', Object.keys(vars));

// Show game data structure
if (vars.games) {
  console.log(`\ngames: Array of ${vars.games.length} daily snapshots`);
  const last = vars.games[vars.games.length - 1];
  console.log(`Latest snapshot: ${last.date}`);
  console.log(`Games in latest: ${last.games.length}`);
  console.log(`First 3 games:`, last.games.slice(0,3).map(g => `${g.rank}. ${g.name} (${g.company})`));
  console.log(`Game fields:`, Object.keys(last.games[0]));
}

if (vars.infData) {
  console.log(`\ninfData: Array of ${vars.infData.length} influencers`);
  console.log(`First:`, vars.infData[0]);
}

if (vars.sponData) {
  const keys = Object.keys(vars.sponData);
  console.log(`\nsponData: Object with ${keys.length} game keys`);
  console.log(`Sample:`, JSON.stringify(vars.sponData[keys[0]]).substring(0, 100));
}

if (vars.revLabels) {
  console.log(`\nrevLabels: Array of ${vars.revLabels.length} dates`);
  console.log(`First/last: ${vars.revLabels[0]} / ${vars.revLabels[vars.revLabels.length-1]}`);
}

if (vars.revAllDS) {
  console.log(`\nrevAllDS: Array of ${vars.revAllDS.length} game revenue series`);
  console.log(`First:`, JSON.stringify(vars.revAllDS[0]).substring(0, 100));
}

// Save all data to files
const dataDir = 'C:/Users/user/game-dashboard/data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Save each variable
for (const [name, data] of Object.entries(vars)) {
  fs.writeFileSync(`${dataDir}/${name}.json`, JSON.stringify(data), 'utf-8');
  console.log(`Saved: ${name}.json`);
}

// Also save publisher data merged into games
if (vars.games) {
  // Read publisher data
  try {
    const pubData = JSON.parse(fs.readFileSync('C:/Users/user/.openclaw/workspace/publisher_data.json', 'utf-8'));
    const pubLookup = {};
    for (const p of pubData) pubLookup[p.name] = p.publisher;
    
    // Add publisher to latest games
    const latest = vars.games[vars.games.length - 1];
    for (const g of latest.games) {
      g.publisher = pubLookup[g.name] || g.company || '-';
    }
    fs.writeFileSync(`${dataDir}/latestGames.json`, JSON.stringify(latest.games), 'utf-8');
    console.log(`Saved: latestGames.json (with publisher data)`);
    
    // Also add publisher to all snapshots
    for (const snap of vars.games) {
      for (const g of snap.games) {
        g.publisher = pubLookup[g.name] || g.company || '-';
      }
    }
    fs.writeFileSync(`${dataDir}/revenueWithPublisher.json`, JSON.stringify(vars.games), 'utf-8');
    console.log('Saved: revenueWithPublisher.json');
  } catch(e) {
    console.log('Publisher data merge skipped:', e.message);
  }
}
