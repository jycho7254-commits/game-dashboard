const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/dashboards-repo/game/index.html', 'utf-8');

// Search for revLabels and revAllDS in raw text
const idx1 = content.indexOf('revLabels');
const idx2 = content.indexOf('revAllDS');
const idx3 = content.indexOf('rhData');
const idx4 = content.indexOf('infData');
const idx5 = content.indexOf('sponData');

console.log('Search results:');
console.log(`revLabels: ${idx1 >= 0 ? 'Found at ' + idx1 : 'NOT FOUND'}`);
console.log(`revAllDS: ${idx2 >= 0 ? 'Found at ' + idx2 : 'NOT FOUND'}`);
console.log(`rhData: ${idx3 >= 0 ? 'Found at ' + idx3 : 'NOT FOUND'}`);
console.log(`infData: ${idx4 >= 0 ? 'Found at ' + idx4 : 'NOT FOUND'}`);
console.log(`sponData: ${idx5 >= 0 ? 'Found at ' + idx5 : 'NOT FOUND'}`);

console.log('\nFile stats:');
console.log(`Total size: ${content.length}`);

// Show 100 chars around each found position
for (const [name, idx] of [['revLabels', idx1], ['revAllDS', idx2], ['rhData', idx3], ['infData', idx4], ['sponData', idx5]]) {
  if (idx >= 0) {
    const start = Math.max(0, idx - 20);
    const end = Math.min(content.length, idx + 80);
    console.log(`\n--- ${name} (at ${idx}) ---`);
    console.log(content.substring(start, end));
  }
}
