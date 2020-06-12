/**
 * 实现一个webpack 插件
 * tree shaking
 */
// import { flatten, concat } from 'lodash';
import flat from 'lodash/flatten';
import concat from 'lodash/concat';
/**
 * 转换成
 * import flatten from 'lodash/flatten';
 * import concat from 'lodash/concat';
 * 
 */

console.log(flat)
console.log(concat)
