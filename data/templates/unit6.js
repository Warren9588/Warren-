/** 单元6：数据的表示与分析 — 生成题模板 */
(function() {
  if (typeof MathGenerator === 'undefined') return;
  var G = MathGenerator;

  G.registerTemplate(6, 'choice', { name: '统计图选择', generate: function() {
    return { question: '想清楚地看出大连一周温度的变化趋势，最好用（ ）', answer: '折线统计图',
      distractors: ['条形统计图','统计表','扇形统计图'],
      explain: '折线统计图能清晰地反映数量的增减变化趋势' };
  }});

  G.registerTemplate(6, 'fill', { name: '平均数计算', generate: function() {
    var n = Math.floor(Math.random()*5)+4;
    var nums = []; var sum = 0;
    for(var i=0;i<n;i++){ var v = Math.floor(Math.random()*40)+20; nums.push(v); sum+=v; }
    var avg = Math.round(sum/n*10)/10;
    return { question: '一组数据：'+nums.join('、')+'，平均数是（ ）', answer: String(avg),
      explain: '总和='+sum+'，平均数='+sum+'÷'+n+'='+avg };
  }});

  G.registerTemplate(6, 'judge', { name: '数据判断', generate: function() {
    return { question: '平均数一定比这组数据中的最大数小'+(Math.random()>0.5?'':'或相等')+' （ ）', answer: true,
      explain: '平均数介于最大数和最小数之间（可能等于最大数，所有数相同时）' };
  }});

  G.registerTemplate(6, 'speed', { name: '快速求平均数', generate: function() {
    var a = Math.floor(Math.random()*30)+10, b = Math.floor(Math.random()*30)+10, c = Math.floor(Math.random()*30)+10;
    var avg = Math.round((a+b+c)/3);
    return { question: '('+a+' + '+b+' + '+c+') ÷ 3 = ?',
      options: [String(avg), String(avg+1), String(avg-1), String(Math.round((a+b+c)/2))],
      answer: 0, time_limit: 20, explain: '('+a+'+'+b+'+'+c+')÷3='+avg };
  }});
})();
