/**
 * generator.js — 参数化出题引擎
 * 支持模板注册和随机生成，保证每次练习题目不同
 */

(function(global) {
  'use strict';

  // 模板仓库：{ chapterId: { questionType: [template, ...] } }
  var templateRepo = {};
  var templateIndex = 0;

  // ====== 模板注册 ======
  function registerTemplate(chapterId, questionType, template) {
    if (!templateRepo[chapterId]) {
      templateRepo[chapterId] = {};
    }
    if (!templateRepo[chapterId][questionType]) {
      templateRepo[chapterId][questionType] = [];
    }
    var id = 't' + (++templateIndex) + '_' + chapterId + '_' + questionType;
    template.id = id;
    templateRepo[chapterId][questionType].push(template);
    return id;
  }

  // ====== 题目生成 ======
  function generateQuestions(chapterId, questionType, count) {
    var chapterTemplates = templateRepo[chapterId];
    if (!chapterTemplates || !chapterTemplates[questionType]) {
      return [];
    }

    var templates = chapterTemplates[questionType];
    if (templates.length === 0) return [];

    // 轮询使用模板，确保多样性
    var questions = [];
    var usedTemplateIndex = {}; // 记录每个template被使用的次数
    var maxPerTemplate = Math.max(1, Math.ceil(count / templates.length));

    // 初始化计数器
    for (var i = 0; i < templates.length; i++) {
      usedTemplateIndex[i] = 0;
    }

    var qIndex = 0;
    while (questions.length < count) {
      // 轮流尝试模板
      var tIdx = qIndex % templates.length;
      var template = templates[tIdx];

      if (usedTemplateIndex[tIdx] < maxPerTemplate) {
        try {
          var generated = template.generate();
          var question = formatQuestion(chapterId, questionType, template, generated);
          if (question) {
            questions.push(question);
            usedTemplateIndex[tIdx]++;
          }
        } catch (e) {
          // 生成失败，跳过这个模板
        }
      }
      qIndex++;

      // 防止无限循环
      if (qIndex > count * 3) break;
    }

    return shuffleArray(questions);
  }

  // ====== 格式化题目 ======
  function formatQuestion(chapterId, questionType, template, generated) {
    var q = {
      id: 'g_' + chapterId + '_' + questionType + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      question: generated.question,
      answer: generated.answer,
      explain: generated.explain || '',
      template: template.name || '',
      generated: true
    };

    // 选择题/速答题：生成选项并找到正确答案位置
    if (questionType === 'choice' || questionType === 'speed') {
      q.options = generated.options || generateChoiceOptions(generated.answer, generated.distractors);
      if (Array.isArray(q.options) && q.options.length > 0) {
        // 检测：模板返回的 answer 是索引还是值？
        var isIndex = (typeof generated.answer === 'number' && generated.answer >= 0 && 
          generated.options && generated.answer < generated.options.length);
        
        if (isIndex) {
          // answer 是索引，从原始 options 中取出真实答案值，再到 q.options 中找
          var realAnswer = generated.options[generated.answer];
          q.answer = findAnswerIndex(q.options, normalizeAnswerStr(realAnswer));
          if (q.answer === -1) {
            // q.options 就是 generated.options（未经过 generateChoiceOptions）
            q.answer = generated.answer;
          }
        } else {
          // answer 是值，在 options 中查找
          var answerStr = normalizeAnswerStr(q.answer);
          q.answer = findAnswerIndex(q.options, answerStr);
          if (q.answer === -1) {
            q.options.unshift(String(q.answer));
            q.answer = 0;
          }
        }
      }
    }

    // 填空/计算题：设置默认容差
    if (questionType === 'fill' || questionType === 'calc') {
      if (q.tolerance === undefined) q.tolerance = 0.005;
    }

    // 判断题：规范化答案为布尔值
    if (questionType === 'judge') {
      q.answer = Boolean(q.answer);
    }

    // 连线题：确保 pairs 存在
    if (questionType === 'match') {
      q.pairs = generated.pairs || [];
      q.left_items = generated.left_items || [];
      q.right_items = generated.right_items || [];
    }

    // 限时题：添加时间限制
    if (questionType === 'speed') {
      q.time_limit = generated.time_limit || 15;
    }

    // 计算题：添加竖式标识
    if (questionType === 'calc') {
      q.type = generated.type || 'vertical';
    }

    return q;
  }

  // ====== 干扰项生成 ======
  function generateChoiceOptions(answer, providedDistractors) {
    if (providedDistractors && Array.isArray(providedDistractors)) {
      // 去重：合并正确答案和干扰项，去重后保留前4个
      var opts = [String(answer)];
      for (var di = 0; di < providedDistractors.length && opts.length < 4; di++) {
        var ds = String(providedDistractors[di]);
        if (opts.indexOf(ds) < 0) opts.push(ds);
      }
      // 如果还不够4个，补充通用选项
      var fallbacks = ['以上都对', '以上都不对'];
      for (var fi = 0; fi < fallbacks.length && opts.length < 4; fi++) {
        if (opts.indexOf(fallbacks[fi]) < 0) opts.push(fallbacks[fi]);
      }
      return shuffleArray(opts);
    }

    // 自动生成干扰项（确保不重复且与正确答案不同）
    var answerStr = String(answer);
    var answerNum = parseFloat(answer);
    var options = [answerStr];

    if (!isNaN(answerNum)) {
      var attempts = 0;
      while (options.length < 4 && attempts < 30) {
        attempts++;
        var d;
        var offsetType = attempts % 3;
        if (offsetType === 0) {
          d = parseFloat((answerNum + getRandomOffset(1, 5) * (attempts > 3 ? attempts * 0.3 : 1)).toFixed(2));
        } else if (offsetType === 1) {
          d = parseFloat((answerNum - getRandomOffset(0.5, 3) * (attempts > 3 ? attempts * 0.3 : 1)).toFixed(2));
        } else {
          d = parseFloat((answerNum * (getRandomSign() * (0.5 + Math.random() * 2))).toFixed(2));
        }
        var ds = String(d);
        if (ds !== answerStr && options.indexOf(ds) < 0) {
          options.push(ds);
        }
      }
      // 还不够的话用通用选项补充
      var fb = ['以上都对', '以上都不对'];
      for (var f = 0; f < fb.length && options.length < 4; f++) {
        if (options.indexOf(fb[f]) < 0) options.push(fb[f]);
      }
    } else {
      options = [answerStr, '以上都对', '以上都不对', '不确定'];
    }

    return shuffleArray(options);
  }

  function getRandomOffset(min, max) {
    return min + Math.random() * (max - min);
  }

  function getRandomSign() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  // ====== 洗牌 ======
  function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }

  // ====== 设置全局随机种子（用于测试复用） ======
  // ====== 答案标准化辅助 ======
  function normalizeAnswerStr(val) {
    // 转字符串，数值去掉末尾多余零
    var s = String(val);
    var n = parseFloat(s);
    if (!isNaN(n) && String(n) === s) return String(n);
    // 比如 "5.00" → parseFloat → 5 → "5"
    // 但如果原始就是 "5.0"，返回 "5"
    return s;
  }

  function findAnswerIndex(options, target) {
    // 先精确匹配
    var idx = options.indexOf(target);
    if (idx >= 0) return idx;
    // 尝试数值匹配（处理 "5" vs "5.0" 等情况）
    var targetNum = parseFloat(target);
    if (!isNaN(targetNum)) {
      for (var i = 0; i < options.length; i++) {
        var optNum = parseFloat(options[i]);
        if (!isNaN(optNum) && Math.abs(optNum - targetNum) < 0.001) return i;
      }
    }
    return -1;
  }

  // ====== 清洗答案字符串 ======
  function cleanAnswerStr(val) {
    var s = String(val).trim();
    // 数值型：去末尾零
    var n = parseFloat(s);
    if (!isNaN(n) && s.indexOf('.') >= 0) {
      s = s.replace(/0+$/, '').replace(/\.$/, '');
    }
    return s;
  }

  function setSeed(seed) {
    // 简单的伪随机实现，用于测试可复现
    if (seed !== undefined) {
      var s = seed;
      Math.random = function() {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    }
  }

  // ====== 获取已注册模板数 ======
  function getTemplateCount(chapterId, questionType) {
    var ct = templateRepo[chapterId];
    if (!ct) return 0;
    var tt = ct[questionType];
    return tt ? tt.length : 0;
  }

  // ====== 清空模板（测试用） ======
  function clearTemplates() {
    templateRepo = {};
    templateIndex = 0;
  }

  // ====== 导出 ======
  var api = {
    registerTemplate: registerTemplate,
    generateQuestions: generateQuestions,
    getTemplateCount: getTemplateCount,
    setSeed: setSeed,
    clearTemplates: clearTemplates,
    _shuffleArray: shuffleArray
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  global.MathGenerator = api;

})(typeof window !== 'undefined' ? window : global);
