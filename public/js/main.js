var this_data;
var this_host;
var this_ip;
var this_loginId;
var this_port;
var this_pageUrl;
var this_sendThis;
var this_waitCnt;
var this_isWait;
var this_reject;
var this_session_time_out;
var this_limitCnt;
var this_waitQueueSize;
var this_waitMyCnt;

var tracer_cookie_domain='https://doiloppa.chickenkiller.com';




function makeCookieKey() {
    var start=10000;
    var end=99999;

    var rand = Math.floor((Math.random() * (end-start+1)) + start);
    let loginId = this_ip+"_T_"+rand+"_WC";

    var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));

    setCookie_Tracer("wcCookie",loginId,date,"/",tracer_cookie_domain);

    return loginId;
}

function setCookie_Tracer(cookieName, cookieValue, cookieExpire, cookiePath, cookieDomain, cookieSecure){
    var cookieText=escape(cookieName)+'='+escape(cookieValue);
    cookieText+=(cookieExpire ? '; EXPIRES='+cookieExpire.toGMTString() : '');
    cookieText+=(cookiePath ? '; PATH='+cookiePath : '');
    cookieText+=(cookieDomain ? '; DOMAIN='+cookieDomain : '');
    cookieText+=(cookieSecure ? '; SECURE' : '');
    document.cookie=cookieText;
    this_loginId = cookieText;
    console.log(cookieText);
}

function getCookie(cookieName){
    var cookieValue=null;
    if(document.cookie){
        var array=document.cookie.split((escape(cookieName)+'='));
        if(array.length >= 2){
            var arraySub=array[1].split(';');
            cookieValue=unescape(arraySub[0]);
        }
    }
    return cookieValue;
}

function getCookieKey() {
    var cookie = getCookie('wcCookie');
    return cookie;
}

var bMakeCookie=false;


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
        console.log("close");

        $.ajax({	
            url : "/browser-close.do",	
            cache : "false", //캐시사용금지	
            method : "get",
            data : {
                id:"test"
            },
            async : false, 
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


    var cookie = getCookie('wcCookie');
    if ( cookie == null || cookie == '' ) {
        bMakeCookie=true;
        makeCookieKey();
    } else {
        bMakeCookie=false;
        this_loginId=cookie;
   }


    
});
