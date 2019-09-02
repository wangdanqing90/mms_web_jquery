$(function() {
	var dom = document.getElementById("container");
            var myChart = echarts.init(dom);
            window.onresize = myChart.resize;  // 适应屏幕放大缩小
            var app = {};
            option = null;
            option = {
              baseOption: {
                title: {
                    text: '某楼盘销售情况',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['意向','预购','成交']
                },
                toolbox: {
                    show: true,
                    feature: {
                       /* magicType: {show: true, type: ['stack', 'tiled']},*/
                        saveAsImage: {show: true}   //可下载图片
                    }
                },
                 grid: {
                                    left: '10%',     //设置canvas图距左的距离
                                    top: '20%',
                                    right: '10%',
                                    bottom: '10%'
                                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '成交',
                    type: 'line',
                    smooth: true,
                    data: [10, 12, 21, 54, 260, 830, 710]
                },
                {
                    name: '预购',
                    type: 'line',
                    smooth: true,
                    data: [30, 182, 434, 791, 390, 30, 10]
                },
                {
                    name: '意向',
                    type: 'line',
                    smooth: true,
                    data: [1320, 1132, 601, 234, 120, 90, 20]
                }]
                }
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}


page1();
})


//翻页
function page1(){
var pageDiv = $("div.page");
var currentPage=1;
var totalSize=10;
            pageDiv.page({pageSize:10,total:(Number(currentPage)+totalSize)*10});
            pageDiv.pageSelect(currentPage);
            $("div.page").delegate("a","click",function(){
                location.href=constructAllQueryCondition(true);
            });
}
