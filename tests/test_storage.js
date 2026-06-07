/**
 * storage.js 单元测试
 * 运行方式：node tests/test_storage.js
 * 注意：storage.js 依赖浏览器 localStorage，测试中模拟为普通对象
 */

// 模拟浏览器环境
global.localStorage = {};
global.localStorage.getItem = function(key) { return this[key] || null; };
global.localStorage.setItem = function(key, value) { this[key] = String(value); };
global.localStorage.removeItem = function(key) { delete this[key]; };
global.localStorage.clear = function() { Object.keys(this).forEach(k => delete this[k]); };

// 加载待测模块
const storage = require('../js/storage.js');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error('  FAIL:', msg);
  }
}

function reset() {
  // 只清除数据 key，保留方法
  var methods = ['getItem', 'setItem', 'removeItem', 'clear', 'key', 'length'];
  Object.keys(global.localStorage).forEach(function(k) {
    if (methods.indexOf(k) === -1) delete global.localStorage[k];
  });
}

// ====== 测试用例 ======

console.log('\n🧪 测试 Storage 模块\n');

// --- 教师 ---
reset();
console.log('📋 教师管理');

let teacher = storage.getTeacher();
assert(teacher === null, '初始无教师 → null');

storage.saveTeacher('王老师');
teacher = storage.getTeacher();
assert(teacher.name === '王老师', '保存教师后读取成功');
assert(Array.isArray(teacher.students), '教师应有 students 数组');

// --- 学生 ---
console.log('📋 学生管理');

const s1 = storage.addStudent('张三');
assert(typeof s1 === 'string' && s1.length > 0, '添加学生返回有效 ID');

const s2 = storage.addStudent('李四');
const students = storage.getStudents();
assert(students.length === 2, '教师有2个学生');
assert(students[0].name === '张三', '学生1名字正确');
assert(students[1].name === '李四', '学生2名字正确');

// 更新 teacher 内容来验证学生列表
const updatedTeacher = storage.getTeacher();
assert(updatedTeacher.students.includes(s1), '教师学生列表包含s1');
assert(updatedTeacher.students.includes(s2), '教师学生列表包含s2');

// --- 进度 ---
console.log('📋 进度管理');

const progress = storage.getProgress(s1);
assert(progress.total_coins === 0, '新学生金币为0');
assert(Object.keys(progress.chapters).length === 6, '默认有6章进度');

storage.saveProgress(s1, { total_coins: 50, chapters: { "1": { stars: 3, best_score: 14 } } });
const p1 = storage.getProgress(s1);
assert(p1.total_coins === 50, '保存后金币=50');
assert(p1.chapters["1"].stars === 3, '保存后第一章3星');
assert(p1.chapters["2"].status === 'locked', '未保存的章节仍为默认锁定');

// --- 多个学生独立进度 ---
console.log('📋 多学生进度隔离');

storage.saveProgress(s2, { total_coins: 30 });
const pS1 = storage.getProgress(s1);
const pS2 = storage.getProgress(s2);
assert(pS1.total_coins === 50, 's1金币不受s2影响');
assert(pS2.total_coins === 30, 's2金币独立存储');

// --- 容错：损坏数据 ---
console.log('📋 容错处理');

localStorage.setItem('dalian_math_progress_s999', '{ broken json !!');
const badProgress = storage.getProgress('s999');
assert(badProgress.total_coins === 0, '损坏数据 → 返回默认值');
assert(typeof badProgress.chapters === 'object', '损坏数据章节仍为对象');

// --- 容错：空存储 ---
reset();
const freshTeacher = storage.getTeacher();
assert(freshTeacher === null, '空存储教师为null');
const freshStudents = storage.getStudents();
assert(freshStudents.length === 0, '空存储学生列表为空');

// --- 重置 ---
console.log('📋 全部重置');

storage.saveTeacher('测试');
storage.addStudent('测试生');
storage.resetAll();
assert(storage.getTeacher() === null, '重置后教师清空');
assert(storage.getStudents().length === 0, '重置后学生清空');

// ====== 结果 ======
console.log(`\n${'='.repeat(40)}`);
console.log(`✅ 通过: ${passed}  |  ❌ 失败: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

if (failed > 0) process.exit(1);
