document.addEventListener("DOMContentLoaded",() => {
    
    $.ajax({	
        url : "/getClientIp.do",	
        cache : "false", //캐시사용금지	
        method : "get",
        data : {
        },
        async : false, 
        success : function(data){ 
            console.log(data);
            $("#client-ip").text(data);
            this_ip = data;
        },
        error:function(e){
            console.log(e);
        }
    });
    

    
    $(window).bind("beforeunload", function (e){	
        

        const id = $("#client-ip").text();
        let performanceStatus = JSON.stringify( window.performance.getEntriesByType("navigation"));
 

        let dummy = new FormData(); 

        dummy.append('text','test-msg');
        dummy.append('document_status',document.readyState);
        dummy.append("reload_chk" , window.closed);
        dummy.append('performanceStatus',performanceStatus);
        



        $.ajax({	
            url : "/browser-close.do",	
            cache : "false", //캐시사용금지	
            method : "post",
            data : {
                id : "test",
                document_status : document.readyState,
                performanceStatus : performanceStatus,
                reload_chk :  document.visibilityState,

            },
            success : function(data){ 
                console.log(data);
            },
            error:function(e){
                console.log(e);
            }
        });



        e.preventDefault();
        e.returnValue = '창을 닫으시겠습니까?';
        
    });

});


function testPush(target_id){

    $.ajax({
        type: "POST",
        url: "/target-push.do",
        data:{
            id:target_id
        },
        success : function(data){
            console.log(data);
            
            return data;
        },
        error :function(error) {
            console.log("Error!");

            return error;
        }
});
}