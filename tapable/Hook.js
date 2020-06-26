
class Hook {
  constructor(args) {
      if (!Array.isArray(args)) args = [];
      this.args = args; // Hook类的实例 this.args = args=['name','age']
      this.taps = []; // 这是存放钩子回调函数的数组
      this._x = undefined; // 是用来拼函数的
  }
  tap(options, fn) {
      if (typeof options === 'string') options = { name: options };
      options.fn = fn; 
      this._insert(options);
  }
  tapAsync(options, fn) {
      if (typeof options === 'string') options = { name: options };
      options.fn = fn; 
      this._insert(options);
  }
  _insert(options) {
      this.taps[this.taps.length] = options; // = this.taps.push(options);
  }
  call(...args) { 
      // 第一个动态编译出来一个函数
      let callMethod = this._createCall();
      return callMethod.apply(this, args);;
  }
  callAsync(...args) {  
      let callMethod = this._createCall();
      return callMethod.apply(this, args);;
  }
  _createCall() {
      return this.compile({
          taps: this.taps, // 监听函数  
          args: this.args // ['name','age']
      });
  }
}

module.exports = Hook;