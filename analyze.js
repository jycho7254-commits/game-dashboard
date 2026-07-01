const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/dashboards-repo/game/index.html', 'utf-8');
const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);

const keywords = ['const ', 'var ', 'let ', 'function ', '// ', '/* '];
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (trimmed.startsWith('const ') || trimmed.startsWith('var ') || trimmed.startsWith('let ') || 
      trimmed.startsWith('function ') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
    const preview = trimmed.substring(0, 150);
    console.log(`L${i+1}: ${preview}`);
  }
}
