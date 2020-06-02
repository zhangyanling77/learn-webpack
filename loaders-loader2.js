function loader2(source) {
  console.log('loader2', this.data)
  return source + '-loader2'
}
/**
 * 如果pitch有返回值，则跳过剩下的loader,直接返回上执行上一个normal 函数
 * 
 * 每个loader有一个自己的data
 * 这个data 是用来在pitch函数中向自己的normal传递数据的
 */
loader2.pitch = function (remainingRequest, previousRequest, data) {
  //request = loader1.js!loader2.js!loader3.js!./index.js
  //remainingRequest \loader3.js!\index.js
  //previousRequest loader1.js
  console.log('remainingRequest', remainingRequest);
  console.log('previousRequest', previousRequest);
  data.name = 'loader2';
  console.log('pitch2');
  // return 'pitch2'
}
module.exports = loader2
