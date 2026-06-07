/**
 * storage.js — localStorage 统一读写模块
 * 管理：教师档案、多学生档案、进度持久化
 */

(function(global) {
  'use strict';

  // 兼容浏览器和 Node.js 测试环境
  const ls = (typeof localStorage !== 'undefined') ? localStorage : global.localStorage;

  const PREFIX = 'dalian_math_';
  const KEY_TEACHER = PREFIX + 'teacher';
  const KEY_PROGRESS_PREFIX = PREFIX + 'progress_';

  // ====== 工具函数 ======

  function safeParse(jsonStr, fallback) {
    try {
      const result = JSON.parse(jsonStr);
      return result !== null && typeof result === 'object' ? result : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeStringify(obj) {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return '{}';
    }
  }

  function generateId() {
    return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // ====== 默认进度模板 ======

  function createDefaultProgress() {
    return {
      version: 1,
      total_coins: 0,
      chapters: {
        "1": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] },
        "2": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] },
        "3": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] },
        "4": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] },
        "5": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] },
        "6": { status: "locked", stars: 0, best_score: 0, total: 16, attempts: 0, levels_completed: [] }
      }
    };
  }

  // ====== 教师管理 ======

  function getTeacher() {
    const raw = ls.getItem(KEY_TEACHER);
    if (!raw) return null;
    const data = safeParse(raw, null);
    if (!data || !data.name) return null;
    return data;
  }

  function saveTeacher(name) {
    const existing = getTeacher();
    const data = {
      name: name,
      students: existing ? existing.students || [] : [],
      created_at: existing ? existing.created_at : new Date().toISOString()
    };
    ls.setItem(KEY_TEACHER, safeStringify(data));
    return data;
  }

  // ====== 学生管理 ======

  function getStudents() {
    const teacher = getTeacher();
    if (!teacher || !teacher.students) return [];

    return teacher.students.map(function(sid) {
      const progress = getProgress(sid);
      const infoKey = PREFIX + 'student_info_' + sid;
      const infoRaw = ls.getItem(infoKey);
      const info = safeParse(infoRaw, { name: '未知学生' });
      return {
        id: sid,
        name: info.name,
        total_coins: progress.total_coins,
        completed_chapters: Object.values(progress.chapters).filter(function(c) {
          return c.status === 'completed';
        }).length
      };
    });
  }

  function addStudent(name) {
    const teacher = getTeacher();
    if (!teacher) return null;

    const sid = generateId();
    teacher.students.push(sid);
    ls.setItem(KEY_TEACHER, safeStringify(teacher));

    // 储存学生信息
    const infoKey = PREFIX + 'student_info_' + sid;
    ls.setItem(infoKey, safeStringify({ name: name, created_at: new Date().toISOString() }));

    // 初始化进度（第1章解锁）
    const progress = createDefaultProgress();
    progress.chapters["1"].status = "in_progress";
    ls.setItem(KEY_PROGRESS_PREFIX + sid, safeStringify(progress));

    return sid;
  }

  function removeStudent(sid) {
    const teacher = getTeacher();
    if (!teacher) return false;

    teacher.students = teacher.students.filter(function(s) { return s !== sid; });
    ls.setItem(KEY_TEACHER, safeStringify(teacher));

    ls.removeItem(PREFIX + 'student_info_' + sid);
    ls.removeItem(KEY_PROGRESS_PREFIX + sid);
    return true;
  }

  // ====== 进度管理 ======

  function getProgress(sid) {
    const raw = ls.getItem(KEY_PROGRESS_PREFIX + sid);
    const progress = safeParse(raw, null);
    if (!progress || typeof progress.total_coins !== 'number') {
      return createDefaultProgress();
    }
    // 合并默认结构，防止后续新增字段缺失
    const def = createDefaultProgress();
    for (var key in def.chapters) {
      if (!progress.chapters[key]) {
        progress.chapters[key] = def.chapters[key];
      }
    }
    return progress;
  }

  function saveProgress(sid, data) {
    const existing = getProgress(sid);
    // 深度合并
    const merged = mergeDeep(existing, data);
    merged.last_updated = new Date().toISOString();
    ls.setItem(KEY_PROGRESS_PREFIX + sid, safeStringify(merged));
    return merged;
  }

  function mergeDeep(target, source) {
    var result = JSON.parse(JSON.stringify(target));
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = mergeDeep(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  // ====== 重置 ======

  function resetAll() {
    // 只清除本应用的 key，兼容浏览器和 Node.js
    var keys = [];
    if (typeof ls.length === 'number' && typeof ls.key === 'function') {
      for (var i = 0; i < ls.length; i++) {
        var key = ls.key(i);
        if (key && key.indexOf(PREFIX) === 0) {
          keys.push(key);
        }
      }
    } else {
      // Node.js 测试环境
      keys = Object.keys(ls).filter(function(k) { return k.indexOf(PREFIX) === 0; });
    }
    keys.forEach(function(k) { ls.removeItem(k); });
  }

  // ====== 导出（浏览器全局 / Node.js module） ======

  var api = {
    getTeacher: getTeacher,
    saveTeacher: saveTeacher,
    getStudents: getStudents,
    addStudent: addStudent,
    removeStudent: removeStudent,
    getProgress: getProgress,
    saveProgress: saveProgress,
    resetAll: resetAll,
    _PREFIX: PREFIX
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.MathStorage = api;
  }

})(typeof window !== 'undefined' ? window : global);
