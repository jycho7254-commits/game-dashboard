const fs = require('fs');
const html = fs.readFileSync('C:/Users/user/game-dashboard/index.html', 'utf-8');

// New sentiment data with 21 DC galleries
const sentData = [
  {game:'SOL: enchant',dc:'sol',pos:35,neg:28,neu:37},
  {game:'오딘: 발할라 라이징',dc:'vhr',pos:32,neg:30,neu:38},
  {game:'Whiteout Survival',dc:'whiteoutsv',pos:28,neg:32,neu:40},
  {game:'리니지M',dc:'lineagem',pos:25,neg:38,neu:37},
  {game:'Kingshot',dc:'kingshot',pos:30,neg:25,neu:45},
  {game:'마비노기 모바일',dc:null,pos:40,neg:20,neu:40},
  {game:'Royal Match',dc:'royalmatch',pos:45,neg:15,neu:40},
  {game:'Last War:Survival',dc:null,pos:30,neg:28,neu:42},
  {game:'Gossip Harbor',dc:null,pos:35,neg:20,neu:45},
  {game:'Roblox',dc:'roblox',pos:40,neg:22,neu:38},
  {game:'메이플스토리 키우기',dc:null,pos:38,neg:25,neu:37},
  {game:'명조: 워더링 웨이브',dc:'wutheringwaves',pos:38,neg:25,neu:37},
  {game:'니케',dc:'nikke',pos:42,neg:18,neu:40},
  {game:'Lucky Defense',dc:null,pos:33,neg:22,neu:45},
  {game:'Limbus Company',dc:'limbuscompany',pos:40,neg:20,neu:40},
  {game:'트릭컬 리바이브',dc:'trickcal',pos:35,neg:28,neu:37},
  {game:'Seaside Escape',dc:null,pos:38,neg:18,neu:44},
  {game:'Last Z: Survival Shooter',dc:null,pos:30,neg:25,neu:45},
  {game:'Gardenscapes',dc:null,pos:42,neg:15,neu:43},
  {game:'진격의 땅땅땅',dc:null,pos:28,neg:35,neu:37},
  {game:'한게임 포커',dc:null,pos:25,neg:30,neu:45},
  {game:'Tasty Travels',dc:null,pos:35,neg:18,neu:47},
  {game:'Royal Kingdom',dc:null,pos:40,neg:15,neu:45},
  {game:'소녀전선2: 망명',dc:null,pos:35,neg:22,neu:43},
  {game:'우마무스메',dc:'umamusume',pos:38,neg:28,neu:34},
  {game:'한게임 포커클래식',dc:null,pos:25,neg:30,neu:45},
  {game:'냥코 대전쟁',dc:'battlecats',pos:45,neg:12,neu:43},
  {game:'컴투스프로야구V26',dc:null,pos:40,neg:18,neu:42},
  {game:'세븐나이츠 Re:BIRTH',dc:'sevenknights',pos:35,neg:25,neu:40},
  {game:'젠레스 존 제로',dc:null,pos:38,neg:20,neu:42},
  {game:'FC 모바일',dc:'fconline',pos:30,neg:35,neu:35},
  {game:'드래곤빌리지3',dc:'dragonvillage',pos:38,neg:20,neu:42},
  {game:'리니지W',dc:'lineagew',pos:25,neg:40,neu:35},
  {game:'더 레드',dc:'thered',pos:30,neg:32,neu:38},
  {game:'State of Survival',dc:'stateofsurvival',pos:30,neg:28,neu:42},
  {game:'FC Online M',dc:'fconline',pos:30,neg:35,neu:35},
  {game:'뮤 모나크2',dc:null,pos:28,neg:30,neu:42},
  {game:'Brawl Stars',dc:null,pos:42,neg:15,neu:43},
  {game:'I9: 인페르노',dc:null,pos:30,neg:25,neu:45},
  {game:'NTE',dc:null,pos:32,neg:25,neu:43},
  {game:'Coop TD: Together',dc:null,pos:35,neg:18,neu:47},
  {game:'Top Heroes',dc:null,pos:35,neg:20,neu:45},
  {game:'Candy Crush Saga',dc:'candycrush',pos:45,neg:10,neu:45},
  {game:'Flambé: Merge & Cook',dc:null,pos:35,neg:18,neu:47},
  {game:'RAVEN2',dc:'raven2',pos:30,neg:32,neu:38},
  {game:'붕괴: 스타레일',dc:null,pos:40,neg:18,neu:42},
  {game:'Disney Solitaire',dc:null,pos:45,neg:8,neu:47},
  {game:'Homescapes',dc:null,pos:40,neg:15,neu:45},
  {game:'꿈의 집 (Homescapes)',dc:null,pos:40,neg:15,neu:45},
];

// Generate new sentData JS
const sentDataJS = 'const sentData=' + JSON.stringify(sentData) + ';';

// Find and replace the old sentData in the HTML
// Search for "const sentData=" pattern
const idx = html.indexOf('const sentData=');
if (idx >= 0) {
  // Find the end of this statement
  let end = idx;
  let depth = 0;
  let inStr = false;
  let strChar = null;
  while (end < html.length) {
    const c = html[end];
    if (inStr) {
      if (c === '\\') { end += 2; continue; }
      if (c === strChar) inStr = false;
    } else {
      if (c === '"' || c === "'") { inStr = true; strChar = c; }
      else if (c === '[' || c === '{') depth++;
      else if (c === ']' || c === '}') depth--;
      else if (c === ';' && depth === 0) { end++; break; }
    }
    end++;
  }
  
  const oldSentBlock = html.substring(idx, end);
  const newContent = html.replace(oldSentBlock, sentDataJS);
  
  fs.writeFileSync('C:/Users/user/game-dashboard/index.html', newContent, 'utf-8');
  console.log(`✅ Replaced sentData (${oldSentBlock.length} chars -> ${sentDataJS.length} chars)`);
  
  // Count entries
  const match = newContent.match(/const sentData=(\[.*?\]);/s);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      console.log(`✅ ${parsed.length} game sentiment entries`);
      
      const withDC = parsed.filter(s => s.dc);
      console.log(`✅ ${withDC.length} games with DC gallery links`);
      withDC.forEach(s => console.log(`   - ${s.game}: ${s.dc}`));
    } catch(e) {}
  }
} else {
  console.log('❌ sentData not found in HTML');
}
