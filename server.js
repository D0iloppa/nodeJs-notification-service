const express = require("express");


const http = require("http");
const https = require("https");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const fs = require("fs");
const cors = require('cors'); 

// 설정파일
const d_Conf = require("./conf");



/************************** 인증서 ******************************/
// ssl 폴더 확인
const ssl_dir = (__dirname + '/ssl/');
/*
fs.readdir(ssl_dir , function(err,filelist){
    console.log(filelist);
});
*/
// conf에 정의되어 있는 경우
var privateKey = fs.readFileSync(ssl_dir + "privkey.pem")
var certificate = fs.readFileSync(ssl_dir + "cert.pem")
var ca = fs.readFileSync(ssl_dir + "fullchain.pem")
//var pfx = fs.readFileSync(d_Conf.cert_Path + "certificate.pfx");

const credentials = { 
    key: privateKey, 
    cert: certificate, 
    ca: ca
}


// vapid key 생성
var webpush = require('web-push'); // web-push 사용
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
    'mailto:kdi3939@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


console.log("VAPID KEY : ",vapidKeys);


/****************************************************************/

// server init
const doilServer = express();

// static 파일 경로
doilServer.use(express.static(__dirname + '/public'));
//cross origin 허용
doilServer.use(cors());
//json사용
doilServer.use(express.json());
//body-parse사용
doilServer.use(express.urlencoded({ extended: true})); 

// index URL routing
doilServer.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

// health check
doilServer.get('/isAlive', (req, res) => res.sendStatus(200));
doilServer.get('/getClientIp.do',(req,res)=>{

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.send(ip.replace('::ffff:',''));
});



/*******************[구독 관련 annotation]****************************/




// 구독자 array
const temp_subs = [];


// 서버키를 구함
doilServer.get("/getServerKey.do", (req,res) => {
    let sendData = {};
    sendData["key"] = vapidKeys.publicKey;
    res.json(sendData);
});
  
doilServer.post('/getService-worker.do', (req, res) => {
    res.sendFile(__dirname + "/public/js/client.js");
});

// 구독자 리스트 getter
doilServer.get('/getSubArr.do', (req,res) => {
  console.log(temp_subs);
  res.send(temp_subs);
});

// 구독자 전체에게 push
doilServer.get('/push.do', (req,res) => {

  console.log("push start");
  
  var idx = 0;
  const term = 1000;

  console.log("[sub size] : " + temp_subs.length);

  for(const sub of temp_subs){
    // 구독자 정보가 올바른 경우에만 작동
    const isCorrectTemplate = (sub["endpoint"]) ? true : false;

    if(isCorrectTemplate){
        console.log(`Sub_info #${idx++} :  ${JSON.stringify(sub)}`);

        webpush.sendNotification(sub,'test message').then( (res) => {
            console.log('sent notification successfully');
            }).catch( (err) => {
                console.error(`notification error : ${err}`);
                res.sendStatus(500);
            });
    }else continue;
   
  }

  console.log("push end");

  //res.send("Push complete");
});

// 구독버튼
doilServer.post('/subscribe.do', (req, res) => {
    temp_subs.push(req.body.subscription);
    console.log(`subscribed : ${JSON.stringify(req.body.subscription)}`);
    res.send('Subscribed');
});

// 브라우저 unload catch
doilServer.post('/browser-close.do', multipartMiddleware , (req,res) => {
    const getBody = req.body;
    //console.log(req);
    console.log("client info : " , getBody);
    console.log("performanceStaus : " + getBody.performanceStatus);
    console.log(`${getBody.id} : 브라우저 닫힘`);

    res.sendStatus(201);
});

/****************************************************************/


const httpServer = http.createServer(doilServer).listen(d_Conf["port"] , ()=> {
    console.log(`
    ####################################################
      😎 Wellcome to DOIL's dev SERVER (by express) 😎
      🐳 Server listening on port ${d_Conf.port}

      site : http://${d_Conf.domain}:${d_Conf.port}/
    ####################################################
    `);
});

const httpsServer = https.createServer(credentials,doilServer).listen(d_Conf["ssl_Port"] , () => {
    console.log(`
    ####################################################
      😎 Wellcome to DOIL's dev https SERVER (by express) 😎
      🐳 Server listening on port(local) ${d_Conf.ssl_Port}
      
      site : https://${d_Conf.domain}:443/
    ####################################################
    `);
});