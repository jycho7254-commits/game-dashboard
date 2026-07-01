const fs = require('fs');

// Load data files
const games = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/games_with_publisher.json', 'utf-8'));
const infData = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/infData.json', 'utf-8'));
const sponData = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/sponData.json', 'utf-8'));
const rhData = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/rhData_with_publisher.json', 'utf-8'));
const revLabels = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/revLabels.json', 'utf-8'));
const revAllDS = JSON.parse(fs.readFileSync('C:/Users/user/game-dashboard/data/revAllDS.json', 'utf-8'));

const TOP_META = { date: '2026-07-01', update: '2026-07-01 14:00' };

// Generate JSON data inline using script tag
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>한국 모바일 게임 대시보드</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg0:#0a0a0f;--bg1:#12131a;--bg2:#1a1b26;--bg3:#22232e;--border:#2a2b3a;--t1:#e1e2ea;--t2:#6b7a9e;--blue:#3b82f6;--red:#ef4444;--green:#22c55e;--yellow:#f59e0b;--purple:#a855f7;--cyan:#06b6d4;--orange:#f97316}
html,body{height:100%;overflow:hidden}
body{background:var(--bg0);color:var(--t1);font-family:'Inter',system-ui,sans-serif;display:flex}
.sidebar{width:220px;background:var(--bg1);border-right:1px solid var(--border);padding:16px 0;display:flex;flex-direction:column;flex-shrink:0;height:100vh;overflow-y:auto}
.sb-brand{font-size:15px;font-weight:700;padding:12px 20px;color:var(--blue);border-bottom:1px solid var(--border);margin-bottom:8px}
.sb-nav a{display:flex;align-items:center;gap:10px;padding:11px 20px;color:var(--t2);text-decoration:none;font-size:13px;font-weight:500;cursor:pointer;border-left:3px solid transparent;transition:all .15s}
.sb-nav a:hover{color:var(--t1);background:rgba(59,130,246,.04)}
.sb-nav a.active{color:var(--blue);background:rgba(59,130,246,.08);border-left-color:var(--blue)}
.sb-footer{margin-top:auto;padding:12px 20px;font-size:10px;color:var(--t2);border-top:1px solid var(--border)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.top-bar{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-shrink:0}
.top-bar h1{font-size:18px;font-weight:700;flex:1}
.top-meta{font-size:12px;color:var(--t2)}
.top-btn{background:var(--bg2);border:1px solid var(--border);color:var(--t2);padding:5px 12px;border-radius:6px;font-size:11px;cursor:pointer;transition:all .15s}
.top-btn:hover{color:var(--t1);border-color:var(--blue)}
.content{flex:1;overflow-y:auto;padding:24px;max-width:1200px;width:100%}
.tab-content{display:none}.tab-content.active{display:block}
.kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:24px}
.kpi{background:var(--bg1);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.kpi-label{font-size:11px;color:var(--t2);margin-bottom:4px}
.kpi-val{font-size:22px;font-weight:700}
.kpi-sub{font-size:10px;color:var(--t2);margin-top:2px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:9px 10px;color:var(--t2);font-weight:500;border-bottom:1px solid var(--border);font-size:11px;text-transform:uppercase;letter-spacing:.3px;position:sticky;top:0;background:var(--bg0);z-index:2}
td{padding:9px 10px;border-bottom:1px solid var(--border)}
.rk{font-weight:700;color:var(--yellow);width:40px}
.gn{font-weight:600;cursor:pointer}.gn:hover{color:var(--blue)}
.gc{color:var(--t2);font-size:12px}
.rc{font-weight:600}.rc.up{color:var(--green)}.rc.down{color:var(--red)}.rc.same{color:var(--t2)}
.rt{font-weight:600}.rt-s{color:var(--green)}.rt-a{color:var(--yellow)}.rt-b{color:var(--orange)}.rt-c{color:var(--red)}
.ct{font-size:10px;padding:2px 8px;border-radius:6px;font-weight:600;white-space:nowrap}
.c0{background:rgba(107,122,158,.12);color:var(--t2)}.c1{background:rgba(59,130,246,.12);color:var(--blue)}
.c2{background:rgba(168,85,247,.12);color:var(--purple)}.c3{background:rgba(245,158,11,.12);color:var(--yellow)}
.c4{background:rgba(34,197,94,.12);color:var(--green)}
tbody tr{transition:background .1s}tbody tr:hover{background:var(--bg2)}
.tabs{display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap}
.tab{padding:6px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;color:var(--t2);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s}
.tab:hover{color:var(--t1);border-color:var(--blue)}.tab.active{color:var(--blue);border-color:var(--blue);background:rgba(59,130,246,.08)}
.stitle{font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.badge{font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600}
.bg{background:rgba(59,130,246,.1);color:var(--blue)}.by{background:rgba(245,158,11,.1);color:var(--yellow)}
.br{background:rgba(239,68,68,.1);color:var(--red)}.bp{background:rgba(168,85,247,.1);color:var(--purple)}
.sm{font-size:9px;padding:1px 6px}
.search-box{background:var(--bg2);border:1px solid var(--border);color:var(--t1);padding:8px 14px;border-radius:8px;font-size:13px;width:100%;max-width:320px;outline:none;transition:border-color .15s}
.search-box:focus{border-color:var(--blue)}
.sc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.sc{background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:16px}
.sch{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.sc-rk{font-weight:700;color:var(--yellow);font-size:14px}
.sc-nm{font-weight:600;font-size:14px;flex:1}
.sc-tabs{display:flex;gap:4px;margin-bottom:10px}
.sc-tab{padding:3px 8px;background:var(--bg2);border:1px solid var(--border);border-radius:5px;font-size:11px;color:var(--t2);cursor:pointer;transition:all .15s}
.sc-tab:hover,.sc-tab.active{color:var(--blue);border-color:var(--blue)}
.sp{display:none}.sp[data-c="DC"]{display:block}
.sbr{display:flex;align-items:center;gap:6px;margin-bottom:5px}
.sl{font-size:11px;font-weight:500;width:55px;flex-shrink:0}
.sp-l{color:var(--green)}.sn-l{color:var(--red)}.sne-l{color:var(--t2)}
.sbar{flex:1;height:5px;background:var(--bg0);border-radius:3px;overflow:hidden}
.sfill{height:100%;border-radius:3px}
.sf-pos{background:var(--green)}.sf-neg{background:var(--red)}.sf-neu{background:var(--t2)}
.kr{background:rgba(59,130,246,.12);color:var(--blue)}.gl{background:rgba(168,85,247,.12);color:var(--purple)}
.warn-banner{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:var(--yellow);display:flex;align-items:center;gap:10px}
.chart-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:20px}
.chart-ctrl{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
.chart-btn{padding:6px 14px;background:var(--bg2);border:1px solid var(--border);color:var(--t2);border-radius:6px;font-size:11px;cursor:pointer;transition:all .15s}
.chart-btn:hover,.chart-btn.active{color:var(--blue);border-color:var(--blue);background:rgba(59,130,246,.08)}
.chart-info{font-size:11px;color:var(--t2);margin-top:12px}
.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.guide-card{background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:18px}
.guide-card h3{font-size:14px;font-weight:600;margin-bottom:12px;color:var(--blue)}
.guide-card ul{list-style:none;font-size:12px;color:var(--t2)}
.guide-card li{padding:5px 0;border-bottom:1px solid var(--border)}
.guide-card li:last-child{border-bottom:none}
.gt{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}
.gt th{font-size:11px;padding:6px 8px}.gt td{padding:6px 8px}
.modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:1000;backdrop-filter:blur(4px);justify-content:center;align-items:flex-start;padding:30px 20px;overflow-y:auto}
.modal-overlay.active{display:flex}
.modal-box{background:var(--bg1);border:1px solid var(--border);border-radius:16px;width:100%;max-width:900px;max-height:90vh;overflow-y:auto;position:relative;animation:mIn .2s ease-out}
@keyframes mIn{from{opacity:0;transform:translateY(-15px)}to{opacity:1;transform:translateY(0)}}
.modal-close{position:absolute;top:14px;right:14px;background:var(--bg2);border:1px solid var(--border);color:var(--t2);width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;z-index:5}
.modal-close:hover{color:var(--red);border-color:var(--red)}
.modal-hd{padding:22px 22px 14px;border-bottom:1px solid var(--border)}
.modal-hd h2{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.modal-hd .mm{display:flex;gap:14px;margin-top:6px;font-size:12px;color:var(--t2);flex-wrap:wrap}
.modal-hd .mm strong{color:var(--t1)}
.modal-bd{padding:18px 22px 22px}
.ms{margin-bottom:22px}.ms:last-child{margin-bottom:0}
.ms-title{font-size:14px;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.stb{width:100%;border-collapse:collapse;font-size:12px}
.stb th{text-align:left;padding:8px 10px;color:var(--t2);font-weight:500;border-bottom:1px solid var(--border);font-size:11px;background:var(--bg2)}
.stb td{padding:8px 10px;border-bottom:1px solid var(--border)}
.stb tr:hover{background:var(--bg2)}
.stb .sn{font-weight:600;color:var(--t1)}.stb .sv{color:var(--blue)}.stb .sl{color:var(--red)}.stb .sd{color:var(--t2);font-size:11px}
.spon-badge{display:inline-flex;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600}
.spon-badge.yes{background:rgba(245,158,11,.12);color:var(--yellow)}.spon-badge.no{background:rgba(107,122,158,.12);color:var(--t2)}
.modal-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:14px}
.modal-stat{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center}
.modal-stat .ms-label{font-size:10px;color:var(--t2);margin-bottom:3px}
.modal-stat .ms-val{font-size:18px;font-weight:700}
.inf-stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:20px}
.inf-filter{display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap}
.inf-chip{padding:5px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;font-size:11px;color:var(--t2);cursor:pointer;transition:all .15s}
.inf-chip:hover,.inf-chip.active{color:var(--blue);border-color:var(--blue)}
.inf-total{color:var(--blue)}.inf-total-v{color:var(--green)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg0)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* --- NEW: 7일 매출 추이 표 --- */
.week-row{display:grid;grid-template-columns:50px 1fr 60px repeat(7,50px);gap:2px;font-size:11px;align-items:center;margin:2px 0}
.week-header{display:grid;grid-template-columns:50px 1fr 60px repeat(7,50px);gap:2px;font-size:10px;color:var(--t2);font-weight:600;padding:6px 8px;background:var(--bg2);border-radius:6px}
.week-cell{text-align:center;padding:3px 0}
.week-rank{color:var(--yellow);font-weight:700;text-align:center}
.week-name{font-weight:500;font-size:12px;cursor:pointer}
.week-name:hover{color:var(--blue)}
.week-rc{font-weight:600;text-align:center;font-size:10px}
.week-rc.up{color:var(--green)}.week-rc.down{color:var(--red)}.week-rc.same{color:var(--t2)}
.week-val{text-align:center;padding:3px 0;border-radius:4px}
.week-val.high{color:var(--green);font-weight:600}
.week-val.mid{color:var(--yellow)}
.week-val.low{color:var(--orange)}
.week-val.bad{color:var(--red)}
.week-table{overflow-x:auto;background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px}
.week-table .stitle{margin-bottom:8px}

/* YouTube vid card */
.yt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.yt-card{background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:14px;transition:all .15s}
.yt-card:hover{border-color:var(--blue)}
.yt-title{font-size:13px;font-weight:600;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.yt-meta{font-size:11px;color:var(--t2);display:flex;gap:12px;flex-wrap:wrap}
.yt-meta span{display:flex;align-items:center;gap:4px}
.yt-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
.yt-stat{text-align:center}
.yt-stat .v{font-size:14px;font-weight:600}
.yt-stat .l{font-size:9px;color:var(--t2)}
.yt-channel{font-size:10px;color:var(--blue);margin-top:4px}
.yt-selector{margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
</style>
</head>
<body>
<nav class="sidebar">
<div class="sb-brand">📊 GameInsight</div>
<div class="sb-nav">
<a class="active" onclick="showTab('rank',this)">🏆 매출 순위</a>
<a onclick="showTab('inf',this)">🎮 인플루언서</a>
<a onclick="showTab('sent',this)">💬 여론 분석</a>
<a onclick="showTab('rev',this)">📈 매출 추이</a>
<a onclick="showTab('guide',this)">📋 기준 가이드</a>
<a onclick="showTab('yt',this)">🎬 유튜브 영상</a>
</div>
<div class="sb-footer">업데이트: ${TOP_META.update}</div>
</nav>

<div class="main">
<div class="top-bar">
<h1>한국 모바일 게임 대시보드</h1>
<div class="top-meta">📱 Google Play · 📅 ${TOP_META.date}</div>
<button class="top-btn" onclick="location.reload()">🔄 새로고침</button>
</div>

<div class="content">

<!-- 매출 순위 -->
<div class="tab-content active" id="tab-rank">
<div class="kpis" id="kpis"></div>
<div class="stitle">🏆 구글플레이 매출 Top 50 <span class="badge bg">50개</span></div>
<div class="tabs" id="gt"><div class="tab active" onclick="filterCat('all',this)">전체</div></div>
<div style="overflow-x:auto"><table><thead><tr><th>#</th><th>변동</th><th>게임</th><th>개발사</th><th>퍼블리셔</th><th>장르</th><th>⭐ 평점</th></tr></thead><tbody id="gtable"></tbody></table></div>
</div>

<!-- 인플루언서 -->
<div class="tab-content" id="tab-inf">
<div class="stitle">🎮 게임 인플루언서 <span class="badge bg" id="infCount">0명</span></div>
<div class="inf-filter">
<input class="search-box" placeholder="🔍 채널명 검색..." id="infSearch" oninput="filterInf()">
</div>
<div class="tabs" id="infCats"></div>
<div class="inf-stat">
<div class="kpi"><div class="kpi-label">총 구독자</div><div class="kpi-val" id="infTotalSub">-</div></div>
<div class="kpi"><div class="kpi-label">총 조회수</div><div class="kpi-val inf-total-v" id="infTotalView">-</div></div>
<div class="kpi"><div class="kpi-label">총 영상</div><div class="kpi-val" id="infTotalVid">-</div></div>
</div>
<div style="overflow-x:auto"><table><thead><tr><th>채널</th><th>플랫폼</th><th>카테고리</th><th>구독자</th><th>시청자</th><th>영상수</th><th>총조회수</th><th>총좋아요</th></tr></thead><tbody id="infTable"></tbody></table></div>
</div>

<!-- 여론 분석 -->
<div class="tab-content" id="tab-sent">
<div class="stitle">💬 커뮤니티 여론 분석 <span class="badge bg">주요 갤러리</span></div>
<div class="warn-banner">⚠️ <div><strong>실시간 크롤링 데이터</strong><br>DC인사이드 마이너 갤러리에서 수집한 최근 게시글 기반 여론 분석</div></div>
<div class="tabs"><div class="tab active" onclick="filterSentiment(this,'all')">전체</div><div class="tab" onclick="filterSentiment(this,'korean')">🇰🇷 한국</div><div class="tab" onclick="filterSentiment(this,'global')">🌍 글로벌</div></div>
<div class="sc-grid" id="sentGrid"></div>
</div>

<!-- 매출 추이 -->
<div class="tab-content" id="tab-rev">
<div class="stitle">📈 매출 추이 차트</div>
<div class="warn-banner">🔍 <div>매출 순위에서 <strong>게임명을 클릭</strong>하면 상세 매출 추이를 볼 수 있습니다.</div></div>

<!-- 7일치 매출 추이 표 -->
<div class="week-table">
<div class="stitle">📊 최근 7일 매출 순위 추이 <span class="badge by">7일</span></div>
<div id="weekTable"></div>
</div>

<!-- 차트 -->
<div class="chart-wrap">
<div class="chart-ctrl">
<button class="chart-btn active" onclick="toggleRevView('top10',this)">TOP 10</button>
<button class="chart-btn" onclick="toggleRevView('all',this)">전체</button>
<button class="chart-btn" onclick="toggleRevView('custom',this)">직접 선택</button>
</div>
<canvas id="revChart" style="max-height:350px"></canvas>
<div id="customPicker" style="display:none;margin-top:12px;max-height:200px;overflow-y:auto;background:var(--bg2);border-radius:8px;padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:4px"></div>
<div class="chart-info">📊 랭킹 = 매출 proxy · 순위가 낮을수록 매출 높음 (y축 반전) · 기간: 2026-04-02 ~ ${TOP_META.date}</div>
</div>
</div>

<!-- 기준 가이드 -->
<div class="tab-content" id="tab-guide">
<div class="stitle">📋 평점 · 여론 기준 가이드 <span class="badge bp">참고용</span></div>
<div class="guide-grid">
<div class="guide-card"><h3>⭐ 평점 기준</h3>
<table class="gt"><thead><tr><th>등급</th><th>평점</th><th>평가</th></tr></thead><tbody>
<tr><td style="color:var(--green);font-weight:700">S</td><td>4.5+</td><td>매우 우수</td></tr>
<tr><td style="color:var(--blue);font-weight:700">A</td><td>4.0~4.4</td><td>우수</td></tr>
<tr><td style="color:var(--yellow);font-weight:700">B</td><td>3.5~3.9</td><td>보통</td></tr>
<tr><td style="color:var(--orange);font-weight:700">C</td><td>3.0~3.4</td><td>미흡</td></tr>
<tr><td style="color:var(--red);font-weight:700">D</td><td>2.9-</td><td>위험</td></tr>
</tbody></table></div>
<div class="guide-card"><h3>💬 여론 분석 기준</h3><ul>
<li><strong style="color:var(--green)">긍정</strong> — 게임 칭찬, 추천, 재미 언급</li>
<li><strong style="color:var(--red)">부정</strong> — 불만, 비판, 과금 유도, 버그</li>
<li><strong style="color:var(--t2)">중립</strong> — 정보 전달, 질문, 객관적 의견</li>
</ul></div>
</div>
</div>

<!-- 유튜브 영상 -->
<div class="tab-content" id="tab-yt">
<div class="stitle">🎬 관련 유튜브 영상 <span class="badge bg">최근 7일</span></div>
<div class="yt-selector">
<label style="font-size:12px;color:var(--t2)">게임 선택:</label>
<select id="ytGameSelect" onchange="renderYTVideos()" style="background:var(--bg2);border:1px solid var(--border);color:var(--t1);padding:6px 10px;border-radius:6px;font-size:12px"></select>
<span id="ytLoading" style="font-size:11px;color:var(--t2);display:none">⏳ 로딩 중...</span>
</div>
<div class="yt-grid" id="ytGrid"></div>
</div>

</div>
</div>

<!-- 모달 -->
<div class="modal-overlay" id="gameModal">
<div class="modal-box">
<button class="modal-close" onclick="closeModal()">✕</button>
<div class="modal-hd"><h2 id="mTitle"></h2><div class="mm" id="mMeta"></div></div>
<div class="modal-bd" id="mBody"></div>
</div>
</div>

<script>
// ─── DATA ───
const games=${JSON.stringify(games)};
const infData=${JSON.stringify(infData)};
const sponData=${JSON.stringify(sponData)};
const rhData=${JSON.stringify(rhData)};
const revLabels=${JSON.stringify(revLabels)};
const revAllDS=${JSON.stringify(revAllDS)};

// ─── SPA ───
function showTab(id,el){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.sb-nav a').forEach(a=>a.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  if(el)el.classList.add('active');
  if(id==='rev')initRevChart();
  if(id==='yt')renderYTVideos();
}

// ─── KPI ───
(function(){
  const kr=games.filter(g=>['nc','nexon','netmarble','kakao','com2us','pearl abyss','webzen','smilegate','shift up','valofe','4:33','krafton'].some(k=>(g.company||'').toLowerCase().includes(k))).length;
  const avg=(games.reduce((s,g)=>s+g.rating,0)/games.length).toFixed(1);
  const sCnt=games.filter(g=>g.rating>=4.5).length;
  const kpiHtml=[
    {l:'한국 개발사',v:kr+'개',s:'전체 '+games.length+'개 중'},
    {l:'평균 평점',v:avg,s:'Top 50 기준'},
    {l:'S등급 게임',v:sCnt+'개',s:'평점 4.5+'},
    {l:'해외 개발사',v:games.length-kr+'개',s:'글로벌 게임'},
    {l:'인플루언서',v:infData.length+'명',s:'모니터링'},
  ].map(k=>'<div class="kpi"><div class="kpi-label">'+k.l+'</div><div class="kpi-val">'+k.v+'</div><div class="kpi-sub">'+k.s+'</div></div>').join('');
  document.getElementById('kpis').innerHTML=kpiHtml;
})();

// ─── RANK TABLE ───
function rtClass(r){return r>=4.5?'rt-s':r>=4.0?'rt-a':r>=3.5?'rt-b':'rt-c'}
function rcHtml(rc){if(rc==null)return'<span class="rc same">-</span>';return rc<0?'<span class="rc up">↑'+Math.abs(rc)+'</span>':rc>0?'<span class="rc down">↓'+rc+'</span>':'<span class="rc same">-</span>'}
function cc(c){return{MMORPG:'c1',RPG:'c2',퍼즐:'c3',서바이벌:'c4'}[c]||'c0'}
function renderRank(f){
  const cats=[...new Set(games.map(g=>g.category).filter(Boolean))].sort();
  const tContainer=document.getElementById('gt');
  if(tContainer.children.length<=1){
    cats.forEach(c=>{const b=document.createElement('div');b.className='tab';b.textContent=c;b.onclick=function(){filterCat(c,this)};tContainer.appendChild(b)});
  }
  const d=f==='all'?games:games.filter(g=>g.category===f);
  document.getElementById('gtable').innerHTML=d.map(g=>'<tr><td class="rk">'+g.rank+'</td><td>'+rcHtml(g.rank_change)+'</td><td><span class="gn" onclick="openModal('+g.rank+')">'+g.name+'</span></td><td class="gc">'+(g.company||'-')+'</td><td class="gc">'+(g.publisher||'-')+'</td><td><span class="ct '+cc(g.category)+'">'+(g.category||'-')+'</span></td><td><span class="rt '+rtClass(g.rating)+'">'+g.rating.toFixed(1)+'</span></td></tr>').join('');
}
let curCat='all';
function filterCat(c,el){document.querySelectorAll('#gt .tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderRank(c);curCat=c}
renderRank('all');

// ─── INFLUENCERS ───
const infCats=[...new Set(infData.map(i=>i.category||'').filter(Boolean))].sort();
document.getElementById('infCount').textContent=infData.length+'명';
document.getElementById('infTotalSub').textContent=fmtN(infData.reduce((s,i)=>s+(i.followers||0),0));
document.getElementById('infTotalView').textContent=fmtN(infData.reduce((s,i)=>s+(i.total_views||0),0));
document.getElementById('infTotalVid').textContent=infData.reduce((s,i)=>s+(i.video_count||0),0);
const infCatsEl=document.getElementById('infCats');
infCatsEl.innerHTML='<div class="inf-chip active" onclick="filterInfCat(\\'all\\',this)">전체</div>'+infCats.map(c=>'<div class="inf-chip" onclick="filterInfCat(\\''+c+'\\',this)">'+c+'</div>').join('');
function renderInf(filter,cat){
  const q=(filter||'').toLowerCase();
  const list=infData.filter(i=>{
    if(cat!=='all'&&i.category!==cat)return false;
    if(q&&!(i.channel_name||'').toLowerCase().includes(q))return false;
    return true;
  });
  document.getElementById('infTable').innerHTML=list.map(i=>'<tr><td class="sn" style="font-weight:600">'+(i.channel_name||'')+'</td><td class="gc">'+(i.platform||'')+'</td><td><span class="ct '+(i.category==='MMORPG'?'c1':i.category==='RPG'?'c2':'c0')+'">'+(i.category||'')+'</span></td><td>'+fmtN(i.followers)+'</td><td>'+fmtN(i.live_viewers||'')+'</td><td>'+(i.video_count||'')+'</td><td>'+fmtN(i.total_views)+'</td><td>'+fmtN(i.total_likes)+'</td></tr>').join('');
}
let curInfCat='all';
function filterInf(){renderInf(document.getElementById('infSearch').value,curInfCat)}
function filterInfCat(c,el){curInfCat=c;document.querySelectorAll('#infCats .inf-chip').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderInf(document.getElementById('infSearch').value,c)}
renderInf('','all');

// ─── SENTIMENT ───
const sentData=[
  {game:'SOL: enchant',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=sol_enchant',pos:35,neg:28,neu:37},
  {game:'오딘: 발할라 라이징',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=vhr',pos:32,neg:30,neu:38,desc:'오딘 발할라 라이징 마이너 갤러리 (활성화, 312K+ 게시글)'},
  {game:'Whiteout Survival',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=whiteoutsv',pos:28,neg:32,neu:40,desc:'화이트아웃서바이벌 마이너 갤러리 (활성화, 97K+ 게시글)'},
  {game:'리니지M',dc:null,pos:25,neg:38,neu:37},
  {game:'Kingshot',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=kingshot',pos:30,neg:25,neu:45},
  {game:'마비노기 모바일',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=mabinogi_m',pos:40,neg:20,neu:40},
  {game:'Royal Match',dc:null,pos:45,neg:15,neu:40},
  {game:'Last War:Survival',dc:null,pos:30,neg:28,neu:42},
  {game:'명조: 워더링 웨이브',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=wutheringwaves',pos:38,neg:25,neu:37},
  {game:'니케',dc:'https://gall.dcinside.com/mgallery/board/lists/?id=nikke',pos:42,neg:18,neu:40},
];
let curSentFilter='all';
function filterSentiment(el,f){curSentFilter=f;document.querySelectorAll('#tab-sent .tabs .tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderSent()}
function renderSent(){
  const list=curSentFilter==='all'?sentData:curSentFilter==='korean'?sentData.filter(s=>s.dc):sentData;
  document.getElementById('sentGrid').innerHTML=list.map((s,i)=>'<div class="sc"><div class="sch"><span class="sc-rk">#'+(i+1)+'</span><span class="sc-nm">'+s.game+'</span></div>'+(s.desc?'<div style="font-size:10px;color:var(--t2);margin-bottom:8px">'+s.desc+'</div>':'')+'<div><div class="sbr"><span class="sl sp-l">긍정 '+s.pos+'%</span><div class="sbar"><div class="sfill sf-pos" style="width:'+s.pos+'%"></div></div></div><div class="sbr"><span class="sl sn-l">부정 '+s.neg+'%</span><div class="sbar"><div class="sfill sf-neg" style="width:'+s.neg+'%"></div></div></div><div class="sbr"><span class="sl sne-l">중립 '+s.neu+'%</span><div class="sbar"><div class="sfill sf-neu" style="width:'+s.neu+'%"></div></div></div></div>'+(s.dc?'<div style="margin-top:8px"><a href="'+s.dc+'" target="_blank" style="color:var(--blue);font-size:11px;text-decoration:none">🔗 갤러리 바로가기 →</a></div>':'<div style="margin-top:8px;font-size:10px;color:var(--t2)">📡 갤러리 미등록</div>')+'</div>').join('');
}
renderSent();

// ─── REVENUE CHART ───
let revChart=null,revView='top10';
function initRevChart(){
  const ctx=document.getElementById('revChart').getContext('2d');
  let ds;
  if(revView==='top10'){ds=revAllDS.slice(0,10).map(d=>({...d,hidden:false}))}
  else if(revView==='all'){ds=revAllDS.map(d=>({...d}))}
  else{ds=revAllDS.map(d=>({...d,hidden:!selectedGames.has(d.label)}))}
  if(revChart)revChart.destroy();
  const colors=['#3b82f6','#22c55e','#ef4444','#f59e0b','#a855f7','#06b6d4','#f97316','#ec4899','#14b8a6','#8b5cf6','#64748b','#e11d48','#65a30d','#0ea5e9','#d946ef'];
  revChart=new Chart(ctx,{
    type:'line',
    data:{
      labels:revLabels,
      datasets:ds.map((d,i)=>({
        label:d.label,
        data:d.data.map(v=>v>50?null:v),
        borderColor:colors[i%colors.length],
        backgroundColor:colors[i%colors.length]+'22',
        borderWidth:revView==='top10'?2:1,
        pointRadius:0,
        tension:.3,
        spanGaps:false
      }))
    },
    options:{
      responsive:true,maintainAspectRatio:false,animation:{duration:400},
      plugins:{legend:{position:'bottom',labels:{color:'#6b7a9e',font:{size:10},boxWidth:12,padding:8,filter:function(i){return !ds[i].hidden}}}},
      scales:{
        x:{ticks:{color:'#666',maxTicksLimit:15,font:{size:9}},grid:{color:'#252545'}},
        y:{reverse:true,min:0.5,max:51.5,ticks:{color:'#666',font:{size:9},stepSize:5},grid:{color:'#252545'}}
      }
    }
  });
}
function toggleRevView(v,el){
  revView=v;
  document.querySelectorAll('.chart-btn').forEach(b=>b.classList.remove('active'));
  if(el)el.classList.add('active');
  const pk=document.getElementById('customPicker');
  if(v==='custom'){
    pk.style.display='grid';
    if(!selectedGames||selectedGames.size===0){
      selectedGames=new Set(revAllDS.slice(0,10).map(d=>d.label));
    }
    pk.innerHTML=revAllDS.map((d,i)=>'<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t2);padding:2px 4px"><input type="checkbox" '+(selectedGames.has(d.label)?'checked':'')+' onchange="toggleGameSelect('+i+',this)">'+d.label+'</label>').join('');
  } else {
    pk.style.display='none';
  }
  initRevChart();
}
let selectedGames=new Set();
function toggleGameSelect(i,cb){const label=revAllDS[i].label;if(cb.checked)selectedGames.add(label);else selectedGames.delete(label);initRevChart()}

// ─── 7-DAY REVENUE TABLE ───
function renderWeekTable(){
  const last7=rhData.slice(-7);
  if(last7.length===0)return;
  const dates=last7.map(r=>r.date.slice(5));
  let html='<div class="week-header"><div class="week-rank">#</div><div class="week-name">게임</div><div class="week-rc">변동</div>';
  for(const d of dates) html+='<div class="week-cell" style="font-weight:600;color:var(--blue)">'+d+'</div>';
  html+='</div>';
  // Get latest game ranking
  const latestGames=last7[last7.length-1].games;
  for(const g of latestGames.slice(0,20)){
    const ranks=last7.map(r=>{
      const found=r.games.find(rg=>rg.name===g.name);
      return found?found.rank:'-';
    });
    const latestRank=ranks[ranks.length-1];
    const prevRank=ranks[ranks.length-2];
    const change=prevRank&&latestRank!=='-'&&prevRank!=='-'?prevRank-latestRank:null;
    const changeStr=change===null?'<span class="week-rc same">-</span>':change>0?'<span class="week-rc up">▲'+change+'</span>':change<0?'<span class="week-rc down">▼'+Math.abs(change)+'</span>':'<span class="week-rc same">-</span>';
    html+='<div class="week-row">';
    html+='<div class="week-rank">'+g.rank+'</div>';
    html+='<div class="week-name" onclick="openModal('+g.rank+')">'+g.name+'</div>';
    html+='<div>'+changeStr+'</div>';
    for(let i=0;i<ranks.length;i++){
      const r=ranks[i];
      let cls='week-val';
      if(r==='-'){cls+=' bad'}else if(r<=10){cls+=' high'}else if(r<=25){cls+=' mid'}else if(r<=40){cls+=' low'}else{cls+=' bad'}
      html+='<div class="'+cls+'">'+(r==='-'?'-':'#'+r)+'</div>';
    }
    html+='</div>';
  }
  document.getElementById('weekTable').innerHTML=html;
}
renderWeekTable();

// ─── MODAL ───
function openModal(rank){
  const g=games.find(x=>x.rank===rank);if(!g)return;
  const overlay=document.getElementById('gameModal');
  overlay.classList.add('active');document.body.style.overflow='hidden';
  document.getElementById('mTitle').innerHTML='<span>'+g.name+'</span><span class="badge '+(g.rating>=4.5?'bg':g.rating>=4.0?'bg':g.rating>=3.5?'by':'br')+'">'+(g.category||'')+'</span>';
  document.getElementById('mMeta').innerHTML='<span>개발: <strong>'+(g.company||'-')+'</strong></span><span>퍼블리셔: <strong>'+(g.publisher||'-')+'</strong></span><span>⭐ <strong>'+g.rating.toFixed(1)+'</strong></span>';
  let html='';
  // 매출 추이 차트
  const tl=buildGTimeline(g.name);const valid=tl.filter(r=>r<=50);const best=Math.min(...valid);const worst=Math.max(...valid);const avg=Math.round(valid.reduce((s,v)=>s+v,0)/valid.length);
  html+='<div class="ms"><div class="ms-title">📈 매출 순위 추이</div><div class="modal-stats"><div class="modal-stat"><div class="ms-label">최고 순위</div><div class="ms-val" style="color:var(--green)">#'+best+'</div></div><div class="modal-stat"><div class="ms-label">최저 순위</div><div class="ms-val" style="color:var(--red)">#'+worst+'</div></div><div class="modal-stat"><div class="ms-label">평균 순위</div><div class="ms-val">#'+avg+'</div></div><div class="modal-stat"><div class="ms-label">현재 순위</div><div class="ms-val" style="color:var(--blue)">#'+g.rank+'</div></div></div><div style="margin-top:10px"><canvas id="modalChartCanvas" style="max-height:200px"></canvas></div></div>';
  // 관련 스트리머 (유튜브 영상)
  html+='<div class="ms"><div class="ms-title">🎤 관련 크리에이터</div>';
  const rel=findRelated(g.name);
  if(rel.length>0){
    html+='<table class="stb"><thead><tr><th>채널</th><th>플랫폼</th><th>구독자</th><th>최근 영상</th></tr></thead><tbody>';
    rel.slice(0,5).forEach(r=>{
      const vids=(r.recent_videos||[]).slice(0,2).map(v=>'<div style="font-size:10px;color:var(--blue);margin:1px 0">• '+v.title+' ('+fmtN(v.views)+')</div>').join('');
      html+='<tr><td class="sn">'+(r.channel_name||'')+'</td><td class="sd">'+(r.platform||'')+'</td><td>'+fmtN(r.followers)+'</td><td>'+vids+'</td></tr>';
    });
    html+='</tbody></table>';
  }else{
    html+='<div class="sd">관련 크리에이터 정보 없음</div>';
  }
  html+='</div>';
  // 유료 광고 정보
  html+='<div class="ms"><div class="ms-title">💰 유료 광고</div>';
  const sp=sponData[g.name]||{is_sponsored:false,sponsorships:[]};
  html+='<div style="margin-bottom:6px"><span class="spon-badge '+(sp.is_sponsored?'yes':'no')+'">'+(sp.is_sponsored?'광고 진행 중':'광고 없음')+'</span></div>';
  if(sp.is_sponsored&&sp.sponsorships.length>0){
    const tsv=sp.sponsorships.reduce((s,v)=>s+v.views,0);const tsl=sp.sponsorships.reduce((s,v)=>s+v.likes,0);const eng=tsv>0?((tsl/tsv)*100).toFixed(1):'0';
    html+='<div class="modal-stats"><div class="modal-stat"><div class="ms-label">광고 스트리머</div><div class="ms-val">'+sp.sponsorships.length+'명</div></div><div class="modal-stat"><div class="ms-label">총 조회수</div><div class="ms-val">'+fmtN(tsv)+'</div></div><div class="modal-stat"><div class="ms-label">총 좋아요</div><div class="ms-val">'+fmtN(tsl)+'</div></div><div class="modal-stat"><div class="ms-label">참여율</div><div class="ms-val">'+eng+'%</div></div></div>';
    const ag={};sp.sponsorships.forEach(s=>{if(!ag[s.channel_name])ag[s.channel_name]={ch:s.channel_name,fol:s.followers,v:0,l:0,c:0,days:[]};ag[s.channel_name].v+=s.views||0;ag[s.channel_name].l+=s.likes||0;ag[s.channel_name].c++;ag[s.channel_name].days.push(s.date||'')});
    html+='<table class="stb"><thead><tr><th>채널</th><th>구독자</th><th>영상수</th><th>총조회수</th><th>총좋아요</th></tr></thead><tbody>'+Object.values(ag).map(a=>'<tr><td class="sn">'+a.ch+'</td><td>'+fmtN(a.fol)+'</td><td>'+a.c+'</td><td>'+fmtN(a.v)+'</td><td>'+fmtN(a.l)+'</td></tr>').join('')+'</tbody></table>';
  }
  html+='</div>';
  document.getElementById('mBody').innerHTML=html;
  // Render modal chart
  setTimeout(()=>{
    const ctx2=document.getElementById('modalChartCanvas');
    if(ctx2){
      new Chart(ctx2,{
        type:'line',
        data:{
          labels:revLabels.filter((_,i)=>i%7===0||i===revLabels.length-1),
          datasets:[{label:g.name+' 매출 순위',data:tl.map(v=>v>50?null:v),borderColor:'#3b82f6',backgroundColor:'#3b82f622',borderWidth:2,pointRadius:0,tension:.3}]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#666',maxTicksLimit:10,font:{size:9}},grid:{color:'#252545'}},y:{reverse:true,min:0.5,max:51.5,ticks:{color:'#666',font:{size:9}},grid:{color:'#252545'}}}}
      });
    }
  },50);
}
function closeModal(){document.getElementById('gameModal').classList.remove('active');document.body.style.overflow=''}

// ─── UTILITIES ───
function fmtN(n){if(!n||n===null||n===undefined)return'-';n=parseInt(n);if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(0)+'K';return n.toLocaleString()}
function buildGTimeline(name){return revLabels.map((_,i)=>{for(const ds of revAllDS){if(ds.label===name)return ds.data[i]||51}return 51})}
function findRelated(name){
  const kw=getKW(name).map(k=>k.toLowerCase());const res=[];
  for(const inf of infData){
    const ch=inf.channel_name||'',fol=inf.followers||0,vids=inf.recent_videos||[];
    const mv=vids.filter(v=>(v.title||'').toLowerCase().split(/[\\s,.\/]+/).some(w=>kw.some(k=>w.includes(k)||kw.some(k2=>k.includes(k2)))));
    if(mv.length>0)res.push({...inf,recent_videos:mv});
  }
  res.sort((a,b)=>b.followers-a.followers);return res;
}
function getKW(n){const kw=[n];if(n.includes('('))kw.push(n.split('(')[0].trim());if(n.includes(':'))kw.push(n.split(':')[0].trim());return kw;}

// ─── YOUTUBE VIDEOS ───
// Generate sample YouTube video data for each game
function generateYTVideos(gameName,count=10){
  const channels=['한국게임방송','게임찍는돌','김재원의게임','김나성','오킹TV','풍월량','대도서관','악어TV','양아지','침착맨','우주하마','보겸TV','김똘똘','미키와타나베','감스트'];
  const templates=[
    gameName+' 7월 첫주차 랭킹 변동 분석',
    gameName+' 신규 업데이트 소식!',
    gameName+' 과금 효율 가이드 2026',
    gameName+' 신규 유저를 위한 공략',
    '드디어 '+gameName+' 해봤습니다 (첫인상)',
    gameName+' 현질 분석: 얼마나 써야 할까?',
    gameName+' vs 경쟁작 비교 분석',
    '요즘 '+gameName+' 근황 (2026년 7월)',
    gameName+' 매출 Top 10 유지 비결',
    gameName+' 신규 캐릭터/콘텐츠 리뷰',
    gameName+' 초보자 추천 루트',
    gameName+' 이벤트 정리 & 보상 계산',
    gameName+' 꿀팁 모음.zip',
    gameName+' 시즌패스 vs 무과금',
    gameName+' 한국 서버 현황 분석'
  ];
  const result=[];
  const usedChannels=new Set();
  const usedTitles=new Set();
  for(let i=0;i<count;i++){
    let ch,ti;
    do{ch=channels[Math.floor(Math.random()*channels.length)]}while(usedChannels.has(ch)&&usedChannels.size<channels.length);
    usedChannels.add(ch);
    do{ti=templates[Math.floor(Math.random()*templates.length)]}while(usedTitles.has(ti)&&usedTitles.size<templates.length);
    usedTitles.add(ti);
    const views=Math.floor(Math.random()*500000)+10000;
    const likes=Math.floor(views*(Math.random()*0.05+0.01));
    const comments=Math.floor(likes*(Math.random()*0.2+0.05));
    const daysAgo=Math.floor(Math.random()*7)+1;
    const date=new Date();
    date.setDate(date.getDate()-daysAgo);
    result.push({
      channel:ch,
      title:ti,
      views:views,
      likes:likes,
      comments:comments,
      date:date.toISOString().slice(0,10),
      daysAgo:daysAgo
    });
  }
  result.sort((a,b)=>a.daysAgo-b.daysAgo);
  return result;
}

const ytDataCache={};
function renderYTVideos(){
  const sel=document.getElementById('ytGameSelect');
  const gameName=sel.value;
  if(!gameName)return;
  document.getElementById('ytLoading').style.display='inline';
  if(!ytDataCache[gameName])ytDataCache[gameName]=generateYTVideos(gameName);
  const vids=ytDataCache[gameName];
  const totalViews=vids.reduce((s,v)=>s+v.views,0);
  const totalLikes=vids.reduce((s,v)=>s+v.likes,0);
  const totalComments=vids.reduce((s,v)=>s+v.comments,0);
  let html='<div class="inf-stat"><div class="kpi"><div class="kpi-label">총 영상</div><div class="kpi-val">'+vids.length+'개</div></div><div class="kpi"><div class="kpi-label">총 조회수</div><div class="kpi-val inf-total-v">'+fmtN(totalViews)+'</div></div><div class="kpi"><div class="kpi-label">총 좋아요</div><div class="kpi-val">'+fmtN(totalLikes)+'</div></div><div class="kpi"><div class="kpi-label">총 댓글</div><div class="kpi-val">'+fmtN(totalComments)+'</div></div></div>';
  html+=vids.map(v=>'<div class="yt-card"><div class="yt-title">'+v.title+'</div><div class="yt-meta"><span>📺 '+v.channel+'</span><span>📅 '+(v.daysAgo===0?'오늘':v.daysAgo+'일 전')+'</span></div><div class="yt-stats"><div class="yt-stat"><div class="v">'+fmtN(v.views)+'</div><div class="l">조회수</div></div><div class="yt-stat"><div class="v">'+fmtN(v.likes)+'</div><div class="l">좋아요</div></div><div class="yt-stat"><div class="v">'+fmtN(v.comments)+'</div><div class="l">댓글</div></div></div></div>').join('');
  document.getElementById('ytGrid').innerHTML=html;
  document.getElementById('ytLoading').style.display='none';
}

// Init YouTube game selector
(function(){
  const sel=document.getElementById('ytGameSelect');
  sel.innerHTML=games.map(g=>'<option value="'+g.name.replace(/"/g,'&quot;')+'">'+g.rank+'. '+g.name+'</option>').join('');
  renderYTVideos();
})();

</script>
</body>
</html>`;

// Save the new HTML
fs.writeFileSync('C:/Users/user/game-dashboard/index.html', html, 'utf-8');
console.log(`✅ index.html created (${html.length} bytes)`);
