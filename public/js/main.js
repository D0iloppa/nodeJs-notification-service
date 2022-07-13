
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
    

    /*
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
                reload_chk :  window.closed,

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

    */
    
});


function testPush(){
    var tmp = {};

    $.ajax({
        type: "POST",
        data:{
            targetObj:tmp
        },
        url: "/target-push.do"
    });
}