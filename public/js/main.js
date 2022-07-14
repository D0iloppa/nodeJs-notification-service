

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

  
    document.addEventListener("DOMContentLoaded",() => {
      // hide our user interface that shows our A2HS button
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });

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


function testPush(target_id){

    $.ajax({
        type: "POST",
        url: "/target-push.do",
        data:{
            id:target_id
        },
        success : function(data){
            console.log(data);
        },
        error :function(error) {
            console.log("Error!");
        }
});
}