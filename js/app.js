/**
 * app.js — 主应用入口
 * 路由管理、页面切换、全局状态、题型渲染
 */

(function(global) {
  'use strict';

  // ====== 全局数据 ======
  var chapterData = null;
  var questionDataCache = {};
  var quizQuestions = [];

  // ====== 路由定义 ======
  var ROUTES = {
    cover:     { pattern: /^#cover$/,           name: 'cover' },
    teacher:   { pattern: /^#teacher$/,         name: 'teacher' },
    map:       { pattern: /^#map$/,             name: 'map' },
    story:     { pattern: /^#story\/(\d+)$/,    name: 'story',   params: ['id'] },
    quiz:      { pattern: /^#quiz\/(\d+)$/,     name: 'quiz',    params: ['id'] },
    reward:    { pattern: /^#reward$/,          name: 'reward' },
    wrongcamp: { pattern: /^#wrongcamp$/,       name: 'wrongcamp' },
    advanced:  { pattern: /^#advanced$/,        name: 'advanced' },
    report:    { pattern: /^#report\/(.+)$/,    name: 'report',   params: ['id'] },
    reportAdv: { pattern: /^#report-adv\/(.+)$/, name: 'report-adv', params: ['id'] }
  };

  function getCurrentRoute() {
    var hash = location.hash || '';
    if (!hash || hash === '#') return { name: 'cover', params: null };
    for (var key in ROUTES) {
      var route = ROUTES[key];
      var match = hash.match(route.pattern);
      if (match) {
        var params = null;
        if (route.params) {
          params = {};
          for (var i = 0; i < route.params.length; i++) {
            params[route.params[i]] = match[i + 1];
          }
        }
        return { name: route.name, params: params };
      }
    }
    return { name: 'cover', params: null };
  }

  function navigate(hash) {
    location.hash = hash;
    onHashChange();
  }

  // ====== 路由监听 ======
  var changeCallbacks = [];

  function onRouteChange(callback) { changeCallbacks.push(callback); }

  function onHashChange() {
    var route = getCurrentRoute();
    showPage(route.name);
    renderPage(route);
    if (typeof MathAuth !== 'undefined') MathAuth.updateNavbar();
    for (var i = 0; i < changeCallbacks.length; i++) {
      changeCallbacks[i](route);
    }
  }

  // ====== 页面切换 ======
  function showPage(pageName) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
    var target = document.getElementById('page-' + pageName);
    if (target) target.classList.add('active');
    var navbar = document.getElementById('navbar');
    if (navbar) navbar.style.display = pageName === 'cover' ? 'none' : 'flex';
  }

  // ====== 页面渲染 ======
  function renderPage(route) {
    switch (route.name) {
      case 'cover': renderCover(); break;
      case 'teacher': renderTeacher(); break;
      case 'map': renderMap(); break;
      case 'story': renderStory(route.params.id); break;
      case 'quiz': renderQuiz(route.params.id); break;
      case 'reward': renderReward(); break;
      case 'wrongcamp': renderWrongCamp(); break;
      case 'advanced': renderAdvanced(); break;
      case 'report': renderReportPage(route.params.id); break;
      case 'report-adv': renderAdvancedReportPage(route.params.id); break;
    }
  }

  // ====== 封面页 ======
  function renderCover() {
    var page = document.getElementById('page-cover');
    page.innerHTML = ''
      + '<div style="position:relative;width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;">'
      + '<div class="wave-bg" style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,transparent,var(--blue-pale),var(--blue-light));opacity:0.4;"></div>'
      + '<div id="seagull1" style="position:absolute;font-size:2rem;animation:seagullFly 12s linear infinite;">🐦</div>'
      + '<div id="seagull2" style="position:absolute;font-size:1.5rem;animation:seagullFly 15s linear 5s infinite;">🐦</div>'
      + '<div style="animation:fadeInUp 1s ease;text-align:center;z-index:1;">'
      + '<div style="font-size:4rem;margin-bottom:16px;animation:wave 2s ease infinite;">🌊</div>'
      + '<h1 style="font-size:3rem;color:var(--blue-dalian);margin-bottom:8px;text-shadow:0 2px 10px rgba(26,123,186,0.2);">趣味数学大冒险</h1>'
      + '<p style="font-size:1.3rem;color:var(--grey-light);margin-bottom:4px;">—— 四年级下册 ——</p>'
      + '<div style="margin:12px 0;color:var(--gold-sand);font-size:1rem;">📚 北师大版 · 优等生 | 📍 辽宁大连专版</div>'
      + '<button class="btn btn-primary" style="font-size:1.3rem;padding:16px 56px;margin-top:20px;animation:pulse 2s ease infinite;" onclick="MathApp.navigate(\'#teacher\')">🚀 老师登陆</button>'
      + '</div></div>';
  }

  // ====== 教师页 ======
  function renderTeacher() {
    // 设置海洋馆背景
    var page = document.getElementById('page-teacher');
    if (page) {
      page.style.background = 'url(assets/scenes/classroom-bg.png) center/cover no-repeat';
      page.style.backgroundAttachment = 'fixed';
    }
    if (typeof MathAuth !== 'undefined') MathAuth.renderTeacherPage();
  }

  // ====== 地图页 ======
  function renderMap() {
    var page = document.getElementById('page-map');
    // 设置银沙滩海边背景
    if (page) {
      page.style.background = 'url(assets/scenes/beach-bg.png) center/cover no-repeat';
      page.style.backgroundAttachment = 'fixed';
    }
    if (!chapterData) {
      loadChapterData(function() { renderMap(); });
      page.innerHTML = '<div class="container" style="text-align:center;padding-top:100px;"><p>加载中...</p></div>';
      return;
    }

    var sid = (typeof MathAuth !== 'undefined') ? MathAuth.getCurrentStudentId() : null;
    var progress = sid ? MathStorage.getProgress(sid) : null;
    var chapters = chapterData.chapters || [];

    var html = '<div class="container" style="padding-top:20px;">';

    // 学生信息 + 金币
    if (sid && typeof MathAuth !== 'undefined') {
      var students = MathStorage.getStudents();
      var sname = '';
      for (var si = 0; si < students.length; si++) {
        if (students[si].id === sid) { sname = students[si].name; break; }
      }
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
      html += '<h2 style="color:var(--blue-dalian);">🗺️ 冒险地图 — ' + sname + '</h2>';
      html += '<span style="background:var(--gold-light);padding:6px 16px;border-radius:20px;font-weight:600;">🪙 ' + (progress ? progress.total_coins : 0) + '</span>';
      html += '</div>';
    }

    html += '<div class="landmark-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">';

    for (var i = 0; i < chapters.length; i++) {
      var ch = chapters[i];
      var chProgress = progress ? progress.chapters[String(ch.id)] : null;
      var status = chProgress ? chProgress.status : 'locked';
      var stars = chProgress ? chProgress.stars : 0;

      // 如果前一章未完成且不是第一章，锁定
      if (status !== 'completed' && status !== 'in_progress') {
        var prev = i === 0 ? null : progress ? progress.chapters[String(chapters[i-1].id)] : null;
        if (i === 0) status = 'in_progress';
        else if (prev && prev.status === 'completed') status = 'in_progress';
        else status = 'locked';
      }

      var icon = status === 'completed' ? '🏆' : status === 'in_progress' ? '📍' : '🔒';
      var bgColor = status === 'completed' ? 'var(--green-light)' : status === 'in_progress' ? 'var(--white-pure)' : 'var(--grey-card)';
      var clickAction = status === 'locked' ? '' : 'onclick="MathApp.navigate(\'#story/' + ch.id + '\')"';

      html += '<div class="card" style="background:' + bgColor + ';cursor:' + (status === 'locked' ? 'default' : 'pointer') + ';opacity:' + (status === 'locked' ? '0.6' : '1') + ';transition:transform 0.2s;" ' + clickAction + '>';
      html += '<div style="display:flex;align-items:center;gap:12px;">';
      html += '<div style="font-size:2.5rem;">' + ch.landmark_icon + '</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-weight:700;color:var(--grey-reef);">' + icon + ' ' + ch.title + '</div>';
      html += '<div style="font-size:0.9rem;color:var(--grey-light);">📍 ' + ch.landmark + '</div>';
      html += '</div>';
      // 星级显示
      if (status !== 'locked') {
        html += '<div style="font-size:1.2rem;">';
        for (var s = 0; s < 3; s++) {
          html += '<span style="color:' + (s < stars ? 'var(--gold-sand)' : 'var(--grey-light)') + ';">★</span>';
        }
        html += '</div>';
      }
      html += '</div>';

      // 进度条
      if (status !== 'locked' && chProgress) {
        html += '<div class="progress-bar" style="margin-top:8px;"><div class="progress-bar-fill" style="width:' + (chProgress.best_score / Math.max(chProgress.total, 1) * 100) + '%;"></div></div>';
        html += '<div style="font-size:0.8rem;color:var(--grey-light);margin-top:4px;">' + (chProgress.best_score || 0) + '/' + ch.total_questions + '题</div>';
      }

      html += '</div>';
    }

    html += '</div>';

    // ====== 营地入口卡片 ======
    if (sid) {
      var wrongs = getWrongAnswersFromStorage(sid);
      var wrongCount = wrongs.length;
      // 按章节统计错题数
      var wrongByChapter = {};
      for (var w = 0; w < wrongs.length; w++) {
        var wch = String(wrongs[w].chapterId);
        wrongByChapter[wch] = (wrongByChapter[wch] || 0) + 1;
      }

      var advProgress = getAdvancedProgress(sid);
      var advLevel = advProgress.highestLevel || 0;

      html += '<div style="margin-top:24px;">';
      html += '<h3 style="color:var(--blue-dalian);margin-bottom:12px;">🏕️ 特训营地</h3>';
      html += '<div class="landmark-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">';

      // 错题训练营卡片
      html += '<div class="card" style="cursor:pointer;transition:transform 0.2s;border-left:4px solid var(--red-coral);" onclick="MathApp.navigate(\'#wrongcamp\')">';
      html += '<div style="display:flex;align-items:center;gap:12px;">';
      html += '<div style="font-size:2.5rem;">📝</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-weight:700;color:var(--grey-reef);">错题训练营</div>';
      html += '<div style="font-size:0.9rem;color:var(--grey-light);">针对薄弱知识点专项训练</div>';
      html += '</div>';
      html += '<div style="text-align:right;">';
      html += '<div style="font-size:1.5rem;font-weight:700;color:var(--red-coral);">' + wrongCount + '</div>';
      html += '<div style="font-size:0.8rem;color:var(--grey-light);">道错题</div>';
      html += '</div>';
      html += '</div>';
      // 显示各章节错题数
      if (wrongCount > 0) {
        html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">';
        for (var wchKey in wrongByChapter) {
          html += '<span style="background:var(--red-light);color:var(--red-coral);padding:2px 8px;border-radius:10px;font-size:0.75rem;">Ch' + wchKey + ': ' + wrongByChapter[wchKey] + '题</span>';
        }
        html += '</div>';
      }
      html += '</div>';

      // 进阶营地卡片
      html += '<div class="card" style="cursor:pointer;transition:transform 0.2s;border-left:4px solid var(--gold-sand);" onclick="MathApp.navigate(\'#advanced\')">';
      html += '<div style="display:flex;align-items:center;gap:12px;">';
      html += '<div style="font-size:2.5rem;">🚀</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-weight:700;color:var(--grey-reef);">进阶营地</div>';
      html += '<div style="font-size:0.9rem;color:var(--grey-light);">举一反三 · 多章混合挑战</div>';
      html += '</div>';
      html += '<div style="text-align:right;">';
      html += '<div style="font-size:1.5rem;font-weight:700;color:var(--gold-sand);">' + (advLevel > 0 ? 'Lv.' + advLevel : '新') + '</div>';
      html += '<div style="font-size:0.8rem;color:var(--grey-light);">' + (advLevel > 0 ? '最高关卡' : '未开始') + '</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '</div>';
      html += '</div>';
    }

    // 返回按钮
    html += '<div style="margin-top:30px;text-align:center;">';
    html += '<button class="btn btn-secondary" onclick="MathApp.navigate(\'#teacher\')">← 返回教师面板</button>';
    html += '</div>';

    html += '</div>';
    page.innerHTML = html;
  }

  // ====== 故事页 ======
  function renderStory(chapterId) {
    if (!chapterData) { loadChapterData(function() { renderStory(chapterId); }); return; }
    if (typeof MathStory !== 'undefined') MathStory.renderStoryPage(parseInt(chapterId));
  }

  // ====== 加载章节数据 ======
  function loadChapterData(callback) {
    // 优先使用内联数据（file:// 兼容）
    if (window._INLINE_CHAPTER_DATA) {
      chapterData = window._INLINE_CHAPTER_DATA;
      if (callback) callback();
      return;
    }
    loadJSON('data/chapters.json', function(data) {
      if (data) {
        chapterData = data;
        window._INLINE_CHAPTER_DATA = data;
      } else {
        chapterData = getFallbackChapterData();
      }
      if (callback) callback();
    });
  }

  // ====== 通用 JSON 加载（兼容 file:// 协议） ======
  function loadJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            callback(JSON.parse(xhr.responseText));
          } catch(e) {
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    };
    xhr.onerror = function() { callback(null); };
    xhr.send();
  }

  function getFallbackChapterData() {
    return {
      chapters: [
        {id:1,title:'小数的意义与加减法',landmark:'大连商场',landmark_icon:'🏬',story_intro:'来大连商场学小数！',total_questions:16,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'calc',title:'计算题',count:2},{id:4,type:'judge',title:'判断题',count:3},{id:5,type:'speed',title:'速答题',count:5}]},
        {id:2,title:'认识三角形和四边形',landmark:'星海广场',landmark_icon:'⭐',story_intro:'星海广场上的几何图形！',total_questions:16,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'judge',title:'判断题',count:3},{id:4,type:'match',title:'配对题',count:3},{id:5,type:'speed',title:'速答题',count:4}]},
        {id:3,title:'小数乘法',landmark:'大连港码头',landmark_icon:'⚓',story_intro:'帮老船长算集装箱！',total_questions:16,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'calc',title:'计算题',count:3},{id:4,type:'match',title:'配对题',count:3},{id:5,type:'speed',title:'速答题',count:4}]},
        {id:4,title:'观察物体',landmark:'贝壳博物馆',landmark_icon:'🏛️',story_intro:'贝壳博物馆的三视图！',total_questions:14,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'judge',title:'判断题',count:3},{id:4,type:'match',title:'配对题',count:2},{id:5,type:'speed',title:'速答题',count:3}]},
        {id:5,title:'认识方程',landmark:'有轨电车',landmark_icon:'🚃',story_intro:'跟着电车学方程！',total_questions:16,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'calc',title:'计算题',count:3},{id:4,type:'match',title:'配对题',count:3},{id:5,type:'speed',title:'速答题',count:4}]},
        {id:6,title:'数据的表示与分析',landmark:'大连气象台',landmark_icon:'🌤️',story_intro:'当一回气象统计师！',total_questions:14,levels:[{id:1,type:'choice',title:'选择题',count:3},{id:2,type:'fill',title:'填空题',count:3},{id:3,type:'judge',title:'判断题',count:3},{id:4,type:'match',title:'配对题',count:2},{id:5,type:'speed',title:'速答题',count:3}]}
      ]
    };
  }

  // ====== 答题页 ======
  function renderQuiz(chapterId) {
    if (!chapterData) { loadChapterData(function() { renderQuiz(chapterId); }); return; }

    var cid = parseInt(chapterId);
    var chapter = null;
    for (var i = 0; i < chapterData.chapters.length; i++) {
      if (chapterData.chapters[i].id === cid) { chapter = chapterData.chapters[i]; break; }
    }
    if (!chapter) return;

    var sid = (typeof MathAuth !== 'undefined') ? MathAuth.getCurrentStudentId() : null;

    // 初始化答题会话
    MathQuiz.initSession(cid, sid);

    // 加载手写题
    loadHandcraftedAndStart(cid, chapter, sid);
  }

  function loadHandcraftedAndStart(cid, chapter, sid) {
    // 优先使用内联数据
    var handData = null;
    if (window._INLINE_QUESTIONS_DATA && window._INLINE_QUESTIONS_DATA[cid]) {
      handData = window._INLINE_QUESTIONS_DATA[cid];
    }

    if (handData && handData.questions) {
      var allQuestions = buildQuestionPool(cid, chapter, handData.questions);
      quizQuestions = allQuestions;
      renderCurrentQuestion(allQuestions, 0, 0, chapter);
    } else {
      // 尝试 XHR 加载
      loadJSON('data/questions/unit' + cid + '.json', function(data) {
        if (data && data.questions) {
          var allQuestions = buildQuestionPool(cid, chapter, data.questions);
          quizQuestions = allQuestions;
          renderCurrentQuestion(allQuestions, 0, 0, chapter);
        } else {
          // 全部用生成题
          var allQuestions = buildQuestionPool(cid, chapter, null);
          quizQuestions = allQuestions;
          renderCurrentQuestion(allQuestions, 0, 0, chapter);
        }
      });
    }
  }

  function buildQuestionPool(cid, chapter, handData) {
    var levels = chapter.levels || [];
    var pool = [];
    var usedIds = {}; // 去重：记录已使用的题目ID

    for (var li = 0; li < levels.length; li++) {
      var level = levels[li];
      var type = level.type;
      var count = level.count || 3;
      var levelQs = [];

      // 手写题（去重选取）
      if (handData && handData[type] && handData[type].length > 0) {
        var handPick = Math.min(Math.floor(count * 0.4), handData[type].length);
        var shuffled = shuffleArray(handData[type].slice());
        var picked = 0;
        for (var h = 0; h < shuffled.length && picked < handPick; h++) {
          var q = shuffled[h];
          var qKey = q.id || q.question;
          if (!usedIds[qKey]) {
            levelQs.push(q);
            usedIds[qKey] = true;
            picked++;
          }
        }
        // 如果手写题因去重不够，允许重复使用
        if (picked < handPick) {
          for (var h2 = 0; h2 < shuffled.length && picked < handPick; h2++) {
            levelQs.push(shuffled[h2]);
            picked++;
          }
        }
      }

      // 生成题（去重）
      var genCount = count - levelQs.length;
      if (typeof MathGenerator !== 'undefined' && genCount > 0) {
        var genQs = MathGenerator.generateQuestions(cid, type, Math.max(genCount + 5, 10));
        var genPicked = 0;
        for (var g = 0; g < genQs.length && genPicked < genCount; g++) {
          var gq = genQs[g];
          var gKey = gq.question;
          if (!usedIds[gKey]) {
            levelQs.push(gq);
            usedIds[gKey] = true;
            genPicked++;
          }
        }
        // 如果还不够，补充（允许重复）
        if (genPicked < genCount) {
          for (var g2 = 0; g2 < genQs.length && genPicked < genCount; g2++) {
            levelQs.push(genQs[g2]);
            genPicked++;
          }
        }
      }

      // 再次补充不足
      if (levelQs.length < count && typeof MathGenerator !== 'undefined') {
        var extraQs = MathGenerator.generateQuestions(cid, type, (count - levelQs.length) * 2);
        for (var e = 0; e < extraQs.length && levelQs.length < count; e++) {
          levelQs.push(extraQs[e]);
        }
      }

      levelQs = shuffleArray(levelQs.slice(0, count));
      pool.push(levelQs);
    }

    return pool;
  }

  // ====== 当前题目渲染 ======
  var currentLevelIdx = 0, currentQIdx = 0, currentScore = 0, totalAnswered = 0;
  var wrongAnswers = []; // 本次答题的错题记录

  function renderCurrentQuestion(pool, levelIdx, qIdx, chapter) {
    currentLevelIdx = levelIdx;
    currentQIdx = qIdx;

    // 更新导航栏标题
    var navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = chapter.title;

    if (levelIdx >= pool.length) {
      finishQuiz(chapter);
      return;
    }

    var levelQs = pool[levelIdx];
    if (qIdx >= levelQs.length) {
      // 进入下一关
      currentLevelIdx++;
      currentQIdx = 0;
      renderCurrentQuestion(pool, currentLevelIdx, 0, chapter);
      return;
    }

    var question = levelQs[qIdx];
    var levelInfo = chapter.levels[levelIdx];
    var levelNames = ['🐠 海底选择题', '⚓ 港口填空题', '🧮 浪花计算器', '🏗️ 建筑判断灯', '🗺️ 拖拽配对', '⏱️ 海鸥限时速答'];
    var levelTitle = levelInfo.title || (levelNames[levelIdx] || '第' + (levelIdx+1) + '关');

    var page = document.getElementById('page-quiz');
    var totalInLevel = pool.reduce(function(sum, l) { return sum + l.length; }, 0);
    var answeredInLevel = 0;
    for (var a = 0; a < levelIdx; a++) answeredInLevel += pool[a].length;
    answeredInLevel += qIdx;

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    // 关卡标题
    html += '<div style="text-align:center;margin-bottom:20px;">';
    html += '<h3 style="color:var(--blue-dalian);">' + levelTitle + '</h3>';
    html += '<div style="color:var(--grey-light);font-size:0.9rem;">第 ' + (levelIdx+1) + '/' + pool.length + ' 关 · 第 ' + (qIdx+1) + '/' + levelQs.length + ' 题</div>';
    html += '</div>';

    // 进度条
    html += '<div class="progress-bar" style="margin-bottom:24px;">';
    html += '<div class="progress-bar-fill" style="width:' + (answeredInLevel / Math.max(totalInLevel, 1) * 100) + '%;"></div>';
    html += '</div>';

    // 题目卡片
    html += '<div class="card" style="animation:fadeIn 0.3s ease;" id="question-card">';
    html += '<div style="font-size:1.2rem;margin-bottom:20px;line-height:1.8;color:var(--grey-reef);">' + escapeHtml(question.question) + '</div>';

    // 根据题型渲染不同的答题区
    var type = levelInfo.type;
    html += '<div id="answer-area">';

    if (type === 'choice') {
      html += renderChoiceArea(question);
    } else if (type === 'fill') {
      html += renderFillArea(question);
    } else if (type === 'calc') {
      html += renderCalcArea(question);
    } else if (type === 'judge') {
      html += renderJudgeArea(question);
    } else if (type === 'match') {
      html += renderMatchArea(question);
    } else if (type === 'speed') {
      html += renderSpeedArea(question);
    }

    html += '</div>';

    // 反馈区
    html += '<div id="feedback-area" style="margin-top:16px;min-height:60px;"></div>';
    html += '</div>'; // end card

    // 返回按钮
    html += '<div style="text-align:center;margin-top:16px;">';
    html += '<button class="btn btn-secondary" style="font-size:0.9rem;padding:8px 20px;" onclick="if(confirm(\'确定退出闯关吗？\')) MathApp.navigate(\'#map\')">🗺️ 返回地图</button>';
    html += '</div>';

    html += '</div>'; // end container

    page.innerHTML = html;

    // 绑定事件
    bindQuestionEvents(type, question, pool, chapter);
  }

  // ====== 选择题渲染 ======
  function renderChoiceArea(question) {
    var options = question.options || ['选项A', '选项B', '选项C', '选项D'];
    var html = '<div class="choice-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    var labels = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < options.length; i++) {
      html += '<button class="choice-btn" data-choice="' + i + '" style="background:var(--blue-pale);border:2px solid var(--blue-light);border-radius:16px;padding:16px;font-size:1.1rem;cursor:pointer;transition:all 0.2s;color:var(--grey-reef);">'
        + '<span style="display:inline-block;background:var(--blue-dalian);color:white;border-radius:50%;width:28px;height:28px;line-height:28px;margin-right:8px;font-size:0.9rem;">' + labels[i] + '</span>'
        + escapeHtml(options[i]) + '</button>';
    }
    html += '</div>';
    return html;
  }

  // ====== 填空题渲染（物理键盘输入） ======
  function renderFillArea(question) {
    return ''
      + '<input type="text" id="fill-display" placeholder="输入答案后按回车" autocomplete="off" autofocus '
      + 'style="width:100%;padding:16px 20px;font-size:1.4rem;text-align:center;border:2px solid var(--blue-light);border-radius:12px;background:var(--grey-card);color:var(--blue-dalian);font-family:var(--font-mono);outline:none;">'
      + '<div style="text-align:center;margin-top:16px;">'
      + '<button class="btn btn-primary" id="fill-submit-btn" style="font-size:1.1rem;padding:12px 40px;">✓ 提交答案</button>'
      + '</div>';
  }

  // ====== 计算题渲染（物理键盘输入） ======
  function renderCalcArea(question) {
    var html = '<div style="text-align:center;margin-bottom:12px;"><span style="color:var(--grey-light);">请在下方输入计算结果</span></div>';
    html += '<input type="text" id="fill-display" placeholder="输入结果后按回车" autocomplete="off" autofocus '
      + 'style="width:100%;padding:16px 20px;font-size:1.4rem;text-align:center;border:2px solid var(--blue-light);border-radius:12px;background:var(--grey-card);color:var(--blue-dalian);font-family:var(--font-mono);outline:none;">'
      + '<div style="text-align:center;margin-top:16px;">'
      + '<button class="btn btn-primary" id="fill-submit-btn" style="font-size:1.1rem;padding:12px 40px;">✓ 提交答案</button>'
      + '</div>';
    return html;
  }

  // ====== 判断题渲染 ======
  function renderJudgeArea(question) {
    return ''
      + '<div style="display:flex;gap:20px;justify-content:center;">'
      + '<button class="judge-btn judge-true" data-judge="true" style="width:120px;height:120px;border-radius:50%;border:4px solid var(--green-seaweed);background:var(--green-light);font-size:3rem;cursor:pointer;transition:all 0.2s;">✓</button>'
      + '<button class="judge-btn judge-false" data-judge="false" style="width:120px;height:120px;border-radius:50%;border:4px solid var(--red-coral);background:var(--red-light);font-size:3rem;cursor:pointer;transition:all 0.2s;">✗</button>'
      + '</div>'
      + '<div style="text-align:center;margin-top:12px;color:var(--grey-light);">🏗️ 点亮灯塔：判断对错</div>';
  }

  // ====== 连线题渲染 ======
  function renderMatchArea(question) {
    var left = question.left_items || [];
    var right = question.right_items || [];
    var rightShuffled = shuffleArray(right.slice());

    var html = '<div class="match-container" style="display:flex;align-items:flex-start;gap:40px;justify-content:center;position:relative;min-height:250px;">';

    // Canvas 用于画连线
    html += '<canvas id="match-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;"></canvas>';

    // 左侧
    html += '<div class="match-column match-left" style="flex:0 0 auto;z-index:2;position:relative;">';
    for (var i = 0; i < left.length; i++) {
      html += '<div class="match-item match-drag-item" data-left="' + i + '" draggable="true" '
        + 'style="background:var(--blue-pale);border:2px solid var(--blue-light);border-radius:12px;padding:14px 20px;margin-bottom:10px;cursor:grab;font-size:1rem;user-select:none;text-align:center;transition:all 0.2s;">'
        + '🏷️ ' + escapeHtml(left[i]) + '</div>';
    }
    html += '</div>';

    // 右侧
    html += '<div class="match-column match-right" style="flex:0 0 auto;z-index:2;position:relative;">';
    for (var j = 0; j < rightShuffled.length; j++) {
      var origIdx = right.indexOf(rightShuffled[j]);
      html += '<div class="match-item match-drop-item" data-right="' + origIdx + '" '
        + 'style="background:var(--gold-light);border:2px dashed var(--gold-sand);border-radius:12px;padding:14px 20px;margin-bottom:10px;font-size:1rem;text-align:center;transition:all 0.2s;">'
        + '📦 ' + escapeHtml(rightShuffled[j]) + '</div>';
    }
    html += '</div>';

    html += '</div>';
    html += '<div style="text-align:center;margin-top:16px;">';
    html += '<div style="color:var(--grey-light);font-size:0.9rem;margin-bottom:8px;">🗺️ 拖拽左侧卡片到右侧对应答案上</div>';
    html += '<button class="btn btn-primary match-submit-btn" style="display:none;">✓ 提交配对</button>';
    html += '</div>';
    return html;
  }

  // ====== 限时速答渲染 ======
  function renderSpeedArea(question) {
    var time = question.time_limit || 15;
    var options = question.options || ['A', 'B', 'C', 'D'];
    var html = '<div id="speed-timer" style="text-align:center;margin-bottom:16px;">';
    html += '<div style="font-size:2rem;font-weight:700;color:var(--red-coral);" id="timer-display">' + time + '</div>';
    html += '<div style="color:var(--grey-light);font-size:0.9rem;">⏱️ 海鸥飞过中...</div>';
    html += '</div>';
    html += '<div class="choice-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    var labels = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < Math.min(options.length, 4); i++) {
      html += '<button class="speed-choice-btn" data-choice="' + i + '" style="background:var(--blue-pale);border:2px solid var(--blue-light);border-radius:16px;padding:14px;font-size:1.1rem;cursor:pointer;transition:all 0.2s;">'
        + '<span style="display:inline-block;background:var(--blue-dalian);color:white;border-radius:50%;width:28px;height:28px;line-height:28px;margin-right:8px;font-size:0.9rem;">' + labels[i] + '</span>'
        + escapeHtml(options[i]) + '</button>';
    }
    html += '</div>';
    return html;
  }

  // ====== 事件绑定（统一处理所有题型） ======
  var numpadValue = '';
  var matchLeft = null;
  var speedTimer = null;
  var speedTimeLeft = 0;
  var speedAnswered = false;

  function bindQuestionEvents(type, question, pool, chapter) {
    numpadValue = '';
    matchLeft = null;
    speedAnswered = false;

    if (type === 'choice') {
      var btns = document.querySelectorAll('.choice-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
          var choice = parseInt(this.getAttribute('data-choice'));
          handleChoice(choice, question, pool, chapter, type);
        });
      }
    } else if (type === 'fill' || type === 'calc') {
      // 物理键盘输入 + 提交按钮 + 回车键
      var submitBtn = document.getElementById('fill-submit-btn');
      var inputEl = document.getElementById('fill-display');
      var doSubmit = function() {
        var value = inputEl ? inputEl.value.trim() : '';
        handleFill(value, question, pool, chapter, type);
      };
      if (submitBtn) submitBtn.addEventListener('click', doSubmit);
      if (inputEl) inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); doSubmit(); }
      });
    } else if (type === 'judge') {
      var judgeBtns = document.querySelectorAll('.judge-btn');
      for (var k = 0; k < judgeBtns.length; k++) {
        judgeBtns[k].addEventListener('click', function() {
          var val = this.getAttribute('data-judge') === 'true';
          handleJudge(val, question, pool, chapter);
        });
      }
    } else if (type === 'match') {
      _bindMatchDragEvents(question, 'main', pool, chapter);
    } else if (type === 'speed') {
      speedTimeLeft = question.time_limit || 15;
      updateTimerDisplay();
      speedTimer = setInterval(function() {
        speedTimeLeft--;
        updateTimerDisplay();
        if (speedTimeLeft <= 0 && !speedAnswered) {
          clearInterval(speedTimer);
          speedAnswered = true;
          handleSpeedTimeout(question, pool, chapter);
        }
      }, 1000);

      var spdBtns = document.querySelectorAll('.speed-choice-btn');
      for (var s = 0; s < spdBtns.length; s++) {
        spdBtns[s].addEventListener('click', function() {
          if (speedAnswered) return;
          clearInterval(speedTimer);
          speedAnswered = true;
          var choice = parseInt(this.getAttribute('data-choice'));
          handleChoice(choice, question, pool, chapter, type);
        });
      }
    }
  }

  function updateFillDisplay() {
    var el = document.getElementById('fill-display');
    if (el) el.textContent = numpadValue || '_';
  }

  function updateTimerDisplay() {
    var el = document.getElementById('timer-display');
    if (el) {
      el.textContent = speedTimeLeft;
      el.style.color = speedTimeLeft <= 5 ? 'var(--red-coral)' : speedTimeLeft <= 10 ? 'var(--gold-sand)' : 'var(--green-seaweed)';
    }
  }

  // ====== 答案处理（防错增强版） ======

  function handleChoice(choice, question, pool, chapter, type) {
    var userIdx = parseInt(choice, 10);

    // 方法1：索引比较
    var correctIdx = parseInt(question.answer, 10);
    var correctByIndex = (!isNaN(userIdx) && !isNaN(correctIdx) && userIdx === correctIdx);

    // 方法2：文本值比较（兜底）
    var correctByText = false;
    if (question.options && Array.isArray(question.options) && !isNaN(userIdx)) {
      var clickedText = question.options[userIdx];
      var correctOptIdx = !isNaN(correctIdx) ? correctIdx : 0;
      var correctText = question.options[correctOptIdx];
      correctByText = (String(clickedText).trim() === String(correctText).trim());
    }

    var correct = correctByIndex || correctByText;

    showFeedback(correct, question);
    if (correct) currentScore++;
    else recordWrongAnswer(question, '选项' + (userIdx + 1), chapter, type);
    totalAnswered++;
    disableAllButtons();
    setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
  }

  function handleFill(value, question, pool, chapter, type) {
    var strValue = String(value).trim();
    var strAnswer = String(question.answer).trim();
    
    // 先尝试字符串精确匹配
    var correct = (strValue.toLowerCase() === strAnswer.toLowerCase());

    // 字符串不匹配时，尝试数值容差比较
    if (!correct) {
      var userAnswer = parseFloat(strValue);
      var expected = parseFloat(strAnswer);
      if (!isNaN(userAnswer) && !isNaN(expected)) {
        var tolerance = question.tolerance;
        if (tolerance === undefined || tolerance === null) tolerance = 0.005;
        correct = Math.abs(userAnswer - expected) <= Math.max(tolerance, 0.001);
      }
    }

    showFeedback(correct, question);
    if (correct) currentScore++;
    else recordWrongAnswer(question, value, chapter, type);
    totalAnswered++;
    disableAllButtons();
    setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
  }

  function handleJudge(value, question, pool, chapter) {
    // 统一转为布尔值
    var userBool = (value === true || value === 'true' || value === 1 || value === '1');
    var answerIsTrue = (
      question.answer === true || question.answer === 'true' || 
      question.answer === 1 || question.answer === '1'
    );
    var correct = userBool === answerIsTrue;

    showFeedback(correct, question);
    if (correct) currentScore++;
    else recordWrongAnswer(question, value ? '对' : '错', chapter, 'judge');
    totalAnswered++;
    disableAllButtons();
    setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
  }

  function handleSpeedTimeout(question, pool, chapter) {
    showFeedback(false, question, '⏰ 时间到！');
    recordWrongAnswer(question, '未作答（超时）', chapter, 'speed');
    totalAnswered++;
    disableAllButtons();
    setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
  }

  function checkMatchComplete(expectedPairs, pool, chapter) {
    var rightItems = document.querySelectorAll('.match-right-item');
    var count = 0;
    for (var i = 0; i < rightItems.length; i++) {
      if (rightItems[i].hasAttribute('data-matched')) count++;
    }
    if (count >= rightItems.length) {
      // 全部配对完成，验证
      var userPairs = [];
      for (var j = 0; j < rightItems.length; j++) {
        userPairs.push(parseInt(rightItems[j].getAttribute('data-matched')));
      }
      var correct = arraysEqual(userPairs, expectedPairs);
      showFeedback(correct, { explain: '正确答案请参考解析' });
      if (correct) currentScore++;
      totalAnswered++;
      disableAllButtons();
      setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
    }
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (parseInt(a[i]) !== parseInt(b[i])) return false;
    }
    return true;
  }

  // ====== 通用拖拽连线事件绑定 ======
  function _bindMatchDragEvents(question, context, pool, chapter) {
    var matchPairs = {};
    var dragItems = document.querySelectorAll('.match-drag-item');
    var dropItems = document.querySelectorAll('.match-drop-item');
    var canvas = document.getElementById('match-canvas');

    if (canvas) {
      var c = canvas.parentElement;
      if (c) { canvas.width = c.offsetWidth; canvas.height = c.offsetHeight; }
    }

    for (var i = 0; i < dragItems.length; i++) {
      (function(di) {
        di.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', this.getAttribute('data-left'));
          this.style.opacity = '0.5';
        });
        di.addEventListener('dragend', function() {
          this.style.opacity = '1';
        });
      })(dragItems[i]);
    }

    for (var j = 0; j < dropItems.length; j++) {
      (function(dj) {
        dj.addEventListener('dragover', function(e) { e.preventDefault(); });
        dj.addEventListener('drop', function(e) {
          e.preventDefault();
          var leftIdx = parseInt(e.dataTransfer.getData('text/plain'));
          var rightIdx = parseInt(this.getAttribute('data-right'));
          matchPairs[leftIdx] = rightIdx;
          this.style.background = 'var(--green-light)';
          this.style.border = '2px solid var(--green-seaweed)';
          this.innerHTML = '✅ ' + this.textContent.replace(/^[📦🏷️]\s*/, '');

          drawMatchLines(matchPairs);

          for (var k = 0; k < dragItems.length; k++) {
            if (parseInt(dragItems[k].getAttribute('data-left')) === leftIdx) {
              dragItems[k].style.background = 'var(--green-light)';
              dragItems[k].style.border = '2px solid var(--green-seaweed)';
            }
          }

          if (Object.keys(matchPairs).length >= dropItems.length) {
            var submitBtn = document.querySelector('.match-submit-btn');
            if (submitBtn) {
              submitBtn.style.display = 'inline-flex';
              submitBtn.onclick = function() {
                var userPairs = [];
                for (var l = 0; l < dragItems.length; l++) {
                  var li = parseInt(dragItems[l].getAttribute('data-left'));
                  userPairs.push(matchPairs[li] !== undefined ? matchPairs[li] : -1);
                }
                var correct = _arraysMatch(userPairs, question.pairs);
                if (context === 'main') {
                  showFeedback(correct, { explain: '正确答案请参考解析' });
                  if (correct) currentScore++;
                  totalAnswered++;
                  disableAllButtons();
                  setTimeout(function() { advanceQuestion(pool, chapter); }, 1500);
                } else if (context === 'wrongcamp') {
                  _wrongCampFeedback(correct, question, '配对完成');
                  if (correct) wrongCampState.levelScore++;
                  _recordWrongCampAnswer(question, userPairs, correct);
                  _disableWrongCampButtons();
                  setTimeout(_advanceWrongCamp, 1200);
                } else if (context === 'advanced') {
                  _advancedFeedback(correct, question, '配对完成');
                  if (correct) advancedState.score++;
                  advancedState.answers.push({ question: question.question, answer: question.answer, userAnswer: userPairs, correct: correct, explain: question.explain || '' });
                  _disableAdvancedButtons();
                  setTimeout(_advanceAdvanced, 1200);
                }
              };
            }
          }
        });
      })(dropItems[j]);
    }
  }

  function _arraysMatch(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) { if (parseInt(a[i]) !== parseInt(b[i])) return false; }
    return true;
  }

  // ====== 画连线 ======
  function drawMatchLines(pairs) {
    var canvas = document.getElementById('match-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var dragItems = document.querySelectorAll('.match-drag-item');
    var dropItems = document.querySelectorAll('.match-drop-item');
    var container = canvas.parentElement;
    var rect = container.getBoundingClientRect();

    Object.keys(pairs).forEach(function(leftIdx) {
      var rightIdx = pairs[leftIdx];
      // 找对应的 DOM 元素
      dragItems.forEach(function(di) {
        if (parseInt(di.getAttribute('data-left')) === parseInt(leftIdx)) {
          dropItems.forEach(function(dj) {
            if (parseInt(dj.getAttribute('data-right')) === rightIdx) {
              var lr = di.getBoundingClientRect();
              var rr = dj.getBoundingClientRect();
              var x1 = lr.right - rect.left;
              var y1 = lr.top + lr.height/2 - rect.top;
              var x2 = rr.left - rect.left;
              var y2 = rr.top + rr.height/2 - rect.top;

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = 'rgba(46,204,113,0.6)';
              ctx.lineWidth = 3;
              ctx.setLineDash([]);
              ctx.stroke();

              // 画小圆点
              ctx.beginPath();
              ctx.arc(x1, y1, 4, 0, Math.PI*2);
              ctx.fillStyle = '#2ECC71';
              ctx.fill();

              ctx.beginPath();
              ctx.arc(x2, y2, 4, 0, Math.PI*2);
              ctx.fillStyle = '#F4A460';
              ctx.fill();
            }
          });
        }
      });
    });
  }

  // ====== 反馈展示 ======
  function showFeedback(correct, question, customMsg) {
    var area = document.getElementById('feedback-area');
    if (!area) return;

    // 播放音效
    playSound(correct);

    if (correct) {
      area.innerHTML = '<div style="animation:bounceIn 0.5s ease;color:var(--green-seaweed);font-size:1.1rem;padding:12px;background:var(--green-light);border-radius:8px;">✅ 回答正确！' + (question.explain ? '<br><small>' + question.explain + '</small>' : '') + '</div>';
    } else {
      var html = '<div style="animation:shake 0.5s ease;color:var(--red-coral);font-size:1.1rem;padding:12px;background:var(--red-light);border-radius:8px;">'
        + '❌ ' + (customMsg || '回答错误')
        + (question.explain ? '<br><small>💡 ' + question.explain + '</small>' : '')
        + '<br><button class="btn btn-secondary" style="font-size:0.85rem;padding:6px 14px;margin-top:8px;" onclick="MathApp._askDeepSeek(\'' + _escapeQuote(question.question) + '\')">🤖 不懂？问问DeepSeek</button>'
        + '</div>';
      area.innerHTML = html;
    }
  }

  // ====== DeepSeek 辅助 ======
  function _askDeepSeek(questionText) {
    var text = String(questionText || '');
    try {
      // 复制题目到剪贴板
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          window.open('https://chat.deepseek.com/', '_blank');
        });
      } else {
        // Fallback for older browsers
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        window.open('https://chat.deepseek.com/', '_blank');
      }
    } catch(e) {
      window.open('https://chat.deepseek.com/', '_blank');
    }
  }

  function _escapeQuote(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  // ====== 音效系统（Web Audio API，无需外部文件） ======
  var audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
        audioCtx = null;
      }
    }
    return audioCtx;
  }

  function playSound(correct) {
    var ctx = getAudioCtx();
    if (!ctx) return;

    try {
      // 确保 AudioContext 已激活（浏览器需要用户交互后才能播放音频）
      if (ctx.state === 'suspended') ctx.resume();

      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.15;

      var now = ctx.currentTime;

      if (correct) {
        // 答对：上升的愉悦音阶 C5→E5→G5
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);       // C5
        osc.frequency.setValueAtTime(659, now + 0.08); // E5
        osc.frequency.setValueAtTime(784, now + 0.16); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // 答错：低沉的提示音
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);  // E4
        osc.frequency.setValueAtTime(262, now + 0.1); // C4
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch(e) {
      // 音频播放失败不阻塞主流程
    }
  }

  function disableAllButtons() {
    var btns = document.querySelectorAll('#question-card button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      btns[i].style.opacity = '0.6';
      btns[i].style.cursor = 'default';
    }
  }

  // ====== 推进题目 ======
  function advanceQuestion(pool, chapter) {
    // 清除上一个速度题计时器
    if (speedTimer) { clearInterval(speedTimer); speedTimer = null; }
    speedAnswered = false;

    currentQIdx++;
    if (currentQIdx >= pool[currentLevelIdx].length) {
      currentLevelIdx++;
      currentQIdx = 0;
    }
    renderCurrentQuestion(pool, currentLevelIdx, currentQIdx, chapter);
  }

  // ====== 错题记录 ======
  function recordWrongAnswer(question, userAnswer, chapter, type) {
    var chapterDataForKP = null;
    if (chapterData && chapterData.chapters) {
      for (var ci = 0; ci < chapterData.chapters.length; ci++) {
        if (chapterData.chapters[ci].id === chapter.id) {
          chapterDataForKP = chapterData.chapters[ci];
          break;
        }
      }
    }
    var kp = (chapterDataForKP && chapterDataForKP.knowledge_points)
      ? chapterDataForKP.knowledge_points[0] || '未知'
      : '未知';

    var wrongItem = {
      id: 'w_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      question: question.question,
      options: question.options || null,
      answer: question.answer,
      userAnswer: userAnswer,
      explain: question.explain || '',
      knowledgePoint: kp,
      type: type,
      date: new Date().toISOString(),
      retryCount: 0
    };
    wrongAnswers.push(wrongItem);
  }

  function getWrongAnswersFromStorage(studentId) {
    var key = 'dalian_math_wrong_' + studentId;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function saveWrongAnswersToStorage(studentId, wrongs) {
    var key = 'dalian_math_wrong_' + studentId;
    try {
      localStorage.setItem(key, JSON.stringify(wrongs));
    } catch(e) {}
  }

  function addWrongAnswersToStorage(studentId, newWrongs) {
    var existing = getWrongAnswersFromStorage(studentId);
    // 去重：基于 question 文本和 chapterId
    for (var n = 0; n < newWrongs.length; n++) {
      var isDup = false;
      for (var e = 0; e < existing.length; e++) {
        if (existing[e].question === newWrongs[n].question && existing[e].chapterId === newWrongs[n].chapterId) {
          // 更新为最新答案，增加重试计数
          existing[e].userAnswer = newWrongs[n].userAnswer;
          existing[e].retryCount = (existing[e].retryCount || 0) + 1;
          existing[e].date = newWrongs[n].date;
          isDup = true;
          break;
        }
      }
      if (!isDup) {
        existing.push(newWrongs[n]);
      }
    }
    saveWrongAnswersToStorage(studentId, existing);
    return existing;
  }

  // ====== 测试历史记录 ======
  function addTestHistory(studentId, chapterId, score, total, accuracy, stars) {
    var key = 'dalian_math_hist_' + studentId;
    var hist = {};
    try {
      var raw = localStorage.getItem(key);
      if (raw) hist = JSON.parse(raw);
    } catch(e) {}

    var chId = String(chapterId);
    if (!hist[chId]) hist[chId] = [];
    hist[chId].push({
      date: new Date().toISOString(),
      score: score,
      total: total,
      accuracy: accuracy,
      stars: stars
    });

    // 只保留最近20条
    if (hist[chId].length > 20) hist[chId] = hist[chId].slice(-20);

    try {
      localStorage.setItem(key, JSON.stringify(hist));
    } catch(e) {}
  }

  function getTestHistory(studentId) {
    var key = 'dalian_math_hist_' + studentId;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function getChapterStats(history, chapters) {
    var stats = {};
    for (var ci = 0; ci < chapters.length; ci++) {
      var chId = String(chapters[ci].id);
      var records = history[chId] || [];
      if (records.length === 0) {
        stats[chId] = { attempts: 0, last: null, best: 0, avg: 0 };
      } else {
        var best = 0, sum = 0;
        for (var r = 0; r < records.length; r++) {
          if (records[r].accuracy > best) best = records[r].accuracy;
          sum += records[r].accuracy;
        }
        var last = records[records.length - 1];
        stats[chId] = {
          attempts: records.length,
          last: last,
          best: best,
          avg: Math.round(sum / records.length)
        };
      }
    }
    return stats;
  }

  // ====== 错题训练营存储 ======
  function getWrongcampProgress(studentId) {
    var key = 'dalian_math_wrongcamp_' + studentId;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveWrongcampProgress(studentId, data) {
    var key = 'dalian_math_wrongcamp_' + studentId;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {}
  }

  // ====== 进阶营地存储 ======
  function getAdvancedProgress(studentId) {
    var key = 'dalian_math_advanced_' + studentId;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : { highestLevel: 0 };
    } catch(e) { return { highestLevel: 0 }; }
  }

  function saveAdvancedProgress(studentId, data) {
    var key = 'dalian_math_advanced_' + studentId;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {}
  }

  // ====== 完成答题 ======
  function finishQuiz(chapter) {
    var total = poolTotal(quizQuestions);
    var accuracy = total > 0 ? Math.round(currentScore / total * 100) : 0;
    var stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
    var coins = currentScore * 10;

    // 保存进度
    var sid = (typeof MathAuth !== 'undefined') ? MathAuth.getCurrentStudentId() : null;
    if (sid) {
      var progress = MathStorage.getProgress(sid);
      var chId = String(chapter.id);
      var chProgress = progress.chapters[chId];
      chProgress.status = 'completed';
      chProgress.stars = Math.max(chProgress.stars || 0, stars);
      chProgress.best_score = Math.max(chProgress.best_score || 0, currentScore);
      chProgress.total = total;
      chProgress.attempts = (chProgress.attempts || 0) + 1;
      progress.total_coins = (progress.total_coins || 0) + coins;
      MathStorage.saveProgress(sid, progress);

      // 解锁下一章
      var nextId = String(chapter.id + 1);
      if (progress.chapters[nextId] && progress.chapters[nextId].status === 'locked') {
        progress.chapters[nextId].status = 'in_progress';
        MathStorage.saveProgress(sid, progress);
      }
    }

    // 保存错题
    if (sid && wrongAnswers.length > 0) {
      addWrongAnswersToStorage(sid, wrongAnswers);
    }

    // 记录测试历史
    if (sid) {
      addTestHistory(sid, chapter.id, currentScore, total, accuracy, stars);
    }

    // 跳转结算页
    var result = {
      score: currentScore, total: total, accuracy: accuracy,
      stars: stars, coins: coins, chapterId: chapter.id,
      elapsed: 0, studentId: sid
    };

    // 传递错题数据给结算页
    if (wrongAnswers.length > 0) {
      result.wrongAnswers = wrongAnswers.slice();
    }

    if (typeof MathReward !== 'undefined') {
      MathReward.renderRewardPage(result);
    }

    MathApp.navigate('#reward');
    currentScore = 0;
    totalAnswered = 0;
    wrongAnswers = [];
  }

  function poolTotal(pool) {
    var t = 0;
    for (var i = 0; i < pool.length; i++) t += pool[i].length;
    return t;
  }

  // ====== 结算页 ======
  function renderReward() {
    // 已在 finishQuiz 中处理
    var page = document.getElementById('page-reward');
    if (!page || page.innerHTML.trim()) return;
    page.innerHTML = '<div class="container" style="text-align:center;padding-top:100px;"><p>请先完成答题</p><button class="btn btn-primary" onclick="MathApp.navigate(\'#map\')">返回地图</button></div>';
  }

  // ====== 错题训练营 ======
  var wrongCampState = {
    view: 'list', chapterId: null, chapter: null, pool: [],
    currentLevelIdx: 0, currentQIdx: 0, levelScore: 0,
    levelAnswers: [], totalScore: 0, allAnswers: [], numpadValue: ''
  };

  function renderWrongCamp() {
    var page = document.getElementById('page-wrongcamp');
    if (!page) return;
    page.style.background = 'url(assets/scenes/library-bg.png) center/cover no-repeat';
    page.style.backgroundAttachment = 'fixed';

    var sid = (typeof MathAuth !== 'undefined') ? MathAuth.getCurrentStudentId() : null;
    if (!sid) {
      page.innerHTML = '<div class="container" style="text-align:center;padding-top:100px;"><p>请先选择学生</p><button class="btn btn-primary" onclick="MathApp.navigate(\'#teacher\')">返回教师面板</button></div>';
      return;
    }

    var navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = '错题训练营';

    if (wrongCampState.view === 'list') {
      _renderWrongCampList(page, sid);
    } else if (wrongCampState.view === 'quiz') {
      _renderWrongCampQuiz(page);
    } else if (wrongCampState.view === 'levelReview') {
      _renderWrongCampLevelReview(page);
    } else if (wrongCampState.view === 'summary') {
      _renderWrongCampSummary(page, sid);
    }
  }

  function _startWrongCampQuiz(chapterId) {
    if (!chapterData) { loadChapterData(function() { _startWrongCampQuiz(chapterId); }); return; }
    var chapter = null;
    for (var i = 0; i < chapterData.chapters.length; i++) {
      if (chapterData.chapters[i].id === chapterId) { chapter = chapterData.chapters[i]; break; }
    }
    if (!chapter) return;

    var pool = [];
    var levels = chapter.levels || [];
    for (var li = 0; li < levels.length; li++) {
      var level = levels[li];
      var type = level.type;
      var count = level.count || 4;
      var genQs = [];
      if (typeof MathGenerator !== 'undefined') {
        genQs = MathGenerator.generateQuestions(chapterId, type, count);
        var safety = 0;
        while (genQs.length < count && safety < 50) {
          var more = MathGenerator.generateQuestions(chapterId, type, count - genQs.length);
          if (more.length === 0) break;
          genQs = genQs.concat(more);
          safety++;
        }
      }
      pool.push(shuffleArray(genQs.slice(0, count)));
    }

    wrongCampState = {
      view: 'quiz', chapterId: chapterId, chapter: chapter, pool: pool,
      currentLevelIdx: 0, currentQIdx: 0, levelScore: 0,
      levelAnswers: [], totalScore: 0, allAnswers: [], numpadValue: ''
    };
    renderWrongCamp();
  }

  function _renderWrongCampList(page, sid) {
    var wrongs = getWrongAnswersFromStorage(sid);
    // 检查是否在管理模式
    var manageMode = wrongCampState._manageMode || false;

    var byChapter = {};
    for (var i = 0; i < wrongs.length; i++) {
      var ch = String(wrongs[i].chapterId);
      if (!byChapter[ch]) byChapter[ch] = { count: 0, title: wrongs[i].chapterTitle || ('第' + ch + '章'), items: [] };
      byChapter[ch].count++;
      byChapter[ch].items.push(wrongs[i]);
    }

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:20px;">';
    html += '<h2 style="color:var(--blue-dalian);">📝 错题训练营</h2>';
    html += '<p style="color:var(--grey-light);">' + (manageMode ? '点击删除已掌握的错题' : '针对薄弱知识点进行专项训练') + '</p>';
    html += '</div>';

    var chapters = (chapterData && chapterData.chapters) ? chapterData.chapters : [];
    if (Object.keys(byChapter).length === 0) {
      html += '<div class="card" style="text-align:center;padding:40px;">';
      html += '<div style="font-size:3rem;margin-bottom:12px;">🎉</div>';
      html += '<p style="color:var(--green-seaweed);">太棒了！没有错题记录</p>';
      html += '</div>';
    } else if (manageMode) {
      // 管理模式：展示错题详情，可删除
      html += '<div style="margin-bottom:16px;">';
      var sortedKeys = Object.keys(byChapter).sort();
      for (var k = 0; k < sortedKeys.length; k++) {
        var chKey = sortedKeys[k];
        var chData = byChapter[chKey];
        var chapterInfo = null;
        for (var ci = 0; ci < chapters.length; ci++) {
          if (String(chapters[ci].id) === chKey) { chapterInfo = chapters[ci]; break; }
        }
        var icon = chapterInfo ? chapterInfo.landmark_icon : '📚';
        html += '<div class="card" style="margin-bottom:12px;">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
        html += '<div style="font-weight:700;">' + icon + ' ' + chData.title + ' <span style="color:var(--red-coral);">(' + chData.count + '题)</span></div>';
        html += '<button class="btn btn-danger btn-sm" style="font-size:0.8rem;padding:4px 12px;" onclick="MathApp._deleteWrongChapter(\'' + sid + '\',' + chKey + ')">🗑️ 清空本章</button>';
        html += '</div>';
        for (var wi = 0; wi < chData.items.length; wi++) {
          var w = chData.items[wi];
          html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;padding:6px 0;border-top:1px solid var(--grey-card);">';
          html += '<div style="flex:1;font-size:0.9rem;">' + escapeHtml(w.question) + '</div>';
          html += '<button class="btn btn-secondary btn-sm" style="font-size:0.75rem;padding:3px 8px;margin-left:8px;white-space:nowrap;" onclick="MathApp._deleteWrongItem(\'' + sid + '\',\'' + w.id + '\')">✕ 删除</button>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      // 正常训练模式
      html += '<div style="display:grid;gap:16px;">';
      var sortedKeys2 = Object.keys(byChapter).sort();
      for (var k2 = 0; k2 < sortedKeys2.length; k2++) {
        var chKey2 = sortedKeys2[k2];
        var chData2 = byChapter[chKey2];
        var chapterInfo2 = null;
        for (var ci2 = 0; ci2 < chapters.length; ci2++) {
          if (String(chapters[ci2].id) === chKey2) { chapterInfo2 = chapters[ci2]; break; }
        }
        var icon2 = chapterInfo2 ? chapterInfo2.landmark_icon : '📚';
        var kps2 = (chapterInfo2 && chapterInfo2.knowledge_points) ? chapterInfo2.knowledge_points.slice(0, 3).join(' · ') : '';
        html += '<div class="card" style="cursor:pointer;transition:transform 0.2s;" onclick="MathApp._startWrongCampQuiz(' + parseInt(chKey2) + ')">';
        html += '<div style="display:flex;align-items:center;gap:12px;">';
        html += '<div style="font-size:2rem;">' + icon2 + '</div>';
        html += '<div style="flex:1;">';
        html += '<div style="font-weight:700;color:var(--grey-reef);">' + chData2.title + '</div>';
        html += '<div style="font-size:0.85rem;color:var(--grey-light);">' + kps2 + '</div>';
        html += '</div>';
        html += '<div style="text-align:right;">';
        html += '<div style="font-size:1.8rem;font-weight:700;color:var(--red-coral);">' + chData2.count + '</div>';
        html += '<div style="font-size:0.8rem;color:var(--grey-light);">道错题</div>';
        html += '</div>';
        html += '</div></div>';
      }
      html += '</div>';
    }

    html += '<div style="text-align:center;margin-top:24px;display:flex;gap:12px;justify-content:center;">';
    html += '<button class="btn btn-secondary" onclick="MathApp.navigate(\'#map\')">← 返回地图</button>';
    if (Object.keys(byChapter).length > 0) {
      if (manageMode) {
        html += '<button class="btn btn-primary" onclick="MathApp._toggleManageMode()">🏕️ 返回训练</button>';
      } else {
        html += '<button class="btn btn-secondary" style="color:var(--red-coral);border-color:var(--red-coral);" onclick="MathApp._toggleManageMode()">🗑️ 管理错题</button>';
      }
    }
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;
  }

  function _toggleManageMode() {
    wrongCampState._manageMode = !wrongCampState._manageMode;
    renderWrongCamp();
  }

  function _deleteWrongItem(sid, itemId) {
    if (!confirm('确定删除这道错题吗？')) return;
    var wrongs = getWrongAnswersFromStorage(sid);
    wrongs = wrongs.filter(function(w) { return w.id !== itemId; });
    saveWrongAnswersToStorage(sid, wrongs);
    renderWrongCamp();
  }

  function _deleteWrongChapter(sid, chapterId) {
    if (!confirm('确定清空本章所有错题吗？')) return;
    var wrongs = getWrongAnswersFromStorage(sid);
    wrongs = wrongs.filter(function(w) { return String(w.chapterId) !== String(chapterId); });
    saveWrongAnswersToStorage(sid, wrongs);
    renderWrongCamp();
  }

  function _renderWrongCampQuiz(page) {
    var s = wrongCampState;
    if (s.currentLevelIdx >= s.pool.length) {
      // All levels done, show summary
      s.view = 'summary';
      renderWrongCamp();
      return;
    }
    var levelQs = s.pool[s.currentLevelIdx];
    if (s.currentQIdx >= levelQs.length) {
      // Level complete, show review
      s.view = 'levelReview';
      renderWrongCamp();
      return;
    }

    var question = levelQs[s.currentQIdx];
    var levelInfo = s.chapter.levels[s.currentLevelIdx];
    var levelTitle = levelInfo.title || ('第' + (s.currentLevelIdx + 1) + '关');

    var totalInPool = 0;
    for (var ti = 0; ti < s.pool.length; ti++) totalInPool += s.pool[ti].length;
    var answeredInLevel = 0;
    for (var a = 0; a < s.currentLevelIdx; a++) answeredInLevel += s.pool[a].length;
    answeredInLevel += s.currentQIdx;

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:16px;background:var(--red-light);border-radius:12px;padding:12px;">';
    html += '<div style="font-size:0.9rem;color:var(--red-coral);">🏕️ 错题特训 · ' + s.chapter.title + '</div>';
    html += '<h3 style="color:var(--blue-dalian);margin:4px 0;">' + levelTitle + '</h3>';
    html += '<div style="color:var(--grey-light);font-size:0.85rem;">第 ' + (s.currentLevelIdx + 1) + '/' + s.pool.length + ' 关 · 第 ' + (s.currentQIdx + 1) + '/' + levelQs.length + ' 题</div>';
    html += '</div>';

    html += '<div class="progress-bar" style="margin-bottom:20px;">';
    html += '<div class="progress-bar-fill" style="width:' + (answeredInLevel / Math.max(totalInPool, 1) * 100) + '%;"></div>';
    html += '</div>';

    html += '<div class="card" style="animation:fadeIn 0.3s ease;" id="wrongcamp-card">';
    html += '<div style="font-size:1.2rem;margin-bottom:20px;line-height:1.8;color:var(--grey-reef);">' + escapeHtml(question.question) + '</div>';
    html += '<div id="answer-area">';

    var type = levelInfo.type;
    if (type === 'choice') html += renderChoiceArea(question);
    else if (type === 'fill') html += renderFillArea(question);
    else if (type === 'calc') html += renderCalcArea(question);
    else if (type === 'judge') html += renderJudgeArea(question);
    else if (type === 'match') html += renderMatchArea(question);
    else if (type === 'speed') html += renderSpeedArea(question);

    html += '</div>';
    html += '<div id="wrongcamp-feedback" style="margin-top:16px;min-height:60px;"></div>';
    html += '</div>';

    html += '<div style="text-align:center;margin-top:16px;">';
    html += '<button class="btn btn-secondary" style="font-size:0.9rem;padding:8px 20px;" onclick="if(confirm(\'确定退出训练营吗？\')){MathApp._resetWrongCamp();MathApp.navigate(\'#wrongcamp\')}">🏕️ 返回营地</button>';
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;

    _bindWrongCampEvents(type, question);
  }

  function _bindWrongCampEvents(type, question) {
    wrongCampState.numpadValue = '';
    var s = wrongCampState;

    if (type === 'speed') {
      // 速度题：启动倒计时
      s._speedTimeLeft = question.time_limit || 15;
      s._speedAnswered = false;
      s._speedTimer = setInterval(function() {
        s._speedTimeLeft--;
        if (s._speedTimeLeft <= 0 && !s._speedAnswered) {
          clearInterval(s._speedTimer);
          s._speedAnswered = true;
          _wrongCampFeedback(false, question, '⏰ 超时');
          _recordWrongCampAnswer(question, '超时', false);
          _disableWrongCampButtons();
          setTimeout(_advanceWrongCamp, 1200);
        }
        _updateWrongCampTimer();
      }, 1000);
      _updateWrongCampTimer(); // 初始显示

      var spdBtns = document.querySelectorAll('.speed-choice-btn');
      for (var si = 0; si < spdBtns.length; si++) {
        spdBtns[si].addEventListener('click', function() {
          if (s._speedAnswered) return;
          clearInterval(s._speedTimer);
          s._speedAnswered = true;
          var choice = parseInt(this.getAttribute('data-choice'));
          var correct = parseInt(choice) === parseInt(question.answer);
          _wrongCampFeedback(correct, question, choice);
          if (correct) s.levelScore++;
          _recordWrongCampAnswer(question, choice, correct);
          _disableWrongCampButtons();
          setTimeout(_advanceWrongCamp, 1200);
        });
      }
    } else if (type === 'choice') {
      var btns = document.querySelectorAll('.choice-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
          var choice = parseInt(this.getAttribute('data-choice'));
          var correct = parseInt(choice) === parseInt(question.answer);
          _wrongCampFeedback(correct, question, choice);
          if (correct) s.levelScore++;
          _recordWrongCampAnswer(question, choice, correct);
          _disableWrongCampButtons();
          setTimeout(_advanceWrongCamp, 1200);
        });
      }
    } else if (type === 'fill' || type === 'calc') {
      var submitBtn = document.getElementById('fill-submit-btn');
      var inputEl = document.getElementById('fill-display');
      var doSubmit = function() {
        var value = inputEl ? inputEl.value.trim() : '';

        // 先试字符串精确匹配
        var correct = (String(value).toLowerCase() === String(question.answer).toLowerCase());

        // 不匹配则试数值容差
        if (!correct) {
          var answer = parseFloat(value);
          var expected = parseFloat(question.answer);
          if (!isNaN(answer) && !isNaN(expected)) {
            var tolerance = question.tolerance || 0.005;
            correct = Math.abs(answer - expected) <= Math.max(tolerance, 0.001);
          }
        }
        var correct = Math.abs(answer - expected) <= tolerance;
        _wrongCampFeedback(correct, question, value);
        if (correct) s.levelScore++;
        _recordWrongCampAnswer(question, value, correct);
        _disableWrongCampButtons();
        setTimeout(_advanceWrongCamp, 1200);
      };
      if (submitBtn) submitBtn.addEventListener('click', doSubmit);
      if (inputEl) inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); doSubmit(); }
      });
    } else if (type === 'judge') {
      var judgeBtns = document.querySelectorAll('.judge-btn');
      for (var k = 0; k < judgeBtns.length; k++) {
        judgeBtns[k].addEventListener('click', function() {
          var val = this.getAttribute('data-judge') === 'true';
          var correct = Boolean(val) === Boolean(question.answer);
          _wrongCampFeedback(correct, question, val ? '对' : '错');
          if (correct) s.levelScore++;
          _recordWrongCampAnswer(question, val ? '对' : '错', correct);
          _disableWrongCampButtons();
          setTimeout(_advanceWrongCamp, 1200);
        });
      }
    } else if (type === 'match') {
      _bindMatchDragEvents(question, 'wrongcamp');
    }
  }

  function _updateWrongCampTimer() {
    var el = document.getElementById('timer-display');
    if (el) {
      el.textContent = wrongCampState._speedTimeLeft;
      el.style.color = wrongCampState._speedTimeLeft <= 5 ? 'var(--red-coral)' : wrongCampState._speedTimeLeft <= 10 ? 'var(--gold-sand)' : 'var(--green-seaweed)';
    }
  }

  function _wrongCampFeedback(correct, question, userAnswer) {
    var area = document.getElementById('wrongcamp-feedback');
    if (!area) return;
    playSound(correct);
    if (correct) {
      area.innerHTML = '<div style="animation:bounceIn 0.5s ease;color:var(--green-seaweed);font-size:1.1rem;padding:12px;background:var(--green-light);border-radius:8px;">✅ 回答正确！' + (question.explain ? '<br><small>' + question.explain + '</small>' : '') + '</div>';
    } else {
      var correctDisplay = question.options ? question.options[question.answer] : question.answer;
      area.innerHTML = '<div style="animation:shake 0.5s ease;color:var(--red-coral);font-size:1.1rem;padding:12px;background:var(--red-light);border-radius:8px;">❌ 回答错误<br><small>你的答案：' + userAnswer + ' | 正确答案：' + correctDisplay + '</small>'
        + (question.explain ? '<br><small>💡 ' + question.explain + '</small>' : '')
        + '<br><button class="btn btn-secondary" style="font-size:0.85rem;padding:6px 14px;margin-top:8px;" onclick="MathApp._askDeepSeek(\'' + _escapeQuote(question.question) + '\')">🤖 不懂？问问DeepSeek</button>'
        + '</div>';
    }
  }

  function _recordWrongCampAnswer(question, userAnswer, correct) {
    wrongCampState.levelAnswers.push({
      question: question.question,
      options: question.options,
      answer: question.answer,
      userAnswer: userAnswer,
      correct: correct,
      explain: question.explain || ''
    });
    wrongCampState.allAnswers.push({
      question: question.question,
      options: question.options,
      answer: question.answer,
      userAnswer: userAnswer,
      correct: correct,
      explain: question.explain || ''
    });
  }

  function _disableWrongCampButtons() {
    var btns = document.querySelectorAll('#wrongcamp-card button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      btns[i].style.opacity = '0.6';
      btns[i].style.cursor = 'default';
    }
  }

  function _updateWrongCampDisplay() {
    var el = document.getElementById('fill-display');
    if (el) el.textContent = wrongCampState.numpadValue || '_';
  }

  function _advanceWrongCamp() {
    // 清除速度题计时器
    if (wrongCampState._speedTimer) { clearInterval(wrongCampState._speedTimer); wrongCampState._speedTimer = null; }
    wrongCampState._speedAnswered = false;

    wrongCampState.currentQIdx++;
    if (wrongCampState.currentQIdx >= wrongCampState.pool[wrongCampState.currentLevelIdx].length) {
      wrongCampState.totalScore += wrongCampState.levelScore;
      wrongCampState.view = 'levelReview';
    }
    renderWrongCamp();
  }

  function _renderWrongCampLevelReview(page) {
    var s = wrongCampState;
    var levelInfo = s.chapter.levels[s.currentLevelIdx];
    var levelTitle = levelInfo.title || ('第' + (s.currentLevelIdx + 1) + '关');
    var totalInLevel = s.pool[s.currentLevelIdx].length;
    var accuracy = totalInLevel > 0 ? Math.round(s.levelScore / totalInLevel * 100) : 0;

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:20px;background:var(--blue-pale);border-radius:16px;padding:20px;">';
    html += '<div style="font-size:2rem;margin-bottom:8px;">' + (accuracy >= 80 ? '🎉' : accuracy >= 60 ? '💪' : '📚') + '</div>';
    html += '<h2 style="color:var(--blue-dalian);">' + levelTitle + ' - 完成!</h2>';
    html += '<div style="display:flex;justify-content:center;gap:24px;margin-top:12px;">';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--green-seaweed);">' + s.levelScore + '/' + totalInLevel + '</div><div style="font-size:0.8rem;color:var(--grey-light);">得分</div></div>';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + accuracy + '%</div><div style="font-size:0.8rem;color:var(--grey-light);">正确率</div></div>';
    html += '</div></div>';

    // 题目解析
    html += '<div style="margin-bottom:16px;"><h3 style="color:var(--grey-reef);margin-bottom:8px;">📋 本关题目解析</h3>';
    var levelAnswers = s.levelAnswers;
    for (var i = 0; i < levelAnswers.length; i++) {
      var la = levelAnswers[i];
      var correctDisplay = la.options ? la.options[la.answer] : la.answer;
      html += '<div class="card" style="margin-bottom:8px;border-left:4px solid ' + (la.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';padding:16px;">';
      html += '<div style="font-weight:600;margin-bottom:4px;">' + (la.correct ? '✅' : '❌') + ' ' + escapeHtml(la.question) + '</div>';

      // 选择题：显示所有选项
      if (la.options && Array.isArray(la.options)) {
        var labels = ['A','B','C','D','E','F'];
        html += '<div style="font-size:0.85rem;color:var(--grey-light);margin-bottom:6px;">';
        for (var oi = 0; oi < la.options.length; oi++) {
          var isUser = (oi === parseInt(la.userAnswer));
          var isCorrect = (oi === parseInt(la.answer));
          var style = '';
          if (isUser && !isCorrect) style = 'color:var(--red-coral);text-decoration:line-through;';
          else if (isCorrect) style = 'color:var(--green-seaweed);font-weight:700;';
          html += '<div style="' + style + '">' + labels[oi] + '. ' + escapeHtml(String(la.options[oi])) + (isCorrect ? ' ✅' : '') + (isUser && !isCorrect ? ' ❌' : '') + '</div>';
        }
        html += '</div>';
      }

      html += '<div style="font-size:0.9rem;color:var(--grey-light);">你的答案：<span style="color:' + (la.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';">' + la.userAnswer + '</span></div>';
      if (!la.correct) {
        html += '<div style="font-size:0.9rem;color:var(--green-seaweed);">正确答案：' + correctDisplay + '</div>';
      }
      if (la.explain) {
        html += '<div style="font-size:0.85rem;color:var(--blue-dalian);margin-top:4px;">💡 ' + la.explain + '</div>';
      }
      html += '<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 10px;margin-top:6px;" onclick="MathApp._askDeepSeek(\'' + _escapeQuote(la.question) + '\')">🤖 问DeepSeek</button>';
      html += '</div>';
    }
    html += '</div>';

    // 按钮
    if (s.currentLevelIdx + 1 < s.pool.length) {
      html += '<div style="text-align:center;margin-top:20px;">';
      html += '<button class="btn btn-primary" onclick="MathApp._advanceWrongCampLevel()">▶ 下一关</button>';
      html += '</div>';
    } else {
      html += '<div style="text-align:center;margin-top:20px;">';
      html += '<button class="btn btn-success" onclick="MathApp._finishWrongCamp()">🏆 查看总结</button>';
      html += '</div>';
    }

    html += '</div>';
    page.innerHTML = html;
  }

  function _advanceWrongCampLevel() {
    var s = wrongCampState;
    s.levelScore = 0;
    s.levelAnswers = [];
    s.currentLevelIdx++;
    s.currentQIdx = 0;
    s.view = 'quiz';
    renderWrongCamp();
  }

  function _finishWrongCamp() {
    wrongCampState.view = 'summary';
    renderWrongCamp();
  }

  function _renderWrongCampSummary(page, sid) {
    var s = wrongCampState;
    var totalQs = 0;
    for (var i = 0; i < s.pool.length; i++) totalQs += s.pool[i].length;
    var totalCorrect = 0;
    for (var j = 0; j < s.allAnswers.length; j++) {
      if (s.allAnswers[j].correct) totalCorrect++;
    }
    var accuracy = totalQs > 0 ? Math.round(totalCorrect / totalQs * 100) : 0;

    // 更新训练营进度 - 标记知识点已练习
    var campProgress = getWrongcampProgress(sid);
    if (!campProgress[String(s.chapterId)]) campProgress[String(s.chapterId)] = { practiced: [], attempts: 0 };
    campProgress[String(s.chapterId)].attempts = (campProgress[String(s.chapterId)].attempts || 0) + 1;
    if (s.chapter && s.chapter.knowledge_points) {
      for (var k = 0; k < s.chapter.knowledge_points.length; k++) {
        if (campProgress[String(s.chapterId)].practiced.indexOf(s.chapter.knowledge_points[k]) === -1) {
          campProgress[String(s.chapterId)].practiced.push(s.chapter.knowledge_points[k]);
        }
      }
    }
    saveWrongcampProgress(sid, campProgress);

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:20px;background:var(--green-light);border-radius:16px;padding:24px;">';
    html += '<div style="font-size:3rem;margin-bottom:8px;">' + (accuracy >= 80 ? '🏆' : '📚') + '</div>';
    html += '<h2 style="color:var(--blue-dalian);">训练结束!</h2>';
    html += '<p style="color:var(--grey-light);">' + s.chapter.title + ' · 错题特训完成</p>';
    html += '<div style="display:flex;justify-content:center;gap:24px;margin-top:12px;">';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--green-seaweed);">' + totalCorrect + '/' + totalQs + '</div><div style="font-size:0.8rem;color:var(--grey-light);">总得分</div></div>';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + accuracy + '%</div><div style="font-size:0.8rem;color:var(--grey-light);">正确率</div></div>';
    html += '</div></div>';

    // 所有题目解析
    html += '<div style="margin-bottom:16px;"><h3 style="color:var(--grey-reef);margin-bottom:8px;">📋 全部题目解析</h3>';
    var allAns = s.allAnswers;
    for (var ai = 0; ai < allAns.length; ai++) {
      var aa = allAns[ai];
      var cd = aa.options ? aa.options[aa.answer] : aa.answer;
      html += '<div class="card" style="margin-bottom:6px;border-left:4px solid ' + (aa.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';padding:12px;font-size:0.9rem;">';
      html += '<div>' + (aa.correct ? '✅' : '❌') + ' ' + escapeHtml(aa.question) + '</div>';
      html += '<div style="color:var(--grey-light);">你的答案：<span style="color:' + (aa.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';">' + aa.userAnswer + '</span>';
      if (!aa.correct) html += ' | 正确答案：<span style="color:var(--green-seaweed);">' + cd + '</span>';
      html += '</div>';
      if (aa.explain) html += '<div style="color:var(--blue-dalian);">💡 ' + aa.explain + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="text-align:center;margin-top:20px;display:flex;gap:12px;justify-content:center;">';
    html += '<button class="btn btn-primary" onclick="MathApp._startWrongCampQuiz(' + s.chapterId + ')">🔄 再练一次</button>';
    html += '<button class="btn btn-secondary" onclick="MathApp._resetWrongCamp();MathApp.navigate(\'#wrongcamp\')">🏕️ 返回营地</button>';
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;
  }

  function _resetWrongCamp() {
    wrongCampState = {
      view: 'list', chapterId: null, chapter: null, pool: [],
      currentLevelIdx: 0, currentQIdx: 0, levelScore: 0,
      levelAnswers: [], totalScore: 0, allAnswers: [], numpadValue: ''
    };
  }

  // ====== 进阶营地 ======
  var advancedState = {
    view: 'list', currentLevel: 0, pool: [],
    currentQIdx: 0, score: 0, answers: [], numpadValue: ''
  };

  function renderAdvanced() {
    var page = document.getElementById('page-advanced');
    if (!page) return;
    page.style.background = 'url(assets/scenes/bridge-bg.png) center/cover no-repeat';
    page.style.backgroundAttachment = 'fixed';

    var sid = (typeof MathAuth !== 'undefined') ? MathAuth.getCurrentStudentId() : null;
    if (!sid) {
      page.innerHTML = '<div class="container" style="text-align:center;padding-top:100px;"><p>请先选择学生</p><button class="btn btn-primary" onclick="MathApp.navigate(\'#teacher\')">返回教师面板</button></div>';
      return;
    }

    var navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = '进阶营地';

    if (advancedState.view === 'list') {
      _renderAdvancedList(page, sid);
    } else if (advancedState.view === 'quiz') {
      _renderAdvancedQuiz(page);
    } else if (advancedState.view === 'levelReview') {
      _renderAdvancedLevelReview(page, sid);
    }
  }

  function _getAdvancedLevelConfig(level) {
    // Returns { chapterIds: [], questionCount: number }
    var configs = {
      1: { chapterIds: [1, 2], count: 10, perChapter: 5 },
      2: { chapterIds: [1, 2, 3], count: 15, perChapter: 5 },
      3: { chapterIds: [1, 2, 3, 4], count: 20, perChapter: 5 },
      4: { chapterIds: [1, 2, 3, 4, 5], count: 25, perChapter: 5 },
      5: { chapterIds: [1, 2, 3, 4, 5, 6], count: 30, perChapter: 5 }
    };
    return configs[level] || configs[1];
  }

  function _startAdvancedQuiz(level) {
    if (!chapterData) { loadChapterData(function() { _startAdvancedQuiz(level); }); return; }
    var config = _getAdvancedLevelConfig(level);
    if (!config) return;

    var chapters = chapterData.chapters || [];
    var pool = [];
    var allTypes = ['choice', 'fill', 'calc', 'judge', 'match', 'speed'];

    for (var ci = 0; ci < config.chapterIds.length; ci++) {
      var cid = config.chapterIds[ci];
      var chapter = null;
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].id === cid) { chapter = chapters[i]; break; }
      }
      if (!chapter) continue;

      var count = config.perChapter || 5;
      // 每个章节混合多种题型
      var qsForChapter = [];
      for (var q = 0; q < count; q++) {
        var type = allTypes[q % allTypes.length];
        if (typeof MathGenerator !== 'undefined') {
          var genQs = MathGenerator.generateQuestions(cid, type, 1);
          if (genQs.length > 0) qsForChapter.push(genQs[0]);
        }
      }
      // Fill missing with choice questions
      while (qsForChapter.length < count && typeof MathGenerator !== 'undefined') {
        var extraQs = MathGenerator.generateQuestions(cid, 'choice', 1);
        if (extraQs.length > 0) qsForChapter.push(extraQs[0]);
        else break;
      }
      qsForChapter = shuffleArray(qsForChapter.slice(0, count));
      pool = pool.concat(qsForChapter);
    }

    pool = shuffleArray(pool);

    advancedState = {
      view: 'quiz', currentLevel: level, pool: pool,
      currentQIdx: 0, score: 0, answers: [], numpadValue: ''
    };
    renderAdvanced();
  }

  function _renderAdvancedList(page, sid) {
    var advProgress = getAdvancedProgress(sid);
    var highestLevel = advProgress.highestLevel || 0;

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:20px;">';
    html += '<h2 style="color:var(--blue-dalian);">🚀 举一反三进阶营地</h2>';
    html += '<p style="color:var(--grey-light);">多章节混合挑战，检验综合能力！</p>';
    html += '</div>';

    var levelNames = ['', '初露锋芒', '渐入佳境', '融会贯通', '炉火纯青', '登峰造极'];
    var levelDescs = ['', '2个单元混合 · 10题', '3个单元混合 · 15题', '4个单元混合 · 20题', '5个单元混合 · 25题', '全6单元 · 30题终极挑战'];
    var levelIcons = ['', '🌱', '🌿', '🌳', '🔥', '👑'];

    html += '<div style="display:grid;gap:16px;">';
    for (var lv = 1; lv <= 5; lv++) {
      var unlocked = lv === 1 || lv <= highestLevel + 1;
      var completed = lv <= highestLevel;
      var statusIcon = completed ? '✅' : unlocked ? '📍' : '🔒';
      var bgColor = completed ? 'var(--green-light)' : unlocked ? 'var(--white-pure)' : 'var(--grey-card)';

      html += '<div class="card" style="background:' + bgColor + ';cursor:' + (unlocked ? 'pointer' : 'default') + ';opacity:' + (unlocked ? '1' : '0.6') + ';transition:transform 0.2s;"' + (unlocked ? ' onclick="MathApp._startAdvancedQuiz(' + lv + ')"' : '') + '>';
      html += '<div style="display:flex;align-items:center;gap:12px;">';
      html += '<div style="font-size:2rem;">' + levelIcons[lv] + '</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-weight:700;color:var(--grey-reef);">' + statusIcon + ' 第' + lv + '关 · ' + levelNames[lv] + '</div>';
      html += '<div style="font-size:0.85rem;color:var(--grey-light);">' + levelDescs[lv] + '</div>';
      html += '</div>';
      html += '<div style="font-size:1.5rem;">' + (completed ? '🏆' : '▶') + '</div>';
      html += '</div></div>';
    }
    html += '</div>';

    html += '<div style="text-align:center;margin-top:24px;">';
    html += '<button class="btn btn-secondary" onclick="MathApp.navigate(\'#map\')">← 返回地图</button>';
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;
  }

  function _renderAdvancedQuiz(page) {
    var s = advancedState;
    if (s.currentQIdx >= s.pool.length) {
      s.view = 'levelReview';
      renderAdvanced();
      return;
    }

    var question = s.pool[s.currentQIdx];
    // 正确检测题目类型（基于题目结构特征）
    var type = detectQuestionType(question);

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:16px;background:var(--gold-light);border-radius:12px;padding:12px;">';
    html += '<div style="font-size:0.9rem;color:var(--gold-sand);">🚀 进阶营地 · 第' + s.currentLevel + '关</div>';
    html += '<div style="color:var(--grey-light);font-size:0.85rem;">第 ' + (s.currentQIdx + 1) + '/' + s.pool.length + ' 题 · ' + getTypeLabel(type) + '</div>';
    html += '</div>';

    html += '<div class="progress-bar" style="margin-bottom:20px;">';
    html += '<div class="progress-bar-fill" style="width:' + (s.currentQIdx / Math.max(s.pool.length, 1) * 100) + '%;"></div>';
    html += '</div>';

    html += '<div class="card" style="animation:fadeIn 0.3s ease;" id="advanced-card">';
    html += '<div style="font-size:1.2rem;margin-bottom:20px;line-height:1.8;color:var(--grey-reef);">' + escapeHtml(question.question) + '</div>';
    html += '<div id="answer-area">';

    // 按题目类型渲染对应界面
    if (type === 'choice') {
      if (!question.options) question.options = ['A', 'B', 'C', 'D'];
      html += renderChoiceArea(question);
    } else if (type === 'judge') {
      html += renderJudgeArea(question);
    } else if (type === 'match') {
      html += renderMatchArea(question);
    } else if (type === 'speed') {
      html += renderSpeedArea(question);
    } else if (type === 'calc') {
      html += renderCalcArea(question);
    } else {
      // fill 类型统一使用文本输入框
      html += renderFillArea(question);
    }

    html += '</div>';
    html += '<div id="advanced-feedback" style="margin-top:16px;min-height:60px;"></div>';
    html += '</div>';

    html += '<div style="text-align:center;margin-top:16px;">';
    html += '<button class="btn btn-secondary" style="font-size:0.9rem;padding:8px 20px;" onclick="if(confirm(\'确定退出进阶营地吗？\')){MathApp.navigate(\'#advanced\')}">🚀 返回营地</button>';
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;

    _bindAdvancedEvents(type, question);
  }

  // ====== 题目类型检测 ======
  function detectQuestionType(question) {
    if (question.generated && question.template) {
      // 生成题：从 template 名推断
      var t = question.template || '';
      if (t.indexOf('判断') >= 0) return 'judge';
    }
    // 结构化检测
    if (question.left_items && question.right_items) return 'match';
    if (question.time_limit && question.options) return 'speed';
    if (question.answer === true || question.answer === false) return 'judge';
    if (question.options && question.options.length > 0) return 'choice';
    if (question.type === 'vertical' || question.type === 'word') return 'calc';
    return 'fill';
  }

  function getTypeLabel(type) {
    var map = { choice: '选择题', fill: '填空题', calc: '计算题', judge: '判断题', match: '连线题', speed: '速答题' };
    return map[type] || '答题';
  }

  function isNumericAnswer(answer) {
    if (typeof answer === 'number') return true;
    if (typeof answer === 'boolean') return false;
    return !isNaN(parseFloat(String(answer))) && isFinite(String(answer));
  }

  // ====== 文字填空题渲染 ======
  function renderTextFillArea(question) {
    return ''
      + '<input type="text" id="fill-display" placeholder="请输入答案" '
      + 'style="width:100%;padding:16px;font-size:1.3rem;text-align:center;border:2px solid var(--blue-light);border-radius:12px;background:var(--grey-card);color:var(--blue-dalian);font-family:var(--font-mono);" '
      + 'autocomplete="off">'
      + '<div style="text-align:center;margin-top:16px;">'
      + '<button class="btn btn-primary" onclick="MathApp._advancedTextSubmit()" style="font-size:1.1rem;">✓ 提交答案</button>'
      + '</div>';
  }

  function _bindAdvancedEvents(type, question) {
    advancedState.numpadValue = '';
    var s = advancedState;

    if (type === 'choice') {
      var btns = document.querySelectorAll('.choice-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
          var choice = parseInt(this.getAttribute('data-choice'));
          var correct = parseInt(choice) === parseInt(question.answer);
          if (isNaN(parseInt(question.answer))) {
            correct = String(choice) === String(question.answer);
          }
          _advancedFeedback(correct, question, (question.options && question.options[choice]) ? question.options[choice] : choice);
          if (correct) s.score++;
          s.answers.push({ question: question.question, options: question.options, answer: question.answer, userAnswer: choice, correct: correct, explain: question.explain || '' });
          _disableAdvancedButtons();
          setTimeout(_advanceAdvanced, 1200);
        });
      }
    } else if (type === 'speed') {
      // 速答：计时 + 选择
      s.speedTimeLeft = question.time_limit || 15;
      s.speedAnswered = false;
      _updateAdvancedTimer();
      s.speedTimer = setInterval(function() {
        s.speedTimeLeft--;
        _updateAdvancedTimer();
        if (s.speedTimeLeft <= 0 && !s.speedAnswered) {
          clearInterval(s.speedTimer);
          s.speedAnswered = true;
          _advancedFeedback(false, question, '⏰ 超时');
          s.answers.push({ question: question.question, options: question.options, answer: question.answer, userAnswer: '超时', correct: false, explain: question.explain || '' });
          _disableAdvancedButtons();
          setTimeout(_advanceAdvanced, 1200);
        }
      }, 1000);

      var spdBtns = document.querySelectorAll('.speed-choice-btn');
      for (var si = 0; si < spdBtns.length; si++) {
        spdBtns[si].addEventListener('click', function() {
          if (s.speedAnswered) return;
          clearInterval(s.speedTimer);
          s.speedAnswered = true;
          var choice = parseInt(this.getAttribute('data-choice'));
          var correct = parseInt(choice) === parseInt(question.answer);
          _advancedFeedback(correct, question, question.options[choice]);
          if (correct) s.score++;
          s.answers.push({ question: question.question, options: question.options, answer: question.answer, userAnswer: choice, correct: correct, explain: question.explain || '' });
          _disableAdvancedButtons();
          setTimeout(_advanceAdvanced, 1200);
        });
      }
    } else if (type === 'judge') {
      var judgeBtns = document.querySelectorAll('.judge-btn');
      for (var j = 0; j < judgeBtns.length; j++) {
        judgeBtns[j].addEventListener('click', function() {
          var val = this.getAttribute('data-judge') === 'true';
          var correct = val === Boolean(question.answer);
          _advancedFeedback(correct, question, val ? '✓ 对' : '✗ 错');
          if (correct) s.score++;
          s.answers.push({ question: question.question, options: question.options, answer: question.answer, userAnswer: val, correct: correct, explain: question.explain || '' });
          _disableAdvancedButtons();
          setTimeout(_advanceAdvanced, 1200);
        });
      }
    } else if (type === 'match') {
      _bindMatchDragEvents(question, 'advanced');
    } else {
      // fill / calc: 物理键盘输入
      var submitBtn = document.getElementById('fill-submit-btn');
      var inputEl = document.getElementById('fill-display');
      var doSubmit = function() {
        var value = inputEl ? inputEl.value.trim() : '';
        if (isNumericAnswer(question.answer)) {
          var answer = parseFloat(value);
          var expected = parseFloat(question.answer);
          var tolerance = question.tolerance;
          if (tolerance === undefined) tolerance = 0.005;
          var correct = Math.abs(answer - expected) <= tolerance;
          _advancedFeedback(correct, question, value);
          if (correct) s.score++;
          s.answers.push({ question: question.question, answer: question.answer, userAnswer: value, correct: correct, explain: question.explain || '' });
        } else {
          var correct = String(value).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
          _advancedFeedback(correct, question, value);
          if (correct) s.score++;
          s.answers.push({ question: question.question, answer: question.answer, userAnswer: value, correct: correct, explain: question.explain || '' });
        }
        _disableAdvancedButtons();
        setTimeout(_advanceAdvanced, 1200);
      };
      if (submitBtn) submitBtn.addEventListener('click', doSubmit);
      if (inputEl) inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); doSubmit(); }
      });
    }
  }

  function _advancedFeedback(correct, question, userAnswer) {
    var area = document.getElementById('advanced-feedback');
    if (!area) return;
    playSound(correct);
    if (correct) {
      area.innerHTML = '<div style="animation:bounceIn 0.5s ease;color:var(--green-seaweed);font-size:1.1rem;padding:12px;background:var(--green-light);border-radius:8px;">✅ 回答正确！' + (question.explain ? '<br><small>' + question.explain + '</small>' : '') + '</div>';
    } else {
      var correctDisplay = question.options ? question.options[question.answer] : question.answer;
      area.innerHTML = '<div style="animation:shake 0.5s ease;color:var(--red-coral);font-size:1.1rem;padding:12px;background:var(--red-light);border-radius:8px;">❌ 回答错误<br><small>你的答案：' + userAnswer + ' | 正确答案：' + correctDisplay + '</small>'
        + (question.explain ? '<br><small>💡 ' + question.explain + '</small>' : '')
        + '<br><button class="btn btn-secondary" style="font-size:0.85rem;padding:6px 14px;margin-top:8px;" onclick="MathApp._askDeepSeek(\'' + _escapeQuote(question.question) + '\')">🤖 不懂？问问DeepSeek</button>'
        + '</div>';
    }
  }

  function _disableAdvancedButtons() {
    var btns = document.querySelectorAll('#advanced-card button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      btns[i].style.opacity = '0.6';
      btns[i].style.cursor = 'default';
    }
  }

  function _updateAdvancedTimer() {
    var el = document.getElementById('timer-display');
    if (el) {
      el.textContent = advancedState.speedTimeLeft;
      el.style.color = advancedState.speedTimeLeft <= 5 ? 'var(--red-coral)' : advancedState.speedTimeLeft <= 10 ? 'var(--gold-sand)' : 'var(--green-seaweed)';
    }
  }

  function _advancedTextSubmit() {
    var s = advancedState;
    var el = document.getElementById('fill-display');
    if (!el) return;
    var value = el.value.trim();
    var question = s.pool[s.currentQIdx];
    var correct = value === String(question.answer).trim()
      || value.toLowerCase() === String(question.answer).trim().toLowerCase();
    _advancedFeedback(correct, question, value);
    if (correct) s.score++;
    s.answers.push({ question: question.question, answer: question.answer, userAnswer: value, correct: correct, explain: question.explain || '' });
    _disableAdvancedButtons();
    setTimeout(_advanceAdvanced, 1200);
  }

  function _advanceAdvanced() {
    advancedState.currentQIdx++;
    if (advancedState.currentQIdx >= advancedState.pool.length) {
      advancedState.view = 'levelReview';
    }
    renderAdvanced();
  }

  function _renderAdvancedLevelReview(page, sid) {
    var s = advancedState;
    var level = s.currentLevel;
    var total = s.pool.length;
    var accuracy = total > 0 ? Math.round(s.score / total * 100) : 0;

    // 保存最高关卡并追加测试历史
    var advProgress = getAdvancedProgress(sid);
    if (s.score / Math.max(total, 1) >= 0.6 && level >= (advProgress.highestLevel || 0)) {
      advProgress.highestLevel = Math.max(advProgress.highestLevel || 0, level);
    }
    if (!advProgress.history) advProgress.history = [];
    advProgress.history.push({
      date: new Date().toISOString(),
      level: level,
      score: s.score,
      total: total
    });
    if (advProgress.history.length > 30) advProgress.history = advProgress.history.slice(-30);
    saveAdvancedProgress(sid, advProgress);

    var levelNames = ['', '初露锋芒', '渐入佳境', '融会贯通', '炉火纯青', '登峰造极'];

    var html = '<div class="container" style="max-width:700px;padding-top:20px;">';
    html += '<div style="text-align:center;margin-bottom:20px;background:var(--gold-light);border-radius:16px;padding:20px;">';
    html += '<div style="font-size:2rem;margin-bottom:8px;">' + (accuracy >= 80 ? '🏆' : accuracy >= 60 ? '💪' : '📚') + '</div>';
    html += '<h2 style="color:var(--blue-dalian);">第' + level + '关 · ' + (levelNames[level] || '') + ' - 完成!</h2>';
    html += '<div style="display:flex;justify-content:center;gap:24px;margin-top:12px;">';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--green-seaweed);">' + s.score + '/' + total + '</div><div style="font-size:0.8rem;color:var(--grey-light);">得分</div></div>';
    html += '<div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + accuracy + '%</div><div style="font-size:0.8rem;color:var(--grey-light);">正确率</div></div>';
    html += '</div></div>';

    // 题目解析
    html += '<div style="margin-bottom:16px;"><h3 style="color:var(--grey-reef);margin-bottom:8px;">📋 本关题目解析</h3>';
    for (var i = 0; i < s.answers.length; i++) {
      var ans = s.answers[i];
      var correctDisplay = ans.options ? ans.options[ans.answer] : ans.answer;
      html += '<div class="card" style="margin-bottom:6px;border-left:4px solid ' + (ans.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';padding:12px;font-size:0.9rem;">';
      html += '<div>' + (ans.correct ? '✅' : '❌') + ' ' + escapeHtml(ans.question) + '</div>';

      // 选择题：显示所有选项
      if (ans.options && Array.isArray(ans.options)) {
        var labels = ['A','B','C','D','E','F'];
        html += '<div style="font-size:0.85rem;color:var(--grey-light);margin:6px 0;">';
        for (var oi = 0; oi < ans.options.length; oi++) {
          var isUser = (oi === parseInt(ans.userAnswer));
          var isCorrect = (oi === parseInt(ans.answer));
          var style = '';
          if (isUser && !isCorrect) style = 'color:var(--red-coral);text-decoration:line-through;';
          else if (isCorrect) style = 'color:var(--green-seaweed);font-weight:700;';
          html += '<div style="' + style + '">' + labels[oi] + '. ' + escapeHtml(String(ans.options[oi])) + (isCorrect ? ' ✅' : '') + (isUser && !isCorrect ? ' ❌' : '') + '</div>';
        }
        html += '</div>';
      }

      html += '<div style="color:var(--grey-light);">你的答案：<span style="color:' + (ans.correct ? 'var(--green-seaweed)' : 'var(--red-coral)') + ';">' + ans.userAnswer + '</span>';
      if (!ans.correct) html += ' | 正确答案：<span style="color:var(--green-seaweed);">' + correctDisplay + '</span>';
      html += '</div>';
      if (ans.explain) html += '<div style="color:var(--blue-dalian);">💡 ' + ans.explain + '</div>';
      html += '<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 10px;margin-top:4px;" onclick="MathApp._askDeepSeek(\'' + _escapeQuote(ans.question) + '\')">🤖 问DeepSeek</button>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="text-align:center;margin-top:20px;display:flex;gap:12px;justify-content:center;">';
    if (accuracy >= 60 && level < 5) {
      html += '<button class="btn btn-primary" onclick="MathApp._startAdvancedQuiz(' + (level + 1) + ')">▶ 挑战下一关</button>';
    }
    html += '<button class="btn btn-secondary" onclick="MathApp._resetAdvanced();MathApp.navigate(\'#advanced\')">🚀 返回营地</button>';
    html += '</div>';
    html += '</div>';
    page.innerHTML = html;
  }

  function _resetAdvanced() {
    advancedState = {
      view: 'list', currentLevel: 0, pool: [],
      currentQIdx: 0, score: 0, answers: [], numpadValue: ''
    };
  }
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i]; result[i] = result[j]; result[j] = tmp;
    }
    return result;
  }

  // ====== 初始化 ======
  function init() {
    // 初始化 Supabase 云同步
    if (typeof MathDB !== 'undefined') {
      MathDB.initSupabase();
      var syncIcon = document.getElementById('nav-sync');
      
      // 先显示"检查中"状态
      if (syncIcon) { syncIcon.textContent = '⏳'; syncIcon.title = '正在检测云同步...'; syncIcon.className = 'nav-sync checking'; }
      
      // 异步验证真实连接状态
      MathDB.checkConnection().then(function(ok) {
        if (ok) {
          console.log('☁️ Supabase 云同步已连接');
          if (syncIcon) { syncIcon.textContent = '☁️'; syncIcon.title = '云同步已连接'; syncIcon.className = 'nav-sync connected'; }
        } else {
          console.warn('⚠️ 云同步未连接，使用本地存储');
          if (syncIcon) { syncIcon.textContent = '💾'; syncIcon.title = '本地存储模式（未连接云同步）'; syncIcon.className = 'nav-sync local'; }
        }
      });
    }

    window.addEventListener('hashchange', onHashChange);

    // 绑定导航栏返回按钮
    var backBtn = document.getElementById('nav-back');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        var route = getCurrentRoute();
        if (route.name === 'teacher') navigate('#cover');
        else if (route.name === 'map') navigate('#teacher');
        else if (route.name === 'wrongcamp' || route.name === 'advanced' || route.name === 'report' || route.name === 'report-adv') navigate('#teacher');
        else if (route.name === 'quiz' || route.name === 'story' || route.name === 'reward') {
          // 答题中需要确认
          if (route.name === 'quiz' && typeof currentLevelIdx !== 'undefined' && currentQIdx > 0) {
            if (confirm('确定要退出当前闯关吗？进度不会保存。')) {
              navigate('#map');
            }
          } else {
            navigate('#map');
          }
        } else navigate('#cover');
      });
    }

    // 立即渲染封面页，避免白屏
    var route = getCurrentRoute();
    showPage(route.name);
    renderCover();

    // 异步加载章节数据
    loadChapterData(function() {
      if (!location.hash || location.hash === '#') {
        if (typeof MathStorage !== 'undefined') {
          var teacher = MathStorage.getTeacher();
          if (teacher) {
            location.hash = '#teacher';
            return;
          }
        }
        location.hash = '#cover';
      }
      onHashChange();
    });
  }

  // ====== 模态弹窗 ======
  function showModal(title, message, buttons) {
    var overlay = document.getElementById('modal-overlay');
    var box = document.getElementById('modal-box');
    if (!overlay || !box) return;
    var html = '<h3>' + title + '</h3>';
    if (message) html += '<p>' + message + '</p>';
    if (buttons && buttons.length) {
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        html += '<button class="btn ' + (b.cls || 'btn-primary') + '" data-modal-action="' + i + '">' + b.text + '</button> ';
      }
    }
    box.innerHTML = html;
    overlay.style.display = 'flex';
    box.querySelectorAll('[data-modal-action]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-modal-action'));
        if (buttons[idx] && buttons[idx].action) buttons[idx].action();
        overlay.style.display = 'none';
      });
    });
  }

  // ====== 学生成绩报告页 ======
  function renderReportPage(studentId) {
    var page = document.getElementById('page-report');
    if (!page) return;
    page.style.background = 'url(assets/scenes/report-bg.png) center/cover no-repeat';
    page.style.backgroundAttachment = 'fixed';

    var students = MathStorage.getStudents();
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (students[i].id === studentId) { student = students[i]; break; }
    }
    if (!student) { page.innerHTML = '<p>学生不存在</p>'; return; }

    var navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = student.name + ' · 学习报告';

    var progress = MathStorage.getProgress(studentId);
    var history = getTestHistory(studentId);
    var chapters = (chapterData && chapterData.chapters) ? chapterData.chapters : [];
    var stats = getChapterStats(history, chapters);
    var allRecords = [];
    Object.keys(history).forEach(function(k) { allRecords = allRecords.concat(history[k]); });
    allRecords.sort(function(a, b) { return (a.date > b.date ? -1 : 1); });

    var totalTests = allRecords.length;
    var totalBest = progress.total_coins || 0;
    var completedChaps = 0;
    for (var ck in progress.chapters) {
      if (progress.chapters[ck].status === 'completed') completedChaps++;
    }

    var html = '<div class="container" style="max-width:750px;padding-top:20px;background:rgba(255,255,255,0.92);border-radius:16px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
    html += '<h2 style="color:var(--blue-dalian);">📊 ' + student.name + ' · 学习报告</h2>';
    html += '<button class="btn btn-secondary" onclick="MathApp.navigate(\'#teacher\')">← 返回</button>';
    html += '</div>';

    // 总览卡片
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px;">';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">🏆</div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + completedChaps + '/6</div><div style="color:var(--grey-light);">已完成章节</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">📝</div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + totalTests + '</div><div style="color:var(--grey-light);">测试总次数</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">🪙</div><div style="font-size:1.5rem;font-weight:700;color:var(--gold-sand);">' + totalBest + '</div><div style="color:var(--grey-light);">总金币</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">📈</div><div style="font-size:1.5rem;font-weight:700;color:var(--green-seaweed);">' + (totalTests > 0 ? Math.round(allRecords.filter(function(r){return r.accuracy>=70;}).length/totalTests*100) : 0) + '%</div><div style="color:var(--grey-light);">达标率(≥70%)</div></div>';
    html += '</div>';

    // 章节详情表
    html += '<h3 style="color:var(--blue-dalian);margin-bottom:12px;">📋 各章节测试详情</h3>';
    html += '<div style="overflow-x:auto;margin-bottom:20px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr style="background:var(--blue-pale);">';
    html += '<th style="padding:10px 8px;text-align:left;">章节</th>';
    html += '<th style="padding:10px 8px;">测试次数</th>';
    html += '<th style="padding:10px 8px;">最近成绩</th>';
    html += '<th style="padding:10px 8px;">最高正确率</th>';
    html += '<th style="padding:10px 8px;">平均正确率</th>';
    html += '<th style="padding:10px 8px;">学习进度</th>';
    html += '</tr></thead><tbody>';

    for (var ci = 0; ci < chapters.length; ci++) {
      var ch = chapters[ci];
      var chId = String(ch.id);
      var st = stats[chId] || { attempts: 0, last: null, best: 0, avg: 0 };
      var chProg = progress.chapters[chId];
      var statusIcon = chProg && chProg.status === 'completed' ? '✅' : chProg && chProg.status === 'in_progress' ? '🔄' : '🔒';
      var barPct = chProg ? Math.round(chProg.best_score / Math.max(chProg.total, 1) * 100) : 0;

      html += '<tr style="border-bottom:1px solid var(--grey-card);">';
      html += '<td style="padding:10px 8px;font-weight:600;">' + statusIcon + ' ' + ch.title + '</td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + st.attempts + '次</td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + (st.last ? st.last.score + '/' + st.last.total + ' (' + st.last.accuracy + '%)' : '-') + '</td>';
      html += '<td style="padding:10px 8px;text-align:center;color:var(--green-seaweed);font-weight:700;">' + (st.best > 0 ? st.best + '%' : '-') + '</td>';
      html += '<td style="padding:10px 8px;text-align:center;color:var(--blue-dalian);font-weight:700;">' + (st.avg > 0 ? st.avg + '%' : '-') + '</td>';
      html += '<td style="padding:10px 8px;"><div class="progress-bar" style="height:8px;"><div class="progress-bar-fill" style="width:' + barPct + '%;height:8px;"></div></div></td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';

    // 最近测试记录
    html += '<h3 style="color:var(--blue-dalian);margin-bottom:12px;">🕒 最近10次测试记录</h3>';
    html += '<div style="margin-bottom:20px;">';
    var recentTests = allRecords.slice(0, 10);
    for (var ri = 0; ri < recentTests.length; ri++) {
      var rt = recentTests[ri];
      var rtChapter = null;
      for (var cc = 0; cc < chapters.length; cc++) {
        if (String(chapters[cc].id) === Object.keys(history).find(function(k) {
          return history[k].indexOf(rt) >= 0;
        })) { rtChapter = chapters[cc]; break; }
      }
      // Find chapter title from history key
      var rtChTitle = '';
      for (var hk in history) {
        if (history[hk].indexOf(rt) >= 0) {
          for (var fc = 0; fc < chapters.length; fc++) {
            if (String(chapters[fc].id) === hk) { rtChTitle = chapters[fc].title; break; }
          }
          break;
        }
      }
      var d = new Date(rt.date);
      var dateStr = (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
      html += '<div class="card" style="margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;">';
      html += '<div><span style="color:var(--grey-light);">' + dateStr + '</span> <span style="font-weight:600;">' + rtChTitle + '</span></div>';
      html += '<div style="display:flex;gap:16px;align-items:center;">';
      html += '<span style="color:' + (rt.accuracy >= 80 ? 'var(--green-seaweed)' : rt.accuracy >= 60 ? 'var(--gold-sand)' : 'var(--red-coral)') + ';font-weight:700;">' + rt.accuracy + '%</span>';
      html += '<span style="color:var(--grey-light);">' + rt.score + '/' + rt.total + '</span>';
      html += '<span>' + Array(rt.stars+1).join('⭐') + '</span>';
      html += '</div></div>';
    }
    if (recentTests.length === 0) {
      html += '<div class="card" style="text-align:center;padding:24px;color:var(--grey-light);">暂无测试记录，快去闯关吧！</div>';
    }
    html += '</div>';

    html += '</div>';
    page.innerHTML = html;
  }

  // ====== 进阶营地成绩报告页 ======
  function renderAdvancedReportPage(studentId) {
    var page = document.getElementById('page-report-adv');
    if (!page) return;
    page.style.background = 'url(assets/scenes/advreport-bg.png) center/cover no-repeat';
    page.style.backgroundAttachment = 'fixed';

    var students = MathStorage.getStudents();
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (students[i].id === studentId) { student = students[i]; break; }
    }
    if (!student) { page.innerHTML = '<p>学生不存在</p>'; return; }

    var navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = student.name + ' · 进阶营地报告';

    var advProgress = getAdvancedProgress(studentId);
    var advHistory = advProgress.history || [];
    var highestLevel = advProgress.highestLevel || 0;

    var levelNames = ['', '初露锋芒', '渐入佳境', '融会贯通', '炉火纯青', '登峰造极'];
    var levelDesc = ['', '2个单元联考', '3个单元联考', '4个单元联考', '5个单元联考', '6个单元全考（期末模拟）'];
    var levelQuestions = [0, 10, 15, 20, 25, 30];

    var totalTests = advHistory.length;
    var bestScore = 0, sumAcc = 0;
    for (var h = 0; h < advHistory.length; h++) {
      var acc = advHistory[h].total > 0 ? Math.round(advHistory[h].score / advHistory[h].total * 100) : 0;
      sumAcc += acc;
      if (acc > bestScore) bestScore = acc;
    }
    var avgAccuracy = totalTests > 0 ? Math.round(sumAcc / totalTests) : 0;

    var html = '<div class="container" style="max-width:750px;padding-top:20px;background:rgba(255,255,255,0.92);border-radius:16px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
    html += '<h2 style="color:var(--blue-dalian);">🚀 ' + student.name + ' · 进阶营地报告</h2>';
    html += '<button class="btn btn-secondary" onclick="MathApp.navigate(\'#teacher\')">← 返回</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px;">';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">🏔️</div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + highestLevel + '/5</div><div style="color:var(--grey-light);">最高关卡</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">📝</div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + totalTests + '</div><div style="color:var(--grey-light);">测试次数</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">🏆</div><div style="font-size:1.5rem;font-weight:700;color:var(--green-seaweed);">' + bestScore + '%</div><div style="color:var(--grey-light);">最高正确率</div></div>';
    html += '<div class="card" style="text-align:center;padding:16px;"><div style="font-size:2rem;">📈</div><div style="font-size:1.5rem;font-weight:700;color:var(--blue-dalian);">' + avgAccuracy + '%</div><div style="color:var(--grey-light);">平均正确率</div></div>';
    html += '</div>';

    html += '<h3 style="color:var(--blue-dalian);margin-bottom:12px;">📋 各关卡详情</h3>';
    html += '<div style="overflow-x:auto;margin-bottom:20px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr style="background:var(--gold-light);">';
    html += '<th style="padding:10px 8px;text-align:left;">关卡</th><th style="padding:10px 8px;">题数</th><th style="padding:10px 8px;">测试次数</th><th style="padding:10px 8px;">最近成绩</th><th style="padding:10px 8px;">最高正确率</th><th style="padding:10px 8px;">状态</th>';
    html += '</tr></thead><tbody>';

    for (var lv = 1; lv <= 5; lv++) {
      var levelRecs = [];
      for (var r = 0; r < advHistory.length; r++) {
        if (advHistory[r].level === lv) levelRecs.push(advHistory[r]);
      }
      var lvBest = 0;
      for (var b = 0; b < levelRecs.length; b++) {
        var la = levelRecs[b].total > 0 ? Math.round(levelRecs[b].score / levelRecs[b].total * 100) : 0;
        if (la > lvBest) lvBest = la;
      }
      var last = levelRecs.length > 0 ? levelRecs[levelRecs.length - 1] : null;
      var lastStr = last ? last.score + '/' + last.total + ' (' + Math.round(last.score/last.total*100) + '%)' : '-';
      var status = lv <= highestLevel ? '✅' : '🔒';
      var unlocked = lv <= (highestLevel + 1);

      html += '<tr style="border-bottom:1px solid var(--grey-card);' + (unlocked ? '' : 'opacity:0.5;') + '">';
      html += '<td style="padding:10px 8px;font-weight:600;">' + status + ' ' + levelNames[lv] + '<br><small style="color:var(--grey-light);">' + levelDesc[lv] + '</small></td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + levelQuestions[lv] + '题</td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + levelRecs.length + '次</td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + lastStr + '</td>';
      html += '<td style="padding:10px 8px;text-align:center;color:var(--green-seaweed);font-weight:700;">' + (lvBest > 0 ? lvBest + '%' : '-') + '</td>';
      html += '<td style="padding:10px 8px;text-align:center;">' + status + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';

    html += '<h3 style="color:var(--blue-dalian);margin-bottom:12px;">🕒 最近10次测试</h3>';
    var recent = advHistory.slice(-10).reverse();
    for (var ri = 0; ri < recent.length; ri++) {
      var rt = recent[ri];
      var rtAcc = rt.total > 0 ? Math.round(rt.score / rt.total * 100) : 0;
      var d = new Date(rt.date);
      var dateStr = (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
      html += '<div class="card" style="margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;">';
      html += '<div><span style="color:var(--grey-light);">' + dateStr + '</span> <span style="font-weight:600;">第' + rt.level + '关 · ' + (levelNames[rt.level] || '') + '</span></div>';
      html += '<div style="display:flex;gap:16px;align-items:center;">';
      html += '<span style="color:' + (rtAcc >= 80 ? 'var(--green-seaweed)' : rtAcc >= 60 ? 'var(--gold-sand)' : 'var(--red-coral)') + ';font-weight:700;">' + rtAcc + '%</span>';
      html += '<span style="color:var(--grey-light);">' + rt.score + '/' + rt.total + '</span>';
      html += '</div></div>';
    }
    if (recent.length === 0) {
      html += '<div class="card" style="text-align:center;padding:24px;color:var(--grey-light);">暂无进阶营地记录，快去挑战吧！</div>';
    }

    html += '</div>';
    page.innerHTML = html;
  }

  // ====== 导出 ======
  var api = {
    getCurrentRoute: getCurrentRoute,
    navigate: navigate,
    onRouteChange: onRouteChange,
    showPage: showPage,
    showModal: showModal,
    init: init,
    _chapterData: null,
    _startWrongCampQuiz: _startWrongCampQuiz,
    _resetWrongCamp: _resetWrongCamp,
    _advanceWrongCampLevel: _advanceWrongCampLevel,
    _finishWrongCamp: _finishWrongCamp,
    _startAdvancedQuiz: _startAdvancedQuiz,
    _resetAdvanced: _resetAdvanced,
    _advancedTextSubmit: _advancedTextSubmit,
    _askDeepSeek: _askDeepSeek,
    _toggleManageMode: _toggleManageMode,
    _deleteWrongItem: _deleteWrongItem,
    _deleteWrongChapter: _deleteWrongChapter
  };

  // 暴露 _chapterData 给其他模块
  Object.defineProperty(api, '_chapterData', {
    get: function() { return chapterData; },
    set: function(v) { chapterData = v; }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  global.MathApp = api;

  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

})(typeof window !== 'undefined' ? window : global);
