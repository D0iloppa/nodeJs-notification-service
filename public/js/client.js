// service-worker 다운로드하여 등록
function registerPush(appPubkey) {
    navigator.serviceWorker.register('./service-worker/sw.js').then( (registration) =>{
        console.log("service worker Registered / getSubscription");

        return registration.pushManager.getSubscription()
            .then(function(subscription) {
                if (subscription) {
                    return subscription;
                }

                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(appPubkey)
                });
            }) 
            // 2. 구독 API호출하여 subscription정보를 전송
            .then(function(subscription) {
                console.log('post subscription : ', subscription);
                mysubscription = subscription;
                let tmp = subscription;
                tmp["dummy"] = {
                    "id" : 'test',
                    "date" : new Date()
                };
                
                return fetch('subscribe.do', {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ subscription: tmp })
                });
            }).catch( (error) =>{
                console.err(`subscription error : ${error}`);
            });        
    }).catch(function (err) {
        console.log("Service Worker Failed to Register", err);
    });    
}




function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i)  {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

// serviceWorker가 등록되어 있는지 확인하고 없으면 등록시작
document.querySelector('#subscribe_Btn').onclick = function(){
    console.log("btn click");

    // 구독갱신 unregister
    navigator.serviceWorker.getRegistrations()
    .then((reg)=>{
        console.log(reg);
        if(reg[0]) reg[0].unregister();
    }).then(() => {
        console.log("register 삭제");

        if (navigator.serviceWorker) {
            // 서버키를 가져와서 register
            fetch('/getServerKey.do')
            .then( e => e.json()).then( (result) =>{
                document.querySelector('#receivedPubKey').innerText = result.key;
                registerPush(result.key);
            });
        }    

    });
}