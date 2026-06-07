/**
 * generator.js 生成题引擎单元测试
 * 运行：node tests/test_generator.js
 */

// 模拟浏览器环境
global.window = global;
global.localStorage = {};
global.localStorage.getItem = function() { return null; };
global.localStorage.setItem = function() {};
global.document = {};
global.window.addEventListener = function() {};

// 加载模块
require('../js/generator.js');

var gen = global.MathGenerator;
var passed = 0;
var failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; }
  else { failed++; console.error('  FAIL:', msg); }
}

console.log('\n🧪 测试生成题引擎\n');

// --- 模板注册 ---
console.log('📋 模板注册');

var tid1 = gen.registerTemplate(1, 'choice', {
  name: '小数加法竖式',
  generate: function() {
    var a = (Math.random() * 10 + 1).toFixed(1);
    var b = (Math.random() * 10 + 1).toFixed(1);
    return {
      question: a + ' + ' + b + ' = ?',
      answer: (parseFloat(a) + parseFloat(b)).toFixed(1),
      explain: '小数点对齐，从低位加起'
    };
  }
});
assert(typeof tid1 === 'string', '注册模板返回id');

var tid2 = gen.registerTemplate(1, 'choice', {
  name: '小数比大小',
  generate: function() {
    var a = (Math.random() * 10).toFixed(1);
    var b = (Math.random() * 10).toFixed(1);
    var gt = parseFloat(a) > parseFloat(b);
    return {
      question: a + ' ○ ' + b,
      answer: gt ? '>' : (parseFloat(a) === parseFloat(b) ? '=' : '<'),
      explain: gt ? a + '更大' : b + '更大'
    };
  }
});

// --- 生成题目 ---
console.log('📋 生成题目');

var questions = gen.generateQuestions(1, 'choice', 5);
assert(questions.length === 5, '生成5道题');
assert(questions[0].id !== undefined, '题目有id');
assert(questions[0].question !== undefined, '题目有问题文本');
assert(questions[0].answer !== undefined, '题目有答案字段');

// --- 选项生成 ---
console.log('📋 选项生成');

var choiceQ = questions[0];
assert(choiceQ.options !== undefined, '选择题有options');
assert(Array.isArray(choiceQ.options), 'options是数组');

// --- 题目多样性 ---
console.log('📋 题目多样性');

var allIds = questions.map(function(q) { return q.id; });
var uniqueIds = allIds.filter(function(id, i) { return allIds.indexOf(id) === i; });
assert(uniqueIds.length >= 3, '5题中至少3个不同模板: 实际' + uniqueIds.length);

// --- 答案正确性验证 ---
console.log('📋 答案正确性');

for (var i = 0; i < questions.length; i++) {
  var q = questions[i];
  if (q.options && q.answer !== undefined) {
    var correctOption = q.options[q.answer];
    assert(correctOption !== undefined, '题' + i + '正确答案索引有效');
  }
}

// --- 无模板时回退 ---
console.log('📋 无模板回退');

var empty = gen.generateQuestions(999, 'choice', 3);
assert(empty.length === 0, '无模板返回空数组');

// ====== 结果 ======
console.log(`\n${'='.repeat(40)}`);
console.log(`✅ 通过: ${passed}  |  ❌ 失败: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

if (failed > 0) process.exit(1);
