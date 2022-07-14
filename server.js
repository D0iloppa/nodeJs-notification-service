const express = require("express");
const http = require("http");
const https = require("https");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const fs = require("fs");
const cors = require("cors");
// 설정파일
const d_Conf = require("./conf");
/************************** 인증서 ******************************/
// ssl 폴더 확인
const ssl_dir = __dirname + "/ssl/";
/*
fs.readdir(ssl_dir , function(err,filelist){
    console.log(filelist);
});
*/
// conf에 정의되어 있는 경우
var privateKey = fs.readFileSync(ssl_dir + "privkey.pem");
var certificate = fs.readFileSync(ssl_dir + "cert.pem");
var ca = fs.readFileSync(ssl_dir + "fullchain.pem");
//var pfx = fs.readFileSync(d_Conf.cert_Path + "certificate.pfx");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};
// vapid key 생성
var webpush = require("web-push"); // web-push 사용
const vapidKeys = d_Conf.VAPID ? d_Conf.VAPID : webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:kdi3939@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

console.log("VAPID KEY : ", vapidKeys);
/****************************************************************/
// server init
const doilServer = express();
// static 파일 경로
doilServer.use(express.static(__dirname + "/public"));
//cross origin 허용
doilServer.use(cors());
//json사용
doilServer.use(express.json());
//body-parse사용
doilServer.use(express.urlencoded({ extended: true }));

// index URL routing
doilServer.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// health check
doilServer.get("/isAlive", (req, res) => res.sendStatus(200));
doilServer.get("/getClientIp.do", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.send(ip.replace("::ffff:", ""));
});
/*******************[구독 관련 annotation]****************************/
// 구독자 array
// const temp_subs = [];
var subs_Arr = [];


// 서버키를 구함
doilServer.get("/getServerKey.do", (req, res) => {
  let sendData = {};
  sendData["key"] = vapidKeys.publicKey;
  res.json(sendData);
});

doilServer.post("/getService-worker.do", (req, res) => {
  res.sendFile(__dirname + "/public/js/client.js");
});
/*
// 구독자 리스트 getter
doilServer.get("/getSubArr.do", (req, res) => {
  console.log(temp_subs);
  res.send(temp_subs);
});
*/
/*
// 구독자 전체에게 push
doilServer.get("/push.do", (req, res) => {
  console.log("push start");
  var idx = 0;
  const term = 1000;
  console.log("[sub size] : " + temp_subs.length);
  for (const sub of temp_subs) {
    // 구독자 정보가 올바른 경우에만 작동
    const isCorrectTemplate = sub["endpoint"] ? true : false;
    if (isCorrectTemplate) {
      console.log(`Sub_info #${idx++} :  ${JSON.stringify(sub)}`);
      webpush
        .sendNotification(sub, "test message")
        .then((res) => {
          console.log("sent notification successfully");
        })
        .catch((err) => {
          console.error(`notification error : ${err}`);
          res.sendStatus(500);
        });
    } else continue;
  }
  console.log("push end");
  //res.send("Push complete");
});
*/

// 구독자 대상에게 push
doilServer.post("/target-push.do", multipartMiddleware, (req, res) => {
  const target = req.body.id;
  
  console.log(`push start : [id : ${target}]`);

  const sub = subs_Arr.find( i => i.id == target);
  const msg = (sub ? JSON.stringify(sub) : "There is no matched Target");

  console.log("[sub info] : " + msg);


  const isCorrectTemplate = (sub?.subscription?.endpoint) ? true : false;
  var state = false;

  if (isCorrectTemplate) {

    webpush.sendNotification(sub.subscription, "test message")
    .then((res) => {
      console.log("sent notification successfully");
      state = true;
    })
    .catch((err) => {
      console.error(`notification error : ${err}`);
      res.sendStatus(500);
    });

  }else{
    res.send(msg);
  }

  console.log("push end");
  
  
});



