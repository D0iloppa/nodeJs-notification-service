//worker.js 파일
const fetch = require("node-fetch");
let startTime = process.uptime();           // 스레드 생성 시간.
const Worker = require('worker_threads');
let jobSize = 100000;

doWorkersJob(); 

let endTime = process.uptime();


function doWorkersJob(){
    let data;
    for (let i = 0; i < 100 ; i++){
      console.log(`스레드 작업 ${i} : end`);
      waitTerm(1);
    }
  }


  function waitTerm(sec) {
    let start = Date.now() , now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}