(function() {
	if(!$.isLogin()) {
		location.href = "/view/sign/login.html"
	}

	initPie();
	initBar();
})()

function initPie() {
	var domleft = document.getElementById("leftcontainer");
	var dommiddle = document.getElementById("middlecontainer");
	var domright = document.getElementById("rightcontainer");
	var myChartleft = echarts.init(domleft);
	var myChartmiddle = echarts.init(dommiddle);
	var myChartright = echarts.init(domright);
	var app = {};

	var data = [{
			value: 1000,
			name: '年度指标'
		},
		{
			value: 100,
			name: '已完成'
		}
	]
	var option = {
		tooltip: {
			show: false
		},
		graphic: {
			type: 'group',
			left: 'center',
			top: 'center',
			children: [{
				type: 'text',
				right: 'center',
				top: '10px',
				style: {
					text: '30%',
					textAlign: 'center',
					font: '16px "Microsoft YaHei", sans-serif',
					fill: 'black'
				}
			}, {
				type: 'text',
				right: 'center',
				top: '30px',
				style: {
					text: '理财',
					textAlign: 'center',
					font: '12px "Microsoft YaHei", sans-serif',
					fill: '#7F8FA4'
				}
			}]
		},
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: false,
					position: 'center'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '30',
						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			startAngle: 320,
			avoidLabelOverlap: false,
			hoverAnimation: false,
			legendHoverLink: false,
			cursor: "default",
			radius: ["90%", '100%'],

			label: {
				normal: {
					show: false
				}
			},
			data: [{
					value: 100,
					name: '已完成',
					itemStyle: {
						color: "#FDC581"
					}
				},
				{
					value: 900,
					name: '年度指标',
					itemStyle: {
						color: "#E7EBEF"
					}
				}
			]
		}]
	};

	if(option && typeof option === "object") {
		myChartleft.setOption(option, true);
		myChartmiddle.setOption(option, true);
		myChartright.setOption(option, true);
	}
}


//柱状图
function initBar(){
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
var option = {
    color: ['#003366', '#006699'],
    legend: {
			left: "0",
			itemWidth:15,
			textStyle:{
				color :"#7F8FA4"
			},
			data: [{
				name: '当前周',
				icon: "circle"
			}, {
				name: '同比上周',
				icon: "circle"
			}]
		},
    grid:{
    	left:"50",
    	right:'50'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            axisLine:{
            	show:false
            },
           
            data: ['理财', '基金', '保险'],
            axisLabel: {
                textStyle: {
                  color:"#9FA9BA",
                  fontSize:14
                }
             }          
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '金额万元            ',
            nameTextStyle:{color:"#9FA9BA", align:'center', verticalAlign: "bottom"},
            axisTick: {show: false},
            axisLine:{show:false},
            splitLine:{
            	lineStyle:{color:'#E7EBEF'}
            },
            axisLabel: {
                textStyle: {
                  color:"#9FA9BA"
                }
              },
        }
    ],
    series: [
        {
            name: '当前周',
            type: 'bar',
            barWidth:25, 
            data: [320, 332, 301],
             itemStyle: {            	
                normal: {
                	barBorderRadius:12,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,[{offset: 0, color: '#48DFFE'},{offset: 1, color: '#51A6FC'}]
                    )
                },
             }
        },
        {
            name: '同比上周',
            type: 'bar',
            barWidth:25, 
            data: [220, 182, 191],
            itemStyle: {
                normal: {
                	barBorderRadius:12,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,[{offset: 0, color: 'rgba(2,148,255,0.33)'},{offset: 1, color: 'rgba(255,255,255,0.00)'}]
                    )
                },
             }
        }
    ]
};;
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
	
}