doilServer.get("/test-push.do", multipartMiddleware, (req, res) => {

  const sub ={
    "endpoint":"https://wns2-pn1p.notify.windows.com/w/?token=BQYAAAAHoGsKgvDWJJ9qAL1PeLZ7TnikAXTECfUbyPk4VUMQhfvH6NbLFf5U5jH0h5kqSeivQZ3PpPZ8FRURnJL2UION4E8YvZ%2bfJeqkHi%2bLZ611Xi6Rq6QMEzBTlscrPPz22eGs6qRU%2fXf3U1f%2fh3YC1hyd7qbox5TPczVeBuZRwNdZFTletNbZgWtrL8Sgcrv7NGld9XLK9J0y1cpudgnZqg%2bmBk2LprB%2b51QM16qVf%2bAMynLcTsBeNGDJgTFz4mB1GZ%2b4a7w5izB3d9Siw05lR5DZcORqkg%2fKP5mwaRkprGwYQ7t3deOzavDazTV8lwB7BVGYSTwUWfaeSyQINXgqZdkW",
    "expirationTime":null,
    "keys":{
      "p256dh":"BIRMMTEY6-uOUGYX-XBh7mJA7DPS8LntiCOCSPSzA-YudTEMJWVZCUglyho21CTonrtFfhV_dw33iX4L1sGDro4",
      "auth":"qk3XW27x5f7gjcX1flV7SQ"
    }
  };

    webpush.sendNotification(sub , "test message")
    .then((res) => {
      console.log("sent notification successfully");
      state = true;
    })
    .catch((err) => {
      console.error(`notification error : ${err}`);
      res.sendStatus(500);
    });
  
  
});







// 구독버튼
doilServer.post("/subscribe.do", (req, res) => {

  let getData = req.body;

  let subInfo = {
      id : getData.dummy.id,
      subscription : getData.sub
  };

  // temp_subs.push(req.body.sub);
0
  var unique_id_push = subs_Arr.findIndex(obj => (obj.id == subInfo.id));
  if(unique_id_push > -1){
    // 이미 해당 아이디로 구독권 정보를 가지고 있으면 교체
    subs_Arr[ unique_id_push ] = subInfo;
  } else{
    // 해당 아이디가 구독권이 존재하지 않으면 array에 push
    subs_Arr.push(subInfo);
  }
  

  console.log(`subscribed : ${JSON.stringify(req.body)}`);
  res.send("Subscribed");
});

// 브라우저 unload catch
doilServer.post("/browser-close.do", multipartMiddleware, (req, res) => {
  const getBody = req.body;
  //console.log(req);
  /*
  console.log("client info : ", getBody);
  console.log("performanceStaus : " + getBody.performanceStatus);
  */
  console.log(`${getBody.id} : 브라우저 닫힘`);
  res.sendStatus(201);
});

/****************************************************************/


const httpServer = doilServer.listen(d_Conf["port"], () => {
  console.log(`
    ##########################################################
      😎 Wellcome to DOIL's dev SERVER (by express) 😎
      🐳 Server listening on port ${d_Conf.port}
      site : http://${d_Conf.domain}:${d_Conf.port}/
      ##########################################################
    `);
});
const httpsServer = https
  .createServer(credentials, doilServer)
  .listen(d_Conf["ssl_Port"], () => {
    console.log(`
    ##########################################################
      😎 Wellcome to DOIL's dev https SERVER (by express) 😎
      🐳 Server listening on port(local) ${d_Conf.ssl_Port}
      site : https://${d_Conf.domain}:443/
    ##########################################################
    `);
  });


/*
var io = require("socket.io")(httpsServer);
io.on("connection", (socket) => {
  //연결이 들어오면 실행되는 이벤트
  // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
  console.log(`
    =======================================${socket.id}connected...
  `);



  // user connection lost
  socket.on("disconnect", function (data) {
    console.log(`
      ==============================================${socket.id} user disconnected====================================
    `);
  });
});
*/
