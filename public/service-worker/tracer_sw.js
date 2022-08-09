const sw_label = 'TRACER 3.0 service-worker #1';


console.log(`Service worker is waking up! 🐳`);

self.addEventListener('install', event => {
    console.log(`Tracer's Service worker installed! 👍`);
});

self.addEventListener('activate', event => {
    //const tmp = event;
    /*
    console.log(`Tracer's Service worker activated! 😎`)
    
    console.log(clients);
    */
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then( response => {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('offline', event =>{
    console.log("OFFLINE");
});

const CACHE_NAME = "tracer-sw-cache-v1";
const urlsToCache = [
    '/',
    '/styles/main.css',
    '/scripts/main.js',
    '/images/sad.jpg'
];

self.addEventListener('push' , function(event) {

    // push로 보여줄 내용 customizing

    const title = "Wellconn";

    const options = {
        body : "순번대기가 완료되었습니다. ",
        icon : "/images/example.png",
        vibrate : [100, 50, 100],
        data : {
            dateOfArrival : Date.now(),
            primaryKey : '2'
        },
        actions:[
            {
                action : 'explore',
                title : '방문',
                icon : '/images/checkmark.png'
            },
            {
                action : 'close',
                title : '닫기',
                icon : '/images/xmark.png'
            },
        ]
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
    
});



self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');
  
    event.notification.close();
    /*
        [event.waitUntil()] ensures that 
        the browser doesn't terminate the service worker before the new window or tab has been displayed.
    */
    const actionChk = event.action;
    console.log("action:",actionChk);
    

    /*
    event.waitUntil( () => {
        // eventCallBackFunc() 
        clients.openWindow('http://www.wellconn.co.kr');
    });
    */

    const target_url = 'http://www.wellconn.co.kr';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
        .then(clientsArr => {
            // If a Window tab matching the targeted URL already exists, focus that;
            const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === e.notification.data.url ? (windowClient.focus(), true) : false);
            // Otherwise, open a new tab to the applicable URL and focus it.

            if (!hadWindowToFocus) 
                clients.openWindow(target_url)
                    .then(windowClient => windowClient ? windowClient.focus() : null);
      }));


  });


  function eventCallBackFunc(){
    // 언제든 변경 가능
    clients.openWindow('http://www.wellconn.co.kr');
  }


  self.addEventListener('close',(e)=>{
    



    let dummy = new FormData(); 

    dummy.append('text','서비스워커 체크');
    dummy.append('document_status',document.readyState);
    dummy.append("reload_chk" , window.closed);
    dummy.append('performanceStatus',performanceStatus);
    dummy.append('id',id);


    
    window.navigator.sendBeacon("/browser-close.do",dummy); 

  });