/**
 * reward.js — 结算页面
 * 星级评级、金币动画、数据统计
 */

(function(global) {
  'use strict';

  function renderRewardPage(result) {
    var page = document.getElementById('page-reward');
    if (!page) return;

    // 设置教室背景
    page.style.background = 'url(assets/scenes/classroom-bg.webp) center/cover no-repeat';
    page.style.backgroundAttachment = 'fixed';

    if (!result) {
      page.innerHTML = '<p>加载中...</p>';
      return;
    }

    var starsHtml = '';
    for (var i = 0; i < 3; i++) {
      starsHtml += '<span class="star' + (i < result.stars ? ' filled' : '') + '" style="font-size:3rem;animation:bounceIn ' + (0.3 + i * 0.2) + 's ease both;">⭐</span>';
    }

    var emoji = result.stars >= 3 ? '🎉' : result.stars >= 2 ? '👍' : result.stars >= 1 ? '💪' : '📚';
    var message = result.stars >= 3 ? '太棒了！全部通关！'
      : result.stars >= 2 ? '做得不错，继续加油！'
      : result.stars >= 1 ? '还需要多练练哦~'
      : '别灰心，再来一次！';

    var html = '<div class="container" style="max-width:600px;text-align:center;padding-top:40px;">';

    // 星级
    html += '<div style="animation:fadeInUp 0.6s ease;">';
    html += '<div style="font-size:4rem;margin-bottom:12px;">' + emoji + '</div>';
    html += '<div style="margin-bottom:8px;">' + starsHtml + '</div>';
    html += '<h2 style="color:var(--blue-dalian);margin-bottom:4px;">' + message + '</h2>';
    html += '</div>';

    // 统计
    html += '<div class="card" style="margin-top:24px;animation:fadeInUp 0.8s ease 0.2s both;">';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">';
    html += '<div><div style="color:var(--grey-light);font-size:0.9rem;">答对</div><div style="font-size:1.8rem;font-weight:700;color:var(--green-seaweed);">' + result.score + '/' + result.total + '</div></div>';
    html += '<div><div style="color:var(--grey-light);font-size:0.9rem;">正确率</div><div style="font-size:1.8rem;font-weight:700;color:var(--blue-dalian);">' + result.accuracy + '%</div></div>';
    html += '<div><div style="color:var(--grey-light);font-size:0.9rem;">用时</div><div style="font-size:1.8rem;font-weight:700;color:var(--grey-reef);">' + formatTime(result.elapsed) + '</div></div>';
    html += '<div><div style="color:var(--grey-light);font-size:0.9rem;">获得金币</div><div style="font-size:1.8rem;font-weight:700;color:var(--gold-sand);">+🪙 ' + result.coins + '</div></div>';
    html += '</div></div>';

    // ====== 错题解析面板 ======
    if (result.wrongAnswers && result.wrongAnswers.length > 0) {
      html += '<div style="margin-top:24px;animation:fadeInUp 1s ease 0.4s both;">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">';
      html += '<h3 style="color:var(--red-coral);">❌ 错题解析（' + result.wrongAnswers.length + '题）</h3>';
      html += '</div>';
      html += '<div style="max-height:350px;overflow-y:auto;border-radius:12px;border:2px solid var(--red-light);">';

      for (var wi = 0; wi < result.wrongAnswers.length; wi++) {
        var wrong = result.wrongAnswers[wi];
        var userAnswerText = wrong.userAnswer;
        var correctAnswerText = wrong.answer;

        // 选择题显示选项文本
        if (wrong.options && Array.isArray(wrong.options)) {
          if (typeof wrong.userAnswer === 'number' && wrong.userAnswer >= 0 && wrong.userAnswer < wrong.options.length) {
            userAnswerText = wrong.options[wrong.userAnswer];
          }
          if (typeof wrong.answer === 'number' && wrong.answer >= 0 && wrong.answer < wrong.options.length) {
            correctAnswerText = wrong.options[wrong.answer];
          }
        }

        // 判断题显示文本
        if (wrong.type === 'judge') {
          correctAnswerText = wrong.answer ? '对 (✓)' : '错 (✗)';
        }

        html += '<div class="card" style="margin:0;border-radius:0;border-bottom:1px solid var(--grey-card);border-left:4px solid var(--red-coral);padding:14px;">';
        html += '<div style="font-weight:600;color:var(--grey-reef);margin-bottom:6px;">#' + (wi + 1) + ' ' + escapeHtml(wrong.question) + '</div>';

        // 选择题：显示所有选项
        if (wrong.options && Array.isArray(wrong.options)) {
          var labels = ['A', 'B', 'C', 'D', 'E', 'F'];
          html += '<div style="font-size:0.85rem;color:var(--grey-light);margin-bottom:8px;">';
          for (var oi = 0; oi < wrong.options.length; oi++) {
            var isUser = (oi === parseInt(wrong.userAnswer));
            var isCorrect = (oi === parseInt(wrong.answer));
            var style = '';
            if (isUser && !isCorrect) style = 'color:var(--red-coral);text-decoration:line-through;';
            else if (isCorrect) style = 'color:var(--green-seaweed);font-weight:700;';
            html += '<div style="' + style + '">' + labels[oi] + '. ' + escapeHtml(String(wrong.options[oi])) + (isCorrect ? ' ✅' : '') + (isUser && !isCorrect ? ' ❌' : '') + '</div>';
          }
          html += '</div>';
        }

        html += '<div style="display:flex;gap:16px;font-size:0.9rem;flex-wrap:wrap;">';
        html += '<span style="color:var(--red-coral);">你的答案：<strong>' + escapeHtml(String(userAnswerText)) + '</strong></span>';
        html += '<span style="color:var(--green-seaweed);">正确答案：<strong>' + escapeHtml(String(correctAnswerText)) + '</strong></span>';
        html += '</div>';
        if (wrong.explain) {
          html += '<div style="margin-top:6px;font-size:0.85rem;color:var(--blue-dalian);background:var(--blue-pale);padding:6px 10px;border-radius:6px;">💡 ' + escapeHtml(wrong.explain) + '</div>';
        }
        html += '<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px;margin-top:8px;" onclick="MathApp._askDeepSeek(\'' + escapeQuote(wrong.question) + '\')">🤖 问DeepSeek</button>';
        html += '</div>';
      }

      html += '</div>';

      // 加入错题训练营按钮
      html += '<div style="text-align:center;margin-top:12px;">';
      html += '<button class="btn btn-danger" onclick="MathApp.navigate(\'#wrongcamp\')" style="font-size:1rem;">📝 加入错题训练营</button>';
      html += '</div>';

      html += '</div>';
    }

    // 按钮
    html += '<div style="margin-top:30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fadeInUp 1s ease 0.5s both;">';
    html += '<button class="btn btn-primary" onclick="MathReward._retry()">🔄 再来一次</button>';
    html += '<button class="btn btn-secondary" onclick="MathReward._backToMap()">🗺️ 返回地图</button>';
    if (result.chapterId < 6) {
      html += '<button class="btn btn-gold" onclick="MathReward._nextChapter(' + result.chapterId + ')">▶ 下一章</button>';
    }
    html += '</div>';

    html += '</div>';
    page.innerHTML = html;
  }

  function formatTime(seconds) {
    if (seconds < 60) return seconds + '秒';
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + '分' + s + '秒';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeQuote(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  // ====== 操作 ======
  function _retry() {
    var session = MathQuiz.getSession();
    if (session) {
      location.reload();
    }
    // fallback
    MathApp.navigate('#quiz/' + (session ? session.chapterId : 1));
  }

  function _backToMap() {
    MathApp.navigate('#map');
  }

  function _nextChapter(currentId) {
    MathApp.navigate('#story/' + (currentId + 1));
  }

  // ====== 导出 ======
  var api = { renderRewardPage: renderRewardPage, _retry: _retry, _backToMap: _backToMap, _nextChapter: _nextChapter };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  global.MathReward = api;

})(typeof window !== 'undefined' ? window : global);
