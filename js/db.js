/**
 * db.js — Supabase 数据库连接模块
 * 免费层：500MB 数据库 + 5万月活用户
 * 
 * 首次使用需设置：
 * 1. 去 https://sb.com 注册免费账号
 * 2. 创建项目，获取 Project URL 和 anon key
 * 3. 在项目 SQL Editor 中运行下方建表语句
 * 4. 将凭据填入下方 SUPABASE_URL / SUPABASE_KEY
 * 
 * 如果未配置，自动降级为 localStorage 存储
 */

(function(global) {
  'use strict';

  // ==================== 配置区 ====================
  var SUPABASE_URL = 'https://yohdhwldvjfakewtgjen.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_0E5x1p2wJafPL1CWBm1Ukg_0_I3xeKU';
  // ================================================

  var sb = null;
  var useSupabase = false;

  function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return false;
    try {
      var globalSupabase = typeof supabase !== 'undefined' ? supabase : null;
      var createClient = globalSupabase && globalSupabase.createClient;
      if (createClient) {
        sb = createClient(SUPABASE_URL, SUPABASE_KEY);
        useSupabase = true;
      }
      return useSupabase;
    } catch(e) {
      console.error('Supabase 初始化失败:', e.message);
      return false;
    }
  }

  // 验证连接是否真正可用（尝试查询数据库）
  function checkConnection() {
    return new Promise(function(resolve) {
      if (!useSupabase || !sb) {
        resolve(false);
        return;
      }
      // 尝试查询 students 表，验证 RLS 和数据表是否就绪
      sb.from('students').select('id', { count: 'exact', head: true }).then(function(res) {
        if (res.error) {
          console.warn('Supabase 连接校验失败:', res.error.message);
          resolve(false);
        } else {
          useSupabase = true;
          resolve(true);
        }
      }).catch(function(e) {
        console.warn('Supabase 连接异常:', e.message);
        resolve(false);
      });
    });
  }

  // ====== 学生操作 ======
  function dbGetStudent(studentId) {
    if (useSupabase && sb) {
      return sb.from('students').select('*').eq('id', studentId).single();
    }
    return Promise.resolve(null);
  }

  function dbCreateStudent(name) {
    if (useSupabase && sb) {
      return sb.from('students').insert([{ name: name }]).select().single();
    }
    return Promise.resolve(null);
  }

  function dbGetAllStudents() {
    if (useSupabase && sb) {
      return sb.from('students').select('*').order('created_at', { ascending: true });
    }
    return Promise.resolve({ data: [], error: null });
  }

  // ====== 进度操作 ======
  function dbGetProgress(studentId) {
    if (useSupabase && sb) {
      return sb.from('progress').select('*').eq('student_id', studentId).single();
    }
    return Promise.resolve({ data: null });
  }

  function dbSaveProgress(studentId, chapterId, data) {
    if (useSupabase && sb) {
      return sb.from('progress').upsert({
        student_id: studentId,
        chapter_id: chapterId,
        stars: data.stars || 0,
        best_score: data.best_score || 0,
        total_questions: data.total || 0,
        attempts: data.attempts || 0,
        updated_at: new Date().toISOString()
      });
    }
    return Promise.resolve();
  }

  // ====== 错题操作 ======
  function dbAddWrongAnswer(studentId, chapterId, question, userAnswer) {
    if (useSupabase && sb) {
      return sb.from('wrong_answers').insert([{
        student_id: studentId,
        chapter_id: chapterId,
        question_text: JSON.stringify(question),
        user_answer: String(userAnswer),
        correct_answer: String(question.answer),
        knowledge_point: question.template || '',
        created_at: new Date().toISOString()
      }]);
    }
    return Promise.resolve();
  }

  function dbGetWrongAnswers(studentId, chapterId) {
    if (useSupabase && sb) {
      var query = sb.from('wrong_answers').select('*').eq('student_id', studentId);
      if (chapterId) query = query.eq('chapter_id', chapterId);
      return query.order('created_at', { ascending: false });
    }
    return Promise.resolve({ data: [] });
  }

  function dbRemoveWrongAnswer(id) {
    if (useSupabase && sb) {
      return sb.from('wrong_answers').delete().eq('id', id);
    }
    return Promise.resolve();
  }

  function dbGetWrongCountByChapter(studentId) {
    if (useSupabase && sb) {
      return sb.rpc('get_wrong_count_by_chapter', { sid: studentId });
    }
    return Promise.resolve({ data: [] });
  }

  // ====== 答题记录 ======
  function dbSaveQuizHistory(studentId, chapterId, score, total, accuracy, stars) {
    if (useSupabase && sb) {
      return sb.from('quiz_history').insert([{
        student_id: studentId,
        chapter_id: chapterId,
        score: score,
        total: total,
        accuracy: accuracy,
        stars: stars,
        created_at: new Date().toISOString()
      }]);
    }
    return Promise.resolve();
  }

  // ====== 初始化 ======
  initSupabase();

  // ====== 导出 ======
  var api = {
    initSupabase: initSupabase,
    checkConnection: checkConnection,
    isConnected: function() { return useSupabase; },
    getStudent: dbGetStudent,
    createStudent: dbCreateStudent,
    getAllStudents: dbGetAllStudents,
    getProgress: dbGetProgress,
    saveProgress: dbSaveProgress,
    addWrongAnswer: dbAddWrongAnswer,
    getWrongAnswers: dbGetWrongAnswers,
    removeWrongAnswer: dbRemoveWrongAnswer,
    getWrongCountByChapter: dbGetWrongCountByChapter,
    saveQuizHistory: dbSaveQuizHistory
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  global.MathDB = api;

})(typeof window !== 'undefined' ? window : global);

/*
SQL 建表语句（在 Supabase SQL Editor 中运行）：

-- 学生表
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  stars INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, chapter_id)
);

-- 错题表
CREATE TABLE wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  question_text TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  knowledge_point TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 答题记录表
CREATE TABLE quiz_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  score INTEGER,
  total INTEGER,
  accuracy INTEGER,
  stars INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 按章节统计错题函数
CREATE OR REPLACE FUNCTION get_wrong_count_by_chapter(sid UUID)
RETURNS TABLE(chapter_id INTEGER, count BIGINT) AS $$
  SELECT chapter_id, COUNT(*) FROM wrong_answers
  WHERE student_id = sid
  GROUP BY chapter_id;
$$ LANGUAGE SQL;
*/
