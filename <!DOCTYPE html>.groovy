<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>语言能力雷达图</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
    <style>
        #main {
            width: 800px;
            height: 600px;
            margin: 50px auto;
        }
    </style>
</head>
<body>

<div id="main"></div>

<script>
    var myChart = echarts.init(document.getElementById('main'));

    var indicatorData = [
        { name: '流利度', max: 100, explanation: '语流连贯无卡顿，音变现象自然' },
        { name: '完整度', max: 100, explanation: '朗读内容与原文一致，无遗漏或增添' },
        { name: '准确度', max: 100, explanation: '发音清晰，重音正确，易于理解' },
        { name: '重音与节奏', max: 100, explanation: '重音突出，节奏自然，语速适中' },
        { name: '语调与表达', max: 100, explanation: '语调自然，情感传达得当' }
    ];

    var option = {
        title: {
            text: '语言能力评估雷达图',
            left: 'center'
        },
        tooltip: {
            formatter: function (params) {
                var toolTip = '';
                for (var i = 0; i < params.value.length; i++) {
                    toolTip += indicatorData[i].name + '：' + params.value[i] + '<br/>' +
                               '解释：' + indicatorData[i].explanation + '<br/><br/>';
                }
                return toolTip;
            }
        },
        legend: {
            data: ['你的得分'],
            bottom: 10
        },
        radar: {
            indicator: indicatorData,
            shape: 'polygon',
            axisName: {
                color: '#333',
                fontWeight: 'bold'
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255,255,255,0.5)', 'rgba(200, 255, 255, 0.5)']
                }
            }
        },
        series: [{
            name: '你的得分',
            type: 'radar',
            data: [{
                value: [80, 95, 75, 70, 85],
                name: '你的得分',
                areaStyle: {
                    color: 'rgba(0, 191, 255, 0.5)'
                },
                lineStyle: {
                    color: '#00BFFF'
                },
                itemStyle: {
                    color: '#00BFFF'
                }
            }]
        }]
    };

    myChart.setOption(option);
</script>

</body>
</html>
