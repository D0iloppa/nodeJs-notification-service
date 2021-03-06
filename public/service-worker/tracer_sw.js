const  sw_label = 'TRACER 3.0 service-worker';


console.log(`Service worker is waking up! ð³`);

self.addEventListener('install', event => {
    console.log(`Tracer's Service worker installed! ð`);
    
    
});

self.addEventListener('activate', event => {
    console.log(`Tracer's Service worker activated! ð`);

});
/*
self.addEventListener('fetch', event => {
    self.navigator.sendBeacon('/beacon-test.do', "fetch");
    event.respondWith(
        caches.match(event.request)
        .then( response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });
*/

self.addEventListener('offline', event =>{
    console.log("OFFLINE");
});

self.addEventListener('push' , function(event) {

    // pushë¡ ë³´ì¬ì¤ ë´ì© customizing

    const title = "Doil test";

    const options = {
        body : "This notification was generated from a Doil's server ìë²ëê¸°ê° ìë£ëììµëë¤. ",
        icon : "/images/example.png",
        data : {
            dateOfArrival : Date.now(),
            primaryKey : '2'
        },
        actions:[
            {
                action : 'explore',
                title : 'ë°©ë¬¸',
                icon : '/images/checkmark.png'
            },
            {
                action : 'close',
                title : 'ë«ê¸°',
                icon : '/images/xmark.png'
            },
        ]
    }
/*
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
*/

    // const data = JSON.parse(event.data.text());
    const data = {test:"testmsg"};

    event.waitUntil( async function() {
        for (const client of await self.clients.matchAll({includeUncontrolled: true})) {
            client.postMessage(data);
        }

        self.registration.showNotification( title, options )
    }());


    
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
    // ì¸ì ë  ë³ê²½ ê°ë¥
    clients.openWindow('http://www.wellconn.co.kr');
  }

