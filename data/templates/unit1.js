/**
 * 单元1：小数的意义与加减法 — 生成题模板
 * 在浏览器中由 index.html 加载后自动注册
 */
(function() {
  if (typeof MathGenerator === 'undefined') return;

  // === 选择题模板 ===
  MathGenerator.registerTemplate(1, 'choice', {
    name: '小数表示',
    generate: function() {
      var tenths = Math.floor(Math.random() * 9) + 1;
      var hundredths = Math.floor(Math.random() * 9) + 1;
      var val = (tenths / 10 + hundredths / 100).toFixed(2);
      return {
        question: val + ' 里面有（ ）个0.01',
        answer: String(tenths * 10 + hundredths),
        distractors: [
          String(tenths + hundredths),
          String(tenths),
          String(tenths * 10 + hundredths + 1)
        ],
        explain: val + ' = ' + (tenths * 10 + hundredths) + '个0.01'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'choice', {
    name: '小数比大小',
    generate: function() {
      var a = (Math.random() * 20).toFixed(2);
      var b = (Math.random() * 20).toFixed(2);
      var choices = [a, b];
      // 加入两个接近的干扰数
      choices.push((parseFloat(a) + 0.1).toFixed(2));
      choices.push((parseFloat(b) - 0.1).toFixed(2));
      // 排序
      choices.sort(function(x, y) { return parseFloat(x) - parseFloat(y); });
      return {
        question: '下面四个数中，最大的是（ ）',
        answer: choices[3],
        distractors: [choices[0], choices[1], choices[2]],
        explain: '比较小数大小：先比整数部分，再依次比十分位、百分位'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'choice', {
    name: '小数与分数互化',
    generate: function() {
      var numerator = Math.floor(Math.random() * 8) + 1;
      var denominators = [2, 5, 10, 100];
      var denom = denominators[Math.floor(Math.random() * denominators.length)];
      var decimal = (numerator / denom).toFixed(denom === 100 ? 2 : 1);
      return {
        question: numerator + '/' + denom + ' 用小数表示是（ ）',
        answer: String(parseFloat(decimal)),
        distractors: [
          (numerator / (denom * 2)).toFixed(2),
          (numerator * denom / 10).toFixed(1),
          ((numerator + 1) / denom).toFixed(2)
        ],
        explain: numerator + '/' + denom + ' = ' + numerator + '÷' + denom + ' = ' + parseFloat(decimal)
      };
    }
  });

  // === 填空题模板 ===
  MathGenerator.registerTemplate(1, 'fill', {
    name: '小数加法填空',
    generate: function() {
      var a = (Math.random() * 30 + 1).toFixed(2);
      var b = (Math.random() * 30 + 1).toFixed(2);
      return {
        question: a + ' + ' + b + ' = ?',
        answer: (parseFloat(a) + parseFloat(b)).toFixed(2),
        explain: '小数点对齐，从低位向高位逐位相加'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'fill', {
    name: '小数减法填空',
    generate: function() {
      var a = (Math.random() * 30 + 5).toFixed(2);
      var b = (Math.random() * parseFloat(a) * 0.8 + 1).toFixed(2);
      return {
        question: a + ' - ' + b + ' = ?',
        answer: (parseFloat(a) - parseFloat(b)).toFixed(2),
        explain: '小数点对齐，不够减时向前一位借1当10'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'fill', {
    name: '单位换算填空',
    generate: function() {
      var yuan = Math.floor(Math.random() * 20) + 1;
      var jiao = Math.floor(Math.random() * 9) + 1;
      return {
        question: yuan + '元' + jiao + '角 = ( )元',
        answer: (yuan + jiao / 10).toFixed(1),
        explain: '1角=0.1元，' + jiao + '角=' + (jiao/10).toFixed(1) + '元'
      };
    }
  });

  // === 计算题模板 ===
  MathGenerator.registerTemplate(1, 'calc', {
    name: '购物计算',
    generate: function() {
      var items = ['笔记本', '铅笔', '橡皮', '尺子', '文具盒', '水彩笔'];
      var item = items[Math.floor(Math.random() * items.length)];
      var price = (Math.random() * 30 + 3).toFixed(2);
      return {
        question: item + '每件' + price + '元，买1件，付50元，应找回多少元？',
        answer: (50 - parseFloat(price)).toFixed(2),
        type: 'word',
        explain: '50 - ' + price + ' = ' + (50 - parseFloat(price)).toFixed(2) + '（元）'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'calc', {
    name: '小数加法竖式',
    generate: function() {
      var a = (Math.random() * 40 + 5).toFixed(2);
      var b = (Math.random() * 40 + 5).toFixed(2);
      return {
        question: '用竖式计算：' + a + ' + ' + b,
        answer: (parseFloat(a) + parseFloat(b)).toFixed(2),
        type: 'vertical',
        explain: '小数点对齐，从低位加起，满十进一'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'calc', {
    name: '小数减法竖式',
    generate: function() {
      var a = (Math.random() * 40 + 10).toFixed(2);
      var b = (Math.random() * parseFloat(a) + 1).toFixed(2);
      return {
        question: '用竖式计算：' + a + ' - ' + b,
        answer: (parseFloat(a) - parseFloat(b)).toFixed(2),
        type: 'vertical',
        explain: '小数点对齐，不够减向高位借1当10'
      };
    }
  });

  // === 判断题模板 ===
  MathGenerator.registerTemplate(1, 'judge', {
    name: '小数大小判断',
    generate: function() {
      var a = (Math.random() * 10).toFixed(1);
      var b = parseFloat(a) + 0.1;
      return {
        question: a + ' < ' + b.toFixed(1) + ' （ ）',
        answer: true,
        explain: a + ' 确实小于 ' + b.toFixed(1) + '，结论正确'
      };
    }
  });

  MathGenerator.registerTemplate(1, 'judge', {
    name: '小数末尾0判断',
    generate: function() {
      var a = (Math.random() * 5 + 1).toFixed(1);
      var same = Math.random() > 0.5;
      if (same) {
        return {
          question: a + ' = ' + parseFloat(a).toFixed(2) + ' （ ）',
          answer: true,
          explain: '小数末尾的0不改变小数大小，' + a + ' = ' + parseFloat(a).toFixed(2)
        };
      } else {
        return {
          question: a + ' > ' + (parseFloat(a) - 0.1).toFixed(1) + ' （ ）',
          answer: true,
          explain: a + ' > ' + (parseFloat(a) - 0.1).toFixed(1) + '，结论正确'
        };
      }
    }
  });

  // === 连线题模板 ===
  MathGenerator.registerTemplate(1, 'match', {
    name: '算式与结果配对',
    generate: function() {
      return {
        question: '将左边的算式与右边正确的结果连起来',
        left_items: ['3.25 + 1.8', '5.6 - 2.3', '0.7 + 0.56', '4.0 - 2.88'],
        right_items: ['5.05', '3.3', '1.26', '1.12'],
        pairs: [0, 1, 2, 3],
        explain: '逐题计算即可配对'
      };
    }
  });

  // === 速答题模板 ===
  MathGenerator.registerTemplate(1, 'speed', {
    name: '速算小数加减',
    generate: function() {
      var ops = ['+', '-'];
      var op = ops[Math.floor(Math.random() * 2)];
      var a = (Math.random() * 20 + 1).toFixed(1);
      var b;
      if (op === '-') {
        b = (Math.random() * parseFloat(a) + 1).toFixed(1);
      } else {
        b = (Math.random() * 10 + 0.5).toFixed(1);
      }
      var result = op === '+' ? (parseFloat(a) + parseFloat(b)) : (parseFloat(a) - parseFloat(b));
      var correctStr = String(parseFloat(result.toFixed(2)));
      // 生成干扰选项
      var dists = [
        String(parseFloat((result + 0.1).toFixed(2))),
        String(parseFloat((result - 0.1).toFixed(2))),
        String(parseFloat((result + 1).toFixed(2)))
      ];
      var options = [correctStr].concat(dists);
      // 打乱
      for (var i = options.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = options[i]; options[i] = options[j]; options[j] = tmp;
      }
      return {
        question: a + ' ' + op + ' ' + b + ' = ?',
        options: options,
        answer: correctStr,
        time_limit: 15,
        explain: '快速心算：' + a + ' ' + op + ' ' + b + ' = ' + correctStr
      };
    }
  });

  MathGenerator.registerTemplate(1, 'speed', {
    name: '单位换算速答',
    generate: function() {
      var cm = Math.floor(Math.random() * 200) + 5;
      var m = (cm / 100).toFixed(2);
      var correctStr = String(parseFloat(m));
      var options = [correctStr, (cm / 10).toFixed(2), (cm / 1000).toFixed(3), (cm * 100).toString()];
      for (var i = options.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = options[i]; options[i] = options[j]; options[j] = tmp;
      }
      return {
        question: cm + '厘米 = ( )米',
        options: options,
        answer: correctStr,
        time_limit: 12,
        explain: '1米=100厘米，' + cm + '÷100=' + m + '米'
      };
    }
  });

})();
