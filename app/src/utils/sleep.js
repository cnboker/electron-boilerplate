// function sleep(time) {
//     const stop = new Date().getTime() + time;
//     while(new Date().getTime() < stop);       
//   }

module.exports =  ms => new Promise( res => setTimeout(res, ms));;
  

