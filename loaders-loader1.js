function loader1(source) {
  console.log('loader1')
  return source + '-loader1'
}
/**
 * 一个模块可能会匹配多个loader loader1  loader2 loader3
 * use:['loader1','loader2','loader3']
 * remainingRequest 剩下的请求
 * previousRequest 之前的请求
 * data 当前的loader的数据，此data可以在pitch和normal 中共享 
 * 真正的执行过程 是这样:
 * 先从左到右执行pitch函数,如果pitch没有返回值，则执行下一个 pitch
 */
loader1.pitch = function (remainingRequest, previousRequest, data) {
  console.log('pitch1');
}

module.exports = loader1
