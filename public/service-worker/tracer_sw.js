const  sw_label = 'TRACER 3.0 service-worker';


console.log(`Service worker is waking up! 🐳`);

self.addEventListener('install', event => {
    console.log(`Tracer's Service worker installed! 👍`);
});

self.addEventListener('activate', event => {
    //const tmp = event;
    console.log(`Tracer's Service worker activated! 😎`)

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

    const title = "Doil test";

    const options = {
        body : "This notification was generated from a Doil's server순번대기가 완료되었습니다. ",
        icon : "images/example.png",
        vibrate : [100, 50, 100],
        data : {
            dateOfArrival : Date.now(),
            primaryKey : '2'
        },
        actions:[
            {
                action : 'explore',
                title : 'Explore this new world',
                icon : 'public/images/checkmark.png'
            },
            {
                action : 'close',
                title : 'Close',
                icon : 'public/images/xmark.png'
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
    
    event.waitUntil( () => {
        eventCallBackFunc() 
    });
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