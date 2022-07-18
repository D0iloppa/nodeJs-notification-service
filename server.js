const express = require("express");
const http = require("http");
const https = require("https");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const fs = require("fs");
const cors = require("cors");
var webpush = require("web-push"); // web-push 사용



// 설정파일
// const d_Conf = require("./conf");
const conf_dir = __dirname + "/";
const conf_file = "conf.json";

// 기본 conf파일 템플릿
const tmpConf = {
  "domain" : "localhost",
  "port" : 80,
  "cert_Path" : "/",
  "ssl_Port" : 443,
};




// @ 설정파일 체크
var d_Conf;
var vapidKeys;

// vapid값이 설정되어 있지 않으면 생성하고, 정해져있으면 설정
function ifNot_gen_setVAPID(){
  if(fs.existsSync(conf_dir + conf_file)){

    d_Conf = JSON.parse( fs.readFileSync(conf_dir + conf_file , 'utf8') );
  
    if(d_Conf.VAPID){
      vapidKeys = d_Conf.VAPID
    } else{
      const tmp = webpush.generateVAPIDKeys();
      d_Conf.VAPID = tmp;
      vapidKeys = tmp;

      setVapidToConf(vapidKeys);
    }
  }

}


function setVapidToConf(vapid_key){
  if(fs.existsSync(conf_dir + conf_file)) {
    let tmp = JSON.parse( fs.readFileSync(conf_dir + conf_file , 'utf8') );
    tmp.VAPID = vapid_key;

    console.log("set VAPID to config file [info]: " , tmp);


    fs.writeFileSync(conf_dir + conf_file , JSON.stringify(tmp) );
  }
}

if(fs.existsSync(conf_dir + conf_file)){
  // @ 확장자 체크 (json 파일이 아닌 경우 예외처리)
  const i = conf_file.lastIndexOf('.');
  var ext = (i < 0) ? false : conf_file.substring(i + 1);
  if(ext == 'json') ifNot_gen_setVAPID();
  
}else{
  fs.writeFileSync(conf_dir + conf_file , JSON.stringify(tmpConf) , (err) => console.log(err));
  d_Conf = JSON.parse( fs.readFileSync(conf_dir + conf_file , 'utf8') );
  console.log("conf파일 생성완료");
  ifNot_gen_setVAPID();
}




  


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
  ca: ca
};

// vapid key 생성 및 push lib에 연동

// const { json } = require("express");
//const vapidKeys = d_Conf.VAPID ? d_Conf.VAPID : webpush.generateVAPIDKeys();



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
// 구독자 array (SERVER IN-MEMORY)
var subs_Arr = [];


// 서버키를 구함
doilServer.get("/getServerKey.do", (req, res) => {
  let sendData = {};
  sendData["key"] = vapidKeys.publicKey;
  res.json(sendData);
});


doilServer.get("/getService-worker.do", (req, res) => {
  res.sendFile(__dirname + "/public/service-worker/tracer_sw.js");
});


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

  const sub = {
      "endpoint":"https://fcm.googleapis.com/fcm/send/e6GXcUwdbWc:APA91bH4sVu6F8ZbQq9j08LCFkS0mLwgsuwWcVTzLbCAK5uIRKMjcxWoISB5YioW39OhWbjhZhP04aVnzzVlokLJLI75mL4DddwnHD64V7CzMIgLHoX4TBOcphdH44z0xwbeMfmMIhG7",
      "expirationTime":null,
      "keys":{
        "p256dh":"BNxJ9i34XfcDD17j3AunPBed8mDSwz2yrAVbn5fBdoPcQbRL7-2yF_TwCh8k0D-IFoEfQWEiDXHoTVBbFywhgOU",
        "auth":"Bjna681paxHEXFNWcwbcRg"
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
    ${socket.id} connected... ==============
  `);



  // user connection lost
  socket.on("disconnect", function (data) {
    console.log(`
      ${socket.id} user disconnected ==============
    `);
  });
});
*/
