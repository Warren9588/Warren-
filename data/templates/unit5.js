/** 单元5：认识方程 — 生成题模板 */
(function() {
  if (typeof MathGenerator === 'undefined') return;
  var G = MathGenerator;

  G.registerTemplate(5, 'choice', { name: '方程识别', generate: function() {
    var qs = ['x+5=12','3x>10','2+3=5','4x-2=10'];
    var equ = [true,false,false,true];
    var i = Math.floor(Math.random()*4);
    return { question: '"'+qs[i]+'" 是方程吗？（ ）', answer: equ[i]?'是':'不是',
      distractors: ['是','不是','无法判断'], explain: equ[i]?'含有未知数的等式，是方程':'不是等式或不含未知数，不是方程' };
  }});

  G.registerTemplate(5, 'fill', { name: '解方程', generate: function() {
    var a = Math.floor(Math.random()*8)+2, b = Math.floor(Math.random()*20)+5;
    var c = a*(Math.floor(Math.random()*10)+3), x = (c-b)/a;
    return { question: '解方程：'+a+'x + '+b+' = '+c+'，x = ?',
      answer: String(parseFloat(x.toFixed(1))), explain: a+'x='+(c-b)+'，x='+(c-b)+'÷'+a+'='+parseFloat(x.toFixed(1)) };
  }});

  G.registerTemplate(5, 'calc', { name: '应用题列方程', generate: function() {
    var x = Math.floor(Math.random()*20)+5;
    var extra = Math.floor(Math.random()*10)+2;
    return { question: '小明有x元，小红比他多'+extra+'元，两人共有'+(2*x+extra)+'元。小明有多少元？',
      answer: String(x), type:'word', explain: 'x+(x+'+extra+')='+(2*x+extra)+'，2x='+(2*x)+'，x='+x };
  }});

  G.registerTemplate(5, 'judge', { name: '等式性质判断', generate: function() {
    var qs = ['等式两边同时加上同一个数，等式仍然成立','方程一定是等式，等式不一定是方程'];
    var ans = [true, true];
    var i = Math.floor(Math.random()*2);
    return { question: qs[i]+' （ ）', answer: ans[i], explain: ans[i]?'正确':'错误' };
  }});

  G.registerTemplate(5, 'speed', { name: '快速解方程', generate: function() {
    var a = Math.floor(Math.random()*9)+2, b = Math.floor(Math.random()*20)+3;
    return { question: 'x + '+b+' = '+(a+b)+'，x = ?',
      options: [String(a), String(b), String(a+b), String(a-b)],
      answer: 0, time_limit: 15, explain: 'x='+(a+b)+'-'+b+'='+a };
  }});
})();
