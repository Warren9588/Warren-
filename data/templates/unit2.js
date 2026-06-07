/** 单元2：认识三角形和四边形 — 生成题模板 */
(function() {
  if (typeof MathGenerator === 'undefined') return;
  var G = MathGenerator;

  G.registerTemplate(2, 'choice', { name: '三角形分类', generate: function() {
    var types = [{n:'锐角三角形', d:'三个角都小于90度'},{n:'直角三角形', d:'有一个角等于90度'},{n:'钝角三角形', d:'有一个角大于90度'}];
    var t = types[Math.floor(Math.random()*3)];
    return { question: '有一个角是91度的三角形是（ ）', answer: '钝角三角形',
      distractors: ['锐角三角形','直角三角形','等边三角形'], explain: '91°>90°，是钝角三角形' };
  }});

  G.registerTemplate(2, 'choice', { name: '三角形内角和', generate: function() {
    var a = Math.floor(Math.random()*70)+30, b = Math.floor(Math.random()*60)+20, c = 180-a-b;
    return { question: '三角形中两个角分别是'+a+'°和'+b+'°，第三个角是（ ）°', answer: String(c),
      distractors: [String(c+5), String(c-5), String(180-a)], explain: '三角形内角和=180°，180-'+a+'-'+b+'='+c+'°' };
  }});

  G.registerTemplate(2, 'fill', { name: '角度计算', generate: function() {
    var a = Math.floor(Math.random()*50)+40, b = Math.floor(Math.random()*40)+30;
    return { question: '等腰三角形顶角是'+a+'°，它的一个底角是（ ）°', answer: String(Math.round((180-a)/2)),
      explain: '底角=(180-顶角)÷2=(180-'+a+')÷2='+Math.round((180-a)/2)+'°' };
  }});

  G.registerTemplate(2, 'judge', { name: '图形性质判断', generate: function() {
    var truths = ['三角形具有稳定性','平行四边形容易变形','等边三角形三个角都相等','正方形是特殊的长方形'];
    var falses = ['三角形没有稳定性','平行四边形是轴对称图形','直角三角形只有一个锐角','四边形内角和是180度'];
    var isTrue = Math.random()>0.5;
    var q = isTrue ? truths[Math.floor(Math.random()*4)] : falses[Math.floor(Math.random()*4)];
    return { question: q+' （ ）', answer: isTrue, explain: isTrue?'判断正确':'判断错误，与数学事实不符' };
  }});

  G.registerTemplate(2, 'speed', { name: '图形快速判断', generate: function() {
    var qs = ['三角形内角和是( )°','等边三角形每个角是( )°','四边形内角和是( )°'];
    var ans = ['180','60','360'];
    var i = Math.floor(Math.random()*3);
    return { question: qs[i], options: [ans[i], String(parseInt(ans[i])+10), String(parseInt(ans[i])-10), String(parseInt(ans[i])+20)],
      answer: 0, time_limit: 12, explain: qs[i].replace('( )',ans[i]) };
  }});
})();
