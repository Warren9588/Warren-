/**
 * story.js — 场景故事引入页
 * 每单元开始前的故事动画和场景介绍
 */

(function(global) {
  'use strict';

  function renderStoryPage(chapterId) {
    var page = document.getElementById('page-story');
    if (!page) return;

    // 获取章节数据
    var chapter = getChapterById(chapterId);
    if (!chapter) {
      page.innerHTML = '<div class="container"><p>章节数据加载中...</p></div>';
      return;
    }

    // 场景图片映射
    var sceneImages = {
      1: 'assets/scenes/mall.webp',
      2: 'assets/scenes/square.webp',
      3: 'assets/scenes/port.webp',
      4: 'assets/scenes/museum.webp',
      5: 'assets/scenes/tram.webp',
      6: 'assets/scenes/weather.webp'
    };

    var html = '<div class="container" style="max-width:750px;text-align:center;">';
    html += '<div id="story-scene" style="animation:fadeInUp 1s ease;">';

    // 场景插画
    html += '<div style="margin-bottom:20px;border-radius:20px;overflow:hidden;box-shadow:var(--shadow-card);">';
    html += '<img src="' + (sceneImages[chapterId] || '') + '" alt="' + chapter.landmark + '" '
      + 'style="width:100%;max-height:350px;object-fit:cover;display:block;" '
      + 'onerror="this.style.display=\'none\'">';
    html += '</div>';

    html += '<h1 style="color:var(--blue-dalian);font-size:1.8rem;margin-bottom:4px;">第' + chapterId + '章</h1>';
    html += '<h2 style="color:var(--grey-reef);font-size:1.4rem;margin-bottom:4px;">' + chapter.title + '</h2>';
    html += '<div style="color:var(--gold-sand);font-size:1.1rem;margin-bottom:16px;">📍 ' + chapter.landmark + '</div>';

    // 故事文字逐句出现
    var intro = chapter.story_intro || '';
    html += '<div id="story-text" style="background:var(--white-pure);border-radius:16px;padding:24px;box-shadow:var(--shadow-card);line-height:2;font-size:1.15rem;color:var(--grey-reef);text-align:left;margin-bottom:30px;min-height:100px;">';
    html += '<p id="story-line" style="margin:0;"></p>';
    html += '</div>';

    // 知识点标签
    if (chapter.knowledge_points) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;">';
      for (var i = 0; i < chapter.knowledge_points.length; i++) {
        html += '<span style="background:var(--blue-pale);color:var(--blue-dalian);padding:4px 12px;border-radius:20px;font-size:0.85rem;">' + chapter.knowledge_points[i] + '</span>';
      }
      html += '</div>';
    }

    html += '<button id="story-start-btn" class="btn btn-primary" style="font-size:1.2rem;padding:14px 48px;display:none;">🚀 开始答题！</button>';
    html += '</div>';
    html += '</div>';

    page.innerHTML = html;

    // 启动打字机效果
    typeWriter(intro, function() {
      var btn = document.getElementById('story-start-btn');
      if (btn) btn.style.display = 'inline-flex';
    });

    // 绑定开始按钮
    setTimeout(function() {
      var btn = document.getElementById('story-start-btn');
      if (btn) {
        btn.addEventListener('click', function() {
          MathApp.navigate('#quiz/' + chapterId);
        });
      }
    }, 100);
  }

  // ====== 打字机效果 ======
  function typeWriter(text, callback) {
    var el = document.getElementById('story-line');
    if (!el) return;

    var i = 0;
    var speed = 60;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }

    type();
  }

  function getChapterById(id) {
    if (typeof MathApp !== 'undefined' && MathApp._chapterData) {
      var chapters = MathApp._chapterData.chapters || [];
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].id === parseInt(id)) return chapters[i];
      }
    }
    return null;
  }

  // ====== 导出 ======
  var api = { renderStoryPage: renderStoryPage, getChapterById: getChapterById };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  global.MathStory = api;

})(typeof window !== 'undefined' ? window : global);
