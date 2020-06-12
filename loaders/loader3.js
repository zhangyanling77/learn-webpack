function loader3(source) {
  console.log('loader3')
  return source + '-loader3'
}
/**
 * 
 * 为了实现高内聚 每个loader 只做一个功能，不要让一个loader把所有的活全干了 流水线
 */
loader3.pitch = function (remainingRequest, previousRequest, data) {
  console.log('remainingRequest', remainingRequest); //./index.js
  console.log('previousRequest', previousRequest);//loader1!loader2
  console.log('pitch3');
  return 'pitch3'
}
module.exports = loader3
