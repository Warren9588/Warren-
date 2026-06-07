/**
 * auth.js — 教师面板
 * 学生管理、进度概览、投影模式切换
 */

(function(global) {
  'use strict';

  var currentStudentId = null;

  // ====== 渲染教师面板 ======
  function renderTeacherPage() {
    var page = document.getElementById('page-teacher');
    if (!page) return;

    var teacher = MathStorage.getTeacher();

    if (!teacher) {
      // 首次设置
      page.innerHTML = ''
        + '<div class="container" style="padding-top:40px;text-align:center;">'
        + '<div style="font-size:3rem;margin-bottom:16px;">👨‍🏫</div>'
        + '<h2 style="color:var(--blue-dalian);margin-bottom:12px;">欢迎来到趣味数学大冒险</h2>'
        + '<p style="color:var(--grey-light);margin-bottom:24px;">请先设置教师信息</p>'
        + '<input id="teacher-name-input" class="input-lg" placeholder="请输入您的姓名" style="padding:12px 20px;font-size:1.1rem;border:2px solid var(--blue-dalian);border-radius:12px;text-align:center;margin-bottom:16px;">'
        + '<br><button class="btn btn-primary" onclick="MathAuth._createTeacher()">开始使用</button>'
        + '</div>';
      return;
    }

    var students = MathStorage.getStudents();

    var html = '<div class="container" style="padding-top:20px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
    html += '<h2 style="color:var(--blue-dalian);">👨‍🏫 ' + teacher.name + ' · 班级面板</h2>';
    html += '<div><button class="btn btn-secondary btn-sm" onclick="MathAuth._toggleProjection()" style="font-size:0.9rem;padding:6px 16px;">📺 投影模式</button></div>';
    html += '</div>';

    // 学生卡片
    html += '<div class="student-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">';

    for (var i = 0; i < students.length; i++) {
      var s = students[i];
      var completed = s.completed_chapters || 0;
      html += '<div class="card student-card" style="transition:transform 0.2s;text-align:center;">';
      html += '<div style="font-size:2.5rem;margin-bottom:8px;">' + (completed >= 6 ? '🏆' : completed >= 3 ? '🌟' : '📚') + '</div>';
      html += '<h3 style="margin-bottom:4px;cursor:pointer;" onclick="MathAuth._selectStudent(\'' + s.id + '\')">' + s.name + '</h3>';
      html += '<div style="color:var(--gold-sand);font-size:1.2rem;">⭐ ' + completed + '/6</div>';
      html += '<div style="color:var(--grey-light);font-size:0.9rem;">🪙 ' + s.total_coins + '</div>';
      html += '<div style="margin-top:10px;display:flex;gap:6px;justify-content:center;">';
      html += '<button class="btn btn-primary btn-sm" style="font-size:0.8rem;padding:4px 12px;" onclick="event.stopPropagation();MathAuth._selectStudent(\'' + s.id + '\')">🎮 进入</button>';
      html += '<button class="btn btn-secondary btn-sm" style="font-size:0.8rem;padding:4px 12px;" onclick="event.stopPropagation();MathApp.navigate(\'#report/' + s.id + '\')">📊 学习报告</button>';
      html += '<button class="btn btn-secondary btn-sm" style="font-size:0.8rem;padding:4px 12px;" onclick="event.stopPropagation();MathApp.navigate(\'#report-adv/' + s.id + '\')">🚀 进阶报告</button>';
      html += '</div>';
      html += '</div>';
    }

    // 添加学生按钮
    html += '<div class="card student-card add-student" style="cursor:pointer;text-align:center;border:2px dashed var(--blue-light);display:flex;align-items:center;justify-content:center;min-height:160px;" onclick="MathAuth._showAddStudent()">';
    html += '<div><div style="font-size:2rem;color:var(--blue-light);">＋</div><div style="color:var(--blue-dalian);">添加学生</div></div>';
    html += '</div>';

    html += '</div>';

    // 全班概览表
    if (students.length > 0) {
      html += '<div style="margin-top:30px;"><h3 style="color:var(--blue-dalian);margin-bottom:12px;">📊 全班概览</h3>';
      html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:var(--blue-pale);">';
      html += '<th style="padding:8px;text-align:left;">姓名</th>';
      html += '<th style="padding:8px;">🏬小数</th><th style="padding:8px;">⭐图形</th><th style="padding:8px;">⚓乘法</th>';
      html += '<th style="padding:8px;">🏛️观察</th><th style="padding:8px;">🚃方程</th><th style="padding:8px;">🌤️数据</th>';
      html += '<th style="padding:8px;">🪙金币</th></tr></thead><tbody>';

      for (var j = 0; j < students.length; j++) {
        var st = students[j];
        var prog = MathStorage.getProgress(st.id);
        html += '<tr style="border-bottom:1px solid var(--grey-card);">';
        html += '<td style="padding:8px;font-weight:600;">' + st.name + '</td>';
        for (var c = 1; c <= 6; c++) {
          var ch = prog.chapters[String(c)];
          var icon = ch.status === 'completed' ? '✅' : ch.status === 'in_progress' ? '🔄' : '🔒';
          html += '<td style="padding:8px;text-align:center;">' + icon + '</td>';
        }
        html += '<td style="padding:8px;text-align:center;">' + st.total_coins + '</td>';
        html += '</tr>';
      }
      html += '</tbody></table></div></div>';
    }

    html += '</div>';
    page.innerHTML = html;
  }

  // ====== 教师操作 ======
  function _createTeacher() {
    var input = document.getElementById('teacher-name-input');
    if (!input || !input.value.trim()) return;
    MathStorage.saveTeacher(input.value.trim());
    renderTeacherPage();
    updateNavbar();
  }

  function _showAddStudent() {
    var name = prompt('请输入学生姓名：');
    if (!name || !name.trim()) return;
    MathStorage.addStudent(name.trim());
    renderTeacherPage();
  }

  function _selectStudent(sid) {
    currentStudentId = sid;
    MathApp.navigate('#map');
  }

  function _toggleProjection() {
    document.body.classList.toggle('projection-mode');
  }

  function getCurrentStudentId() {
    return currentStudentId;
  }

  function setCurrentStudentId(sid) {
    currentStudentId = sid;
  }

  // ====== 更新导航栏 ======
  function updateNavbar() {
    var navTitle = document.getElementById('nav-title');
    var navStudent = document.getElementById('nav-student');
    var navCoins = document.getElementById('nav-coins');
    var navbar = document.getElementById('navbar');

    if (!navbar) return;

    var route = MathApp.getCurrentRoute();

    if (route.name === 'cover') {
      navbar.style.display = 'none';
      return;
    }

    navbar.style.display = 'flex';

    // 标题
    var titles = { teacher: '教师面板', map: '趣味数学大冒险', story: '场景故事', quiz: '闯关答题', reward: '闯关完成', wrongcamp: '错题训练营', advanced: '进阶营地' };
    if (navTitle) navTitle.textContent = titles[route.name] || '';

    // 学生信息
    if (navStudent && currentStudentId) {
      var students = MathStorage.getStudents();
      for (var i = 0; i < students.length; i++) {
        if (students[i].id === currentStudentId) {
          navStudent.textContent = '👦 ' + students[i].name;
          break;
        }
      }
    }

    // 金币
    if (navCoins && currentStudentId) {
      var progress = MathStorage.getProgress(currentStudentId);
      var coinSpan = navCoins.querySelector('span');
      if (coinSpan) coinSpan.textContent = progress.total_coins;
    }
  }

  // ====== 导出 ======
  var api = {
    renderTeacherPage: renderTeacherPage,
    getCurrentStudentId: getCurrentStudentId,
    setCurrentStudentId: setCurrentStudentId,
    updateNavbar: updateNavbar,
    _createTeacher: _createTeacher,
    _showAddStudent: _showAddStudent,
    _selectStudent: _selectStudent,
    _toggleProjection: _toggleProjection
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  global.MathAuth = api;

})(typeof window !== 'undefined' ? window : global);
