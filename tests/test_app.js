/**
 * app.js 路由模块单元测试
 * 运行：node tests/test_app.js
 */

// 模拟浏览器环境
global.window = global;
global.location = { hash: '', href: 'http://test/' };
global.window.addEventListener = function() {};
global.document = {
  querySelector: function() { return null; },
  getElementById: function() { return null; },
  querySelectorAll: function() { return []; },
  addEventListener: function() {},
  readyState: 'complete'
};

// 加载模块（app.js 会自执行并挂载 MathApp 到 window）
require('../js/app.js');

var app = global.MathApp;
var passed = 0;
var failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; }
  else { failed++; console.error('  FAIL:', msg); }
}

console.log('\n🧪 测试 App 路由模块\n');

// --- 路由解析 ---
console.log('📋 路由解析');

location.hash = '#cover';
var route = app.getCurrentRoute();
assert(route.name === 'cover', 'cover 路由解析正确');
assert(route.params === null, 'cover 无参数');

location.hash = '#teacher';
route = app.getCurrentRoute();
assert(route.name === 'teacher', 'teacher 路由解析正确');

location.hash = '#map';
route = app.getCurrentRoute();
assert(route.name === 'map', 'map 路由解析正确');

location.hash = '#story/3';
route = app.getCurrentRoute();
assert(route.name === 'story', 'story 路由解析正确');
assert(route.params.id === '3', 'story/3 id=3');

location.hash = '#quiz/1';
route = app.getCurrentRoute();
assert(route.name === 'quiz', 'quiz 路由解析正确');
assert(route.params.id === '1', 'quiz/1 id=1');

location.hash = '#reward';
route = app.getCurrentRoute();
assert(route.name === 'reward', 'reward 路由解析正确');

location.hash = '';
route = app.getCurrentRoute();
assert(route.name === 'cover', '空 hash 默认到 cover');

location.hash = '#unknown';
route = app.getCurrentRoute();
assert(route.name === 'cover', '未知路由回退到 cover');

// --- 路由导航 ---
console.log('📋 路由导航');

var changedRoutes = [];
app.onRouteChange(function(r) { changedRoutes.push(r); });

app.navigate('#story/5');
assert(location.hash === '#story/5', 'navigate 修改 hash');

app.navigate('#quiz/2', { level: 3 });
assert(location.hash === '#quiz/2', 'navigate 带参数修改 hash');

// --- 页面显示管理 ---
console.log('📋 页面显示');

var shownPages = [];
var mockPages = {
  'page-cover': { classList: { add: function(c) { shownPages.push('cover-'+c); }, remove: function(c) {} }, style: {} },
  'page-teacher': { classList: { add: function(c) { shownPages.push('teacher-'+c); }, remove: function(c) {} }, style: {} },
  'page-map': { classList: { add: function(c) { shownPages.push('map-'+c); }, remove: function(c) {} }, style: {} }
};

app._test_showPage('cover', mockPages);
assert(shownPages.includes('cover-active'), '封面页显示时添加 active class');

// ====== 结果 ======
console.log(`\n${'='.repeat(40)}`);
console.log(`✅ 通过: ${passed}  |  ❌ 失败: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

if (failed > 0) process.exit(1);
