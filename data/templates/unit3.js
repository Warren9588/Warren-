/** 单元3：小数乘法 — 生成题模板 */
(function() {
  if (typeof MathGenerator === 'undefined') return;
  var G = MathGenerator;

  G.registerTemplate(3, 'choice', { name: '小数点位置', generate: function() {
    var a = (Math.random()*8+2).toFixed(1), b = Math.floor(Math.random()*8)+2;
    var p = parseFloat(a)*b, correct = parseFloat(p.toFixed(2));
    return { question: a+' × '+b+' 的积是几位小数？', answer: String(1),
      distractors: ['0位','2位','3位'], explain: a+'有1位小数，乘整数后积保留1位小数' };
  }});

  G.registerTemplate(3, 'fill', { name: '小数×整数', generate: function() {
    var a = (Math.random()*10+1).toFixed(2), b = Math.floor(Math.random()*15)+2;
    return { question: a+' × '+b+' = ?', answer: (parseFloat(a)*b).toFixed(2),
      explain: a+' × '+b+' = '+(parseFloat(a)*b).toFixed(2) };
  }});

  G.registerTemplate(3, 'calc', { name: '竖式计算', generate: function() {
    var a = (Math.random()*20+2).toFixed(2), b = (Math.random()*10+1).toFixed(1);
    return { question: '用竖式计算：'+a+' × '+b, answer: (parseFloat(a)*parseFloat(b)).toFixed(3),
      type:'vertical', explain: '先按整数乘，再点小数点' };
  }});

  G.registerTemplate(3, 'judge', { name: '乘法规律判断', generate: function() {
    var truths = ['一个数乘大于1的数，积大于原数','小数乘法中积的小数位数等于因数小数位数之和'];
    var falses = ['小数乘法中积一定小于1','整数乘法运算定律不能用于小数乘法'];
    var isTrue = Math.random()>0.5;
    var q = isTrue ? truths[Math.floor(Math.random()*2)] : falses[Math.floor(Math.random()*2)];
    return { question: q+' （ ）', answer: isTrue, explain: isTrue?'正确':'错误' };
  }});

  G.registerTemplate(3, 'speed', { name: '速算小数乘法', generate: function() {
    var a = (Math.random()*5+0.5).toFixed(1), b = Math.floor(Math.random()*9)+2;
    var ans = (parseFloat(a)*b).toFixed(1);
    return { question: a+' × '+b+' = ?',
      options: [ans, (parseFloat(ans)+0.5).toFixed(1), (parseFloat(ans)-0.3).toFixed(1), (parseFloat(ans)+1).toFixed(1)],
      answer: 0, time_limit: 20, explain: a+'×'+b+'='+ans };
  }});
})();
