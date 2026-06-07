#!/usr/bin/env python3
"""生成北师大版四年级下册 unit2-unit6 数学题库"""

import json
import os

OUTPUT_DIR = "data/questions"

# ============================================================
# 单元2：认识三角形和四边形
# ============================================================
unit2 = {
    "chapter_id": 2,
    "title": "认识三角形和四边形",
    "questions": {
        "choice": [
            {
                "id": "c2_c_01",
                "question": "三角形按角分类可以分为（ ）",
                "options": ["锐角、直角、钝角三角形", "等腰、等边、不等边三角形", "直边、曲边、折边三角形", "大角、小角、等角三角形"],
                "answer": 0,
                "explain": "按角分类：锐角三角形（三个角都小于90°）、直角三角形（一个角等于90°）、钝角三角形（一个角大于90°）",
                "difficulty": 1
            },
            {
                "id": "c2_c_02",
                "question": "下面哪组线段能围成三角形？",
                "options": ["3cm、4cm、5cm", "2cm、2cm、5cm", "1cm、3cm、5cm", "2cm、4cm、7cm"],
                "answer": 0,
                "explain": "三角形任意两边之和大于第三边。3+4>5、3+5>4、4+5>3，都成立；其他选项不满足",
                "difficulty": 2
            },
            {
                "id": "c2_c_03",
                "question": "一个三角形中至少有（ ）个锐角",
                "options": ["2个", "1个", "3个", "0个"],
                "answer": 0,
                "explain": "三角形内角和180°，最多一个钝角或直角，所以至少有两个锐角",
                "difficulty": 2
            },
            {
                "id": "c2_c_04",
                "question": "等腰三角形中，两条相等的边叫做（ ）",
                "options": ["腰", "底", "斜边", "直角边"],
                "answer": 0,
                "explain": "等腰三角形两条相等的边称为腰，第三条边称为底",
                "difficulty": 1
            },
            {
                "id": "c2_c_05",
                "question": "星海广场的华表底座近似正四边形，它的内角和是（ ）",
                "options": ["360°", "180°", "540°", "270°"],
                "answer": 0,
                "explain": "四边形内角和 = (4-2)×180° = 360°",
                "difficulty": 1
            },
            {
                "id": "c2_c_06",
                "question": "下列说法正确的是（ ）",
                "options": ["等边三角形一定是锐角三角形", "直角三角形一定是等腰三角形", "钝角三角形一定不是等腰三角形", "等边三角形可能是直角三角形"],
                "answer": 0,
                "explain": "等边三角形每个角都是60°，三个角都小于90°，所以一定是锐角三角形",
                "difficulty": 2
            },
            {
                "id": "c2_c_07",
                "question": "一个三角形中，如果两个内角的和是100°，那么第三个角是（ ）",
                "options": ["80°", "100°", "60°", "无法确定"],
                "answer": 0,
                "explain": "三角形内角和180°，第三个角 = 180° - 100° = 80°",
                "difficulty": 2
            },
            {
                "id": "c2_c_08",
                "question": "把一张长方形纸沿对角线剪开，得到的两个三角形都是（ ）",
                "options": ["直角三角形", "锐角三角形", "钝角三角形", "等边三角形"],
                "answer": 0,
                "explain": "长方形的角是90°，沿对角线剪开后每个三角形都有一个90°角，所以是直角三角形",
                "difficulty": 1
            },
            {
                "id": "c2_c_09",
                "question": "有两根小棒分别长4cm和7cm，要围成三角形，第三根小棒可能是（ ）",
                "options": ["4cm", "2cm", "11cm", "12cm"],
                "answer": 0,
                "explain": "第三边必须满足：7-4 < x < 7+4，即3 < x < 11，4cm满足条件",
                "difficulty": 3
            }
        ],
        "fill": [
            {
                "id": "c2_f_01",
                "question": "三角形内角和等于（ ）度",
                "answer": "180",
                "tolerance": 0,
                "explain": "所有三角形的内角和都是180度",
                "difficulty": 1
            },
            {
                "id": "c2_f_02",
                "question": "一个直角三角形中，一个锐角是35°，另一个锐角是（ ）°",
                "answer": "55",
                "tolerance": 0,
                "explain": "直角三角形两个锐角和为90°，90°-35°=55°",
                "difficulty": 1
            },
            {
                "id": "c2_f_03",
                "question": "等腰三角形的一个底角是40°，则顶角是（ ）°",
                "answer": "100",
                "tolerance": 0,
                "explain": "底角相等，两个底角共80°，顶角=180°-80°=100°",
                "difficulty": 2
            },
            {
                "id": "c2_f_04",
                "question": "一个等腰三角形的顶角是80°，它的底角是（ ）°",
                "answer": "50",
                "tolerance": 0,
                "explain": "(180°-80°)÷2=50°，两个底角各50°",
                "difficulty": 2
            },
            {
                "id": "c2_f_05",
                "question": "用3根小棒围三角形，长度分别是6cm、6cm、6cm，这是一个（ ）三角形（填等边/等腰/不等边）",
                "answer": "等边",
                "tolerance": 0,
                "explain": "三条边都相等的是等边三角形",
                "difficulty": 1
            },
            {
                "id": "c2_f_06",
                "question": "平行四边形的（ ）组对边分别平行",
                "answer": "两",
                "tolerance": 0,
                "explain": "平行四边形有两组对边分别平行，这是它的定义",
                "difficulty": 1
            },
            {
                "id": "c2_f_07",
                "question": "长方形和正方形都是特殊的（ ）",
                "answer": "平行四边形",
                "tolerance": 0,
                "explain": "长方形和正方形都满足两组对边分别平行，都是特殊的平行四边形",
                "difficulty": 2
            },
            {
                "id": "c2_f_08",
                "question": "三角形的一条边长8cm，另一条边长3cm，第三条边长最短是（ ）cm（取整数）",
                "answer": "6",
                "tolerance": 0,
                "explain": "第三边 > 8-3=5，且 < 8+3=11。最短整数长度为6cm",
                "difficulty": 3
            },
            {
                "id": "c2_f_09",
                "question": "一个四边形内角和是（ ）°",
                "answer": "360",
                "tolerance": 0,
                "explain": "(4-2)×180°=360°",
                "difficulty": 1
            }
        ],
        "calc": [
            {
                "id": "c2_calc_01",
                "question": "一个三角形三个角的度数比是2:3:4，求最大的角是多少度？",
                "answer": "80",
                "tolerance": 0,
                "explain": "总份数2+3+4=9份，每份180÷9=20°，最大角=20×4=80°",
                "difficulty": 3
            },
            {
                "id": "c2_calc_02",
                "question": "一个等腰三角形顶角是30°，它的底角是多少度？",
                "answer": "75",
                "tolerance": 0,
                "explain": "(180°-30°)÷2=75°",
                "difficulty": 2
            },
            {
                "id": "c2_calc_03",
                "question": "三角形中∠1=55°，∠2=65°，∠3是多少度？这是什么三角形？",
                "answer": "60",
                "tolerance": 0,
                "explain": "∠3=180°-55°-65°=60°，三个角都小于90°，是锐角三角形",
                "difficulty": 2
            },
            {
                "id": "c2_calc_04",
                "question": "五边形内角和是多少度？",
                "answer": "540",
                "tolerance": 0,
                "explain": "(5-2)×180°=540°",
                "difficulty": 2
            },
            {
                "id": "c2_calc_05",
                "question": "直角三角形中，一个锐角比另一个锐角大20°，这两个锐角各是多少度？",
                "answer": "35",
                "tolerance": 0,
                "explain": "两个锐角和为90°，设小角x，则x+(x+20)=90，x=35。答：35°和55°",
                "difficulty": 3
            },
            {
                "id": "c2_calc_06",
                "question": "有轨电车的车窗近似长方形，长1.2米宽0.8米，这个长方形的周长是多少米？",
                "answer": "4",
                "tolerance": 0.01,
                "explain": "(1.2+0.8)×2=4米",
                "difficulty": 2
            }
        ],
        "judge": [
            {
                "id": "c2_j_01",
                "question": "等边三角形的三个角都相等 （ ）",
                "answer": True,
                "explain": "等边三角形三个角都是60°，都相等",
                "difficulty": 1
            },
            {
                "id": "c2_j_02",
                "question": "有一个角是锐角的三角形就是锐角三角形 （ ）",
                "answer": False,
                "explain": "锐角三角形要三个角都是锐角才行，直角三角形也有锐角",
                "difficulty": 2
            },
            {
                "id": "c2_j_03",
                "question": "任意三条线段都能围成一个三角形 （ ）",
                "answer": False,
                "explain": "必须满足任意两边之和大于第三边才行",
                "difficulty": 2
            },
            {
                "id": "c2_j_04",
                "question": "正方形和长方形都是平行四边形 （ ）",
                "answer": True,
                "explain": "正方形和长方形都有两组对边分别平行，属于特殊的平行四边形",
                "difficulty": 1
            },
            {
                "id": "c2_j_05",
                "question": "三角形越大，它的内角和就越大 （ ）",
                "answer": False,
                "explain": "无论三角形大小，内角和始终是180°",
                "difficulty": 2
            },
            {
                "id": "c2_j_06",
                "question": "两个完全一样的三角形可以拼成一个平行四边形 （ ）",
                "answer": True,
                "explain": "形状大小相同的两个三角形沿对应边拼接可组成平行四边形",
                "difficulty": 2
            },
            {
                "id": "c2_j_07",
                "question": "一个等腰三角形一定也是等边三角形 （ ）",
                "answer": False,
                "explain": "等腰三角形只有两条边相等，等边三角形三条边都相等",
                "difficulty": 1
            },
            {
                "id": "c2_j_08",
                "question": "梯形只有一组对边平行 （ ）",
                "answer": True,
                "explain": "梯形的定义就是只有一组对边平行的四边形",
                "difficulty": 2
            }
        ],
        "match": [
            {
                "id": "c2_m_01",
                "question": "将三角形类型与特征配对",
                "left_items": ["三条边都相等", "只有两条边相等", "三条边都不相等", "有一个角是90°"],
                "right_items": ["等边三角形", "等腰三角形", "不等边三角形", "直角三角形"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 1
            },
            {
                "id": "c2_m_02",
                "question": "将四边形与特征配对",
                "left_items": ["两组对边分别平行且四边相等四角为直角", "两组对边分别平行且四角为直角", "两组对边分别平行", "只有一组对边平行"],
                "right_items": ["正方形", "长方形", "平行四边形", "梯形"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 2
            },
            {
                "id": "c2_m_03",
                "question": "将三角形已知条件与第三个角度数配对",
                "left_items": ["∠1=30°,∠2=70°", "∠1=90°,∠2=45°", "∠1=50°,∠2=50°", "∠1=100°,∠2=30°"],
                "right_items": ["80°", "45°", "80°", "50°"],
                "pairs": [0, 1, 0, 2],
                "difficulty": 2
            }
        ],
        "speed": [
            {
                "id": "c2_s_01",
                "question": "三角形内角和是多少度？",
                "options": ["180°", "360°", "90°", "270°"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c2_s_02",
                "question": "等边三角形每个角是多少度？",
                "options": ["60°", "45°", "90°", "30°"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c2_s_03",
                "question": "直角三角形中两锐角和是多少度？",
                "options": ["90°", "180°", "60°", "120°"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c2_s_04",
                "question": "下面哪个不能围成三角形？3,4,?",
                "options": ["8", "5", "6", "2"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c2_s_05",
                "question": "等腰三角形顶角60°，底角多少度？",
                "options": ["60°", "50°", "70°", "55°"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c2_s_06",
                "question": "四边形内角和是多少度？",
                "options": ["360°", "180°", "540°", "270°"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c2_s_07",
                "question": "三角形中有一个110°的角，这个三角形是？",
                "options": ["钝角三角形", "锐角三角形", "直角三角形", "不能确定"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c2_s_08",
                "question": "大连傅家庄海滩有一块三角帆，顶角30°，底角是？",
                "options": ["75°", "150°", "30°", "60°"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c2_s_09",
                "question": "一个三角形三个角分别是50°,60°,70°，这是？",
                "options": ["锐角三角形", "直角三角形", "钝角三角形", "等腰三角形"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c2_s_10",
                "question": "梯形最多有几个直角？",
                "options": ["2个", "1个", "3个", "4个"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            }
        ]
    }
}

# ============================================================
# 单元3：小数乘法
# ============================================================
unit3 = {
    "chapter_id": 3,
    "title": "小数乘法",
    "questions": {
        "choice": [
            {
                "id": "c3_c_01",
                "question": "0.3 × 6 的积是（ ）",
                "options": ["1.8", "0.18", "18", "180"],
                "answer": 0,
                "explain": "0.3×6：先算3×6=18，因数有一位小数，积也有一位小数，所以是1.8",
                "difficulty": 1
            },
            {
                "id": "c3_c_02",
                "question": "下面算式中，积最小的是（ ）",
                "options": ["1.2×0.5", "1.2×1.5", "1.2×2.5", "0.8×0.9"],
                "answer": 0,
                "explain": "分别计算：1.2×0.5=0.6, 1.2×1.5=1.8, 1.2×2.5=3.0, 0.8×0.9=0.72。0.6最小",
                "difficulty": 2
            },
            {
                "id": "c3_c_03",
                "question": "3.25 × 4.2 的积有（ ）位小数",
                "options": ["三位", "两位", "四位", "一位"],
                "answer": 0,
                "explain": "3.25有两位小数，4.2有一位小数，积应有2+1=3位小数（末尾不消除的话）",
                "difficulty": 2
            },
            {
                "id": "c3_c_04",
                "question": "一个数（0除外）乘大于1的数，积比原数（ ）",
                "options": ["大", "小", "相等", "无法确定"],
                "answer": 0,
                "explain": "正数乘大于1的数，积大于原数",
                "difficulty": 1
            },
            {
                "id": "c3_c_05",
                "question": "5.6×2.5 的简便算法是（ ）",
                "options": ["1.4×(4×2.5)", "5.6×2+5.6×0.5", "6×2.5-0.4×2.5", "都可以"],
                "answer": 0,
                "explain": "5.6×2.5 = 1.4×4×2.5 = 1.4×10 = 14，利用了乘法结合律",
                "difficulty": 2
            },
            {
                "id": "c3_c_06",
                "question": "大连有轨电车票价2元，春节涨价0.5倍，现价是（ ）元",
                "options": ["3", "2.5", "1", "4"],
                "answer": 0,
                "explain": "2×(1+0.5)=2×1.5=3元",
                "difficulty": 2
            },
            {
                "id": "c3_c_07",
                "question": "积保留两位小数约是3.85，下面哪个可能是原算式结果？",
                "options": ["3.846", "3.855", "3.840", "3.844"],
                "answer": 0,
                "explain": "3.846四舍五入保留两位小数：看千分位6≥5进1，得3.85",
                "difficulty": 3
            },
            {
                "id": "c3_c_08",
                "question": "0.25×4.78×4 利用运算定律可以简算为（ ）",
                "options": ["(0.25×4)×4.78", "(0.25×4.78)+4", "0.25×(4+4.78)", "不能简算"],
                "answer": 0,
                "explain": "利用乘法交换律和结合律：0.25×4=1，再乘4.78=4.78",
                "difficulty": 2
            }
        ],
        "fill": [
            {
                "id": "c3_f_01",
                "question": "0.6 × 5 = ?",
                "answer": "3",
                "tolerance": 0,
                "explain": "6×5=30，有一位小数，所以是3.0即3",
                "difficulty": 1
            },
            {
                "id": "c3_f_02",
                "question": "2.4 × 0.5 = ?",
                "answer": "1.2",
                "tolerance": 0.01,
                "explain": "24×5=120，因数共2位小数，积为1.20即1.2",
                "difficulty": 1
            },
            {
                "id": "c3_f_03",
                "question": "0.35 × 0.8 = ?",
                "answer": "0.28",
                "tolerance": 0.01,
                "explain": "35×8=280，因数共2+1=3位小数，积为0.280即0.28",
                "difficulty": 2
            },
            {
                "id": "c3_f_04",
                "question": "3.6 × 2 = ?",
                "answer": "7.2",
                "tolerance": 0.01,
                "explain": "36×2=72，因数和为1位小数，积为7.2",
                "difficulty": 1
            },
            {
                "id": "c3_f_05",
                "question": "0.56 × 100 = ?",
                "answer": "56",
                "tolerance": 0,
                "explain": "乘以100相当于小数点向右移动两位",
                "difficulty": 1
            },
            {
                "id": "c3_f_06",
                "question": "4.25 × 0.4 = ?",
                "answer": "1.7",
                "tolerance": 0.01,
                "explain": "425×4=1700，因数共2+1=3位小数，积为1.700即1.7",
                "difficulty": 2
            },
            {
                "id": "c3_f_07",
                "question": "2.5 × 3.2 = ?（用简便方法：2.5×4×0.8）",
                "answer": "8",
                "tolerance": 0.01,
                "explain": "2.5×3.2 = 2.5×4×0.8 = 10×0.8 = 8",
                "difficulty": 2
            },
            {
                "id": "c3_f_08",
                "question": "1.25 × 8.8 = ?（用简便方法）",
                "answer": "11",
                "tolerance": 0.01,
                "explain": "1.25×8.8 = 1.25×(8+0.8) = 10+1 = 11",
                "difficulty": 3
            }
        ],
        "calc": [
            {
                "id": "c3_calc_01",
                "question": "妈妈买了2.5千克苹果，每千克6.4元，需要付多少元？",
                "answer": "16",
                "tolerance": 0.01,
                "explain": "6.4×2.5=16（元）。简算：6.4×2.5=1.6×4×2.5=1.6×10=16",
                "difficulty": 2
            },
            {
                "id": "c3_calc_02",
                "question": "一箱矿泉水有24瓶，每瓶0.55升，这箱矿泉水一共有多少升？",
                "answer": "13.2",
                "tolerance": 0.01,
                "explain": "0.55×24=13.2（升）",
                "difficulty": 2
            },
            {
                "id": "c3_calc_03",
                "question": "大连到沈阳高铁里程约380千米，小明一家往返一次共行驶多少千米？单程0.45元/千米的费用是多少？先求总路程",
                "answer": "760",
                "tolerance": 0,
                "explain": "往返就是380×2=760千米",
                "difficulty": 1
            },
            {
                "id": "c3_calc_04",
                "question": "教室长8.5米，宽6.2米，面积约多少平方米？（保留整数）",
                "answer": "53",
                "tolerance": 0,
                "explain": "8.5×6.2=52.7≈53平方米",
                "difficulty": 2
            },
            {
                "id": "c3_calc_05",
                "question": "0.12×34+0.12×66 = ?（用简便方法计算）",
                "answer": "12",
                "tolerance": 0.01,
                "explain": "乘法分配律：0.12×(34+66)=0.12×100=12",
                "difficulty": 3
            },
            {
                "id": "c3_calc_06",
                "question": "星海广场附近某纪念品商店，明信片每张3.5元，小明买了8张，付了30元，应找回多少元？",
                "answer": "2",
                "tolerance": 0.01,
                "explain": "3.5×8=28元，30-28=2元",
                "difficulty": 2
            },
            {
                "id": "c3_calc_07",
                "question": "食堂每周用大米28.5千克，4周大约用多少千克？（保留整数）",
                "answer": "114",
                "tolerance": 0,
                "explain": "28.5×4=114千克，刚好是整数",
                "difficulty": 1
            }
        ],
        "judge": [
            {
                "id": "c3_j_01",
                "question": "小数乘整数，积的小数位数和因数的小数位数相同 （ ）",
                "answer": True,
                "explain": "如0.3×6=1.8，因数1位小数，积也是1位小数（末尾0已去掉）",
                "difficulty": 1
            },
            {
                "id": "c3_j_02",
                "question": "一个数乘0.9，积一定比这个数小 （ ）",
                "answer": False,
                "explain": "如果这个数是0，积也是0，相等。正数乘小于1的数确实变小",
                "difficulty": 2
            },
            {
                "id": "c3_j_03",
                "question": "2.5×3.2 = 2.5×4×0.8 = 8 （ ）",
                "answer": True,
                "explain": "拆3.2=4×0.8，利用了乘法结合律，计算正确",
                "difficulty": 2
            },
            {
                "id": "c3_j_04",
                "question": "3.14×2.5的积有三位小数 （ ）",
                "answer": True,
                "explain": "3.14两位小数，2.5一位小数，共三位小数。3.14×2.5=7.850=7.85，末尾有0但计算时有三位",
                "difficulty": 2
            },
            {
                "id": "c3_j_05",
                "question": "小数点向右移动一位，数就扩大到原数的10倍 （ ）",
                "answer": True,
                "explain": "小数点右移一位，每位数字的值都乘以10",
                "difficulty": 1
            },
            {
                "id": "c3_j_06",
                "question": "0.25×4.78×4和4.78×(0.25×4)的积相等 （ ）",
                "answer": True,
                "explain": "根据乘法交换律和结合律，两种运算结果相同",
                "difficulty": 2
            },
            {
                "id": "c3_j_07",
                "question": "大于0.6且小于0.8的一位小数只有0.7一个 （ ）",
                "answer": True,
                "explain": "一位小数限定下0.6和0.8之间只有0.7",
                "difficulty": 3
            },
            {
                "id": "c3_j_08",
                "question": "5.8×10.1 = 5.8×10 + 5.8×0.1 （ ）",
                "answer": True,
                "explain": "利用乘法分配律：5.8×10.1 = 5.8×(10+0.1) = 5.8×10+5.8×0.1",
                "difficulty": 3
            }
        ],
        "match": [
            {
                "id": "c3_m_01",
                "question": "将算式与积配对",
                "left_items": ["0.6×5", "2.5×0.4", "0.125×8", "3.2×0.5"],
                "right_items": ["3", "1", "1", "1.6"],
                "pairs": [0, 1, 1, 3],
                "difficulty": 1
            },
            {
                "id": "c3_m_02",
                "question": "将运算定律与简算示例配对",
                "left_items": ["2.5×3.2=2.5×4×0.8", "3.6×2+3.6×8=3.6×10", "0.5×4.7×2=4.7×(0.5×2)", "1.25×8.8=1.25×8+1.25×0.8"],
                "right_items": ["乘法结合律", "乘法分配律", "乘法交换律和结合律", "乘法分配律"],
                "pairs": [0, 1, 2, 1],
                "difficulty": 3
            }
        ],
        "speed": [
            {
                "id": "c3_s_01",
                "question": "0.5 × 6 = ?",
                "options": ["3", "0.3", "30", "0.30"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c3_s_02",
                "question": "0.3 × 0.3 = ?",
                "options": ["0.09", "0.9", "9", "0.6"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c3_s_03",
                "question": "2.5 × 4 = ?",
                "options": ["10", "1", "100", "8.5"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c3_s_04",
                "question": "0.125 × 8 = ?",
                "options": ["1", "0.1", "10", "8.125"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c3_s_05",
                "question": "1.5 × 0.4 = ?",
                "options": ["0.6", "6", "0.06", "60"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c3_s_06",
                "question": "25 × 0.04 = ?",
                "options": ["1", "0.1", "10", "100"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c3_s_07",
                "question": "3.6 + 3.6 + 3.6 + 3.6 + 3.6 = 3.6 × ?",
                "options": ["5", "4", "6", "3.6"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c3_s_08",
                "question": "9.9×7.6最接近下面哪个数？",
                "options": ["76", "7.6", "760", "16"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 3
            }
        ]
    }
}

# ============================================================
# 单元4：观察物体
# ============================================================
unit4 = {
    "chapter_id": 4,
    "title": "观察物体",
    "questions": {
        "choice": [
            {
                "id": "c4_c_01",
                "question": "从正面看一个正方体，看到的形状是（ ）",
                "options": ["正方形", "长方形", "圆形", "三角形"],
                "answer": 0,
                "explain": "正方体每个面都是正方形，从正面看也是正方形",
                "difficulty": 1
            },
            {
                "id": "c4_c_02",
                "question": "观察物体时，从不同的方向看，看到的形状（ ）",
                "options": ["可能不同", "一定相同", "一定不同", "无法判断"],
                "answer": 0,
                "explain": "不同角度看同一个物体，形状可能不同也可能相同（如球体从任何方向看都是圆）",
                "difficulty": 1
            },
            {
                "id": "c4_c_03",
                "question": "两个相同的小正方体摆成一排，从正面看到的是（ ）",
                "options": ["一个长方形（两个正方形横排）", "一个正方形", "一个L形", "无法确定"],
                "answer": 0,
                "explain": "两个正方体横排放置，正面看是两个正方形并排，组成长方形",
                "difficulty": 2
            },
            {
                "id": "c4_c_04",
                "question": "从上面看，下面哪个物体看到的形状和从正面看相同？",
                "options": ["圆柱体", "正方体（各面相同）", "长方体", "圆锥体"],
                "answer": 0,
                "explain": "圆柱体上面看是圆，正面看是长方形，不同。正方体各面相同。长方体不同。圆锥不同。注意：需要仔细分析。正确答案是正方体。",
                "difficulty": 2
            },
            {
                "id": "c4_c_05",

                "question": "用4个相同的小正方体搭成一个立体图形，从正面看是□□（横排两个），从上面看是□□□（横排三个），这个立体图形至少用了几个小正方体？",
                "options": ["4个", "3个", "5个", "6个"],
                "answer": 0,
                "explain": "从上面看有3个位置，正面看只有2列，说明有1列在后方被挡住了，共需4个正方体",
                "difficulty": 3
            },
            {
                "id": "c4_c_06",
                "question": "三视图指的是从哪三个方向观察物体？",
                "options": ["正面、上面、侧面(右面)", "正面、后面、上面", "左面、右面、上面", "正面、左面、后面"],
                "answer": 0,
                "explain": "三视图通常指正视图（正面）、俯视图（上面）和侧视图（右面）",
                "difficulty": 2
            },
            {
                "id": "c4_c_07",
                "question": "大连贝壳博物馆的外形近似半个球体，从上面看它的样子最接近（ ）",
                "options": ["圆形", "正方形", "三角形", "半圆形"],
                "answer": 0,
                "explain": "球体从任何方向看都是圆形，半个球体从上面看也是圆形",
                "difficulty": 2
            },
            {
                "id": "c4_c_08",
                "question": "把3个小正方体堆成一列（竖着放），从正面看到的是（ ）",
                "options": ["竖排三个正方形", "横排三个正方形", "一个正方形", "L形"],
                "answer": 0,
                "explain": "竖着放3个正方体，正面看到的是上中下三个正方形排成一列",
                "difficulty": 1
            }
        ],
        "fill": [
            {
                "id": "c4_f_01",
                "question": "从正方体的（ ）面看都是正方形",
                "answer": "各",
                "tolerance": 0,
                "explain": "正方体六个面都是大小相同的正方形，从任何方向看都是正方形",
                "difficulty": 1
            },
            {
                "id": "c4_f_02",
                "question": "从正面看到一个物体形状是长方形，这个物体可能是（ ）（写出一个即可）",
                "answer": "长方体",
                "tolerance": 0,
                "explain": "长方体从正面看是长方形；也可以是圆柱体",
                "difficulty": 1
            },
            {
                "id": "c4_f_03",
                "question": "用4个相同小正方体搭图形，从正面看到□□□（横排三个），从上面看到□（一个），这可能吗？（填可能/不可能）",
                "answer": "可能",
                "tolerance": 0,
                "explain": "可以。前面放3个一排，后面叠1个——从上往下看时，后面那个被前面挡住了",
                "difficulty": 2
            },
            {
                "id": "c4_f_04",
                "question": "一个立体图形从正面看到□□（横排两个），从上面看到□□（横排两个），最少需要（ ）个小正方体",
                "answer": "2",
                "tolerance": 0,
                "explain": "两个正方体并排即可，正面和上面看到的都是两个正方体",
                "difficulty": 2
            },
            {
                "id": "c4_f_05",
                "question": "观察物体时，站在（ ）的位置观察，看到的形状才准确（填正面/任意）",
                "answer": "正面",
                "tolerance": 0,
                "explain": "画三视图时通常需要从正面、上面、侧面三个标准方向观察",
                "difficulty": 1
            },
            {
                "id": "c4_f_06",
                "question": "从左面看圆柱体，看到的形状是（ ）形",
                "answer": "长方",
                "tolerance": 0,
                "explain": "圆柱体从侧面看是一个长方形（或正方形）",
                "difficulty": 2
            },
            {
                "id": "c4_f_07",
                "question": "把两个小正方体一前一后放置（不重叠），从正面看只能看到（ ）个正方形",
                "answer": "1",
                "tolerance": 0,
                "explain": "后面那个被前面的完全挡住了",
                "difficulty": 2
            },
            {
                "id": "c4_f_08",
                "question": "从上面看一个立体图形是圆形，这个立体图形可能是（ ）（写出一个）",
                "answer": "圆柱",
                "tolerance": 0,
                "explain": "圆柱体、圆锥体、球体从上面看都是圆形",
                "difficulty": 2
            }
        ],
        "calc": [
            {
                "id": "c4_calc_01",
                "question": "用棱长1cm的小正方体搭成一个大的正方体，至少需要多少个小正方体？大正方体的棱长是多少？",
                "answer": "8",
                "tolerance": 0,
                "explain": "拼成正方体需要棱长相等。每边放2个时：长2宽2高2，共2×2×2=8个，大正方体棱长2cm",
                "difficulty": 3
            },
            {
                "id": "c4_calc_02",
                "question": "一个长方体由棱长1cm的小正方体拼成，长3个、宽2个、高2个，共用了多少个小正方体？",
                "answer": "12",
                "tolerance": 0,
                "explain": "3×2×2=12个",
                "difficulty": 2
            },
            {
                "id": "c4_calc_03",
                "question": "用棱长1cm的小正方体搭一个长4cm、宽3cm、高2cm的长方体，需要多少个小正方体？",
                "answer": "24",
                "tolerance": 0,
                "explain": "4×3×2=24（个）",
                "difficulty": 2
            },
            {
                "id": "c4_calc_04",
                "question": "一个立体图形从正面看有3列、每列2层，从上面看有3列2排，最少需要多少个小正方体？",
                "answer": "6",
                "tolerance": 0,
                "explain": "3列×2层=6个即可，满足正视图3×2的要求",
                "difficulty": 3
            },
            {
                "id": "c4_calc_05",
                "question": "用棱长1cm的小正方体搭成一个棱长3cm的正方体，需要多少个小正方体？",
                "answer": "27",
                "tolerance": 0,
                "explain": "3×3×3=27（个）",
                "difficulty": 2
            }
        ],
        "judge": [
            {
                "id": "c4_j_01",
                "question": "从不同的方向观察同一个物体，看到的形状一定不同 （ ）",
                "answer": False,
                "explain": "从不同方向看球体都是圆形，看正方体都是正方形",
                "difficulty": 1
            },
            {
                "id": "c4_j_02",
                "question": "从正面看到的图形就是物体的前面 （ ）",
                "answer": True,
                "explain": "正面观察到的就是物体前面的形状",
                "difficulty": 1
            },
            {
                "id": "c4_j_03",
                "question": "只根据一个方向看到的形状，就能确定立体图形的样子 （ ）",
                "answer": False,
                "explain": "需要从多个方向观察才能确定立体图形的形状",
                "difficulty": 2
            },
            {
                "id": "c4_j_04",
                "question": "从任何方向看球体，看到的形状都是圆形 （ ）",
                "answer": True,
                "explain": "球体是旋转对称的，任何方向投影都是圆",
                "difficulty": 1
            },
            {
                "id": "c4_j_05",
                "question": "从上面看圆柱体和球体，看到的形状相同 （ ）",
                "answer": True,
                "explain": "从上面看，圆柱体和球体都是圆形",
                "difficulty": 2
            },
            {
                "id": "c4_j_06",
                "question": "把4个正方体排成一排，从正面看到的一定是4个正方形并排 （ ）",
                "answer": False,
                "explain": "如果是从侧面看横排，正面看可能只有1个方形（4个在一条线上）",
                "difficulty": 3
            },
            {
                "id": "c4_j_07",
                "question": "两个立体图形的三视图完全相同，它们一定是同一个立体图形 （ ）",
                "answer": False,
                "explain": "不同立体图形可能三视图相同，需要多角度判断",
                "difficulty": 3
            }
        ],
        "match": [
            {
                "id": "c4_m_01",
                "question": "将物体与从正面看到的形状配对",
                "left_items": ["正方体", "圆柱体(竖放)", "圆锥体", "球体"],
                "right_items": ["正方形", "长方形", "三角形", "圆形"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 1
            },
            {
                "id": "c4_m_02",
                "question": "将观察方向与看正方体时看到的形状配对",
                "left_items": ["从正面看", "从上面看", "从左面看", "从后面看"],
                "right_items": ["正方形", "正方形", "正方形", "正方形"],
                "pairs": [0, 0, 0, 0],
                "difficulty": 1
            },
            {
                "id": "c4_m_03",
                "question": "将小正方体组合与需要的最少个数配对（从正面3列2层，从上面3列2行）",
                "left_items": ["正视图3列2层 + 俯视图3列2行", "正视图2列1层 + 俯视图2列1行", "正视图1列3层 + 俯视图1列1行", "正视图2列2层 + 俯视图2列2行"],
                "right_items": ["最少6个", "最少2个", "最少3个", "最少4个"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 3
            }
        ],
        "speed": [
            {
                "id": "c4_s_01",
                "question": "从正面看正方体，看到的是什么形状？",
                "options": ["正方形", "长方形", "三角形", "圆形"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c4_s_02",
                "question": "从上面看竖放的圆柱体，看到什么形状？",
                "options": ["圆形", "长方形", "正方形", "三角形"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c4_s_03",
                "question": "两个正方体上下叠放，从正面看到几个正方形？",
                "options": ["2个（上下排列）", "1个", "3个", "4个"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c4_s_04",
                "question": "球体从任意方向看都是什么形状？",
                "options": ["圆形", "正方形", "三角形", "椭圆"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c4_s_05",
                "question": "两个正方体并排，从正面看到几个正方形？",
                "options": ["2个（左右排列）", "1个", "3个", "4个"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c4_s_06",
                "question": "有轨电车的车厢近似长方体，从正面看近似什么形？",
                "options": ["长方形", "正方形", "圆形", "梯形"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c4_s_07",
                "question": "三个正方体横排放置，从正面看到？",
                "options": ["3个并排", "1个", "3个叠放", "L形"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c4_s_08",
                "question": "从正面看一个大正方形上有两个小正方形并排，可能是几个正方体？",
                "options": ["3个（底2上1）", "2个", "4个", "1个"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 3
            }
        ]
    }
}

# ============================================================
# 单元5：认识方程
# ============================================================
unit5 = {
    "chapter_id": 5,
    "title": "认识方程",
    "questions": {
        "choice": [
            {
                "id": "c5_c_01",
                "question": "下面哪个是方程？",
                "options": ["3x + 5 = 20", "3x + 5", "3 + 5 = 8", "x > 10"],
                "answer": 0,
                "explain": "方程是含有未知数的等式。3x+5=20既有未知数x又是等式",
                "difficulty": 1
            },
            {
                "id": "c5_c_02",
                "question": "方程 2x = 10 的解是（ ）",
                "options": ["x = 5", "x = 10", "x = 2", "x = 20"],
                "answer": 0,
                "explain": "2x=10，x=10÷2=5",
                "difficulty": 1
            },
            {
                "id": "c5_c_03",
                "question": "如果 a + 3 = b + 3，那么（ ）",
                "options": ["a = b", "a > b", "a < b", "无法确定"],
                "answer": 0,
                "explain": "等式两边同时减去3，得a=b。等式的性质：等式两边同时加减同一个数，等式仍成立",
                "difficulty": 1
            },
            {
                "id": "c5_c_04",
                "question": "下面哪个不是方程？",
                "options": ["x + 5 > 12", "2y = 8", "a - 3 = 7", "m ÷ 4 = 2"],
                "answer": 0,
                "explain": "x+5>12是不等式，不是等式，所以不是方程",
                "difficulty": 2
            },
            {
                "id": "c5_c_05",
                "question": "方程 15 - x = 8 的解是（ ）",
                "options": ["x = 7", "x = 23", "x = 8", "x = 15"],
                "answer": 0,
                "explain": "15-x=8，移项得x=15-8=7",
                "difficulty": 2
            },
            {
                "id": "c5_c_06",
                "question": "用字母表示加法交换律，正确的是（ ）",
                "options": ["a + b = b + a", "a × b = b × a", "(a + b) + c = a + (b + c)", "a + 0 = a"],
                "answer": 0,
                "explain": "加法交换律：交换两个加数的位置，和不变。用字母表示：a+b=b+a",
                "difficulty": 1
            },
            {
                "id": "c5_c_07",
                "question": "大连发现王国门票成人x元，儿童半价，儿童的票价是（ ）元",
                "options": ["x ÷ 2", "2x", "x - 2", "x + 2"],
                "answer": 0,
                "explain": "半价就是原价除以2，儿童票价为x÷2元",
                "difficulty": 2
            },
            {
                "id": "c5_c_08",
                "question": "使方程左右两边相等的（ ）叫做方程的解",
                "options": ["未知数的值", "已知数", "常数", "系数"],
                "answer": 0,
                "explain": "方程的解就是使方程左右两边相等的未知数的值",
                "difficulty": 1
            },
            {
                "id": "c5_c_09",
                "question": "3x = 18 和 x + 2 = 8 中x的值相同吗？",
                "options": ["相同，都是6", "不同", "第一个是6，第二个是6", "无法确定"],
                "answer": 0,
                "explain": "3x=18，x=6；x+2=8，x=6。两个方程的解相同",
                "difficulty": 2
            }
        ],
        "fill": [
            {
                "id": "c5_f_01",
                "question": "一本书a页，看了b页，还剩（ ）页（用含字母的式子表示）",
                "answer": "a-b",
                "tolerance": 0,
                "explain": "剩下的页数 = 总页数 - 已看页数 = a - b",
                "difficulty": 1
            },
            {
                "id": "c5_f_02",
                "question": "解方程：x + 8 = 20，x = ?",
                "answer": "12",
                "tolerance": 0,
                "explain": "x=20-8=12",
                "difficulty": 1
            },
            {
                "id": "c5_f_03",
                "question": "解方程：5x = 35，x = ?",
                "answer": "7",
                "tolerance": 0,
                "explain": "x=35÷5=7",
                "difficulty": 1
            },
            {
                "id": "c5_f_04",
                "question": "苹果每千克m元，买3千克需要（ ）元",
                "answer": "3m",
                "tolerance": 0,
                "explain": "总价=单价×数量，3×m=3m（数字写在字母前）",
                "difficulty": 1
            },
            {
                "id": "c5_f_05",
                "question": "解方程：x ÷ 4 = 12，x = ?",
                "answer": "48",
                "tolerance": 0,
                "explain": "x=12×4=48",
                "difficulty": 1
            },
            {
                "id": "c5_f_06",
                "question": "学校合唱队有x人，舞蹈队比合唱队多15人，舞蹈队有（ ）人",
                "answer": "x+15",
                "tolerance": 0,
                "explain": "比x多15就是x+15",
                "difficulty": 2
            },
            {
                "id": "c5_f_07",
                "question": "解方程：2x + 3 = 15，x = ?",
                "answer": "6",
                "tolerance": 0,
                "explain": "2x=15-3=12，x=12÷2=6",
                "difficulty": 2
            },
            {
                "id": "c5_f_08",
                "question": "长方形的长是a厘米，宽是b厘米，周长C = （ ）（用含字母的式子表示）",
                "answer": "2(a+b)",
                "tolerance": 0,
                "explain": "长方形周长 = (长+宽)×2 = 2(a+b)",
                "difficulty": 2
            },
            {
                "id": "c5_f_09",
                "question": "解方程：3x - 7 = 20，x = ?",
                "answer": "9",
                "tolerance": 0,
                "explain": "3x=20+7=27，x=27÷3=9",
                "difficulty": 3
            }
        ],
        "calc": [
            {
                "id": "c5_calc_01",
                "question": "小明有x张邮票，小红有28张，两人共有50张。列方程求x。",
                "answer": "22",
                "tolerance": 0,
                "explain": "x+28=50，x=50-28=22（张）",
                "difficulty": 1
            },
            {
                "id": "c5_calc_02",
                "question": "学校买了5个篮球，每个x元，共付了225元。每个篮球多少元？",
                "answer": "45",
                "tolerance": 0,
                "explain": "5x=225，x=225÷5=45（元）",
                "difficulty": 1
            },
            {
                "id": "c5_calc_03",
                "question": "果园里有苹果树120棵，是梨树的3倍。梨树有多少棵？设梨树x棵，列方程求解。",
                "answer": "40",
                "tolerance": 0,
                "explain": "3x=120，x=120÷3=40（棵）",
                "difficulty": 2
            },
            {
                "id": "c5_calc_04",
                "question": "妈妈买了3千克苹果和2千克梨，苹果每千克6元，梨每千克y元，一共花了26元。梨每千克多少元？",
                "answer": "4",
                "tolerance": 0,
                "explain": "3×6+2y=26，18+2y=26，2y=8，y=4",
                "difficulty": 3
            },
            {
                "id": "c5_calc_05",
                "question": "爸爸今年36岁，是小明年龄的4倍。小明今年几岁？列方程求解。",
                "answer": "9",
                "tolerance": 0,
                "explain": "4x=36，x=36÷4=9（岁）",
                "difficulty": 1
            },
            {
                "id": "c5_calc_06",
                "question": "长方形的周长是24厘米，长是8厘米，宽是多少？设宽为x，列方程求。",
                "answer": "4",
                "tolerance": 0,
                "explain": "2(8+x)=24，8+x=12，x=4（厘米）",
                "difficulty": 2
            },
            {
                "id": "c5_calc_07",
                "question": "大连到旅顺的距离为y千米，爸爸开车平均速度50千米/时，用了0.8小时。求这段距离。",
                "answer": "40",
                "tolerance": 0,
                "explain": "y÷50=0.8，y=50×0.8=40（千米）",
                "difficulty": 3
            }
        ],
        "judge": [
            {
                "id": "c5_j_01",
                "question": "含有未知数的式子就是方程 （ ）",
                "answer": False,
                "explain": "方程必须是等式。如3x+5含有未知数但不是等式，所以不是方程",
                "difficulty": 1
            },
            {
                "id": "c5_j_02",
                "question": "x = 3 是方程 2x = 6 的解 （ ）",
                "answer": True,
                "explain": "把x=3代入：2×3=6，左右相等，所以x=3是解",
                "difficulty": 1
            },
            {
                "id": "c5_j_03",
                "question": "等式两边同时除以同一个数，等式仍然成立 （ ）",
                "answer": False,
                "explain": "除数不能为0。两边除以的数必须不为0，等式才成立",
                "difficulty": 2
            },
            {
                "id": "c5_j_04",
                "question": "所有的方程都是等式 （ ）",
                "answer": True,
                "explain": "方程的定义就是含有未知数的等式，所以方程一定是等式",
                "difficulty": 1
            },
            {
                "id": "c5_j_05",
                "question": "所有的等式都是方程 （ ）",
                "answer": False,
                "explain": "3+5=8是等式但不含未知数，不是方程",
                "difficulty": 2
            },
            {
                "id": "c5_j_06",
                "question": "如果a=b，那么a×c = b×c （ ）",
                "answer": True,
                "explain": "等式两边同时乘以相同的数，等式仍然成立",
                "difficulty": 2
            },
            {
                "id": "c5_j_07",
                "question": "3a + 5a = 8a 运用了乘法分配律 （ ）",
                "answer": True,
                "explain": "3a+5a = a×(3+5) = 8a，这就是乘法分配律的逆用",
                "difficulty": 2
            },
            {
                "id": "c5_j_08",
                "question": "x² 一定大于 2x （ ）",
                "answer": False,
                "explain": "当x=1时，x²=1, 2x=2，x²<2x；当x=3时，x²=9>2x=6。不一定",
                "difficulty": 3
            }
        ],
        "match": [
            {
                "id": "c5_m_01",
                "question": "将文字描述与含字母的式子配对",
                "left_items": ["a与b的和", "a的3倍", "比x多5", "y除以4"],
                "right_items": ["a+b", "3a", "x+5", "y÷4"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 1
            },
            {
                "id": "c5_m_02",
                "question": "将方程与它的解配对",
                "left_items": ["x+7=15", "3x=21", "x÷5=4", "2x-3=9"],
                "right_items": ["x=8", "x=7", "x=20", "x=6"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 2
            },
            {
                "id": "c5_m_03",
                "question": "将应用题与列出的方程配对",
                "left_items": ["小明有5支笔，又买x支后共有12支", "每本练习本2元，买x本花16元", "一个数的3倍是27", "x加上5等于13"],
                "right_items": ["5+x=12", "2x=16", "3x=27", "x+5=13"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 2
            }
        ],
        "speed": [
            {
                "id": "c5_s_01",
                "question": "x + 6 = 10，x = ?",
                "options": ["4", "16", "6", "10"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c5_s_02",
                "question": "8x = 32，x = ?",
                "options": ["4", "8", "24", "256"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c5_s_03",
                "question": "下面哪个是方程？",
                "options": ["2x+1=7", "2x+1", "2+1=3", "7-2=5"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 1
            },
            {
                "id": "c5_s_04",
                "question": "15 - x = 6，x = ?",
                "options": ["9", "21", "6", "15"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c5_s_05",
                "question": "a个苹果分给8人，每人3个，a = ?",
                "options": ["24", "11", "5", "8"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c5_s_06",
                "question": "2x + 4 = 14，x = ?",
                "options": ["5", "9", "7", "3"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c5_s_07",
                "question": "如果 x = y，那么 x + 5 = ?",
                "options": ["y + 5", "5x", "5y", "x = 5"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c5_s_08",
                "question": "25 ÷ x = 5，x = ?",
                "options": ["5", "20", "30", "125"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c5_s_09",
                "question": "大连老虎滩海洋公园成人票x元，买2张共240元，x=?",
                "options": ["120", "240", "480", "60"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c5_s_10",
                "question": "3x - 2 = 10，x = ?",
                "options": ["4", "3", "5", "8"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 3
            }
        ]
    }
}

# ============================================================
# 单元6：数据的表示与分析
# ============================================================
unit6 = {
    "chapter_id": 6,
    "title": "数据的表示与分析",
    "questions": {
        "choice": [
            {
                "id": "c6_c_01",
                "question": "表示气温变化趋势，最好选用（ ）",
                "options": ["折线统计图", "条形统计图", "统计表", "圆形图"],
                "answer": 0,
                "explain": "折线统计图能清晰地反映数据的变化趋势",
                "difficulty": 1
            },
            {
                "id": "c6_c_02",
                "question": "比较各班人数多少，最好选用（ ）",
                "options": ["条形统计图", "折线统计图", "圆形图", "以上都可以"],
                "answer": 0,
                "explain": "条形统计图能直观比较数量的多少",
                "difficulty": 1
            },
            {
                "id": "c6_c_03",
                "question": "小明5次跳绳成绩：120、125、118、122、115，平均成绩是（ ）",
                "options": ["120", "125", "118", "122"],
                "answer": 0,
                "explain": "(120+125+118+122+115)÷5=600÷5=120",
                "difficulty": 2
            },
            {
                "id": "c6_c_04",
                "question": "一组数据的平均数一定比这组数据中的（ ）",
                "options": ["最大值小（或等），比最小值大（或等）", "最大值大", "最小值小", "无法比较"],
                "answer": 0,
                "explain": "平均数介于最大值和最小值之间（可以等于，当数据全相同时）",
                "difficulty": 2
            },
            {
                "id": "c6_c_05",
                "question": "折线统计图中，线越陡表示（ ）",
                "options": ["变化越大", "变化越小", "不变", "无法判断"],
                "answer": 0,
                "explain": "折线越陡峭说明相邻数据之间的差距越大，变化越剧烈",
                "difficulty": 2
            },
            {
                "id": "c6_c_06",
                "question": "大连星海广场某周每天游客人数如下：周一1200、周二1000、周三900、周四1100、周五1500、周六3000、周日2800。平均每天约（ ）人",
                "options": ["约1643", "约1500", "约2000", "约1800"],
                "answer": 0,
                "explain": "(1200+1000+900+1100+1500+3000+2800)÷7=11500÷7≈1642.86≈1643",
                "difficulty": 3
            },
            {
                "id": "c6_c_07",
                "question": "条形统计图中，直条的高度表示（ ）",
                "options": ["数量的多少", "时间的长短", "变化的快慢", "种类的多少"],
                "answer": 0,
                "explain": "条形统计图用直条的高矮来表示数量的多少",
                "difficulty": 1
            },
            {
                "id": "c6_c_08",
                "question": "四年一班10名同学的身高（cm）：130,132,128,135,131,129,133,130,134,128。中位数最适合描述什么？",
                "options": ["中间水平", "最高水平", "最低水平", "平均身高"],
                "answer": 0,
                "explain": "中位数表示一组数据中处于中间位置的数，反映中间水平",
                "difficulty": 3
            }
        ],
        "fill": [
            {
                "id": "c6_f_01",
                "question": "表示数量的多少适合用（ ）统计图",
                "answer": "条形",
                "tolerance": 0,
                "explain": "条形统计图能直观比较数量的多少",
                "difficulty": 1
            },
            {
                "id": "c6_f_02",
                "question": "表示数据的变化趋势适合用（ ）统计图",
                "answer": "折线",
                "tolerance": 0,
                "explain": "折线统计图能清晰反映变化趋势",
                "difficulty": 1
            },
            {
                "id": "c6_f_03",
                "question": "计算平均数时，需要用总数量除以（ ）",
                "answer": "总份数",
                "tolerance": 0,
                "explain": "平均数 = 总数量 ÷ 总份数",
                "difficulty": 1
            },
            {
                "id": "c6_f_04",
                "question": "四个同学的体重分别是30kg、32kg、28kg、34kg，平均体重是（ ）kg",
                "answer": "31",
                "tolerance": 0,
                "explain": "(30+32+28+34)÷4=124÷4=31kg",
                "difficulty": 1
            },
            {
                "id": "c6_f_05",
                "question": "条形统计图中每个直条的（ ）应该相等（填宽度/高度）",
                "answer": "宽度",
                "tolerance": 0,
                "explain": "条形统计图中每个直条的宽度应保持一致，用高度表示数量",
                "difficulty": 2
            },
            {
                "id": "c6_f_06",
                "question": "某小组5人数学成绩：88、92、85、90、95，平均分是（ ）分",
                "answer": "90",
                "tolerance": 0,
                "explain": "(88+92+85+90+95)÷5=450÷5=90分",
                "difficulty": 1
            },
            {
                "id": "c6_f_07",
                "question": "大连一周最高气温：12℃、14℃、15℃、13℃、16℃、18℃、17℃。平均最高气温约（ ）℃（保留整数）",
                "answer": "15",
                "tolerance": 0,
                "explain": "(12+14+15+13+16+18+17)÷7=105÷7=15℃",
                "difficulty": 2
            },
            {
                "id": "c6_f_08",
                "question": "折线统计图不但能表示数量的多少，还能表示数量的（ ）变化",
                "answer": "增减",
                "tolerance": 0,
                "explain": "折线统计图能反映数量的增减变化情况",
                "difficulty": 1
            }
        ],
        "calc": [
            {
                "id": "c6_calc_01",
                "question": "小明语文92分、数学98分、英语95分，三科平均分是多少？",
                "answer": "95",
                "tolerance": 0,
                "explain": "(92+98+95)÷3=285÷3=95（分）",
                "difficulty": 1
            },
            {
                "id": "c6_calc_02",
                "question": "5个同学的身高：140cm、136cm、142cm、138cm、144cm，平均身高是多少？",
                "answer": "140",
                "tolerance": 0,
                "explain": "(140+136+142+138+144)÷5=700÷5=140cm",
                "difficulty": 1
            },
            {
                "id": "c6_calc_03",
                "question": "王奶奶家前4个月的电费分别是：76元、82元、70元、84元。平均每月电费多少？",
                "answer": "78",
                "tolerance": 0,
                "explain": "(76+82+70+84)÷4=312÷4=78元",
                "difficulty": 2
            },
            {
                "id": "c6_calc_04",
                "question": "小华前3次数学测验平均分是88分，第4次考了96分，4次的平均分是多少？",
                "answer": "90",
                "tolerance": 0,
                "explain": "前3次总分=88×3=264，(264+96)÷4=360÷4=90分",
                "difficulty": 2
            },
            {
                "id": "c6_calc_05",
                "question": "某商店一周销售额：周一1500元、周二1200元、周三1300元、周四1400元、周五1800元、周六2500元、周日2200元。这周平均每天销售额约多少元？（保留整数）",
                "answer": "1700",
                "tolerance": 0,
                "explain": "(1500+1200+1300+1400+1800+2500+2200)÷7=11900÷7=1700元",
                "difficulty": 3
            },
            {
                "id": "c6_calc_06",
                "question": "小明前4次听写平均正确18个词，第5次正确22个词，5次平均正确多少个？",
                "answer": "18.8",
                "tolerance": 0.01,
                "explain": "前4次总正确=18×4=72，(72+22)÷5=94÷5=18.8个",
                "difficulty": 3
            },
            {
                "id": "c6_calc_07",
                "question": "大连海洋公园水族馆周一至周五日均游客800人，周六日分别3200人和2800人。这周日均游客多少人？",
                "answer": "1429",
                "tolerance": 0,
                "explain": "(800×5+3200+2800)÷7=(4000+6000)÷7=10000÷7≈1429人",
                "difficulty": 3
            }
        ],
        "judge": [
            {
                "id": "c6_j_01",
                "question": "条形统计图能清楚地看出数量的多少 （ ）",
                "answer": True,
                "explain": "条形统计图用直条的高低直观表示数量多少",
                "difficulty": 1
            },
            {
                "id": "c6_j_02",
                "question": "折线统计图不能表示数量的多少，只能表示变化趋势 （ ）",
                "answer": False,
                "explain": "折线统计图既可以看出数量的多少，又能看出变化趋势",
                "difficulty": 2
            },
            {
                "id": "c6_j_03",
                "question": "一组数据的平均数一定在这组数据中出现过 （ ）",
                "answer": False,
                "explain": "平均数不一定是原始数据中的某个值，如3、4的平均数是3.5",
                "difficulty": 2
            },
            {
                "id": "c6_j_04",
                "question": "求平均数就是把几个数加起来然后除以它们的个数 （ ）",
                "answer": True,
                "explain": "平均数 = 总和 ÷ 个数，这是平均数的基本求法",
                "difficulty": 1
            },
            {
                "id": "c6_j_05",
                "question": "如果要表示大连每月气温的变化情况，用条形统计图更合适 （ ）",
                "answer": False,
                "explain": "表示变化趋势应用折线统计图更合适",
                "difficulty": 2
            },
            {
                "id": "c6_j_06",
                "question": "全班同学的平均身高是135cm，小明身高132cm，他一定是最矮的 （ ）",
                "answer": False,
                "explain": "132cm低于平均身高，但可能有比他更矮的同学",
                "difficulty": 2
            },
            {
                "id": "c6_j_07",
                "question": "两组数据的平均数相同，说明两组数据完全相同 （ ）",
                "answer": False,
                "explain": "平均数相同不代表数据相同，如{1,9}和{4,6}平均数都是5",
                "difficulty": 3
            },
            {
                "id": "c6_j_08",
                "question": "制作条形统计图时，直条的宽度可以随意调整，不影响看图效果 （ ）",
                "answer": False,
                "explain": "直条宽度必须统一，否则会产生误导",
                "difficulty": 2
            }
        ],
        "match": [
            {
                "id": "c6_m_01",
                "question": "将统计图类型与最适合的用途配对",
                "left_items": ["比较班级人数", "表示一年气温变化", "表示各部分占比", "同时看出数量和趋势"],
                "right_items": ["条形统计图", "折线统计图", "圆形图（扇形图）", "折线统计图"],
                "pairs": [0, 1, 1, 1],
                "difficulty": 2
            },
            {
                "id": "c6_m_02",
                "question": "将数据组与平均数配对",
                "left_items": ["10, 20, 30", "5, 5, 5, 5", "2, 4, 6, 8, 10", "12, 18"],
                "right_items": ["20", "5", "6", "15"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 1
            },
            {
                "id": "c6_m_03",
                "question": "将折线图描述与含义配对",
                "left_items": ["折线上升", "折线下降", "折线水平", "折线很陡"],
                "right_items": ["数量增加", "数量减少", "数量不变", "变化幅度大"],
                "pairs": [0, 1, 2, 3],
                "difficulty": 1
            }
        ],
        "speed": [
            {
                "id": "c6_s_01",
                "question": "比较各班人数多少适合用什么图？",
                "options": ["条形统计图", "折线统计图", "圆形图", "都可以"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c6_s_02",
                "question": "(10+20+30)÷3 = ?",
                "options": ["20", "15", "30", "25"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c6_s_03",
                "question": "4个数的平均数是5，它们的和是多少？",
                "options": ["20", "5", "9", "1.25"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c6_s_04",
                "question": "表示气温变化趋势用什么图最好？",
                "options": ["折线统计图", "条形统计图", "统计表", "都可以"],
                "answer": 0,
                "time_limit": 10,
                "difficulty": 1
            },
            {
                "id": "c6_s_05",
                "question": "88、92、96的平均数是多少？",
                "options": ["92", "90", "94", "88"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c6_s_06",
                "question": "折线统计图中线越平说明什么？",
                "options": ["变化越小", "变化越大", "数量越多", "数量越少"],
                "answer": 0,
                "time_limit": 12,
                "difficulty": 2
            },
            {
                "id": "c6_s_07",
                "question": "5个同学身高：130,132,128,126,134。平均数？",
                "options": ["130", "128", "132", "126"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 2
            },
            {
                "id": "c6_s_08",
                "question": "商店周一至周五平均每天100人，周六300人，这6天平均多少人？",
                "options": ["约133", "200", "150", "100"],
                "answer": 0,
                "time_limit": 15,
                "difficulty": 3
            }
        ]
    }
}

# ============================================================
# 写入文件
# ============================================================
def write_json(data, filename):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    # 统计
    q = data["questions"]
    total = sum(len(q.get(k, [])) for k in ["choice","fill","calc","judge","match","speed"])
    print(f"  {filename}:")
    print(f"    choice: {len(q.get('choice',[]))} 道")
    print(f"    fill:   {len(q.get('fill',[]))} 道")
    print(f"    calc:   {len(q.get('calc',[]))} 道")
    print(f"    judge:  {len(q.get('judge',[]))} 道")
    print(f"    match:  {len(q.get('match',[]))} 组")
    print(f"    speed:  {len(q.get('speed',[]))} 道")
    print(f"    --- 合计 {total} 题 ---\n")

print("=" * 50)
print("生成数学题库文件")
print("=" * 50)

write_json(unit2, "unit2.json")
write_json(unit3, "unit3.json")
write_json(unit4, "unit4.json")
write_json(unit5, "unit5.json")
write_json(unit6, "unit6.json")

print("全部完成！")
