/** 单元4：观察物体 — 生成题模板 */
(function() {
  if (typeof MathGenerator === 'undefined') return;
  var G = MathGenerator;

  G.registerTemplate(4, 'choice', { name: '三视图选择', generate: function() {
    var count = Math.floor(Math.random()*5)+3;
    var views = ['从正面看','从上面看','从左面看'];
    var n = [count, count-1, count+1, Math.floor(count/2)];
    for(var i=n.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=n[i];n[i]=n[j];n[j]=t;}
    return { question: '一个立体图形由'+count+'个小正方体搭成，从正面看至少能看到（ ）个正方形',
      answer: String(Math.min(n[0],n[1],n[2])), distractors: [String(n[1]),String(n[2]),String(n[3])],
      explain: '从不同方向看到的小正方形数量不同，取决于摆放方式' };
  }});

  G.registerTemplate(4, 'fill', { name: '数正方体个数', generate: function() {
    var count = Math.floor(Math.random()*6)+4;
    return { question: '一个立体图形由若干个同样大的小正方体搭成，从上面看有'+count+'个正方形。这个立体图形至少用了（ ）个小正方体',
      answer: String(count), explain: '从上面看每个位置至少有一个正方体，所以至少'+count+'个' };
  }});

  G.registerTemplate(4, 'judge', { name: '视图判断', generate: function() {
    var qs = ['同一物体从不同方向观察，看到的形状一定相同','从上面看和从正面看可能看到相同数量的正方形'];
    var ans = [false, true];
    var i = Math.floor(Math.random()*2);
    return { question: qs[i]+' （ ）', answer: ans[i], explain: ans[i]?'正确':'错误，不同方向看到的形状通常不同' };
  }});

  G.registerTemplate(4, 'speed', { name: '空间想象速答', generate: function() {
    var n = Math.floor(Math.random()*5)+3;
    return { question: n+'个相同的小正方体排成一排，从正面能看到（ ）个正方形',
      options: [String(n), String(n-1), String(1), String(n+1)],
      answer: 0, time_limit: 15, explain: '排成一排时正面能看到全部'+n+'个' };
  }});
})();
