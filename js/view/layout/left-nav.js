// 控制显示的菜单栏

//3BFA943D19A846AAE0533E05110A6A11	角色维护
//3BFA943D19A846AAE0533E05110A6A12	用户维护
//3BFA943D19A846AAE0533E05110A6A13	功能维护
//3BFA943D19A846AAE0533E05110A6A7A	权限管理
//3BFA943D19A846AAE0533E05110A6A7B	组织与人员管理
//3BFA943D19A946AAE0533E05110A6A00	组织审核
//3BFA943D19A946AAE0533E05110A6A01	组织管理
//3BFA943D19AA46AAE0533E05110A6A02	组织结构
//3BFA943D19AB46AAE0533E05110A6A03	人员结构
//3BFA943D19AB46AAE0533E05110A6A05	人员管理
//3BFA943D19AB46AAE0533E05110A6A06	人员组织调整审核
//3BFA943D19AC46AAE0533E05110A6A04	变更记录

var navList=[

	// 权限管理
	{
		funcId: "A000000000",
	 	ele:'.nav-two',
	 	childs:[
		 	{
		 		funcId: "A000000001",
		 		ele:'.roleMaintenance',		 		
	 		},
	 		{
	 			funcId: "A000000002",
		 		ele:'.userMaintenance',	
	 		},
	 		{
	 			funcId: "3BFA943D19A846AAE0533E05110A6A13",
		 		ele:'.functionalMaintenance',
	 		}
	 	]
	},
	// 组织与人员管理
	{
		funcId: "B000000000",
	 	ele:'.nav-one',
	 	childs:[
	 	// 组织管理
				{
					ele:'.structure',
					funcId:'B000000001',
				},
			
	 			{
	 				funcId: "B000000002",
	 				ele:'.manageIndex',
	 			}
	 	]
	},
	// 业绩管理
	{
		funcId: "C000000000",
	 	ele:'.perfManage',
	 	childs:[	 	
				{
					ele:'.perTransfer',
					funcId:'C000000001',
				},
				{
					ele:'.actCommission',
					funcId:'C000000002',
				},	 			
	 			{
	 				funcId: "C000000005",
	 				ele:'.achievement',
	 			},{
	 				funcId: "C000000003",
	 				ele:'.orgRoyalty',
	 			},
	 	]
	},
	// 销售订单管理
	{
		funcId: "D000000000",
	 	ele:'.order',
	 	childs:[	 	
				{
					ele:'.orderPatch',
					funcId:'D000000001',
				},
				{
					ele:'.orderList',
					funcId:'D000000002',
				}
	 			
	 	]
	},
	// 产品管理
	{
		funcId: "E000000000",
	 	ele:'.product',
	 	childs:[	 	
				{
					ele:'.productPatch',
					funcId:'E000000001',
				},
				{
					ele:'.productList',
					funcId:'E000000002',
				}
	 			
	 	]
	},
	// 审核管理
	{
		funcId: "F000000000",
	 	ele:'.orderCheck',
	 	childs:[	 	
				{
					ele:'.organizaCheck',
					funcId:'F000000001',
				},
				{
					ele:'.manCheck',
					funcId:'F000000002',
				},
				{
					ele:'.royalty',
					funcId:'F000000003',
				},
				{
					ele:'.perfCheck',
					funcId:'F000000004',
				},{
	 				funcId: "F000000005",
	 				ele:'.orgCheck',
	 			},
	 			
	 	]
	},
	// 操作记录
	{
		funcId: "G000000000",
	 	ele:'.actionRecord',
	 	childs:[	 	
				{
					ele:'.perfRecord',
					funcId:'G000000002',
				},
				{
					ele:'.systemRecord',
					funcId:'G000000001',
				}	 			
	 	]
	},
	
];



(function(){
	//初始化菜单栏
	initNav()	
	initSelected();
})()


function initNav(){
	var user = $.cookie("user");
	// 防止登录失效报错
	if((user == undefined) || (user == "")){return false;}
	user = JSON.parse(user);
	var listArr = JSON.parse(localStorage.funcs);
	if(listArr.length <= 0){
		$("#main-nav").addClass("hide");
		return false;
	}
	shouNavList(listArr,navList)
		
	
}

