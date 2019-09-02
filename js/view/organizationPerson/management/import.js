
$(function(){
	
})

function upload() {　
	document.getElementById("input-file-select").click();
}

function changeFile(){
	$(".file-input-name").empty();
	$(".file-input-name").remove();
}


function submitFile(){	
	var uploadData = new FormData();
	var file = $("#input-file-select")[0].files;
	if(file.length == 0){
       	$.alert("请选择文件");
       	$('.file-name').empty();      
        return false;
  }   	
    try{    	
    	if(file[0].size > (2*1024*1024*10)){ // 20M限制 
    		 throw "上传文件大小不能大于20M！";
    		 return false;
    	}
    	var AllExt="|.xlsx|.xls";
    	if(AllExt.indexOf(file[0].name.split(".")[1])==-1){ 
                $(".div-error").html("该文件类型不允许上传。请上传 "+AllImgExt+" 类型的文件。");;
                throw "该文件类型不允许上传";
                return false;
      	}    	   	
    }catch(e){
    	$('.file-input-name').remove()
    	$.alert(e);
    	return false;
    }
	uploadData.append("salesFile", file[0]);
	$.ajax({
            type: "POST",
            url: "/api/mms-api/sales/import",
            data: uploadData,
            contentType: false, // 不设置内容类型
            processData: false, // 不处理数据
            dataType: "json",
            success: function(data) {
               if((data.statusCode == 200) && (data.data.result == true)){
               		$.alert("导入成功","营销管理平台",function(){
               			location.href = "/view/organizationPerson/management.html";              			
               		})
               	              	   
               }else{
               	 $('.file-input-name').remove()
               	$.alert(data.message);
               }
            },
            error: function(error) {
            	$('.file-input-name').remove()
               console.log(error);
               $.alert("文件处理异常");
            }
    });
}


