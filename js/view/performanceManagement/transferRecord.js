var pageStatus = true;
var pageCurrent = 1;

$(function(){
	getRecord();				
})

function getRecord(flag){
	if(flag){pageStatus=true;$(".M-box3").hide();}
	var param = {
		pageCurrent:pageCurrent,
		pageSize:10
	}
	$.ajax({
		type:"get",
		url:"/api/mms-api/performance/list",
		async:true,
		data:param,
		dataType:"json",
		success:function(data){
			if((data.statusCode == 200) && (data.data.list.length > 0)){
				var html = "";
				if(pageStatus){initPage(data.data.pageCount);}
				$.each(data.data.list, function(index,item) {
					html +='<tr>';
						html +='<td>'+(index+1)+'</td>';
						html +='<td>'+ item.createTime +'</td>';
						html +='<td>'+ item.submitName +'</td>';
						html +='<td>'+ item.startTime +'</td>';
						html +='<td>'+ item.endTime +'</td>';
						html +='<td>'+ item.transferSalesName +'</td>';
						html +='<td>'+ item.transferOrgName +'</td>';
						html +='<td>'+ item.receiveSalesName +'</td>';
						html +='<td>'+ item.receiveOrgName +'</td>';
						
						html +='<td>'+ item.checkerName +'</td>';						
					html +='</tr>';
				});
				$("#role-tbody").empty().append(html);
			}else{
				$("#role-tbody").empty();
			}
		},error:function(error){
			$.alert("网络忙!请稍后再试")
		}				
	});			
}
function initPage(pageCount){	
	$(".M-box3").show();
	$(".M-box3").pagination({
		pageCount : pageCount,
		jump : true,
		coping : true,
		keepShowPN : true,
		mode : "fixed",
		isHide : true,
		homePage : "首页",
		endPage : "尾页",
		prevContent : "上一页",
		nextContent : "下一页",
		callback : function(api) {
			pageCurrent = api.getCurrent();
			pageStatus = false;
			getRecord();
		}
	});
}