// 方便多次遍历方法,嵌套是使用,所以采用的函数的写法
function shouNavList(traget,origin) {
	// 数组为空直接跳出循环
	if((traget.length <= 0) || (origin.length <= 0)){
		return false;
	}
	$.each(traget, function(index,item) {
		$.each(origin, function(indexT,itemT) {
			if(item.funcId == itemT.funcId){
				$("#main-nav  " + itemT.ele).removeClass("hide");
				// 遍历二级菜单
				if(item.childMenuBOList != null){
				  return shouNavList(item.childMenuBOList,itemT.childs);
				}else{
					return false
				}
			}
		});
	});	
}

//路由判断
function initSelected() {	
	var url = window.location.href;
	if(url.indexOf("/view/PrivilegeManagement") > 0) {//权限管理
		$("#PrivilegeManagement").show();
		$("#PrivilegeManagement").parent('li').addClass("left-open");
		if(url.indexOf("/view/PrivilegeManagement/RoleMaintenance.html") > 0) {
			$(".roleMaintenance").addClass("left-select");
		}else if(url.indexOf("/view/PrivilegeManagement/UserMaintenance.html") > 0) {
			$(".userMaintenance").addClass("left-select");
		}
		
	}else if(url.indexOf("structure") > 0 || url.indexOf("management") > 0) {//组织与人员管理
		$("#organizationPerson").show();
		$("#organizationPerson").parent('li').addClass("left-open");
		if(url.indexOf("/view/organizationPerson/structure.html") > 0) {
			$(".structure").addClass("left-select");
		}else if(url.indexOf("/view/organizationPerson/management.html") > 0) {
			$(".manageIndex").addClass("left-select");
		}
									
	}else if(url.indexOf("achievement") > 0|| url.indexOf("addActCommission") > 0|| url.indexOf("orgRoyalty.html") > 0 || url.indexOf("transfer.html") > 0) {//业绩管理
		$("#performanceManagement").show();
		$("#performanceManagement").parent('li').addClass("left-open");
		
		if(url.indexOf("/view/performanceManagement/transfer.html") > 0) {
			$(".perTransfer").addClass("left-select");
		}else if(url.indexOf("/view/performanceManagement/addActCommission.html") > 0) {
			$(".actCommission").addClass("left-select");
		}else if(url.indexOf("/view/performanceManagement/orgRoyalty.html") > 0) {
			$(".orgRoyalty").addClass("left-select");
		}else if(url.indexOf("/view/performanceManagement/achievement.html") > 0) {
			$(".achievement").addClass("left-select");
		}
		
	}else if(url.indexOf("/view/order") > 0) {//销售订单管理
		$("#order").show();
		$("#order").parent('li').addClass("left-open");
		
		if(url.indexOf("/view/order/orderPatch.html") > 0) {
			$(".orderPatch").addClass("left-select");
		}else if(url.indexOf("/view/order/orderList.html") > 0) {
			$(".orderList").addClass("left-select");
		}
	}else if(url.indexOf("/view/product") > 0) {//产品管理
		$("#product").show();
		$("#product").parent('li').addClass("left-open");
		
		if(url.indexOf("/view/product/productPatch.html") > 0) {
			$(".productPatch").addClass("left-select");
		}else if(url.indexOf("/view/product/productList.html") > 0) {
			$(".productList").addClass("left-select");
		}
	}
	if(url.indexOf("organizCheck") > 0  || url.indexOf("manCheck") > 0  || url.indexOf("royalty") > 0 ||url.indexOf("perfCheck") > 0||url.indexOf("orgCheck") > 0  ){ //审核管理
		$('#check').show();
		$('#check').parent('li').addClass("left-open");
		
		if(url.indexOf("organizCheck") > 0) {
			$(".organizaCheck").addClass("left-select");
		}else if(url.indexOf("orgCheck") > 0) {
			$(".orgCheck").addClass("left-select");
		}else if(url.indexOf("manCheck") > 0) {
			$(".manCheck").addClass("left-select");
		}else if(url.indexOf("royalty") > 0) {
			$(".royalty").addClass("left-select");
		}else if(url.indexOf("perfCheck") > 0) {
			$(".perfCheck").addClass("left-select");
		}
	}
	if(url.indexOf("systemRecord") > 0  || url.indexOf("transferRecord") > 0){ //审核管理
		$('#actionRecord').show();
		$('#actionRecord').parent('li').addClass("left-open");
		
		if(url.indexOf("/view/performanceManagement/transferRecord.html") > 0) {
			$(".perfRecord").addClass("left-select");
		}else if(url.indexOf("/view/system/systemRecord.html") > 0) {
			$(".systemRecord").addClass("left-select");
		}
	}			
}
