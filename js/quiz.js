/**
 * quiz.js — 答题引擎（核心模块）
 * 管理答题会话、题型渲染、答案判定、关卡递进
 */

(function(global) {
  'use strict';

  // ====== 会话状态 ======
  var session = null;

  function getSession() { return session; }

  function initSession(chapterId, studentId) {
    session = {
      chapterId: chapterId,
      studentId: studentId,
      currentLevel: 0,
      currentQuestion: 0,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      levels: [],
      questions: [],
      levelResults: [],
      startTime: Date.now()
    };
    return session;
  }

  // ====== 加载题目 ======
  function loadQuestions(chapterId) {
    // 从 chapters.json 获取关卡配置
    var chapter = getChapterConfig(chapterId);
    if (!chapter) return null;

    session.levels = chapter.levels || [];
    session.questions = [];
    session.totalQuestions = 0;

    // 加载手写题库
    var handcrafted = loadHandcraftedQuestions(chapterId);

    // 按关卡生成题目
    for (var li = 0; li < session.levels.length; li++) {
      var level = session.levels[li];
      var type = level.type;
      var count = level.count || 3;

      // 混合手写题和生成题（比例约4:6）
      var handCount = Math.min(
        Math.floor(count * 0.4),
        handcrafted[type] ? handcrafted[type].length : 0
      );
      var genCount = count - handCount;

      var levelQuestions = [];

      // 选取手写题
      if (handcrafted[type] && handcrafted[type].length > 0) {
        var shuffled = shuffleArray(handcrafted[type].slice());
        for (var hi = 0; hi < handCount; hi++) {
          levelQuestions.push(shuffled[hi]);
        }
      }

      // 生成题
      if (typeof MathGenerator !== 'undefined') {
        var generated = MathGenerator.generateQuestions(chapterId, type, genCount);
        levelQuestions = levelQuestions.concat(generated);
      }

      // 确保每关至少有一些题目（纯生成题也行）
      if (levelQuestions.length < count && typeof MathGenerator !== 'undefined') {
        var extra = MathGenerator.generateQuestions(chapterId, type, count - levelQuestions.length);
        levelQuestions = levelQuestions.concat(extra);
      }

      // 打乱本关题目顺序
      levelQuestions = shuffleArray(levelQuestions.slice(0, count));
      session.questions.push(levelQuestions);
      session.totalQuestions += levelQuestions.length;
    }

    session.currentLevel = 0;
    session.currentQuestion = 0;
    return session.questions;
  }

  function loadHandcraftedQuestions(chapterId) {
    var result = { choice: [], fill: [], calc: [], judge: [], match: [], speed: [] };
    // handcrafted questions are loaded via fetch in browser
    // In the browser, we'll use a callback pattern
    return result;
  }

  function getChapterConfig(chapterId) {
    // Will be populated via fetch
    if (typeof MathApp !== 'undefined' && MathApp._chapterData) {
      var chapters = MathApp._chapterData.chapters || [];
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].id === chapterId) return chapters[i];
      }
    }
    return null;
  }

  // ====== 获取当前题目 ======
  function getCurrentQuestion() {
    if (!session || session.currentLevel >= session.questions.length) return null;
    var levelQuestions = session.questions[session.currentLevel];
    if (session.currentQuestion >= levelQuestions.length) return null;
    return levelQuestions[session.currentQuestion];
  }

  function getCurrentLevel() {
    if (!session) return null;
    return session.levels[session.currentLevel];
  }

  function getProgress() {
    if (!session) return { answered: 0, total: 0, level: 0, totalLevels: 0 };
    return {
      answered: session.answeredQuestions,
      total: session.totalQuestions,
      level: session.currentLevel + 1,
      totalLevels: session.levels.length,
      score: session.score
    };
  }

  // ====== 提交答案 ======
  function submitAnswer(answer) {
    var question = getCurrentQuestion();
    if (!question) return null;

    var correct = false;
    var questionType = getCurrentLevel().type;

    switch (questionType) {
      case 'choice':
      case 'speed':
        correct = (parseInt(answer) === parseInt(question.answer));
        break;
      case 'fill':
        var tolerance = question.tolerance || 0;
        correct = Math.abs(parseFloat(answer) - parseFloat(question.answer)) <= tolerance;
        break;
      case 'calc':
        var calcTolerance = question.tolerance || 0;
        correct = Math.abs(parseFloat(answer) - parseFloat(question.answer)) <= calcTolerance;
        break;
      case 'judge':
        correct = (Boolean(answer) === Boolean(question.answer));
        break;
      case 'match':
        // answer is array of pair indices
        correct = arraysEqual(answer, question.pairs);
        break;
      default:
        correct = String(answer).trim() === String(question.answer).trim();
    }

    if (correct) {
      session.score++;
    }
    session.answeredQuestions++;

    var result = {
      correct: correct,
      question: question,
      userAnswer: answer,
      levelType: questionType
    };

    return result;
  }

  function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (parseInt(a[i]) !== parseInt(b[i])) return false;
    }
    return true;
  }

  // ====== 移动到下一题 ======
  function nextQuestion() {
    if (!session) return null;

    session.currentQuestion++;

    // 当前关卡结束？
    if (session.currentQuestion >= session.questions[session.currentLevel].length) {
      // 保存当前关卡结果
      var levelScore = 0;
      var levelTotal = session.questions[session.currentLevel].length;
      // 计算本关得分（粗略估算，精确计算在settlement做）
      session.levelResults.push({
        level: session.currentLevel + 1,
        score: 'pending',
        total: levelTotal
      });

      // 进入下一关
      session.currentLevel++;
      session.currentQuestion = 0;

      // 全部关卡结束？
      if (session.currentLevel >= session.levels.length) {
        return 'finished';
      }
      return 'next_level';
    }

    return 'next_question';
  }

  // ====== 计算结果 ======
  function getFinalResult() {
    if (!session) return null;
    var accuracy = session.totalQuestions > 0 ? session.score / session.totalQuestions : 0;
    var stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.5 ? 1 : 0;
    var coins = session.score * 10;
    var elapsed = Math.floor((Date.now() - session.startTime) / 1000);

    return {
      score: session.score,
      total: session.totalQuestions,
      accuracy: Math.round(accuracy * 100),
      stars: stars,
      coins: coins,
      elapsed: elapsed,
      chapterId: session.chapterId,
      studentId: session.studentId
    };
  }

  // ====== 洗牌 ======
  function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i]; result[i] = result[j]; result[j] = tmp;
    }
    return result;
  }

  // ====== 导出 ======
  var api = {
    initSession: initSession,
    getSession: getSession,
    loadQuestions: loadQuestions,
    getCurrentQuestion: getCurrentQuestion,
    getCurrentLevel: getCurrentLevel,
    getProgress: getProgress,
    submitAnswer: submitAnswer,
    nextQuestion: nextQuestion,
    getFinalResult: getFinalResult,
    loadHandcraftedQuestions: loadHandcraftedQuestions,
    getChapterConfig: getChapterConfig
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  global.MathQuiz = api;

})(typeof window !== 'undefined' ? window : global);
